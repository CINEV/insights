import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const prefixedAsset = name => /^(?:assets|images|_astro)\//.test(name);
const hash = value => createHash('sha256').update(value).digest('hex');
async function files(directory) {
  const result = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    if (item.isSymbolicLink()) throw new Error(`Deployment source must not contain symlinks: ${join(directory, item.name)}`);
    if (item.isDirectory()) for (const name of await files(join(directory, item.name))) result.push(item.name + '/' + name);
    else if (item.isFile()) result.push(item.name);
  }
  return result.sort();
}

// Public contains only maintained site assets. Retired WordPress asset URLs
// have no compatibility copies or rewrites; documents reference /assets/.
export async function prepareAssets({ dist, publicDir, inventory = [], base = '/insights' }) {
  const names = await files(publicDir);
  if (names.some(name => /^(?:wp-content|wp-includes)\//.test(name))) throw new Error('WordPress source directories must not be reintroduced');
  const sources = new Map(await Promise.all(names.map(async name => [name, await readFile(join(publicDir, name))])));
  const seen = new Set();
  for (const asset of inventory) {
    if (!/^\/assets\/[A-Za-z0-9_./-]+$/.test(asset.path) || asset.path.split('/').some(part => ['.', '..'].includes(part)) || seen.has(asset.path)) throw new Error(`Invalid inventory path: ${asset.path}`);
    seen.add(asset.path);
    const bytes = sources.get(asset.path.slice(1));
    if (!bytes || bytes.length !== asset.bytes || hash(bytes) !== asset.sha256) throw new Error(`Site asset integrity mismatch: ${asset.path}`);
  }
  // On repeated preparation, generated modules already live under the prefix.
  const outputFiles = await files(dist);
  for (const prefix of ['', base.slice(1) + '/']) {
    for (const path of outputFiles) {
      if (!path.startsWith(prefix + '_astro/')) continue;
      const name = path.slice(prefix.length);
      if (sources.has(name)) continue;
      names.push(name);
      sources.set(name, await readFile(join(dist, path)));
    }
  }
  const generated = outputFiles.filter(name => !name.startsWith(base.slice(1) + '/') && !sources.has(name) && !['asset-manifest.json', '.nojekyll'].includes(name));
  await rm(join(dist, base.slice(1)), { recursive: true, force: true });
  for (const name of names) await rm(join(dist, name), { force: true });
  const assets = [];
  for (const name of [...sources.keys()].sort()) {
    const bytes = sources.get(name);
    const target = join(dist, base.slice(1), name);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
    if (!prefixedAsset(name)) {
      await mkdir(dirname(join(dist, name)), { recursive: true });
      await writeFile(join(dist, name), bytes);
    }
    assets.push({ path: base + '/' + name, bytes: bytes.length, sha256: hash(bytes) });
  }
  for (const name of generated) {
    if (prefixedAsset(name)) continue;
    await mkdir(dirname(join(dist, base.slice(1), name)), { recursive: true });
    await cp(join(dist, name), join(dist, base.slice(1), name));
  }
  await writeFile(join(dist, '.nojekyll'), '');
  const assetBytes = assets.reduce((sum, asset) => sum + asset.bytes, 0);
  const report = { assets, excluded: [], sourceBytes: assetBytes, assetBytes };
  await writeFile(join(dist, 'asset-manifest.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}
