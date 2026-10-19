import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { prepareAssets } from './lib/deployment-assets.mjs';

const dist = resolve('dist');
for (const language of ['', 'ko', 'ja', 'all']) {
  await mkdir(resolve(dist, language, 'feed'), { recursive: true });
  await writeFile(resolve(dist, language, 'feed/index.html'), await readFile(resolve(dist, language, 'feed.xml')));
}
const { assets: inventory } = JSON.parse(await readFile(resolve('src/config/asset-integrity.json'), 'utf8'));
const report = await prepareAssets({ dist, publicDir: resolve('public'), inventory });
// GitHub project Pages adds /insights/ to the artifact root. Upload only this
// subtree, with documents and assets together, to avoid a doubled URL prefix.
await writeFile(resolve(dist, 'insights/.nojekyll'), '');
await writeFile(resolve(dist, 'insights/asset-manifest.json'), JSON.stringify(report, null, 2) + '\n');
console.log(`Prepared Pages: ${report.assets.length} assets in one shared directory, ${(report.assetBytes / 1048576).toFixed(1)} MiB of assets.`);
