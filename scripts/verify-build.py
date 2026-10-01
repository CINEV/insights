#!/usr/bin/env python3
"""Check migrated route coverage and local links against a real Astro build."""
import argparse
import concurrent.futures
import json
import re
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import quote, unquote, urlsplit
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"
PREFIX = "/insights"


def local_file(url: str):
    parsed = urlsplit(url)
    if parsed.netloc or not parsed.path.startswith("/"):
        return None
    path = unquote(parsed.path)
    target = DIST / path.lstrip("/")
    if target.is_file():
        return target
    if (target / "index.html").is_file():
        return target / "index.html"
    return target


class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.remote_wordpress = []
        self.titles = 0
        self.h1 = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "title":
            self.titles += 1
        if tag == "h1":
            self.h1 += 1
        for key in ("src", "href", "poster"):
            value = attrs.get(key, "")
            if not value:
                continue
            if re.search(r"https?://blog\.cinev\.com/(?:wp-content|wp-includes|wp-json)", value):
                self.remote_wordpress.append(value)
            if value.startswith(("/insights", "/wp-content/", "/wp-includes/")):
                self.links.append(value)
        for item in attrs.get("srcset", "").split(","):
            value = item.strip().split(" ")[0]
            if value.startswith(("/insights", "/wp-content/", "/wp-includes/")):
                self.links.append(value)


def main():
    args = argparse.ArgumentParser(description=__doc__)
    args.add_argument('--base-url', help='Also check HTTP responses from a running local preview, e.g. http://localhost:4321')
    options = args.parse_args()
    if not DIST.is_dir():
        sys.exit("Run npm run build first: dist/ is missing")
    catalog = json.loads((ROOT / "migration/catalog.json").read_text())
    errors = []
    expected = {r["path"] for r in catalog["routes"]}
    expected |= {r["path"] for r in catalog["posts"] + catalog["pages"]}
    for route in sorted(expected):
        file = local_file(route)
        if file is None or not file.is_file():
            errors.append(f"Missing migrated route: {route}")
    checked = 0
    missing = set()
    http_urls = set()
    for file in DIST.rglob("*.html"):
        checked += 1
        if file.name == "index.html" and file.parent.name == "feed":
            if file.read_bytes() != (DIST / "feed.xml").read_bytes():
                errors.append(f"Invalid RSS alias: {file.relative_to(DIST)}")
            continue
        parser = Links()
        parser.feed(file.read_text())
        if parser.titles != 1:
            errors.append(f"Expected one title in {file.relative_to(DIST)}: {parser.titles}")
        for url in parser.remote_wordpress:
            errors.append(f"Live WordPress dependency: {file.relative_to(DIST)} -> {url}")
        for url in parser.links:
            http_urls.add(urlsplit(url).path)
            target = local_file(url)
            if target is not None and not target.is_file():
                missing.add((str(file.relative_to(DIST)), url))
    errors += [f"Broken local link: {source} -> {url}" for source, url in sorted(missing)]
    for endpoint in ("sitemap_index.xml", "sitemap.xml", "feed.xml"):
        if not (DIST / endpoint).is_file():
            errors.append(f"Missing compatibility endpoint: {endpoint}")
    for path in ("feed/index.html", "insights/feed/index.html", "insights/feed.xml", "insights/index.html", ".nojekyll"):
        if not (DIST / path).is_file():
            errors.append(f"Missing Pages compatibility path: {path}")
    # Check every current published entry, including new Markdown posts. The
    # import catalog alone cannot verify ongoing publication.
    try:
        entries = json.loads((DIST / "search-index.json").read_text())
        feed_links = {item.findtext("link") for item in ET.parse(DIST / "feed.xml").findall("./channel/item")}
        sitemap_links = {node.text for node in ET.parse(DIST / "sitemap.xml").findall("{*}url/{*}loc")}
        for entry in entries:
            path = entry["path"]
            if not local_file(path).is_file():
                errors.append(f"Published content has no generated page: {path}")
            canonical_path = re.sub(r"/blog/$", "/", path)
            if "https://cinev.com" + canonical_path not in sitemap_links:
                errors.append(f"Published content missing from sitemap: {path}")
            if entry.get("collection") == "posts" and "https://cinev.com" + path not in feed_links:
                errors.append(f"Published post missing from RSS: {path}")
    except (OSError, ValueError, ET.ParseError) as exc:
        errors.append(f"Cannot validate publication indexes: {exc}")
    http_checked = 0
    if options.base_url:
        base = urlsplit(options.base_url)
        if base.scheme not in ('http', 'https') or base.hostname not in ('localhost', '127.0.0.1', '::1'):
            sys.exit('--base-url must point to a local preview')
        # Also request the assets loaded indirectly by CSS (fonts/backgrounds).
        for asset in catalog.get('assets', []):
            path = asset.get('localPath') or asset.get('path')
            if path:
                http_urls.add(PREFIX + '/' + str(path).removeprefix('public/').lstrip('/'))
        for css in DIST.rglob('*.css'):
            for match in re.finditer(r'''url\(\s*["']?([^\s)"']+)''', css.read_text(errors='replace')):
                if match.group(1).startswith('/'):
                    http_urls.add(match.group(1))
        http_urls |= {PREFIX + '/' + name for name in ('sitemap.xml', 'sitemap_index.xml', 'feed.xml', 'search-index.json', 'site.js', 'site.css')}


        def check_http(path):
            url = options.base_url.rstrip('/') + quote(unquote(path), safe='/%:@')
            try:
                with urlopen(Request(url, method='HEAD'), timeout=20) as response:
                    if response.status != 200:
                        return f'HTTP {response.status}: {path}'
                    if path.endswith(('.woff', '.woff2', '.png', '.jpeg', '.jpg', '.webp', '.svg', '.css', '.js')) and 'text/html' in response.headers.get('Content-Type', ''):
                        return f'Unexpected HTML response for asset: {path}'
            except Exception as exc:
                return f'HTTP failure: {path}: {exc}'
            return None

        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            errors += [result for result in pool.map(check_http, sorted(http_urls)) if result]
        http_checked = len(http_urls)
    summary = {"posts": len(catalog["posts"]), "pages": len(catalog["pages"]),
               "expectedRoutes": len(expected), "builtHtmlPages": checked,
               "publishedEntries": len(entries) if 'entries' in locals() else 0,
               "assets": len(catalog.get("assets", [])), "httpChecked": http_checked, "errors": errors}
    print(json.dumps(summary, indent=2, ensure_ascii=False))
    if errors:
        sys.exit(1)


if __name__ == "__main__":
    main()
