import { getCollection, type CollectionEntry } from 'astro:content';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { load, type CheerioAPI } from 'cheerio';
import site from '../config/site.json';
import importedTranslations from '../../migration/translations.json';
import { seoHead } from './seo';

export type Entry = CollectionEntry<'posts'> | CollectionEntry<'pages'>;
export type Term = { id: number | string; slug: string; name: string; path: string; lang?: string; [key: string]: unknown };
type ImportedEntry = { id: number; path: string; contentFile: string; snapshotFile?: string; excerpt?: string; displayExcerpt?: string; displayExcerpts?: Record<string, string>; [key: string]: unknown };
type ImportedRoute = { path: string; kind: string; sourceUrl: string; snapshotFile: string };
type Catalog = { posts: ImportedEntry[]; pages: ImportedEntry[]; categories: Term[]; tags: Term[]; authors: Term[]; routes: ImportedRoute[] };
export type Route = {
  path: string;
  kind: 'entry' | 'archive';
  entry?: Entry;
  entries?: Entry[];
  page?: number;
  totalPages?: number;
  archivePath?: string;
  label?: string;
  snapshotFile?: string;
  lang: string;
  categoryCounts?: Record<string, number>;
  publishedWordpressPaths?: Record<string, string>;
  noindex?: boolean;
  redirectTo?: string;
  translations?: { lang: string; path: string }[];
};

const root = process.cwd();
const catalogFile = resolve(root, 'migration/catalog.json');
export const catalog: Catalog = JSON.parse(readFileSync(catalogFile, 'utf8'));
const snapshotCache = new Map<string, string>();
const PAGE_SIZE = 6;
export const SITE_URL = site.origin;

export function absoluteUrl(value: string): string {
  return new URL(value, SITE_URL).toString();
}

export function language(value: string = 'en') {
  return value.toLowerCase().split(/[-_]/)[0];
}

export function publicPath(path: string): string {
  const raw = path.startsWith('http') ? new URL(path).pathname : path;
  const decoded = decodeURI(raw).replace(/\/+$/, '');
  return `${(decoded === '/insights' || decoded.startsWith('/insights/')) ? decoded : `/insights${decoded.startsWith('/') ? '' : '/'}${decoded}`}/`;
}

export function originPath(path: string): string | undefined {
  return publicPath(path).replace(/^\/insights\/?/, '').replace(/\/$/, '') || undefined;
}

export function entryPath(entry: Entry): string {
  return publicPath(entry.data.path || `/${language(entry.data.lang) === 'en' ? '' : `${language(entry.data.lang)}/`}${entry.id}/`);
}

export function plainText(html: string): string {
  return load(html, null, false).text().replace(/\s+/g, ' ').trim();
}

export function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function snapshot(file?: string): string | undefined {
  if (!file) return;
  if (!snapshotCache.has(file)) {
    const fullPath = resolve(root, file);
    if (!existsSync(fullPath)) return;
    snapshotCache.set(file, readFileSync(fullPath, 'utf8'));
  }
  return snapshotCache.get(file);
}

export function sourceFor(path: string): ImportedRoute | undefined {
  return catalog.routes.find(route => publicPath(route.path) === publicPath(path));
}

export function entrySource(entry: Entry): ImportedEntry | undefined {
  return [...catalog.posts, ...catalog.pages].find(item => publicPath(item.path) === entryPath(entry));
}

export function sourceSnapshot(entry: Entry): string | undefined {
  return snapshot(entry.data.snapshotFile || entrySource(entry)?.snapshotFile || sourceFor(entryPath(entry))?.snapshotFile);
}

export function entryBody(entry: Entry): string {
  // The glob loader's rendered HTML handles both imported WordPress HTML and
  // ordinary new Markdown. Never serve WordPress runtime scripts from content.
  return cleanFragment(entry.rendered?.html || '');
}

export function cleanFragment(html: string): string {
  const $ = load(html, null, false);
  $('script:not([type="application/ld+json"])').remove();
  $('[onclick], [onload], [onerror]').each((_, node) => {
    $(node).removeAttr('onclick').removeAttr('onload').removeAttr('onerror');
  });
  return localize($.html());
}

export function localize(html: string): string {
  return html
    .replace(/(href=["'])(?:https?:\/\/(?:blog\.)?cinev\.com)?\/insights\/\?(?:p|page_id)=(\d+)(["'])/g, (match, prefix, id, quote) => {
      const entry = [...catalog.posts, ...catalog.pages].find(entry => String(entry.id) === id);
      return entry ? `${prefix}${publicPath(entry.path)}${quote}` : match;
    })
    .replace(/https?:\/\/blog\.cinev\.com(?=\/wp-(?:content|includes)\/)/g, '')
    .replace(/https?:\/\/43\.200\.218\.52(?::80)?(?=\/wp-(?:content|includes)\/)/g, '')
    .replace(/([("'=,\s])\/(wp-(?:content|includes)\/)/g, '$1/insights/$2')
    .replace(/https?:\/\/(?:www\.)?cinev\.com\/insights(?=[/"'#?])/g, '/insights')
    .replace(/\/insights\/ai-anime-series-generator-(ko|ja)\//g, '/insights/$1/ai-anime-series-generator-$1/')
    .replace(/\/insights\/ko\/news-ko\//g, '/insights/ko/news-kr/')
    .replace(/\/insights\/(?:ko|ja)\/author\//g, '/insights/author/')
    .replace(/((?:href|action)=["'])(\/insights\/[^"'?#\s]*)(?=["'?#])/g, (_, prefix, path) =>
      `${prefix}${sourceFor(path) ? publicPath(path) : path}`);
}

function validateContent(entries: Entry[]) {
  const paths = new Map<string, string>();
  const translations = new Map<string, string>();
  const guids = new Set<string>();
  for (const entry of entries) {
    if (entry.data.translationKey) {
      const key = `${entry.data.translationKey}:${entry.data.lang}`;
      if (translations.has(key)) throw new Error(`Duplicate translation language ${key}: ${translations.get(key)} and ${entry.id}`);
      translations.set(key, entry.id);
    }
    if (entry.collection === 'posts' && entry.data.rssGuid) {
      if (guids.has(entry.data.rssGuid)) throw new Error(`Duplicate RSS GUID: ${entry.data.rssGuid}`);
      guids.add(entry.data.rssGuid);
    }
    const raw = entry.data.path;
    if (raw && (!raw.startsWith('/') || /\/\/|[\s?#\\]/.test(raw) || /(?:^|\/)\.{1,2}(?:\/|$)/.test(decodeURIComponent(raw)) || /%2f|%5c/i.test(raw))) {
      throw new Error(`${entry.id}: path must be an absolute local path without query, fragment, or traversal`);
    }
    const path = entryPath(entry);
    const lang = language(entry.data.lang);
    const prefix = lang === 'en' ? '/insights/' : `/insights/${lang}/`;
    if (!path.startsWith(prefix) || (lang === 'en' && /^\/insights\/(?:ko|ja)\//.test(path))) {
      throw new Error(`${entry.id}: path does not match lang ${lang}`);
    }
    if (/^\/insights\/(?:feed(?:\.xml)?|sitemap(?:_index)?\.xml|search-index\.json|llms\.txt|robots\.txt|analytics\.js|legacy-links\.js|site\.(?:js|css)|404(?:\.html)?)(?:\/|$)/.test(path) || /^\/insights\/(?:ko|ja|all)\/feed(?:\.xml)?(?:\/|$)/.test(path) || /^\/insights\/(?:insights|wp-content|wp-includes|images|_astro)(?:\/|$)/.test(path)) {
      throw new Error(`${entry.id}: reserved path ${path}`);
    }
    if (paths.has(path)) throw new Error(`Duplicate content path ${path}: ${paths.get(path)} and ${entry.id}`);
    paths.set(path, entry.id);
    for (const value of entry.data.categories) {
      const term = catalog.categories.find(term => String(term.id) === String(value) || term.slug === value);
      if (!term || language(term.lang || 'en') !== lang) throw new Error(`${entry.id}: unknown category or category language mismatch: ${value}`);
    }
    for (const value of entry.data.tags) {
      const term = catalog.tags.find(term => String(term.id) === String(value) || term.slug === value);
      if (term ? language(term.lang || 'en') !== lang : !/^[\p{L}\p{N}][\p{L}\p{N}_-]*$/u.test(String(value))) {
        throw new Error(`${entry.id}: tag must match the post language or be a new simple slug: ${value}`);
      }
    }
    if (!catalog.authors.some(author => String(author.id) === String(entry.data.author) || author.slug === entry.data.author)) {
      throw new Error(`${entry.id}: unknown author ${entry.data.author}; use an ID or slug from migration/catalog.json`);
    }
  }
}

async function contentEntries(includeDrafts = false) {
  const [posts, pages] = await Promise.all([getCollection('posts'), getCollection('pages')]);
  validateContent([...posts, ...pages]);
  return {
    posts: posts.filter(post => includeDrafts || !post.data.draft).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf()),
    pages: pages.filter(page => includeDrafts || !page.data.draft),
  };
}

export async function publishedEntries() {
  return contentEntries();
}

export function summary(entry: Entry): string {
  return plainText(entry.data.excerpt || entryBody(entry)).slice(0, 190);
}

export function termsFor(entry: Entry, kind: 'categories' | 'tags'): Term[] {
  return entry.data[kind].map(value => catalog[kind].find(term => String(term.id) === String(value) || term.slug === value)
    || { id: value, slug: String(value), name: String(value), path: publicPath(`/${language(entry.data.lang) === 'en' ? '' : `${language(entry.data.lang)}/`}${kind === 'tags' ? 'tag/' : ''}${value}/`), lang: language(entry.data.lang) });
}

function matchesTerm(entry: Entry, term: Term, kind: 'categories' | 'tags' | 'authors') {
  if (kind === 'authors') return String(entry.data.author ?? '') === String(term.id) || entry.data.author === term.slug;
  return entry.data[kind].some(value => String(value) === String(term.id) || value === term.slug);
}

export async function blogRoutes(includeDrafts = import.meta.env.DEV): Promise<Route[]> {
  // Drafts are visible in the local development server only. Production builds,
  // RSS, search, and sitemap always use published content.
  const { posts, pages } = await contentEntries(includeDrafts);
  const routes = new Map<string, Route>();
  const add = (route: Route) => {
    const path = publicPath(route.path);
    const previous = routes.get(path);
    if (previous && (previous.entry || route.entry)) throw new Error(`Content path collides with another page or archive: ${path}`);
    routes.set(path, { ...route, path });
  };
  const addArchive = (path: string, entries: Entry[], lang: string, label?: string, template?: string, noindex = false, redirectTo?: string) => {
    const totalPages = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));
    for (let page = 1; page <= totalPages; page++) {
      const pagePath = page === 1 ? path : `${publicPath(path)}page/${page}/`;
      add({ path: pagePath, kind: 'archive', lang, label, noindex, redirectTo, entries: entries.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), page, totalPages, archivePath: publicPath(path), snapshotFile: sourceFor(pagePath)?.snapshotFile || template });
    }
  };

  const langs = new Set(['en', 'ko', 'ja', ...posts.map(post => language(post.data.lang))]);
  for (const lang of langs) {
    const filtered = posts.filter(post => language(post.data.lang) === lang);
    const prefix = lang === 'en' ? '/insights/' : `/insights/${lang}/`;
    const template = sourceFor(prefix)?.snapshotFile || sourceFor('/insights/')?.snapshotFile;
    addArchive(prefix, filtered, lang, undefined, template);
    addArchive(`${prefix}blog/`, filtered, lang, undefined, sourceFor(`${prefix}blog/`)?.snapshotFile || template);
  }

  const categories = new Map(catalog.categories.map(term => [term.path, term]));
  const tags = new Map(catalog.tags.map(term => [term.path, term]));
  for (const post of posts) {
    for (const term of termsFor(post, 'categories')) categories.set(term.path, term);
    for (const term of termsFor(post, 'tags')) tags.set(term.path, term);
  }
  for (const [kind, terms] of [['categories', [...categories.values()]], ['tags', [...tags.values()]], ['authors', catalog.authors || []]] as const) {
    for (const term of terms) {
      const filtered = posts.filter(post => matchesTerm(post, term, kind));
      const lang = language(term.lang || (publicPath(term.path).startsWith('/insights/ko/') ? 'ko' : publicPath(term.path).startsWith('/insights/ja/') ? 'ja' : 'en'));
      addArchive(term.path, filtered, lang, plainText(term.name), sourceFor(term.path)?.snapshotFile,
        kind === 'tags' ? !site.indexing.tags : kind === 'authors' && !site.indexing.authors,
        kind === 'authors' && !site.indexing.authors ? '/insights/' : undefined);
    }
  }
  // Content pages override archive aliases with the same public URL.
  for (const entry of [...posts, ...pages]) {
    // WordPress stores the configured posts index as a Page record, although
    // its public response is an archive. Keep this archive generated from MD.
    if (entry.collection === 'pages' && load(sourceSnapshot(entry) || '')('body').hasClass('blog')) continue;
    add({ path: entryPath(entry), kind: 'entry', entry, lang: language(entry.data.lang), snapshotFile: entry.data.snapshotFile || entrySource(entry)?.snapshotFile || sourceFor(entryPath(entry))?.snapshotFile });
  }
  const categoryCounts = Object.fromEntries(catalog.categories.map(term => [publicPath(term.path), posts.filter(post => matchesTerm(post, term, 'categories')).length]));
  const publishedWordpressPaths = Object.fromEntries(posts.filter(post => !post.data.draft && post.data.wordpressId !== undefined)
    .map(post => [String(post.data.wordpressId), entryPath(post)]));
  const published = [...posts, ...pages].filter(entry => !entry.data.draft && !entry.data.noindex);
  return [...routes.values()].map(route => {
    let translations: { lang: string; path: string }[] = [];
    const key = route.entry?.data.translationKey;
    if (key && !route.entry?.data.draft && !route.entry?.data.noindex) {
      translations = published.filter(entry => entry.data.translationKey === key)
        .map(entry => ({ lang: language(entry.data.lang), path: entryPath(entry) }));
    } else if (route.kind === 'archive' && !route.noindex) {
      const term = catalog.categories.find(term => publicPath(term.path) === route.archivePath);
      const group = term && importedTranslations.terms.find(group => Object.values(group).includes(Number(term.id)));
      if (group) translations = Object.entries(group).flatMap(([lang, id]) => {
        const translated = catalog.categories.find(term => term.id === id);
        const path = translated && publicPath(translated.path) + ((route.page || 1) > 1 ? `page/${route.page}/` : '');
        return path && routes.has(path) ? [{ lang, path }] : [];
      });
    }
    return { ...route, categoryCounts, publishedWordpressPaths, translations: translations.length > 1 ? translations : [] };
  });
}

export function readingMinutes(entry: Entry): number {
  return entry.data.readingMinutes || Math.max(1, Math.ceil(plainText(entryBody(entry)).split(/\s+/).length / 200));
}

function dateLabel(entry: Entry): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(entry.data.date);
}

function cardExcerpt(entry: Entry, archivePath: string): string {
  const original = entrySource(entry);
  // Astra's displayed excerpts differ from the REST excerpts. Preserve those
  // exact card texts until the author edits this Markdown entry's excerpt.
  if (original?.displayExcerpt !== undefined && plainText(entry.data.excerpt) === plainText(original.excerpt || '')) return original.displayExcerpts?.[publicPath(archivePath)] ?? original.displayExcerpt;
  return plainText(entry.data.excerpt || entryBody(entry).slice(0, 1200)).slice(0, 190);
}

function cardHtml(entry: Entry, archivePath: string): string {
  const source = sourceSnapshot(entry);
  const $post = source ? load(source) : undefined;
  const originalImage = $post?.('.ast-single-post-featured-section img').first();
  const image = entry.data.image || originalImage?.attr('src');
  const imageMarkup = image ? `<div class="ast-blog-featured-section post-thumb ast-blog-single-element"><div class="post-thumb-img-content post-thumb"><a href="${escapeHtml(entryPath(entry))}" aria-label="Read: ${escapeHtml(entry.data.title)}"><img src="${escapeHtml(image)}" alt="${escapeHtml(entry.data.imageAlt || originalImage?.attr('alt'))}" loading="lazy" decoding="async"${originalImage?.attr('width') ? ` width="${escapeHtml(originalImage.attr('width'))}"` : ''}${originalImage?.attr('height') ? ` height="${escapeHtml(originalImage.attr('height'))}"` : ''}></a></div></div>` : '';
  const categories = termsFor(entry, 'categories');
  const categoryMarkup = categories.map(term => `<a href="${escapeHtml(publicPath(term.path))}" rel="category tag">${escapeHtml(plainText(term.name))}</a>`).join(', ');
  return `<article class="post type-post status-publish format-standard ${image ? 'has-post-thumbnail' : ''} hentry ast-grid-common-col ast-full-width ast-article-post ast-width-md-4 ast-archive-post ast-separate-posts" id="post-${escapeHtml(entry.data.wordpressId || entry.id)}" itemtype="https://schema.org/CreativeWork" itemscope>
    <div class="ast-post-format- blog-layout-4 ast-article-inner ast-no-date-box"><div class="post-content ast-grid-common-col">
      ${imageMarkup}<span class="ast-blog-single-element ast-taxonomy-container cat-links default">${categoryMarkup}</span>
      ${entry.data.draft ? '<span class="cinev-draft-label">Draft · 초안</span>' : ''}<h2 class="entry-title ast-blog-single-element" itemprop="headline"><a href="${escapeHtml(entryPath(entry))}" rel="bookmark">${escapeHtml(entry.data.title)}</a></h2>
      <div class="ast-excerpt-container ast-blog-single-element"><p>${escapeHtml(cardExcerpt(entry, archivePath))}</p></div>
      <header class="entry-header ast-blog-single-element ast-blog-meta-container"><div class="entry-meta"><span class="ast-reading-time">${readingMinutes(entry)} ${readingMinutes(entry) === 1 ? 'minute' : 'minutes'} of reading</span> • <span class="posted-on"><span class="published" itemprop="datePublished"> ${dateLabel(entry)} </span></span></div></header>
      <div class="entry-content clear" itemprop="text"></div>
    </div></div>
  </article>`;
}

function paginationHtml(route: Route) {
  if (!route.totalPages || route.totalPages <= 1) return '';
  const page = route.page || 1;
  const path = (number: number) => number === 1 ? route.archivePath! : `${route.archivePath}page/${number}/`;
  const numbers = Array.from({ length: route.totalPages }, (_, index) => index + 1).map(number => number === page
    ? `<span aria-current="page" class="page-numbers current">${number}</span>`
    : `<a class="page-numbers" href="${escapeHtml(path(number))}">${number}</a>`).join('\n');
  const prev = page > 1 ? `<a class="prev page-numbers" href="${escapeHtml(path(page - 1))}">← Previous</a>` : '';
  const next = page < route.totalPages ? `<a class="next page-numbers" href="${escapeHtml(path(page + 1))}">Next <span class="ast-right-arrow" aria-hidden="true">→</span></a>` : '';
  return `<div class="ast-pagination cinev-pagination"><nav class="navigation pagination" aria-label="Post pagination"><div class="nav-links">${prev}${numbers}${next}</div></nav></div>`;
}

function cleanup($: CheerioAPI) {
  $('script, link[rel="pingback"], link[rel="EditURI"], link[rel="https://api.w.org/"], link[type="application/json"], link[rel="shortlink"], meta[name="generator"], meta[name="google-site-verification"], link[rel="dns-prefetch"]').remove();
  $('#comments, #respond').remove();
  $('[onclick], [onload], [onerror]').each((_, element) => { $(element).removeAttr('onclick').removeAttr('onload').removeAttr('onerror'); });
  $('.ast-fade-up, [data-aos]').removeClass('ast-fade-up').removeAttr('data-aos');
  $('body').addClass('cinev-static-blog');
  // Astra generates a hidden duplicate sticky header. CSS makes the original
  // header sticky instead, preserving a single accessible navigation tree.
  $('#astra-fixed-header, #ast-fixed-header').remove();
  $('a[href]').each((_, element) => {
    const link = $(element), href = link.attr('href') || '';
    if (/\/wp-(?:admin|login|json)|admin-ajax\.php/.test(href)) link.remove();
  });
}

function markdownArticle(entry: Entry, token: string) {
  const categories = termsFor(entry, 'categories');
  const firstCategory = categories[0];
  const lang = language(entry.data.lang);
  const home = lang === 'en' ? '/insights/' : `/insights/${lang}/`;
  const author = catalog.authors.find(item => String(item.id) === String(entry.data.author) || item.slug === entry.data.author)!;
  const url = `${SITE_URL}${entryPath(entry)}`;
  const share = `<div class="ast-post-social-sharing cinev-post-share"><span>Share</span><a href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}" rel="noopener noreferrer" target="_blank">Facebook</a><a href="https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&amp;text=${encodeURIComponent(entry.data.title)}" rel="noopener noreferrer" target="_blank">X</a><a href="https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}" rel="noopener noreferrer" target="_blank">LinkedIn</a></div>`;
  return `<article class="post type-post ast-article-single cinev-native-post">
    ${entry.data.draft ? '<aside class="cinev-draft-banner">Draft · 초안 미리보기 — 배포 빌드에는 포함되지 않습니다.</aside>' : ''}
    <nav class="cinev-post-breadcrumb" aria-label="Breadcrumb"><a href="${home}">Blog</a>${firstCategory ? ` / <a href="${escapeHtml(publicPath(firstCategory.path))}">${escapeHtml(plainText(firstCategory.name))}</a>` : ''} / <span class="breadcrumb_last">${escapeHtml(entry.data.title)}</span></nav>
    <header class="entry-header"><span class="cat-links">${categories.map(term => `<a href="${escapeHtml(publicPath(term.path))}">${escapeHtml(plainText(term.name))}</a>`).join(', ')}</span><h1 class="entry-title">${escapeHtml(entry.data.title)}</h1>
      <div class="entry-meta"><a rel="author" href="${escapeHtml(publicPath(author.path))}"><span class="author-name">${escapeHtml(author.name)}</span></a> · <time class="published" datetime="${entry.data.date.toISOString()}">${dateLabel(entry)}</time> · <span class="ast-reading-time">${readingMinutes(entry)} minutes</span></div>
    </header>
    <div class="entry-content">${token}</div>${share}
  </article>`;
}

// Reconcile only Astra-generated recommendations. Authored body links remain
// unchanged and are checked by the build verifier if their target disappears.
function refreshLegacyRecommendations($: CheerioAPI, publishedPaths: Record<string, string>) {
  const originalPosts = new Map(catalog.posts.map(post => [publicPath(post.path), String(post.id)]));
  const originalIds = new Set(catalog.posts.map(post => String(post.id)));
  const linkedPostId = (href: string) => {
    try {
      const url = new URL(href, SITE_URL);
      if (![new URL(SITE_URL).hostname, 'blog.cinev.com', '43.200.218.52'].includes(url.hostname)) return;
      const id = url.searchParams.get('p');
      return id && originalIds.has(id) ? id : originalPosts.get(publicPath(url.pathname));
    } catch { return; }
  };
  $('.ast-single-related-posts-container .ast-related-post').each((_, element) => {
    const card = $(element);
    const id = card.attr('class')?.match(/(?:^|\s)post-(\d+)(?:\s|$)/)?.[1]
      || linkedPostId(card.find('.ast-related-post-title a[href]').first().attr('href') || '');
    if (!id) return;
    const path = publishedPaths[id];
    if (!path) { card.remove(); return; }
    card.find('a[href]').each((_, anchor) => {
      const link = $(anchor);
      if (linkedPostId(link.attr('href') || '') === id) link.attr('href', path);
    });
  });
  $('.post-navigation .nav-previous, .post-navigation .nav-next').each((_, element) => {
    const item = $(element);
    item.find('a[href]').each((_, anchor) => {
      const link = $(anchor), id = linkedPostId(link.attr('href') || '');
      if (!id) return;
      const path = publishedPaths[id];
      if (path) link.attr('href', path);
      else item.remove();
    });
  });
  $('.ast-single-related-posts-container').each((_, element) => {
    if (!$(element).find('.ast-related-post').length) $(element).remove();
  });
  $('.post-navigation').each((_, element) => {
    if (!$(element).find('a[href]').length) $(element).remove();
  });
}

export function renderTemplate(route: Route) {
  if (route.redirectTo) {
    const destination = escapeHtml(route.redirectTo);
    return { head: `<title>CineV Blog</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="${SITE_URL}${destination}"><meta http-equiv="refresh" content="0; url=${destination}">`,
      before: `<main><p><a href="${destination}">Continue to CineV Blog</a></p></main>`, after: '', contentHtml: '', bodyClass: '', lang: route.lang };
  }
  const native = !!route.entry && !sourceSnapshot(route.entry);
  let template = snapshot(route.snapshotFile);
  if (native) template = snapshot(sourceFor(route.lang === 'en' ? '/insights/' : `/insights/${route.lang}/`)?.snapshotFile);
  template ||= snapshot(sourceFor('/insights/')?.snapshotFile || catalog.routes.find(item => /(?:home|archive|index|blog)/.test(item.kind))?.snapshotFile);
  if (!template) throw new Error(`No preserved template available for ${route.path}`);
  const $ = load(template);
  cleanup($);
  $('.uagb-tax-link-wrap').each((_, element) => {
    const wrap = $(element), link = wrap.find('a.uagb-tax-link').first();
    const href = link.attr('href');
    if (!href) return;
    const count = route.categoryCounts?.[publicPath(href)];
    if (count !== undefined) wrap.html(`${$.html(link)}  (${count}) `);
  });
  const slotToken = 'CINEV_ASTRO_CONTENT_SLOT_8FB203D';
  let contentHtml = '';
  let title = $('title').text();
  let description = $('meta[name="description"]').attr('content') || '';

  if (route.entry) {
    const entry = route.entry;
    if (native) {
      $('#main').html(markdownArticle(entry, slotToken));
      $('#secondary, #primary > .ast-pagination, #primary > .ast-ajax-pagination-wrapper').remove();
      $('body').removeClass('blog archive ast-blog-grid-3 ast-blog-layout-4 ast-blog-pagination-type-infinite ast-right-sidebar').addClass('single single-post ast-no-sidebar cinev-markdown-post');

    }
    const article = $('#main > article, #primary article').first();
    if (!article.length) throw new Error(`No entry article found in template for ${route.path}`);
    article.find('.entry-content').first().html(slotToken);
    article.find('.entry-title').first().text(entry.data.title);
    article.find('.breadcrumb_last').text(entry.data.title);
    article.find('.published').text(dateLabel(entry));
    const author = (catalog.authors || []).find(item => String(item.id) === String(entry.data.author) || item.slug === entry.data.author);
    const authorName = author?.name || (typeof entry.data.author === 'string' ? entry.data.author : 'CineV');
    article.find('.author-name').text(authorName);
    article.find('a[rel="author"]').attr('title', `View all posts by ${authorName}`).attr('href', publicPath(author?.path || '/author/user/'));
    article.find('.ast-reading-time').text(`${readingMinutes(entry)} ${readingMinutes(entry) === 1 ? 'minute' : 'minutes'} of reading`);
    article.find('.cat-links').html(termsFor(entry, 'categories').map(term => `<a href="${escapeHtml(publicPath(term.path))}" rel="category tag">${escapeHtml(plainText(term.name))}</a>`).join(', '));
    const image = entry.data.image;
    if (image) {
      $('.ast-single-post-featured-section img').first().attr('src', image).removeAttr('srcset').attr('alt', entry.data.imageAlt);
    }
    article.find('.ast-post-social-sharing a[href]').each((_, element) => {
      const link = $(element);
      try {
        const url = new URL(link.attr('href') || '');
        for (const key of ['u', 'url']) if (url.searchParams.has(key)) url.searchParams.set(key, `${SITE_URL}${route.path}`);
        for (const key of ['text', 'title', 'description']) if (url.searchParams.has(key)) url.searchParams.set(key, entry.data.title);
        if (url.searchParams.has('media')) {
          const media = image || (sourceSnapshot(entry) ? url.searchParams.get('media') : undefined);
          if (media) url.searchParams.set('media', absoluteUrl(localize(media)));
          else url.searchParams.delete('media');
        }
        link.attr('href', url.toString());
      } catch { /* Non-URL controls are handled by native site.js. */ }
    });
    if (!sourceSnapshot(entry)) {
      $('body').addClass('cinev-markdown-post');
      $('body').attr('class', ($('body').attr('class') || '').split(/\s+/).filter(name => !/^postid-\d+$/.test(name)).join(' '));
      article.attr('id', `post-${entry.id}`);
      article.attr('class', (article.attr('class') || '').split(/\s+/).filter(name => !/^(?:post-\d+|category-|tag-)/.test(name) && name !== 'has-post-thumbnail').join(' '));
      article.addClass(`post-${entry.id}`);
      for (const term of termsFor(entry, 'categories')) article.addClass(`category-${term.slug}`);
      if (image) article.addClass('has-post-thumbnail');
      $('.ast-single-post-featured-section').remove();
      if (image) article.find('.entry-header').first().after(`<img class="cinev-markdown-cover" src="${escapeHtml(image)}" alt="${escapeHtml(entry.data.imageAlt)}">`);
      $('.post-navigation, .ast-single-related-posts-container').remove();
    }
    if (route.publishedWordpressPaths) refreshLegacyRecommendations($, route.publishedWordpressPaths);
    contentHtml = entryBody(entry);
  } else {
    const row = $('#main .ast-row').first();
    const cards = (route.entries || []).map(entry => cardHtml(entry, route.path)).join('\n');
    if (row.length) row.html(cards);
    else $('#main').html(`<div class="ast-row">${cards}</div>`);
    let infinite = $('#primary > .ast-ajax-pagination-wrapper').first();
    infinite.remove();
    $('#primary > .ast-pagination').remove();
    $('#primary').append(paginationHtml(route));
    if (route.page && route.totalPages && route.page < route.totalPages) {
      if (!infinite.length) infinite = $('<div class="ast-ajax-pagination-wrapper"><nav class="ast-pagination-infinite"><div class="ast-loader"><div class="ast-loader-1"></div><div class="ast-loader-2"></div><div class="ast-loader-3"></div></div></nav></div>');
      infinite.find('.ast-pagination-infinite').attr('data-page', String(route.page + 1)).attr('data-total', String(route.totalPages)).attr('data-next', `${route.archivePath}page/${route.page + 1}/`);
      $('body').addClass('ast-blog-pagination-type-infinite');
      $('#primary').append(infinite);
    }
    if (route.label) {
      title = `${route.label}${route.page && route.page > 1 ? ` - Page ${route.page}` : ''} : CineV`;
      description = sourceFor(route.path) ? description : `${route.label} · ${site.description}`;
      const archiveHeading = $('.ast-archive-title').first();
      if (archiveHeading.length) archiveHeading.text(route.label);
      else $('#main').prepend(`<header class="ast-archive-description"><h1 class="page-title ast-archive-title">${escapeHtml(route.label)}</h1></header>`);
    }
    if (!route.label && route.page && route.page > 1) title = `${site.blogName} - Page ${route.page} : ${site.name}`;
    if (!route.entries?.length) $('#main .ast-row').html('<p class="cinev-empty-archive">No posts yet.</p>');
  }

  if (route.translations?.length) {
    const names: Record<string, string> = { en: 'English', ko: '한국어', ja: '日本語' };
    const links = route.translations.map(item => item.lang === route.lang
      ? `<span lang="${item.lang}" aria-current="page">${names[item.lang]}</span>`
      : `<a lang="${item.lang}" hreflang="${item.lang}" href="${escapeHtml(item.path)}">${names[item.lang]}</a>`).join(' <span aria-hidden="true">/</span> ');
    const nav = `<nav class="cinev-translations" aria-label="${route.lang === 'ko' ? '다른 언어' : route.lang === 'ja' ? '他の言語' : 'Other languages'}">${links}</nav>`;
    if (route.entry) $('#main > article, #primary article').first().prepend(nav);
    else $('#main').prepend(nav);
  }
  $('html').attr('lang', route.lang);
  $('title, link[rel="canonical"], link[rel="next"], link[rel="prev"], link[hreflang], meta[name="description"], meta[name="robots"], meta[name="author"], meta[property^="og:"], meta[property^="article:"], meta[name^="twitter:"]').remove();
  $('a[href*="/author/"]').each((_, element) => {
    if (!site.indexing.authors) $(element).replaceWith($('<span>').addClass('author-name').html($(element).html() || ''));
  });
  $('link[type="application/rss+xml"]').remove();
  $('head').append(`<link rel="alternate" type="application/rss+xml" title="CineV ${route.lang}" href="/insights/${route.lang === 'en' ? '' : route.lang + '/'}feed.xml">`);
  $('head').append('<link rel="stylesheet" href="/insights/site.css">');
  $('body').append('<script src="/insights/site.js" defer></script>');
  const $head = load(localize($('head').html() || ''), null, false);
  const author = route.entry ? catalog.authors.find(author => String(author.id) === String(route.entry!.data.author) || author.slug === route.entry!.data.author) : undefined;
  const category = route.entry ? termsFor(route.entry, 'categories')[0] : undefined;
  $head.root().append('<script src="/insights/legacy-links.js" defer></script>');
  $head.root().append(seoHead(route, { title, description }, author, category));
  if (route.kind === 'archive' && route.page && route.totalPages && route.page < route.totalPages) $head.root().append(`<link rel="next" href="${SITE_URL}${route.archivePath}page/${route.page + 1}/">`);
  const body = localize($('body').html() || '');
  const [before, after = ''] = body.split(slotToken);
  return { head: $head.html(), before, after, contentHtml, bodyClass: $('body').attr('class') || '', lang: route.lang };
}
