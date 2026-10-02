import { readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';

const requireAstro = createRequire(import.meta.resolve('astro/package.json'));
const { slug } = await import(pathToFileURL(requireAstro.resolve('github-slugger')).href);

// Read the authored YAML independently of generated search/SEO output. Use the
// same installed Markdown parser so folded/quoted YAML remains valid here.
export function contentMetadata(root = process.cwd()) {
  const entries = [];
  for (const collection of ['posts', 'pages']) {
    const directory = resolve(root, 'content', collection);
    for (const file of readdirSync(directory, { recursive: true }).filter(file => file.endsWith('.md'))) {
      const { frontmatter } = parseFrontmatter(readFileSync(join(directory, file), 'utf8'));
      const lang = frontmatter.lang || 'en';
      const id = frontmatter.slug ? String(frontmatter.slug) : file.replace(/\\/g, '/').replace(/\.md$/, '').split('/').map(segment => slug(segment)).join('/').replace(/\/index$/, '');
      const raw = frontmatter.path || `/${lang === 'en' ? '' : lang + '/'}${id}/`;
      const decoded = decodeURI(raw).replace(/\/+$/, '');
      const path = (decoded === '/insights' || decoded.startsWith('/insights/') ? decoded : '/insights' + (decoded.startsWith('/') ? '' : '/') + decoded) + '/';
      entries.push({ ...frontmatter, lang, path, collection, file: join('content', collection, file),
        translationKey: frontmatter.translationKey?.trim(), draft: frontmatter.draft || false, noindex: frontmatter.noindex || false });
    }
  }
  return entries;
}
