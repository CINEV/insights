import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import vm from 'node:vm';
import { load } from 'cheerio';
import { contentMetadata } from './lib/content-metadata.mjs';

const options = process.argv.slice(2);
assert(options.every(option => option === '--migration-baseline'), 'Unknown SEO verification option');
const migrationBaseline = options.includes('--migration-baseline');

const root = process.cwd();
const read = path => readFileSync(resolve(root, path), 'utf8');
const site = JSON.parse(read('src/config/site.json'));
const html = path => load(read(`dist/${decodeURI(path).replace(/^\/insights\//, '')}index.html`));
const sitemap = new Set([...load(read('dist/sitemap.xml'), { xmlMode: true })('loc')].map(node => load(node).text()));
const llms = read('dist/llms.txt');
const published = JSON.parse(read('dist/search-index.json'));
const catalog = JSON.parse(read('migration/catalog.json'));
const importedTranslations = JSON.parse(read('migration/translations.json'));
const currentContent = contentMetadata(root);
const normalizedUrl = value => decodeURI(new URL(value, site.origin).toString());
const alternatesFor = $ => Object.fromEntries([...$('head link[rel="alternate"][hreflang]')].map(element => [$(element).attr('hreflang'), normalizedUrl($(element).attr('href'))]));
const localImage = value => {
  const url = new URL(value);
  assert.equal(url.origin, site.origin);
  assert(url.pathname.startsWith(site.base + '/'), value);
  assert(existsSync(join(root, 'dist', decodeURI(url.pathname))), `Missing SEO image: ${value}`);
};
let pages = 0;
for (const file of readdirSync(resolve(root, 'dist'), { recursive: true })) {
  if (!file.endsWith('index.html') || file.startsWith('insights/') || /(?:^|\/)feed\/index\.html$/.test(file)) continue;
  const $ = load(read(`dist/${file}`));
  const path = '/insights/' + file.replace(/index\.html$/, '');
  const canonical = $('link[rel="canonical"]').attr('href');
  const noindex = $('meta[name="robots"]').attr('content')?.includes('noindex');
  assert.equal($('title').length, 1, file);
  assert.equal($('link[rel="canonical"]').length, 1, file);
  assert.equal($('meta[name="robots"]').length, 1, file);
  if (noindex) assert(!sitemap.has(site.origin + path), `Noindex in sitemap: ${file}`);
  if (/\/(tag|author)\//.test(path)) assert(noindex, file);
  if (path.includes('/author/')) {
    assert.equal($('meta[http-equiv="refresh"]').attr('content'), '0; url=/insights/');
    continue;
  }
  for (const selector of ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:image"]', 'meta[name="twitter:image"]']) assert.equal($(selector).length, 1, `${file}: ${selector}`);
  localImage($('meta[property="og:image"]').attr('content'));
  for (const token of site.googleVerification) assert($(`meta[name="google-site-verification"][content="${token}"]`).length === 1);
  const graphs = [...$('head script[type="application/ld+json"]')].flatMap(node => JSON.parse($(node).text())['@graph'] || []);
  for (const type of ['Organization', 'WebSite', 'ImageObject', 'BreadcrumbList']) assert(graphs.some(node => node['@type'] === type), `${file}: ${type}`);
  assert(!JSON.stringify(graphs).includes('blog.cinev.com'));
  assert(!JSON.stringify(graphs).includes('43.200.218.52'));
  assert.equal($('script[src="/insights/analytics.js"]').length, 1);
  assert(!$('a[href*="?p="]').length, `Unresolved WordPress link: ${file}`);
  const alternates = alternatesFor($);
  if (Object.keys(alternates).length) {
    const language = $('html').attr('lang');
    assert(!noindex, `Noindex page advertises translations: ${file}`);
    assert.equal(alternates[language], normalizedUrl(canonical), `Missing self hreflang: ${file}`);
    assert.equal($('head link[hreflang]').length, Object.keys(alternates).length, `Duplicate language: ${file}`);
    assert.equal($('.cinev-translations [aria-current="page"]').attr('lang'), language, file);
    assert.equal($('.cinev-translations a').length, Object.keys(alternates).length - 1, file);
    for (const [targetLanguage, destination] of Object.entries(alternates)) {
      const target = html(new URL(destination).pathname);
      assert(!target('meta[name="robots"]').attr('content').includes('noindex'), destination);
      assert.equal(alternatesFor(target)[language], normalizedUrl(canonical), `Nonreciprocal hreflang: ${file} -> ${destination}`);
      if (targetLanguage !== language) assert.equal(normalizedUrl($(`.cinev-translations a[hreflang="${targetLanguage}"]`).attr('href')), destination);
    }
  } else assert.equal($('.cinev-translations').length, 0, `Navigation without indexed translations: ${file}`);
  pages++;
}
for (const location of sitemap) {
  const $ = html(new URL(location).pathname);
  assert(!$('meta[name="robots"]').attr('content').includes('noindex'), location);
  assert.equal($('link[rel="canonical"]').attr('href'), location);
}
// Compare with current authored translation keys, not just mutual links in
// output: a missing entire group must fail even if the remaining links agree.
const currentPublished = currentContent.filter(entry => !entry.draft);
assert.deepEqual(published.map(entry => entry.path).sort(), currentPublished.map(entry => entry.path).sort(), 'Search index must match current published Markdown');
let translatedEntries = 0;
let translatedCategories = 0;
for (const entry of currentContent) {
  if (entry.draft) {
    for (const path of [entry.path.slice(site.base.length), entry.path]) assert(!existsSync(join(root, 'dist', decodeURI(path), 'index.html')), `Draft output exists: ${entry.file}`);
    for (const output of [read('dist/sitemap.xml'), llms, ...['feed.xml', 'ko/feed.xml', 'ja/feed.xml', 'all/feed.xml'].map(file => read('dist/' + file))]) {
      assert(!output.includes(entry.path) && !output.includes(encodeURI(entry.path)), `Draft indexed: ${entry.file}`);
    }
    continue;
  }
  const page = html(entry.path);
  assert.equal(page('meta[name="robots"]').attr('content')?.includes('noindex'), entry.noindex, `Authored indexing policy differs: ${entry.file}`);
  const group = entry.translationKey && !entry.noindex ? currentPublished.filter(candidate => candidate.translationKey === entry.translationKey && !candidate.noindex) : [];
  const expected = group.length > 1 ? Object.fromEntries(group.map(candidate => [candidate.lang, normalizedUrl(site.origin + candidate.path)])) : {};
  assert.deepEqual(alternatesFor(page), expected, `Current translation group differs: ${entry.file}`);
  if (group.length > 1) translatedEntries++;
}
const assertTranslationGroup = (group, entries) => {
  const expected = {};
  for (const [lang, id] of Object.entries(group)) {
    const entry = entries.find(entry => entry.id === id);
    assert(entry, `Translation ID missing from catalog: ${id}`);
    expected[lang] = normalizedUrl(site.origin + entry.path);
  }
  for (const path of Object.values(expected)) assert.deepEqual(alternatesFor(html(new URL(path).pathname)), expected, `Migration translation group differs: ${path}`);
};
if (migrationBaseline) {
  for (const group of importedTranslations.posts) assertTranslationGroup(group, [...catalog.posts, ...catalog.pages]);
}
// Category translations are still authored in this file during operation.
for (const group of importedTranslations.terms) {
  if (!Object.values(group).every(id => catalog.categories.some(category => category.id === id))) continue;
  assertTranslationGroup(group, catalog.categories);
  translatedCategories += Object.keys(group).length;
}
assert(read('dist/robots.txt').includes('Disallow: /\n'));
assert(read('dist/robots.txt').includes('Sitemap: https://cinev.com/insights/sitemap_index.xml'));
assert.equal(read('dist/insights/llms.txt'), llms);
// Exercise host gating and duplicate loads without sending real analytics.
const analytics = read('public/analytics.js');
for (const origin of ['http://localhost:4321', 'https://cinev.github.io', 'https://dev.cinev.com', site.origin]) {
  const inserted = [];
  const context = { window: { location: { origin } }, document: {
    currentScript: { dataset: { origin: site.origin, tag: site.analytics.googleTagId } },
    createElement: () => ({}), head: { appendChild: node => inserted.push(node) },
  } };
  vm.runInNewContext(analytics, context);
  vm.runInNewContext(analytics, context);
  if (origin === site.origin) {
    assert.equal(inserted.length, 1);
    assert.equal(inserted[0].src, 'https://www.googletagmanager.com/gtag/js?id=GT-TB7PRSX5');
    assert.equal(context.window.dataLayer.filter(args => args[0] === 'config').length, 1);
  } else assert.equal(inserted.length, 0);
}
console.log(`SEO checks passed: ${pages} pages, metadata, local social images, schema, verification, ${translatedEntries} translated entries, ${translatedCategories} translated categories, reciprocal hreflang/navigation, current Markdown publication/draft policy, sitemap policy, llms.txt, analytics origin gating${migrationBaseline ? ', original WordPress translation baseline' : ''}.`);
