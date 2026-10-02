import { load } from 'cheerio';
import site from '../config/site.json';
import type { Route, Term } from './blog';

const home = `${site.origin}${site.base}/`;
const text = (value: string) => load(value, null, false).text().replace(/\s+/g, ' ').trim();
const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

export function canonicalPath(route: Route): string {
  return route.redirectTo || route.path.replace(/\/blog\/$/, '/').replace(/\/blog\/page\/(\d+)\/$/, '/page/$1/');
}

export function isIndexable(route: Route): boolean {
  return !route.noindex && !route.redirectTo && !route.entry?.data.draft && !route.entry?.data.noindex;
}

export function inSitemap(route: Route): boolean {
  return isIndexable(route) && canonicalPath(route) === route.path;
}

// WordPress-origin uploads are now served from the same public blog prefix.
export function imageUrl(value: string): string {
  const url = new URL(value, site.origin);
  if ([new URL(site.origin).hostname, 'blog.cinev.com', '43.200.218.52'].includes(url.hostname)) {
    if (/^\/wp-(content|includes)\//.test(url.pathname)) url.pathname = site.base + url.pathname;
    url.protocol = 'https:';
    url.host = new URL(site.origin).host;
  }
  return url.toString();
}

export function seoHead(route: Route, fallback: { title: string; description: string }, author?: Term, category?: Term): string {
  const entry = route.entry;
  const canonical = site.origin + canonicalPath(route);
  const title = entry ? entry.data.seoTitle || `${entry.data.title} : ${site.name}` : fallback.title || site.blogName;
  const description = entry
    ? entry.data.description || text(entry.data.excerpt || entry.rendered?.html || '').slice(0, 160)
    : fallback.description || site.description;
  const image = imageUrl(entry?.data.socialImage || entry?.data.image || site.defaultImage);
  const imageAlt = entry?.data.imageAlt || entry?.data.title || site.blogName;
  const locale = route.lang === 'ko' ? 'ko_KR' : route.lang === 'ja' ? 'ja_JP' : 'en_US';
  const robots = entry?.data.draft ? 'noindex, nofollow' : `${isIndexable(route) ? 'index' : 'noindex'}, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`;
  const meta = (key: string, value: string, property = false) => `<meta ${property ? 'property' : 'name'}="${key}" content="${escape(value)}">`;
  const head = [
    `<title>${escape(title)}</title>`, `<link rel="canonical" href="${escape(canonical)}">`,
    meta('description', description), meta('robots', robots),
    meta('og:type', entry?.collection === 'posts' ? 'article' : 'website', true),
    meta('og:site_name', site.name, true), meta('og:locale', locale, true),
    meta('og:url', canonical, true), meta('og:title', title, true), meta('og:description', description, true),
    meta('og:image', image, true), meta('og:image:alt', imageAlt, true),
    meta('twitter:card', 'summary_large_image'), meta('twitter:site', site.twitter),
    meta('twitter:title', title), meta('twitter:description', description),
    meta('twitter:image', image), meta('twitter:image:alt', imageAlt),
    ...(route.translations || []).map(item => `<link rel="alternate" hreflang="${escape(item.lang)}" href="${escape(site.origin + item.path)}">`),
    ...site.googleVerification.map(token => meta('google-site-verification', token)),
  ];
  const ref = (id: string) => ({ '@id': id });
  const organizationId = home + '#organization';
  const websiteId = home + '#website';
  const imageId = canonical + '#primaryimage';
  const breadcrumbId = canonical + '#breadcrumb';
  const languageHome = home + (route.lang === 'en' ? '' : route.lang + '/');
  const crumbs = [{ '@type': 'ListItem', position: 1, name: site.blogName, item: languageHome }];
  if (category) crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: text(category.name), item: site.origin + category.path });
  if (canonical !== languageHome) crumbs.push({ '@type': 'ListItem', position: crumbs.length + 1, name: entry?.data.title || title, item: canonical });
  const graph: Record<string, unknown>[] = [
    { '@type': 'Organization', '@id': organizationId, name: site.organization.name, alternateName: site.organization.alternateName, url: home,
      logo: { '@type': 'ImageObject', '@id': home + '#logo', url: imageUrl(site.organization.logo), width: 510, height: 100 }, sameAs: site.organization.sameAs },
    { '@type': 'WebSite', '@id': websiteId, url: home, name: site.blogName, description: site.description, publisher: ref(organizationId), inLanguage: ['en', 'ko', 'ja'] },
    { '@type': 'ImageObject', '@id': imageId, url: image, contentUrl: image, caption: imageAlt },
    { '@type': 'BreadcrumbList', '@id': breadcrumbId, itemListElement: crumbs },
    { '@type': entry?.data.pageType || 'CollectionPage', '@id': canonical, url: canonical, name: title, description,
      isPartOf: ref(websiteId), primaryImageOfPage: ref(imageId), breadcrumb: ref(breadcrumbId), inLanguage: route.lang,
      ...(entry ? { datePublished: entry.data.date.toISOString(), dateModified: (entry.data.modified || entry.data.date).toISOString() } : {}) },
  ];
  if (entry) {
    const published = entry.data.date.toISOString();
    const modified = (entry.data.modified || entry.data.date).toISOString();
    if (entry.collection === 'posts') {
      head.push(meta('article:published_time', published, true), meta('article:modified_time', modified, true), meta('author', author?.name || site.name));
      const authorId = home + '#/schema/author/' + encodeURIComponent(author?.slug || 'cinev');
      graph.push({ '@type': author?.slug === 'user' ? 'Organization' : 'Person', '@id': authorId, name: author?.name || site.name,
        ...(author?.slug === 'user' ? { url: site.origin } : {}) });
      graph.push({ '@type': 'BlogPosting', '@id': canonical + '#article', headline: entry.data.title, description, url: canonical,
        mainEntityOfPage: ref(canonical), isPartOf: ref(canonical), image: ref(imageId), author: ref(authorId), publisher: ref(organizationId),
        datePublished: published, dateModified: modified, inLanguage: route.lang,
        ...(category ? { articleSection: text(category.name) } : {}) });
    }
  }
  head.push(`<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c')}</script>`);
  // Preview hosts never load Google. Only published pages on the canonical origin do.
  if (!entry?.data.draft) head.push(`<script src="${site.base}/analytics.js" data-origin="${escape(site.origin)}" data-tag="${escape(site.analytics.googleTagId)}" defer></script>`);
  return head.join('\n');
}
