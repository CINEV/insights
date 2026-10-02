import type { APIRoute } from 'astro';
import { inSitemap } from '../lib/seo';
import { blogRoutes, escapeHtml, SITE_URL } from '../lib/blog';

export const GET: APIRoute = async () => {
  const routes = await blogRoutes(false);
  const urls = routes.filter(inSitemap).map(route => `<url><loc>${escapeHtml(`${SITE_URL}${route.path}`)}</loc>${route.entry ? `<lastmod>${(route.entry.data.modified || route.entry.data.date).toISOString()}</lastmod>` : ''}</url>`).join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
