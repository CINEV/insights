import type { APIRoute } from 'astro';
import site from '../config/site.json';

// Crawlers use the host-root robots.txt, maintained by the main site.
// This nested file documents the blog sitemap; it must not block the host.
export const GET: APIRoute = () => new Response(`User-agent: *\nAllow: /\n\nSitemap: ${site.origin}${site.base}/sitemap_index.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
