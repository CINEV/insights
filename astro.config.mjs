import { defineConfig } from 'astro/config';
import site from './src/config/site.json' with { type: 'json' };
import { unified } from '@astrojs/markdown-remark';

// Only this independent blog is rebuilt when Markdown changes. The existing
// frontend preserves /insights while proxying to this origin. The postbuild
// step prepares dist/insights as the artifact mounted at /insights/ by Pages.
export default defineConfig({
  site: site.origin,
  base: site.base,
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory' },
  markdown: {
    processor: unified({ smartypants: false }),
  },
});
