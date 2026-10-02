import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { prepareAssets } from './lib/deployment-assets.mjs';

const dist = resolve('dist');
for (const language of ['', 'ko', 'ja', 'all']) {
  await mkdir(resolve(dist, language, 'feed'), { recursive: true });
  await writeFile(resolve(dist, language, 'feed/index.html'), await readFile(resolve(dist, language, 'feed.xml')));
}
const aliases = JSON.parse(await readFile(resolve('migration/asset-aliases.json'), 'utf8'));
const fontConversions = JSON.parse(await readFile(resolve('migration/font-conversions.json'), 'utf8'));
const report = await prepareAssets({ dist, publicDir: resolve('public'), aliases, fontConversions });
console.log(`Prepared Pages: ${report.assets.length} assets in one shared directory, ${report.excluded.length} archived files excluded; ${(report.assetBytes / 1048576).toFixed(1)} MiB of assets.`);
