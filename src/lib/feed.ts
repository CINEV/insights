import { publishedEntries, entryBody, entryPath, escapeHtml, SITE_URL, summary } from './blog';

export async function rssFeed() {
  const { posts } = await publishedEntries();
  const items = posts.map(post => `<item><title>${escapeHtml(post.data.title)}</title><link>${SITE_URL}${entryPath(post)}</link><guid isPermaLink="true">${SITE_URL}${entryPath(post)}</guid><pubDate>${post.data.date.toUTCString()}</pubDate><description>${escapeHtml(summary(post))}</description><content:encoded><![CDATA[${entryBody(post).replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded></item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>CineV Blog</title><link>${SITE_URL}/insights/</link><description>Tips &amp; Guides for AI Animation</description><atom:link href="${SITE_URL}/insights/feed.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
