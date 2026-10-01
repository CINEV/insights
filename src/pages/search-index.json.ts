import type { APIRoute } from 'astro';
import { publishedEntries, entryBody, entryPath, plainText } from '../lib/blog';

export const GET: APIRoute = async () => {
  const { posts, pages } = await publishedEntries();
  return new Response(JSON.stringify([...posts, ...pages].map(entry => ({
    title: entry.data.title,
    path: entryPath(entry),
    lang: entry.data.lang,
    excerpt: plainText(entry.data.excerpt),
    text: plainText(entryBody(entry)),
  }))), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
