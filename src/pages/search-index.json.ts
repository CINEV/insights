import type { APIRoute } from 'astro';
import { publishedEntries, entryBody, entryPath, plainText, summary } from '../lib/blog';

export const GET: APIRoute = async () => {
  const { posts, pages } = await publishedEntries();
  return new Response(JSON.stringify([...posts, ...pages].map(entry => ({
    title: entry.data.title,
    collection: entry.collection,
    path: entryPath(entry),
    lang: entry.data.lang,
    excerpt: summary(entry),
    text: plainText(entryBody(entry)),
  }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
