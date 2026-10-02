import type { APIRoute, GetStaticPaths } from 'astro';
import { rssFeed, type FeedLanguage } from '../../lib/feed';

export const getStaticPaths: GetStaticPaths = () => ['ko', 'ja', 'all'].map(lang => ({ params: { lang } }));
export const GET: APIRoute = async ({ params }) => new Response(await rssFeed(params.lang as FeedLanguage), {
  headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
});
