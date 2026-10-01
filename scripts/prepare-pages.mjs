import { cp, mkdir, readdir, writeFile, readFile, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

// GitHub Pages has no rewrite rules. Preserve root paths for the existing
// frontend proxy and publish the same files under /insights for direct visits.
const dist = resolve('dist');
const prefix = resolve(dist, 'insights');
await rm(prefix, { recursive: true, force: true });
await mkdir(resolve(dist, 'feed'), { recursive: true });
await writeFile(resolve(dist, 'feed/index.html'), await readFile(resolve(dist, 'feed.xml')));
await writeFile(resolve(dist, '.nojekyll'), '');
const entries = await readdir(dist);
await mkdir(prefix);
for (const entry of entries) {
  if (entry !== 'insights') await cp(resolve(dist, entry), resolve(prefix, entry), { recursive: true });
}
console.log('Prepared GitHub Pages paths at / and /insights/');
