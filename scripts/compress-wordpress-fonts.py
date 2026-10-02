#!/usr/bin/env python3
"""Convert complete CJK fonts to WOFF2 and compare the complete font tables.

Run only inside the documented Podman container. No glyph subsetting is used.
"""
import argparse
import copy
import hashlib
import importlib.metadata
import json
import platform
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.misc.xmlWriter import XMLWriter


class HashSink:
    def __init__(self):
        self.digest = hashlib.sha256()

    def write(self, data):
        self.digest.update(data.encode("utf-8") if isinstance(data, str) else data)


def table_fingerprint(font, tag):
    """Hash normalized table XML, including every contour and instruction."""
    sink = HashSink()
    writer = XMLWriter(sink)
    if tag == "head":
        # WOFF2 reconstructs the SFNT container checksum and loca encoding.
        # Neither changes outlines, characters, metrics or any font behavior.
        table = copy.copy(font[tag])
        table.checkSumAdjustment = 0
        table.indexToLocFormat = 0
        # OpenType head flags bit 11 identifies lossless compression. WOFF2
        # sets it on every converted font; it does not alter rendering data.
        table.flags &= ~(1 << 11)
        table.toXML(writer, font)
    else:
        font[tag].toXML(writer, font)
    return sink.digest.hexdigest()


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def manifest_entries(report):
    if not report["verified"]:
        raise ValueError("Unverified font conversions cannot produce a manifest")
    return [
        {
            "source": font["sourcePath"],
            "target": font["targetPath"],
            "sourceSha256": font["sourceSha256"],
            "sha256": font["targetSha256"],
            "sourceBytes": font["sourceBytes"],
            "bytes": font["targetBytes"],
        }
        for font in report["fonts"]
    ]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--verify-existing", action="store_true")
    parser.add_argument("--source-url-prefix", default="/wp-content/migration-external")
    parser.add_argument("--target-url-prefix", default="/wp-content/migration-fonts")
    parser.add_argument("--expected-fonts", type=int, default=8)
    parser.add_argument("--manifest", type=Path,
                        help="Write the deployment mapping only after successful full-font validation")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    reports = []
    for source in sorted(args.input.glob("*.ttf")):
        output = args.output / (source.stem + ".woff2")
        original = TTFont(source, recalcBBoxes=False, recalcTimestamp=False)
        original_tags = sorted(set(original.keys()) - {"GlyphOrder"})
        original_order = original.getGlyphOrder()
        original_tables = {
            tag: table_fingerprint(original, tag)
            for tag in original_tags if tag != "loca"
        }
        if not (args.verify_existing and output.exists()):
            original.flavor = "woff2"
            original.save(output, reorderTables=False)
        converted = TTFont(output, recalcBBoxes=False, recalcTimestamp=False)
        converted_tags = sorted(set(converted.keys()) - {"GlyphOrder"})
        converted_tables = {
            tag: table_fingerprint(converted, tag)
            for tag in converted_tags if tag != "loca"
        }
        mismatches = [tag for tag in original_tables
                      if original_tables[tag] != converted_tables.get(tag)]
        source_bytes = source.stat().st_size
        output_bytes = output.stat().st_size
        report = {
            "source": source.name,
            "output": output.name,
            "sourcePath": args.source_url_prefix.rstrip("/") + "/" + source.name,
            "targetPath": args.target_url_prefix.rstrip("/") + "/" + output.name,
            "sourceSha256": digest(source),
            "outputSha256": digest(output),
            "targetSha256": digest(output),
            "sourceBytes": source_bytes,
            "outputBytes": output_bytes,
            "targetBytes": output_bytes,
            "savedBytes": source_bytes - output_bytes,
            "savedPercent": round((1-output_bytes/source_bytes)*100, 4),
            "family": original["name"].getDebugName(1),
            "subfamily": original["name"].getDebugName(2),
            "glyphs": len(original_order),
            "unicodeMappings": len(original.getBestCmap()),
            "tables": original_tags,
            "glyphOrderIdentical": original_order == converted.getGlyphOrder(),
            "tableSetIdentical": original_tags == converted_tags,
            "normalizedTableHashes": original_tables,
            "normalizedTableMismatches": mismatches,
            "verified": original_order == converted.getGlyphOrder()
                and original_tags == converted_tags and not mismatches,
        }
        reports.append(report)
        print(json.dumps({key: value for key, value in report.items()
                          if key != "normalizedTableHashes"}), flush=True)
        original.close()
        converted.close()
    report = {
        "method": "Full-font WOFF2; no subsetting or glyph removal",
        "validation": "Complete glyph order and table set; normalized XML of every table except derived loca. head.checkSumAdjustment, head.indexToLocFormat and flags bit 11 (lossless compression indicator) ignored as container encoding fields. glyf XML retains all contours, coordinates, composites and hinting instructions.",
        "versions": {
            "python": platform.python_version(),
            "fonttools": importlib.metadata.version("fonttools"),
            "brotli": importlib.metadata.version("brotli"),
            "zopfli": importlib.metadata.version("zopfli"),
        },
        "fonts": reports,
        "sourceBytes": sum(font["sourceBytes"] for font in reports),
        "outputBytes": sum(font["outputBytes"] for font in reports),
        "savedBytes": sum(font["savedBytes"] for font in reports),
        "verified": len(reports) == args.expected_fonts and all(font["verified"] for font in reports),
    }
    (args.output / "report.json").write_text(json.dumps(report, indent=2) + "\n")
    if not report["verified"]:
        raise SystemExit("Font roundtrip validation failed; inspect report.json")
    if args.manifest:
        args.manifest.parent.mkdir(parents=True, exist_ok=True)
        args.manifest.write_text(json.dumps(manifest_entries(report), indent=2) + "\n")


if __name__ == "__main__":
    main()
