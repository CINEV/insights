import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Run after building. This prints only the historical ID redirects so the
// frontend can merge them with its unrelated redirects without replacing them.
const script = readFileSync(resolve('dist/legacy-links.js'), 'utf8');
const literal = script.match(/const links = (\{[^\n]+\});/);
if (!literal) throw new Error('Run npm run build before exporting legacy redirects');
const links = JSON.parse(literal[1]);
const redirects = Object.entries(links).flatMap(([key, values]) =>
  Object.entries(values).map(([id, destination]) => ({
    source: '/insights/:legacy((?:ko|ja)(?:/index\\.php)?|index\\.php)?',
    has: [{ type: 'query', key, value: id }],
    destination,
    permanent: true,
  })),
);
process.stdout.write(JSON.stringify(redirects, null, 2) + '\n');
