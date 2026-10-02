import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Imported file aliases are fixed history. Emit only these exact rewrites for
// merging ahead of the frontend's general asset rule; do not replace unrelated
// frontend routes or require frontend changes when publishing new Markdown.
const aliases = JSON.parse(readFileSync(resolve('migration/asset-aliases.json'), 'utf8'));
const fonts = JSON.parse(readFileSync(resolve('migration/font-conversions.json'), 'utf8'));
const mappings = [...Object.entries(aliases), ...fonts.map(font => [font.source, font.target])];
const localAsset = /^\/wp-content\/(?:uploads|migration-external|migration-fonts)\/[A-Za-z0-9_./-]+$/;
const sources = new Set(mappings.map(([source]) => source));
if (sources.size !== mappings.length) throw new Error('Asset rewrite sources must be unique');
const rules = mappings.flatMap(([source, target]) => {
  if (!localAsset.test(source) || !localAsset.test(target) || source.includes('/../') || target.includes('/../') || source === target || sources.has(target)) {
    throw new Error(`Asset rewrites must use distinct local paths without alias chains: ${source}`);
  }
  return ['', '/insights'].map(prefix => ({
    source: prefix + source,
    destination: 'https://cinev.github.io/insights' + target,
  }));
});
process.stdout.write(JSON.stringify(rules, null, 2) + '\n');
