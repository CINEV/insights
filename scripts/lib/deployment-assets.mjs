import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import { dirname, join, posix } from 'node:path';

const textExtensions = new Set(['.html', '.xml', '.css', '.js', '.mjs', '.json', '.txt', '.svg']);
const legacyAsset = name => /^(?:wp-content|wp-includes)\//.test(name);
const prefixedAsset = name => /^(?:wp-content|wp-includes|images|_astro)\//.test(name);
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

// Keep source uploads intact. The deployment is a dependency-closed subset;
// legacy video URLs are served by explicit frontend rewrites to their aliases.
export async function prepareAssets({ dist, publicDir, aliases = {}, fontConversions = [], origin = 'https://cinev.com', base = '/insights' }) {
  const names = await files(publicDir);
  const sources = new Map(await Promise.all(names.map(async name => [name, await readFile(join(publicDir, name))])));
  for (const [from, to] of Object.entries(aliases)) {
    if (!from.startsWith('/wp-content/') || !to.startsWith('/wp-content/') || from === to || aliases[to]) throw new Error(`Invalid or chained asset alias: ${from}`);
    const a = sources.get(from.slice(1)), b = sources.get(to.slice(1));
    if (!a || !b || !a.equals(b)) throw new Error(`Asset alias must preserve identical bytes: ${from} -> ${to}`);
  }
  const substitutions = { ...aliases };
  for (const font of fontConversions) {
    const source = sources.get(font.source.slice(1)), target = sources.get(font.target.slice(1));
    if (!source || !target || hash(source) !== font.sourceSha256 || hash(target) !== font.sha256 || target.subarray(0, 4).toString() !== 'wOF2') {
      throw new Error(`Font conversion is missing or stale; regenerate before deploying: ${font.source}`);
    }
    substitutions[font.source] = font.target;
  }
  // Astro-generated chunks are assets too, although they do not live in public.
  // On repeated preparation they exist only under the shared prefix. Read them
  // before removing that tree, preferring fresh root chunks from an Astro build.
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
  await rm(join(dist, base.slice(1)), { recursive: true, force: true });
  const sourceBytes = [...sources.values()].reduce((sum, value) => sum + value.length, 0);
  const localAsset = (raw, owner) => {
    try {
      const url = new URL(raw.replace(/&amp;/g, '&'), origin + base + '/' + owner);
      if (![new URL(origin).host, 'blog.cinev.com', '43.200.218.52', 'cinev.github.io'].includes(url.host)) return;
      let path = decodeURIComponent(url.pathname);
      if (path.startsWith(base + '/')) path = path.slice(base.length);
      return { path, suffix: url.search + url.hash };
    } catch { /* An opaque or malformed URL is not a local dependency. */ }
  };
  const rewrite = (text, owner) => {
    for (const [from, to] of Object.entries(substitutions)) {
      // Both literal UTF-8 and URL-encoded references occur in imported HTML.
      text = text.split(from).join(to).split(encodeURI(from)).join(encodeURI(to));
    }
    // CSS can use relative URLs; resolve before aliasing to avoid retaining a
    // relative URL to a duplicate file which is excluded from the deployment.
    return text.replace(/(url\(\s*|@import\s+(?=["']))(?:"([^"]+)"|'([^']+)'|([^\s)]+))/gi, (match, prefix, double, single, bare) => {
      const value = double ?? single ?? bare;
      const local = localAsset(value, owner);
      const target = local && substitutions[local.path];
      if (!target) return match;
      const quote = double !== undefined ? '"' : single !== undefined ? "'" : '';
      return prefix + quote + base + encodeURI(target) + local.suffix + quote;
    }).replace(/(url\([^)]*\.woff2(?:[?#][^)]*)?['"]?\)\s*format\(['"])truetype(['"]\))/gi, '$1woff2$2');
  };
  const needed = new Set();
  const pending = [];
  const include = name => {
    name = (substitutions['/' + name] || '/' + name).slice(1);
    if (!sources.has(name) || needed.has(name)) return;
    needed.add(name); pending.push(name);
  };
  function inspect(text, owner) {
    text = text.replace(/\\\//g, '/');
    const addUrl = raw => {
      if (/^(?:data:|#)/i.test(raw)) return;
      const local = localAsset(raw, owner);
      if (local) include(local.path.replace(/^\//, ''));
    };
    // Covers HTML attributes, RSS CDATA, JSON-LD, srcset, style and data-* URLs.
    for (const match of text.matchAll(/\/(?:insights\/)?(?:wp-content|wp-includes|images|_astro)\/[^\s"'<>()[\]{}\\,;]+/gu)) addUrl(match[0]);
    for (const match of text.matchAll(/(?:url\(\s*|@import\s+(?=["']))(?:"([^"]+)"|'([^']+)'|([^\s)]+))/gi)) addUrl(match[1] || match[2] || match[3]);
  }

  // Hand-authored public assets and Astro modules are retained. Pruning only
  // applies to the imported WordPress library, never arbitrary user files.
  for (const name of names) if (!legacyAsset(name)) include(name);
  const generated = (await files(dist)).filter(name => !sources.has(name) && !['asset-manifest.json', '.nojekyll'].includes(name));
  for (const name of generated) {
    if (!textExtensions.has(posix.extname(name))) continue;
    const original = await readFile(join(dist, name), 'utf8');
    const text = rewrite(original, name);
    if (text !== original) await writeFile(join(dist, name), text);
    inspect(text, name);
  }
  for (let i = 0; i < pending.length; i++) {
    const name = pending[i];
    if (textExtensions.has(posix.extname(name))) inspect(rewrite(sources.get(name).toString(), name), name);
  }

  // Remove Astro's unfiltered public copies only from dist. Never touch the
  // archived source library. Large assets are written once under /insights/.
  for (const name of names) await rm(join(dist, name), { force: true });
  const assets = [];
  for (const name of [...needed].sort()) {
    const original = sources.get(name);
    const bytes = textExtensions.has(posix.extname(name)) ? Buffer.from(rewrite(original.toString(), name)) : original;
    const target = join(dist, base.slice(1), name);
    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, bytes);
    if (!prefixedAsset(name)) {
      await mkdir(dirname(join(dist, name)), { recursive: true });
      await writeFile(join(dist, name), bytes);
    }
    assets.push({ path: base + '/' + name, bytes: bytes.length, sha256: hash(bytes) });
  }
  // Only documents/endpoints need compatibility copies. Their absolute asset
  // URLs already point to the one shared /insights library.
  for (const name of generated) {
    if (prefixedAsset(name)) continue;
    await mkdir(dirname(join(dist, base.slice(1), name)), { recursive: true });
    await cp(join(dist, name), join(dist, base.slice(1), name));
  }
  await writeFile(join(dist, '.nojekyll'), '');
  const report = {
    assets, excluded: names.filter(name => !needed.has(name)).map(name => '/' + name), aliases,
    fontConversions, sourceBytes, assetBytes: assets.reduce((sum, asset) => sum + asset.bytes, 0),
  };
  await writeFile(join(dist, 'asset-manifest.json'), JSON.stringify(report, null, 2) + '\n');
  return report;
}
