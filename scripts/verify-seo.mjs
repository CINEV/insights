import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import vm from 'node:vm';
import { createHash } from 'node:crypto';
import { load } from 'cheerio';
import { contentMetadata } from './lib/content-metadata.mjs';

const options = process.argv.slice(2);
assert(options.every(option => option === '--migration-baseline'), 'Unknown SEO verification option');
const migrationBaseline = options.includes('--migration-baseline');

const root = process.cwd();
const read = path => readFileSync(resolve(root, path), 'utf8');
const stylesheetVersion = createHash('sha256').update(read('public/site.css')).digest('hex').slice(0, 12);
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
  assert.equal($('.cinev-translations').length, 0, file);
  assert.equal($('.pll-parent-menu-item, .lang-item').length, 0, file);
  $('a[href]').each((_, element) => {
    const url = new URL($(element).attr('href'), site.origin);
    if (['cinev.com', 'www.cinev.com'].includes(url.hostname)) assert(!/^\/(?:ko\/|ja\/)?(?:shorts(?:\/|$)|share\/)/.test(url.pathname), `Service-only link: ${file}: ${url}`);
  });
  assert.equal($(`link[href="/insights/site.css?v=${stylesheetVersion}"]`).length, 1, `Unversioned stylesheet: ${file}`);
  const navigation = $('#masthead, #colophon, .ast-mobile-popup-drawer');
  const language = $('html').attr('lang');
  const home = `/insights/${language === 'en' ? '' : language + '/'}`;
  const featurePage = /\/ai-anime-series-generator(?:-(?:ko|ja))?\/$/.test(path);
  assert.equal($('.cinev-site-languages a').length, featurePage ? 0 : 3, file);
  if (!featurePage) assert.equal($('.cinev-site-languages [aria-current]').attr('lang'), language, file);
  $('.cinev-site-languages a').each((_, element) => {
    const link = $(element), code = link.attr('lang');
    const alternate = $(`head link[hreflang="${code}"]`).attr('href');
    const expected = code === language ? path : alternate ? new URL(alternate).pathname : `/insights/${code === 'en' ? '' : code + '/'}`;
    assert.equal(decodeURI(link.attr('href')), decodeURI(expected), `Wrong language destination: ${file}: ${code}`);
    assert(existsSync(join(root, 'dist', decodeURI(expected), 'index.html')), `Missing language target: ${expected}`);
  });
  if (language === 'ja') $('.ast-excerpt-container p').each((_, element) => {
    assert(Array.from($(element).text()).length <= 161, `Japanese summary too long: ${file}`);
  });
  const menuLabels = {
    en: ['Trends', 'News', 'Tutorials', 'Showcase', 'Features'],
    ko: ['트렌드', '소식', '튜토리얼', '쇼케이스'],
    ja: ['トレンド', 'ニュース', 'チュートリアル', 'ショーケース'],
  };
  $('#masthead .main-header-menu, .ast-mobile-popup-drawer .main-header-menu').each((_, element) => {
    const menu = $(element);
    assert.deepEqual(menu.children('li').map((_, item) => $(item).children('a').text().trim()).get(), menuLabels[language], `Inconsistent menu: ${file}`);
    const categoryPath = path.replace(/page\/\d+\/$/, '');
    const expectedActive = menu.find('a').filter((_, link) => $(link).attr('href') === categoryPath);
    assert.equal(menu.find('a[aria-current="page"]').length, expectedActive.length, `Wrong active menu: ${file}`);
    expectedActive.each((_, link) => {
      assert.equal($(link).attr('aria-current'), 'page', file);
      assert($(link).parent().hasClass('current-menu-item'), file);
    });
    const feature = menu.find('.sub-menu a');
    assert.equal(feature.length, language === 'en' ? 1 : 0, file);
    if (language !== 'en') return;
    assert.equal(feature.text().trim(), { en: 'for IP Creators', ko: 'IP 창작자를 위해', ja: 'IPクリエイター向け' }[language], file);
    assert.equal(feature.attr('href'), home + 'ai-anime-series-generator' + (language === 'en' ? '' : '-' + language) + '/', file);
    assert.equal(menu.find('.menu-item-has-children > .ast-menu-toggle').length, 1, `Missing mobile dropdown: ${file}`);
  });
  if (language !== 'en') assert.equal(navigation.find('a[href*="ai-anime-series-generator"]').length, 0, file);
  assert(navigation.find('a[href="/"]').length > 0, `Missing site home: ${file}`);
  assert(!navigation.text().includes('Try CineV for Free'), file);
  navigation.find('a[href]').each((_, element) => {
    const href = $(element).attr('href');
    assert(!href.includes('/shorts'), `Old CTA: ${file}`);
    if (!href.startsWith('/insights/')) return;
    assert(href.startsWith(home), `Wrong menu language: ${file}: ${href}`);
    assert(existsSync(join(root, 'dist', decodeURI(href), 'index.html')), `Missing menu target: ${href}`);
  });
  $('.ast-post-social-sharing a[href]').each((_, element) => {
    const url = new URL($(element).attr('href'), site.origin);
    if (url.searchParams.has('media')) localImage(url.searchParams.get('media'));
  });

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
    for (const [targetLanguage, destination] of Object.entries(alternates)) {
      const target = html(new URL(destination).pathname);
      assert(!target('meta[name="robots"]').attr('content').includes('noindex'), destination);
      assert.equal(alternatesFor(target)[language], normalizedUrl(canonical), `Nonreciprocal hreflang: ${file} -> ${destination}`);
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
assert(read('dist/robots.txt').includes('Allow: /\n'));
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

for (const [lang, label] of [['ko', '트렌드'], ['ja', 'トレンド']]) {
  const page = html(`/insights/${lang}/trends-${lang}/`);
  assert.equal(page('h1').text().trim(), label);
  assert(page('title').text().includes(label));
  assert.equal(page('#ast-breadcrumbs-yoast [aria-current]').text(), label);
  assert.equal(page('.cinev-translations').length, 0);
  assert.equal(page('.cinev-site-languages a').length, 3);
  assert(!page('.ast-reading-time').text().includes('of reading'));
  assert(!html(`/insights/${lang}/`)('title').text().includes('Tips & Guides'));
}

for (const [lang, text] of [['ko', '등록된 글이 없습니다.'], ['ja', '記事はまだありません。']]) {
  assert.equal(html(`/insights/${lang}/showcase-${lang}/`)('.cinev-empty-archive').text(), text);
}

for (const lang of ['en', 'ko', 'ja']) {
  const prefix = lang === 'en' ? '' : lang + '/';
  const suffix = lang === 'en' ? '' : '-' + lang;
  const page = html(`/insights/${prefix}ai-anime-series-generator${suffix}/`);
  assert.equal(page('.uagb-block-ip-logo a').attr('href'), `/insights/${prefix}`);
  assert.equal(page('.uagb-block-ip-btn-free a').attr('href'), '/');
  assert.equal(page('.uagb-block-ip-btn-free a').text().trim(), {en:'CINEV Home',ko:'CINEV 홈',ja:'CINEV ホーム'}[lang]);
}
