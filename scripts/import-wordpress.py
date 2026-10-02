#!/usr/bin/env python3
"""Import the public CineV WordPress site without requiring WordPress at runtime.

Only published posts/pages and publicly referenced assets are read. Existing
Markdown files are preserved unless --overwrite-content is supplied. Imported
HTML is retained in Markdown to preserve Gutenberg/Spectra layout and styling.
Uses only the Python standard library; no local dependencies are installed.
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import html
from html.parser import HTMLParser
import json
import mimetypes
from pathlib import Path
import posixpath
import re
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

ORIGIN = "https://blog.cinev.com"
PUBLIC_ORIGIN = "https://cinev.com"
INTERNAL_HOSTS = {"blog.cinev.com", "cinev.com", "www.cinev.com", "43.200.218.52"}
ASSET_SUFFIXES = {".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".otf", ".eot", ".mp4", ".webm", ".mov", ".mp3", ".pdf", ".vtt"}
URL_PATTERN = re.compile(r"(?:https?:)?//[^\s<>\"'()]+")
CSS_URL_PATTERN = re.compile(r"url\(\s*(['\"]?)(.*?)\1\s*\)", re.I)
CSS_IMPORT_PATTERN = re.compile(r"@import\s+(?:url\()?['\"]([^'\"]+)['\"]", re.I)
LOCK = threading.Lock()
PRESERVED_FRONTMATTER_KEYS = {"rssGuid", "rssEnclosure", "translationKey"}


def preserved_frontmatter(source: str) -> dict[str, str]:
    """Keep selected authored YAML blocks verbatim without a YAML dependency.

    The importer emits JSON-compatible YAML, but editors can use plain YAML
    scalars, folded strings, comments, or nested enclosure mappings. Retain
    whole top-level blocks instead of attempting to decode them as JSON.
    """
    lines = source.splitlines(keepends=True)
    if not lines or lines[0].strip() != "---":
        return {}
    closing = next((index for index, line in enumerate(lines[1:], 1) if line.strip() == "---" and not line.startswith((" ", "\t"))), None)
    if closing is None:
        return {}
    starts = []
    for index in range(1, closing):
        match = re.match(r'''^(?:([A-Za-z_][A-Za-z0-9_-]*)|"([A-Za-z_][A-Za-z0-9_-]*)"|'([A-Za-z_][A-Za-z0-9_-]*)')\s*:''', lines[index])
        if match:
            starts.append((index, next(value for value in match.groups() if value is not None)))
    preserved = {}
    for offset, (start, key) in enumerate(starts):
        if key in PRESERVED_FRONTMATTER_KEYS:
            end = starts[offset + 1][0] if offset + 1 < len(starts) else closing
            preserved[key] = "".join(lines[start:end]).rstrip("\r\n")
    return preserved


def content_document(frontmatter: dict, content: str, preserved: dict[str, str] | None = None) -> str:
    preserved = preserved or {}
    generated = [key + ": " + json.dumps(value, ensure_ascii=False) for key, value in frontmatter.items() if key not in preserved]
    blocks = generated + list(preserved.values())
    return "---\n" + "\n".join(blocks) + "\n---\n\n" + content.strip() + "\n"


def request(url: str) -> tuple[bytes, dict, str]:
    """Read public URLs with bounded retry; do not follow any authenticated API."""
    request_headers = {"User-Agent": "Mozilla/5.0 CineV-Astro-Migration/1.0", "Accept": "*/*"}
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers=request_headers)
            with urllib.request.urlopen(req, timeout=90) as response:
                return response.read(), dict(response.headers), response.url
        except (urllib.error.URLError, TimeoutError) as error:
            if isinstance(error, urllib.error.HTTPError) and error.code < 500:
                raise
            if attempt == 2:
                raise
            time.sleep(1 + attempt)
    raise RuntimeError("Unreachable request retry")


def route_path(url: str) -> str:
    path = urllib.parse.unquote(urllib.parse.urlsplit(url).path)
    if not path.startswith("/insights"):
        path = "/insights" + (path if path != "/" else "/")
    return path.rstrip("/") + "/"


def origin_route(url: str) -> str:
    parsed = urllib.parse.urlsplit(url)
    path = parsed.path
    if path == "/insights" or path.startswith("/insights/"):
        path = path[len("/insights"):] or "/"
    return ORIGIN + path + ("?" + parsed.query if parsed.query else "")


def language(path: str) -> str:
    if path.startswith("/insights/ko/"):
        return "ko"
    if path.startswith("/insights/ja/"):
        return "ja"
    return "en"


def slug_filename(record: dict) -> str:
    readable = re.sub(r"[^a-zA-Z0-9_-]", "-", urllib.parse.unquote(record.get("slug", ""))).strip("-")
    return str(record["id"]) + "-" + (readable[:90] or "article") + ".md"


def asset_path(url: str) -> str | None:
    parsed = urllib.parse.urlsplit(url)
    path = urllib.parse.unquote(parsed.path)
    for marker in ("/wp-content/", "/wp-includes/"):
        if marker in path and parsed.hostname in INTERNAL_HOSTS:
            local = posixpath.normpath(path[path.index(marker):])
            return local if local.startswith(marker) else None
    if parsed.hostname in {"fonts.googleapis.com", "fonts.gstatic.com", "secure.gravatar.com", "0.gravatar.com", "1.gravatar.com", "2.gravatar.com", "cinev-strorge.cinev.com"}:
        if path in ("", "/"):
            return None
        suffix = Path(path).suffix
        if parsed.hostname == "fonts.googleapis.com":
            suffix = ".css"
        elif parsed.hostname and "gravatar" in parsed.hostname:
            suffix = ".png"
        return "/wp-content/migration-external/" + hashlib.sha256(url.encode()).hexdigest()[:20] + (suffix or ".bin")
    return None


def canonical_asset(url: str, base: str = ORIGIN) -> str | None:
    value = html.unescape(url).strip().replace("\\/", "/")
    if value.startswith(("data:", "blob:", "#", "javascript:", "mailto:")):
        return None
    try:
        resolved = urllib.parse.urljoin(base, value)
        parsed = urllib.parse.urlsplit(resolved)
        local_path = asset_path(resolved)
    except ValueError:
        return None
    if not local_path:
        return None
    if parsed.hostname in INTERNAL_HOSTS:
        return ORIGIN + urllib.parse.quote(local_path, safe="/%:@")
    return resolved


class References(HTMLParser):
    def __init__(self, base: str):
        super().__init__(convert_charrefs=True)
        self.base = base
        self.assets: set[str] = set()
        self.links: set[str] = set()

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        refs = []
        if tag == "link" and values.get("rel", "") in {"stylesheet", "preload", "icon", "apple-touch-icon"}:
            refs.append(values.get("href", ""))
        for name in ("src", "poster", "data-src", "data-lazy-src", "data-background", "data-bg"):
            if values.get(name):
                refs.append(values[name])
        for name in ("srcset", "data-srcset", "data-lazy-srcset"):
            if values.get(name):
                refs.extend(part.strip().split()[0] for part in values[name].split(",") if part.strip())
        if values.get("style"):
            refs.extend(match.group(2) for match in CSS_URL_PATTERN.finditer(values["style"]))
        if tag == "a" and values.get("href"):
            refs.append(values["href"])
            href = urllib.parse.urljoin(self.base, values["href"])
            parsed = urllib.parse.urlsplit(href)
            if parsed.hostname in INTERNAL_HOSTS and (parsed.path.startswith("/insights") or parsed.hostname == "blog.cinev.com"):
                if not parsed.query and not any(x in parsed.path for x in ("/wp-", "/feed", "sitemap", ".xml")):
                    self.links.add(href.split("#")[0])
        for ref in refs:
            canonical = canonical_asset(ref, self.base)
            if canonical:
                self.assets.add(canonical)


def extract_assets(text: str, base: str) -> set[str]:
    parser = References(base)
    parser.feed(text)
    for match in CSS_URL_PATTERN.finditer(text):
        url = canonical_asset(match.group(2), base)
        if url:
            parser.assets.add(url)
    for match in URL_PATTERN.finditer(text.replace("\\/", "/")):
        url = canonical_asset(match.group(0), base)
        if url:
            parser.assets.add(url)
    return parser.assets


def normalize_html(text: str, asset_map: dict[str, str]) -> str:
    # Site/asset origins in HTML and JSON-LD are all changed, including legacy IP
    # asset URLs. Application/external links outside /insights remain intact.
    def replace_url(match):
        value = html.unescape(match.group(0))
        decoded = value.replace("\\/", "/")
        canonical = canonical_asset(decoded)
        if canonical and canonical in asset_map:
            return urllib.parse.quote(asset_map[canonical], safe="/%:@")
        try:
            parsed = urllib.parse.urlsplit(decoded if not decoded.startswith("//") else "https:" + decoded)
        except ValueError:
            return match.group(0)
        if parsed.hostname == "blog.cinev.com" and not parsed.path.startswith(("/wp-", "/xmlrpc")):
            return "/insights" + parsed.path + (("?" + parsed.query) if parsed.query else "")
        if parsed.hostname in {"cinev.com", "www.cinev.com"} and (parsed.path == "/insights" or parsed.path.startswith("/insights/")):
            return parsed.path + (("?" + parsed.query) if parsed.query else "") + (("#" + parsed.fragment) if parsed.fragment else "")
        return match.group(0)

    text = URL_PATTERN.sub(replace_url, text)
    # JSON-LD and block configuration encode slashes but need the same rewrite.
    escaped_url_pattern = re.compile(r"https?:\\/\\/[^\s<>\"']+")
    def escaped_replace(match):
        decoded = match.group(0).replace("\\/", "/")
        normalized = URL_PATTERN.sub(replace_url, decoded)
        return normalized.replace("/", "\\/")
    text = escaped_url_pattern.sub(escaped_replace, text)
    # Escaped JSON URLs and bare /insights/wp-content paths also occur in blocks.
    for original, local in asset_map.items():
        text = text.replace(original.replace("/", "\\/"), local.replace("/", "\\/"))
    text = text.replace("/insights/wp-content/", "/wp-content/").replace("/insights/wp-includes/", "/wp-includes/")
    # Public assets are served under the same /insights base as Astro pages.
    # The main frontend proxy strips that prefix before forwarding to origin.
    text = re.sub(r'''([("'=,\s])/(wp-(?:content|includes)/)''', r'\1/insights/\2', text)
    return text


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=Path(__file__).resolve().parents[1])
    parser.add_argument("--source-output", type=Path, default=None)
    parser.add_argument("--overwrite-content", action="store_true")
    parser.add_argument("--workers", type=int, default=8)
    parser.add_argument("--use-cache", action="store_true", help="Reuse already downloaded local assets and source snapshots")
    args = parser.parse_args()
    root = args.output.resolve()
    source_root = (args.source_output or root / ".migration-cache").resolve()
    (root / "migration/snapshots").mkdir(parents=True, exist_ok=True)
    (source_root / "api").mkdir(parents=True, exist_ok=True)
    (source_root / "snapshots").mkdir(parents=True, exist_ok=True)
    failures: list[dict] = []
    skipped: list[dict] = []

    def api(kind):
        records = []
        page = 1
        total_pages = 1
        while page <= total_pages:
            suffix = "&status=publish" if kind in ("posts", "pages") else ""
            url = f"{ORIGIN}/wp-json/wp/v2/{kind}?per_page=100&page={page}{suffix}"
            payload, headers, _ = request(url)
            batch = json.loads(payload)
            records.extend(batch)
            total_pages = int(headers.get("X-WP-TotalPages", "1"))
            page += 1
        (source_root / "api" / (kind + ".json")).write_text(json.dumps(records, ensure_ascii=False, indent=2))
        print(f"API {kind}: {len(records)}", flush=True)
        return records

    raw = {kind: api(kind) for kind in ("posts", "pages", "categories", "tags", "users")}
    # Keep the complete attachment library, including unreferenced originals.
    raw["media"] = api("media")
    featured_urls = {item["id"]: item.get("media_details", {}).get("sizes", {}).get("large", {}).get("source_url", item.get("source_url", "")) for item in raw["media"]}
    # Save raw public API alongside source snapshots for a complete recovery path.
    (root / "migration/source-api").mkdir(parents=True, exist_ok=True)
    for kind, records in raw.items():
        (root / "migration/source-api" / (kind + ".json")).write_text(json.dumps(records, ensure_ascii=False, indent=2))

    catalog = {"posts": [], "pages": [], "categories": [], "tags": [], "authors": [], "routes": [], "assets": [], "failures": failures}
    catalog.update({"source": ORIGIN, "publicOrigin": PUBLIC_ORIGIN + "/insights", "importedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "skipped": skipped, "sitemapUrls": []})
    routes: dict[str, dict] = {}

    def add_route(url: str, kind: str, **extras):
        path = route_path(url)
        if path in routes:
            return
        digest = hashlib.sha256(path.encode()).hexdigest()[:12]
        routes[path] = {"path": path, "kind": kind, "sourceUrl": origin_route(url), "snapshotFile": "migration/snapshots/" + digest + ".html", **extras}

    for kind in ("posts", "pages"):
        for item in raw[kind]:
            path = route_path(item["link"])
            filename = "content/" + kind + "/" + slug_filename(item)
            record = {"id": item["id"], "slug": item["slug"], "path": path,
                      "title": html.unescape(item["title"]["rendered"]), "date": item["date"],
                      "modified": item["modified"], "excerpt": item.get("excerpt", {}).get("rendered", ""),
                      "categories": item.get("categories", []), "tags": item.get("tags", []),
                      "lang": language(path), "contentFile": filename, "sourceUrl": item["link"],
                      "author": item.get("author"), "featuredMedia": item.get("featured_media", 0),
                      "translations": item.get("translations", {}), "status": item.get("status")}
            catalog[kind].append(record)
            add_route(item["link"], "post" if kind == "posts" else "page", id=item["id"], lang=record["lang"])

    for kind in ("categories", "tags", "users"):
        target = "authors" if kind == "users" else kind
        for item in raw[kind]:
            path = route_path(item["link"])
            record = {"id": item["id"], "slug": item["slug"], "name": html.unescape(item["name"]), "path": path,
                      "count": item.get("count", 0), "lang": language(path), "description": item.get("description", ""), "sourceUrl": item["link"]}
            if kind == "users":
                record["avatarUrls"] = item.get("avatar_urls", {})
            catalog[target].append(record)
            add_route(item["link"], "author" if kind == "users" else ("category" if kind == "categories" else "tag"), id=item["id"], lang=record["lang"])

    for path in ("/", "/ko/", "/ja/", "/blog/", "/blog/page/2/", "/blog/page/3/"):
        add_route(ORIGIN + path, "home" if path in ("/", "/ko/", "/ja/") else "listing")

    visited_sitemaps = set()

    def sitemap(url):
        origin = origin_route(url)
        if origin in visited_sitemaps:
            return
        visited_sitemaps.add(origin)
        try:
            payload, _, _ = request(origin)
            (source_root / (hashlib.sha256(origin.encode()).hexdigest()[:12] + "-sitemap.xml")).write_bytes(payload)
            tree = ET.fromstring(payload)
            # Image sitemaps contain image:loc descendants; only direct loc
            # children of url/sitemap entries are site routes.
            locs = [element.text for entry in tree for element in entry if element.tag.endswith("}loc") and element.text]
            if tree.tag.endswith("sitemapindex"):
                for child in locs:
                    sitemap(child)
            else:
                for link in locs:
                    catalog["sitemapUrls"].append(link)
                    add_route(link, "sitemap")
        except Exception as error:
            failures.append({"kind": "sitemap", "url": origin, "error": str(error)})

    sitemap(ORIGIN + "/sitemap_index.xml")
    print(f"Snapshot routes: {len(routes)}", flush=True)
    snapshots: dict[str, str] = {}
    all_assets: set[str] = set()
    links: set[str] = set()

    def fetch_snapshot(route):
        try:
            name = Path(route["snapshotFile"]).name
            cached = source_root / "snapshots" / name
            if args.use_cache and cached.is_file():
                text = cached.read_text()
                final_url = route["sourceUrl"]
            else:
                payload, _, final_url = request(route["sourceUrl"])
                text = payload.decode("utf-8", "replace")
            if "<html" not in text.lower():
                raise ValueError("Expected public HTML")
            (source_root / "snapshots" / name).write_text(text)
            ref_parser = References(route["sourceUrl"])
            ref_parser.feed(text)
            with LOCK:
                snapshots[route["path"]] = text
                all_assets.update(extract_assets(text, route["sourceUrl"]))
                links.update(ref_parser.links)
            route["finalSourceUrl"] = final_url
            print(f"HTML {route['path']}", flush=True)
        except Exception as error:
            entry = {"kind": "route", "url": route["sourceUrl"], "path": route["path"], "error": str(error)}
            if isinstance(error, urllib.error.HTTPError) and error.code == 404:
                skipped.append(entry)
                route["sourceStatus"] = 404
            else:
                failures.append(entry)

    with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
        list(pool.map(fetch_snapshot, list(routes.values())))
    # Preserve linked pagination routes. Other links are restricted to known
    # public content/taxonomy roots so typo/outbound links are not crawled.
    linked_pagination = sorted(link for link in links if re.search(r"/page/\d+/?$", urllib.parse.urlsplit(link).path))
    new_routes = []
    for link in linked_pagination:
        before = set(routes)
        add_route(link, "pagination")
        if set(routes) != before:
            new_routes.append(routes[route_path(link)])
    if new_routes:
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
            list(pool.map(fetch_snapshot, new_routes))

    for kind in ("posts", "pages"):
        for item in raw[kind]:
            all_assets.update(extract_assets(item["content"]["rendered"], item["link"]))
    for url in featured_urls.values():
        canonical = canonical_asset(url)
        if canonical:
            all_assets.add(canonical)
    for item in raw["users"]:
        for avatar in item.get("avatar_urls", {}).values():
            canonical = canonical_asset(avatar)
            if canonical:
                all_assets.add(canonical)

    asset_map: dict[str, str] = {}
    asset_records: dict[str, dict] = {}
    asset_seen: set[str] = set()

    def fetch_asset(url):
        local = asset_path(url)
        if not local:
            return set()
        destination = root / "public" / local.lstrip("/")
        raw_cache = source_root / "assets" / local.lstrip("/")
        try:
            if args.use_cache and raw_cache.is_file() and raw_cache.stat().st_size > 0:
                payload = raw_cache.read_bytes()
                headers = {"Content-Type": mimetypes.guess_type(local)[0] or "application/octet-stream"}
            elif args.use_cache and not local.endswith(".css") and destination.is_file() and destination.stat().st_size > 0:
                payload = destination.read_bytes()
                headers = {"Content-Type": mimetypes.guess_type(local)[0] or "application/octet-stream"}
            else:
                payload, headers, _ = request(url)
            # Keep raw CSS separate from transformed public CSS. Its relative
            # urls must always resolve against the original resource origin.
            raw_cache.parent.mkdir(parents=True, exist_ok=True)
            raw_cache.write_bytes(payload)
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(payload)
            with LOCK:
                asset_map[url] = local
                asset_records[url] = {"url": url, "path": local, "bytes": len(payload), "contentType": headers.get("Content-Type", "")}
            if local.endswith(".css"):
                text = payload.decode("utf-8", "replace")
                children = set()
                for match in CSS_URL_PATTERN.finditer(text):
                    child = canonical_asset(match.group(2), url)
                    if child:
                        children.add(child)
                for match in CSS_IMPORT_PATTERN.finditer(text):
                    child = canonical_asset(match.group(1), url)
                    if child:
                        children.add(child)
                return children
            return set()
        except Exception as error:
            with LOCK:
                failures.append({"kind": "asset", "url": url, "path": local, "error": str(error)})
            return set()

    pending = set(all_assets)
    while pending:
        batch = sorted(pending - asset_seen)
        if not batch:
            break
        asset_seen.update(batch)
        print(f"Downloading {len(batch)} assets (total discovered {len(asset_seen)})", flush=True)
        pending = set()
        with concurrent.futures.ThreadPoolExecutor(max_workers=args.workers) as pool:
            for children in pool.map(fetch_asset, batch):
                pending.update(children)
    for url, local in sorted(asset_map.items()):
        path = root / "public" / local.lstrip("/")
        if local.endswith((".css", ".js")):
            text = path.read_text(errors="replace")
            if local.endswith(".css"):
                def css_replace(match):
                    canonical = canonical_asset(match.group(2), url)
                    if canonical in asset_map:
                        return "url(\"" + urllib.parse.quote(asset_map[canonical], safe="/%:@") + "\")"
                    return match.group(0)
                text = CSS_URL_PATTERN.sub(css_replace, text)
            path.write_text(normalize_html(text, asset_map))

    for route in routes.values():
        text = snapshots.get(route["path"])
        if text:
            (root / route["snapshotFile"]).write_text(normalize_html(text, asset_map))
    reading_minutes: dict[int, int] = {}
    display_excerpts: dict[int, dict[str, str]] = {}
    for snapshot_path, snapshot in snapshots.items():
        for article in re.finditer(r"<article\b[^>]*\bid=['\"]post-(\d+)['\"][^>]*>(.*?)</article>", snapshot, re.S | re.I):
            minutes = re.search(r"class=['\"]ast-reading-time['\"][^>]*>\s*(\d+)", article.group(2))
            if minutes:
                reading_minutes[int(article.group(1))] = int(minutes.group(1))
            displayed = re.search(r"<div\b[^>]*class=['\"][^'\"]*\bast-excerpt-container\b[^'\"]*['\"][^>]*>(.*?)</div>", article.group(2), re.S | re.I)
            if displayed:
                text = html.unescape(re.sub(r"<[^>]+>", "", displayed.group(1)))
                display_excerpts.setdefault(int(article.group(1)), {})[snapshot_path] = re.sub(r"\s+", " ", text).strip()
    for kind in ("posts", "pages"):
        originals = {item["id"]: item for item in raw[kind]}
        for record in catalog[kind]:
            item = originals[record["id"]]
            content = normalize_html(item["content"]["rendered"], asset_map)
            frontmatter = {key: record[key] for key in ("id", "title", "slug", "path", "date", "modified", "categories", "tags", "lang", "author", "sourceUrl")}
            frontmatter["excerpt"] = re.sub(r"<[^>]+>", "", html.unescape(record["excerpt"])).strip()
            seo = item.get("yoast_head_json", {})
            for source, target in (("title", "seoTitle"), ("description", "description")):
                if seo.get(source):
                    frontmatter[target] = seo[source]
            if seo.get("og_image"):
                image = normalize_html(seo["og_image"][0]["url"], asset_map)
                frontmatter["socialImage"] = "/insights" + image if image.startswith("/wp-") else image
            if any("AboutPage" in node.get("@type", []) for node in seo.get("schema", {}).get("@graph", [])):
                frontmatter["pageType"] = "AboutPage"
            if seo.get("robots", {}).get("index") == "noindex":
                frontmatter["noindex"] = True
            frontmatter["format"] = "wordpress-html"
            frontmatter["wordpressId"] = record["id"]
            if kind == "posts" and item.get("guid", {}).get("rendered"):
                frontmatter["rssGuid"] = html.unescape(item["guid"]["rendered"])
            translations_file = root / "migration/translations.json"
            if translations_file.exists():
                for group in json.loads(translations_file.read_text())["posts"]:
                    if record["id"] in group.values():
                        frontmatter["translationKey"] = "wordpress-" + str(min(group.values()))
            frontmatter["snapshotFile"] = routes[record["path"]]["snapshotFile"]
            destination = root / record["contentFile"]
            destination.parent.mkdir(parents=True, exist_ok=True)
            preserved = preserved_frontmatter(destination.read_text()) if destination.exists() else {}
            record["featuredImage"] = normalize_html(featured_urls.get(record["featuredMedia"], ""), asset_map)
            snapshot = snapshots.get(record["path"], "")
            frontmatter["image"] = record["featuredImage"]
            if record["id"] in reading_minutes:
                record["readingMinutes"] = reading_minutes[record["id"]]
                frontmatter["readingMinutes"] = record["readingMinutes"]
            if record["id"] in display_excerpts:
                record["displayExcerpts"] = display_excerpts[record["id"]]
                home_path = "/insights/" if record["lang"] == "en" else "/insights/" + record["lang"] + "/"
                record["displayExcerpt"] = record["displayExcerpts"].get(home_path, next(iter(record["displayExcerpts"].values())))
            if not destination.exists() or args.overwrite_content:
                destination.write_text(content_document(frontmatter, content, preserved))
            record["excerpt"] = normalize_html(record["excerpt"], asset_map)

    # Guessed pagination and sitemap entries are published only when an actual
    # public HTML page was obtained; retain omitted URLs in skipped/failures.
    catalog["routes"] = sorted((route for route in routes.values() if route["path"] in snapshots), key=lambda item: item["path"])
    catalog["assets"] = sorted(asset_records.values(), key=lambda item: item["path"])
    catalog["counts"] = {key: len(catalog[key]) for key in ("posts", "pages", "categories", "tags", "authors", "routes", "assets", "failures", "skipped")}
    catalog["assetBytes"] = sum(item["bytes"] for item in catalog["assets"])
    (root / "migration/catalog.json").write_text(json.dumps(catalog, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps(catalog["counts"], ensure_ascii=False), flush=True)
    print(f"Asset bytes: {catalog['assetBytes']}", flush=True)
    if failures:
        print(json.dumps(failures, ensure_ascii=False, indent=2), flush=True)


if __name__ == "__main__":
    main()
