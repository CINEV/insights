import type { APIRoute } from 'astro';
import { blogRoutes } from '../lib/blog';
import { inSitemap } from '../lib/seo';
import site from '../config/site.json';

export const GET: APIRoute = async () => {
  const entries = (await blogRoutes(false)).filter(route => route.entry && inSitemap(route));
  const lines = [`# ${site.blogName}`, '', `> ${site.description}`, ''];
  for (const lang of ['en', 'ko', 'ja']) {
    lines.push(`## ${lang}`, '');
    for (const route of entries.filter(route => route.lang === lang)) {
      const title = route.entry!.data.title.replace(/[\[\]\\\r\n]/g, ' ');
      lines.push(`- [${title}](${site.origin}${encodeURI(route.path)}): ${lang}`);
    }
    lines.push('');
  }
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
