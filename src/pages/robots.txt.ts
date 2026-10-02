import type { APIRoute } from 'astro';
import site from '../config/site.json';

// Block crawling of the duplicate Pages origin. The canonical host's root
// robots.txt is owned by the main frontend and permits /insights/.
export const GET: APIRoute = () => new Response(`User-agent: *\nDisallow: /\n\nSitemap: ${site.origin}${site.base}/sitemap_index.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
