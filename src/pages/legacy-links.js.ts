import type { APIRoute } from 'astro';
import { entryPath, publishedEntries } from '../lib/blog';

// WordPress IDs only belong to imported content. Native Markdown posts need no
// ID or frontend redirect change, and unpublished content never enters this map.
export const GET: APIRoute = async () => {
  const { posts, pages } = await publishedEntries();
  const links: Record<string, Record<string, string>> = { p: {}, page_id: {} };
  for (const entry of [...posts, ...pages]) {
    const id = entry.data.legacyId;
    if (id === undefined) continue;
    if (!Number.isSafeInteger(id) || id <= 0 || links.p[id]) {
      throw new Error(`${entry.id}: WordPress ID must be a unique positive integer`);
    }
    links.p[id] = entryPath(entry);
    if (entry.collection === 'pages') links.page_id[id] = entryPath(entry);
  }
  const script = `(() => {
  const links = ${JSON.stringify(links).replace(/</g, '\\u003c')};
  const current = new URL(location.href);
  const key = current.searchParams.has('p') ? 'p' : 'page_id';
  const id = current.searchParams.get(key);
  if (!id || !/^[1-9]\\d*$/.test(id) || !Object.hasOwn(links[key], id)) return;
  const target = new URL(links[key][id], current.origin);
  const legacyHome = /^(?:\\/insights)?(?:\\/(?:ko|ja))?(?:\\/index\\.php)?$/.test(current.pathname.replace(/\\/+$/, ''));
  if (!legacyHome && current.pathname !== target.pathname) return;
  current.searchParams.delete('p');
  current.searchParams.delete('page_id');
  target.search = current.search;
  target.hash = current.hash;
  if (location.pathname === target.pathname) history.replaceState(history.state, '', target.href);
  else location.replace(target.href);
})();\n`;
  return new Response(script, { headers: { 'Content-Type': 'text/javascript; charset=utf-8' } });
};
