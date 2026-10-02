import { load } from 'cheerio';
import site from '../config/site.json';
import { publishedEntries, entryBody, entryPath, escapeHtml, SITE_URL, summary, catalog, termsFor, language, type Entry } from './blog';

export type FeedLanguage = 'en' | 'ko' | 'ja' | 'all';

function absoluteSrcset(value: string, absolute: (value: string) => string): string {
  const candidates: string[] = [];
  let position = 0;
  while (position < value.length) {
    while (/[\s,]/.test(value[position] || '') && position < value.length) position++;
    const start = position;
    while (position < value.length && !/\s/.test(value[position])) position++;
    let url = value.slice(start, position);
    if (!url) break;
    let descriptor = '';
    if (url.endsWith(',')) url = url.replace(/,+$/, '');
    else {
      const descriptorStart = position;
      while (position < value.length && value[position] !== ',') position++;
      descriptor = value.slice(descriptorStart, position).trim();
    }
    candidates.push(absolute(url) + (descriptor ? ` ${descriptor}` : ''));
  }
  return candidates.join(', ');
}

function absoluteBody(post: Entry): string {
  const canonical = SITE_URL + entryPath(post);
  const $ = load(entryBody(post), null, false);
  // Structured data is useful on the article page, but has no purpose in RSS.
  $('script').remove();
  const absolute = (value: string) => {
    if (!value || /^(?:data|mailto|tel):/i.test(value)) return value;
    return new URL(value, canonical).toString();
  };
  $('[src], [href], [poster], [cite], [data-src]').each((_, element) => {
    const node = $(element);
    for (const name of ['src', 'href', 'poster', 'cite', 'data-src']) {
      const value = node.attr(name);
      if (value !== undefined) node.attr(name, absolute(value));
    }
  });
  $('[srcset], [data-srcset]').each((_, element) => {
    const node = $(element);
    for (const name of ['srcset', 'data-srcset']) {
      const value = node.attr(name);
      if (!value) continue;
      node.attr(name, absoluteSrcset(value, absolute));
    }
  });
  return $.html();
}

export async function rssFeed(lang: FeedLanguage = 'en') {
  const { posts: published } = await publishedEntries();
  const posts = published.filter(post => lang === 'all' || language(post.data.lang) === lang);
  const prefix = `${site.base}/${lang === 'en' ? '' : `${lang}/`}`;
  const feedUrl = `${SITE_URL}${prefix}feed.xml`;
  const channelUrl = `${SITE_URL}${lang === 'all' ? `${site.base}/` : prefix}`;
  const seen = new Set<string>();
  const items = posts.map(post => {
    const canonical = SITE_URL + entryPath(post);
    // Imported WordPress GUIDs are identifiers, including their old hostname.
    // Do not rewrite them when changing permalinks or hosting providers.
    const guid = post.data.rssGuid || canonical;
    if (seen.has(guid)) throw new Error(`Duplicate RSS GUID: ${guid}`);
    seen.add(guid);
    const author = catalog.authors.find(author => String(author.id) === String(post.data.author) || author.slug === post.data.author);
    const categories = [...termsFor(post, 'categories'), ...termsFor(post, 'tags')]
      .map(term => `<category>${escapeHtml(load(term.name, null, false).text())}</category>`).join('');
    const body = absoluteBody(post).replace(/]]>/g, ']]]]><![CDATA[>');
    const media = post.data.rssEnclosure;
    const enclosure = media ? `<enclosure url="${escapeHtml(new URL(media.url, SITE_URL).toString())}" length="${media.length}" type="${escapeHtml(media.type)}"/>` : '';
    return `<item><title>${escapeHtml(post.data.title)}</title><link>${escapeHtml(canonical)}</link><guid isPermaLink="${post.data.rssGuid ? 'false' : 'true'}">${escapeHtml(guid)}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><dc:creator>${escapeHtml(author?.name || site.name)}</dc:creator>${categories}${enclosure}<description>${escapeHtml(summary(post))}</description><content:encoded><![CDATA[${body}]]></content:encoded></item>`;
  }).join('\n');
  const modified = posts.reduce((latest, post) => Math.max(latest, (post.data.modified || post.data.date).valueOf()), 0);
  const locale = { en: 'en-US', ko: 'ko-KR', ja: 'ja-JP', all: '' }[lang];
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${escapeHtml(site.blogName)}${lang === 'all' ? ' — All languages' : ''}</title><link>${channelUrl}</link><description>${escapeHtml(site.description)}</description>${locale ? `<language>${locale}</language>` : ''}${modified ? `<lastBuildDate>${new Date(modified).toUTCString()}</lastBuildDate>` : ''}<atom:link href="${feedUrl}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
