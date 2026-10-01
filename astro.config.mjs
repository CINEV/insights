import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';

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
});
