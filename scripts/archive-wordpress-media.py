#!/usr/bin/env python3
"""Archive the public WordPress media library without local dependencies.

Keep the original uploads paths, preserve existing public files, and record
unused originals and generated sizes separately from page-referenced assets.
Only public REST API metadata and public media URLs are requested.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import tempfile
import time
import urllib.error
import urllib.parse
import urllib.request

ORIGIN = "https://blog.cinev.com"
PREFIX = "/wp-content/uploads/"
MAX_ASSET_BYTES = 100_000_000
USER_AGENT = "CineV-Public-Media-Archive/1.0"


def utc_timestamp() -> str:
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


def request(url: str, method: str = "GET"):
    for attempt in range(3):
        try:
            return urllib.request.urlopen(urllib.request.Request(url, method=method, headers={
                "User-Agent": USER_AGENT, "Accept": "*/*", "Accept-Encoding": "identity",
            }), timeout=90)
        except (urllib.error.URLError, TimeoutError) as error:
            if isinstance(error, urllib.error.HTTPError) and error.code < 500:
                raise
            if attempt == 2:
                raise
            time.sleep(attempt + 1)
    raise RuntimeError("Request retries exhausted")


def source_path(url: str) -> str:
    parsed = urllib.parse.urlsplit(url)
    if parsed.hostname not in {"blog.cinev.com", "cinev.com", "www.cinev.com", "43.200.218.52"}:
        raise ValueError(f"Unsupported public media origin: {parsed.hostname}")
    path = urllib.parse.unquote(parsed.path)
    if path.startswith("/insights/"):
        path = path[len("/insights"):]
    if not path.startswith(PREFIX) or any(part in {".", ".."} for part in path.split("/")) or "\\" in path or "\0" in path:
        raise ValueError("Expected a safe WordPress uploads path")
    return path


def source_url(path: str) -> str:
    return ORIGIN + urllib.parse.quote(path, safe="/:@")


def media_assets(records: list[dict]) -> list[dict]:
    by_path: dict[str, dict] = {}
    for media in records:
        media_id = int(media["id"])
        details = media.get("media_details") or {}
        candidates: list[tuple[str, str, int | None]] = []
        url = media.get("source_url", "")
        if url:
            candidates.append((url, "source", details.get("filesize")))
        if details.get("file"):
            candidates.append((source_url(PREFIX + details["file"]), "metadata-file", details.get("filesize")))
        if details.get("original_image"):
            parent = str(PurePosixPath(source_path(url)).parent) if url else PREFIX.rstrip("/") + "/" + str(PurePosixPath(details["file"]).parent)
            candidates.append((source_url(parent + "/" + details["original_image"]), "original-image", None))
        for size, item in (details.get("sizes") or {}).items():
            if isinstance(item, dict) and item.get("source_url"):
                candidates.append((item["source_url"], "size:" + size, item.get("filesize")))
        for url, role, byte_count in candidates:
            path = source_path(url)
            asset = by_path.setdefault(path, {"path": path, "sourceUrl": source_url(path), "mediaIds": [], "roles": [], "metadataBytes": []})
            if media_id not in asset["mediaIds"]:
                asset["mediaIds"].append(media_id)
            binding = {"mediaId": media_id, "role": role}
            if binding not in asset["roles"]:
                asset["roles"].append(binding)
            if isinstance(byte_count, int) and byte_count not in asset["metadataBytes"]:
                asset["metadataBytes"].append(byte_count)
    return sorted(by_path.values(), key=lambda item: item["path"])


def fetch_media() -> tuple[list[dict], dict]:
    records = []
    page = 1
    total_pages = 1
    total = None
    while page <= total_pages:
        with request(f"{ORIGIN}/wp-json/wp/v2/media?per_page=100&page={page}") as response:
            batch = json.loads(response.read())
            if not isinstance(batch, list):
                raise ValueError("Expected an array from the public media API")
            records.extend(batch)
            total_pages = int(response.headers.get("X-WP-TotalPages", "1"))
            total = int(response.headers.get("X-WP-Total", str(len(records))))
        page += 1
    ids = [record["id"] for record in records]
    if len(set(ids)) != len(ids) or total != len(records):
        raise ValueError(f"Media API pagination changed while reading: expected {total}, obtained {len(records)}")
    return records, {"total": total, "totalPages": total_pages}


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        while block := file.read(1024 * 1024):
            digest.update(block)
    return digest.hexdigest()


def write_json(path: Path, data):
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + ".tmp")
    temporary.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n")
    temporary.replace(path)


def archive_asset(asset: dict, root: Path, maximum: int) -> dict:
    record = dict(asset)
    destination = root / "public" / asset["path"].lstrip("/")
    temporary = None
    try:
        if destination.is_file():
            byte_count = destination.stat().st_size
            if not byte_count:
                raise ValueError("Existing media file is empty; it was preserved")
            record.update(status="existing", bytes=byte_count, sha256=sha256_file(destination))
            if asset["metadataBytes"] and byte_count not in asset["metadataBytes"]:
                record["metadataSizeMismatch"] = True
            if byte_count >= maximum:
                record["exceedsMaximum"] = True
            return record
        # Inspect headers before downloading originals, especially large video.
        try:
            response = request(asset["sourceUrl"], "HEAD")
        except urllib.error.HTTPError as error:
            if error.code not in {405, 501}:
                raise
            # Read headers only and close; the byte cap remains enforced below.
            response = request(asset["sourceUrl"])
        with response:
            length = response.headers.get("Content-Length")
            header_bytes = int(length) if length and length.isdigit() else None
            record["headerBytes"] = header_bytes
            record["contentType"] = response.headers.get("Content-Type", "")
            record["lastModified"] = response.headers.get("Last-Modified")
            record["etag"] = response.headers.get("ETag")
        if (header_bytes is not None and header_bytes >= maximum) or any(value >= maximum for value in asset["metadataBytes"]):
            record.update(status="blocked", reason=f"Public media is at least {maximum} bytes; retain in object storage or Git LFS")
            return record
        destination.parent.mkdir(parents=True, exist_ok=True)
        file_descriptor, temporary = tempfile.mkstemp(prefix=".media-", dir=destination.parent)
        digest = hashlib.sha256()
        byte_count = 0
        with os.fdopen(file_descriptor, "wb") as output, request(asset["sourceUrl"]) as response:
            while chunk := response.read(1024 * 1024):
                byte_count += len(chunk)
                if byte_count >= maximum:
                    raise ValueError(f"Media stream exceeds {maximum} bytes")
                output.write(chunk)
                digest.update(chunk)
        if not byte_count:
            raise ValueError("Downloaded media file is empty")
        if header_bytes is not None and byte_count != header_bytes:
            raise ValueError(f"Incomplete media download: expected {header_bytes} bytes, obtained {byte_count}")
        # Exclusive creation avoids replacing concurrent or unrelated work.
        os.link(temporary, destination)
        record.update(status="downloaded", bytes=byte_count, sha256=digest.hexdigest())
        if asset["metadataBytes"] and byte_count not in asset["metadataBytes"]:
            record["metadataSizeMismatch"] = True
        return record
    except Exception as error:
        record.update(status="failed", error=str(error))
        return record
    finally:
        if temporary and Path(temporary).exists():
            Path(temporary).unlink()


def verify_archive(root: Path) -> dict:
    records = json.loads((root / "migration/source-api/media.json").read_text())
    manifest = json.loads((root / "migration/media-library.json").read_text())
    expected = {asset["path"] for asset in media_assets(records)}
    listed = {asset["path"] for asset in manifest["assets"]}
    errors = []
    if expected != listed:
        errors.append(f"Manifest coverage mismatch: missing={len(expected - listed)}, unexpected={len(listed - expected)}")
    for asset in manifest["assets"]:
        path = root / "public" / asset["path"].lstrip("/")
        if asset["status"] not in {"existing", "downloaded"}:
            errors.append(f"Unpreserved media: {asset['path']} ({asset['status']})")
        elif not path.is_file() or path.stat().st_size != asset["bytes"] or sha256_file(path) != asset["sha256"]:
            errors.append(f"Media integrity mismatch: {asset['path']}")
        if asset.get("metadataSizeMismatch") or asset.get("exceedsMaximum"):
            errors.append(f"Media size needs review: {asset['path']}")
    return {"mediaRecords": len(records), "expectedAssets": len(expected), "manifestAssets": len(listed), "errors": errors}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--workers", type=int, default=6)
    parser.add_argument("--max-asset-bytes", type=int, default=MAX_ASSET_BYTES)
    parser.add_argument("--check", action="store_true", help="Offline API/manifest coverage and SHA256 integrity verification")
    args = parser.parse_args()
    root = args.output.resolve()
    if args.check:
        result = verify_archive(root)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        raise SystemExit(bool(result["errors"]))
    records, pagination = fetch_media()
    assets = media_assets(records)
    catalog = json.loads((root / "migration/catalog.json").read_text())
    referenced = {asset["path"].removeprefix("/insights") for asset in catalog["assets"]}
    for asset in assets:
        asset["publiclyReferenced"] = asset["path"] in referenced
    missing_originals = [record["id"] for record in records if not (root / "public" / source_path(record["source_url"]).lstrip("/")).is_file()]
    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        archived = list(pool.map(lambda asset: archive_asset(asset, root, args.max_asset_bytes), assets))
    manifest = {
        "source": ORIGIN, "api": f"{ORIGIN}/wp-json/wp/v2/media?per_page=100", "archivedAt": utc_timestamp(),
        "publicOnly": True, "sourceApiFile": "migration/source-api/media.json", "pagination": pagination,
        "maxAssetBytes": args.max_asset_bytes, "initiallyMissingSourceMediaIds": missing_originals, "assets": archived,
        "counts": {
            "media": len(records), "assets": len(archived), "initiallyMissingOriginals": len(missing_originals),
            "existing": sum(asset["status"] == "existing" for asset in archived),
            "downloaded": sum(asset["status"] == "downloaded" for asset in archived),
            "unreferenced": sum(not asset["publiclyReferenced"] for asset in archived),
            "blocked": sum(asset["status"] == "blocked" for asset in archived),
            "failed": sum(asset["status"] == "failed" for asset in archived),
        },
        "totalBytes": sum(asset.get("bytes", 0) for asset in archived),
        "downloadedBytes": sum(asset.get("bytes", 0) for asset in archived if asset["status"] == "downloaded"),
    }
    write_json(root / "migration/source-api/media.json", records)
    write_json(root / "migration/media-library.json", manifest)
    result = verify_archive(root)
    print(json.dumps({"counts": manifest["counts"], "totalBytes": manifest["totalBytes"], "downloadedBytes": manifest["downloadedBytes"], "validation": result}, ensure_ascii=False, indent=2))
    raise SystemExit(bool(result["errors"]))


if __name__ == "__main__":
    main()
