import assert from 'node:assert/strict';
import { readFileSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { load } from 'cheerio';

const options = process.argv.slice(2);
if (options.includes('--help')) {
  console.log('Usage: node scripts/verify-rss.mjs [--migration-baseline]\nDefault: verify current publication, RSS structure, GUID stability and aliases.\n--migration-baseline: also compare archived author/category/date/enclosure metadata.');
  process.exit(0);
}
assert(options.every(option => option === '--migration-baseline'), 'Unknown RSS verification option');
const migrationBaseline = options.includes('--migration-baseline');
const root = process.cwd();
const read = path => readFileSync(resolve(root, path), 'utf8');
const site = JSON.parse(read('src/config/site.json'));
const published = JSON.parse(read('dist/search-index.json')).filter(entry => entry.collection === 'posts');
const assetManifest = JSON.parse(read('dist/asset-manifest.json'));
const assets = new Map(assetManifest.assets.map(asset => [decodeURI(asset.path), asset]));
const checkedAssets = new Set();
const checkOwnedAsset = (value, context) => {
  const url = new URL(value);
  if (url.origin !== site.origin) return;
  const path = decodeURI(url.pathname);
  if (!path.startsWith(site.base + '/') || !/^\/(?:assets|wp-content|wp-includes|images|_astro)\//.test(path.slice(site.base.length))) return;
  assert(!/\/(?:wp-content|wp-includes)\//.test(path), `Retired RSS asset URL in ${context}: ${path}`);
  const asset = assets.get(path);
  assert(asset, `RSS asset omitted from deployment manifest in ${context}: ${path}`);
  if (!checkedAssets.has(path)) {
    const file = statSync(join(root, 'dist', path));
    assert(file.isFile(), `RSS asset is not a file: ${path}`);
    assert.equal(file.size, asset.bytes, `RSS asset size differs from deployment manifest: ${path}`);
    checkedAssets.add(path);
  }
};
const canonical = value => decodeURI(value);
const xml = source => load(source, { xmlMode: true });
const child = (node, name) => node.children().filter((_, element) => element.name === name);
const feeds = new Map();
let checked = 0;
for (const lang of ['en', 'ko', 'ja', 'all']) {
  const prefix = lang === 'en' ? '' : lang + '/';
  const content = read(`dist/${prefix}feed.xml`);
  const $ = xml(content);
  const channel = $('channel');
  assert.equal(channel.length, 1);
  assert.equal(child(channel, 'atom:link').attr('href'), `${site.origin}${site.base}/${prefix}feed.xml`);
  assert.equal(channel.children('language').text(), { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', all: '' }[lang]);
  for (const copy of [`${prefix}feed/index.html`, `insights/${prefix}feed.xml`, `insights/${prefix}feed/index.html`]) {
    assert.equal(read('dist/' + copy), content, `RSS alias differs: ${copy}`);
  }
  const expected = published.filter(entry => lang === 'all' || entry.lang === lang);
  const entries = new Map();
  const guids = new Set();
  channel.children('item').each((_, element) => {
    const item = $(element);
    const link = canonical(item.children('link').text());
    const guid = item.children('guid').text();
    assert(guid && !guids.has(guid), `Missing or duplicate GUID: ${guid}`);
    guids.add(guid);
    entries.set(link, item);
    assert(expected.some(entry => site.origin + entry.path === link), `Wrong language or unpublished RSS item: ${link}`);
    assert(child(item, 'dc:creator').text(), `Missing author: ${link}`);
    assert(Number.isFinite(Date.parse(item.children('pubDate').text())), `Invalid date: ${link}`);
    const path = decodeURI(new URL(link).pathname).replace(/^\/insights\//, '');
    const page = load(read(`dist/${path}index.html`));
    assert.equal(child(item, 'dc:creator').text(), page('meta[name="author"]').attr('content'), `RSS/page author mismatch: ${link}`);
    assert.equal(Date.parse(item.children('pubDate').text()), Date.parse(page('meta[property="article:published_time"]').attr('content')), `RSS/page date mismatch: ${link}`);
    const graph = [...page('head script[type="application/ld+json"]')].flatMap(element => JSON.parse(page(element).text())['@graph'] || []);
    assert.equal(item.children('title').text(), graph.find(node => node['@type'] === 'BlogPosting')?.headline, `RSS/page title mismatch: ${link}`);
    const body = load(child(item, 'content:encoded').text(), null, false);
    assert.equal(body('script').length, 0, `RSS should not carry page scripts: ${link}`);
    body('[href], [src], [poster], [cite], [data-src]').each((_, element) => {
      for (const attr of ['href', 'src', 'poster', 'cite', 'data-src']) {
        const value = body(element).attr(attr);
        if (value) {
          assert(/^[a-z][a-z\d+.-]*:/i.test(value), `Relative RSS ${attr}: ${value}`);
          checkOwnedAsset(value, `${link} ${attr}`);
        }
      }
    });
    body('[srcset], [data-srcset]').each((_, element) => {
      for (const attr of ['srcset', 'data-srcset']) {
        const value = body(element).attr(attr);
        if (value) {
          // The feed formatter separates candidates with comma + space;
          // commas within a data URL therefore stay inside its URL token.
          for (const candidate of value.split(/,\s+/)) {
            const url = candidate.trim().split(/\s+/)[0];
            assert(/^[a-z][a-z\d+.-]*:/i.test(url), `Relative RSS ${attr}: ${url}`);
            checkOwnedAsset(url, `${link} ${attr}`);
          }
        }
      }
    });
    const enclosure = item.children('enclosure');
    if (enclosure.length) {
      assert.equal(enclosure.length, 1);
      const url = new URL(enclosure.attr('url'));
      assert.equal(url.origin, site.origin, `Imported RSS media still depends on another host: ${url}`);
      assert(url.pathname.startsWith(site.base + '/'));
      checkOwnedAsset(url.toString(), `${link} enclosure`);
      assert.equal(statSync(join(root, 'dist', decodeURI(url.pathname))).size, Number(enclosure.attr('length')));
      assert.match(enclosure.attr('type'), /^(?:audio|video)\//);
    }
    checked++;
  });
  assert.equal(entries.size, expected.length, `${lang}: missing RSS entries`);
  feeds.set(lang, entries);
}
const baseline = JSON.parse(read('tests/fixtures/rss-baseline.json'));
for (const [lang, originals] of Object.entries(baseline)) {
  for (const original of originals) {
    const link = canonical(original.link);
    if (!published.some(entry => site.origin + entry.path === link)) continue;
    for (const kind of [lang, 'all']) {
      const current = feeds.get(kind).get(link);
      assert(current, `${kind}: missing baseline RSS item ${link}`);
      assert.equal(current.children('guid').text(), original.guid);
      assert.equal(current.children('guid').attr('isPermaLink'), 'false');
      if (migrationBaseline) {
        assert.equal(child(current, 'dc:creator').text(), original.author);
        assert.deepEqual(current.children('category').map((_, element) => load(element).text()).get().sort(), original.categories.slice().sort());
        assert.equal(Date.parse(current.children('pubDate').text()), Date.parse(original.date));
        assert.equal(current.children('enclosure').length, original.enclosure ? 1 : 0);
        if (original.enclosure) {
          assert.equal(current.children('enclosure').attr('length'), original.enclosure.length);
          assert.equal(current.children('enclosure').attr('type'), original.enclosure.type);
        }
      }
    }
  }
}
console.log(`RSS checks passed: ${checked} items across en/ko/ja/all, language isolation, stable GUIDs, current page metadata, absolute body URLs, feed aliases, ${checkedAssets.size} deployed body/media assets${migrationBaseline ? ', original WordPress metadata baseline' : ''}.`);
