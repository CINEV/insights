import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

function originCompatibility() {
  const install = server => {
    server.middlewares.use((request, _response, next) => {
      const [pathname, query] = (request.url || '/').split('?');
      if (/^\/(?:wp-content|wp-includes)\//.test(pathname)) request.url = `/insights${pathname}${query ? `?${query}` : ''}`;
      else if (/^\/(?:insights\/)?feed\/?$/.test(pathname)) request.url = '/insights/feed.xml';
      else if (/^\/(?:sitemap(?:_index)?\.xml|search-index\.json|site\.(?:js|css))$/.test(pathname)) request.url = `/insights${pathname}`;
      next();
    });
  };
  return { name: 'cinev-origin-compatibility', configureServer: install, configurePreviewServer: install };
}

// Only this independent blog is rebuilt when Markdown changes. The existing
// frontend strips /insights while proxying to this origin. The postbuild step
// also provides /insights paths for direct access on GitHub Pages.
export default defineConfig({
  site: 'https://cinev.com',
  base: '/insights',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ smartypants: false }),
  },
  vite: { plugins: [originCompatibility()] },
});
