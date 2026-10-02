import assert from 'node:assert/strict';
import test from 'node:test';
import { mkdtemp, mkdir, writeFile, readFile, readdir, stat, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { prepareAssets } from './lib/deployment-assets.mjs';

const digest = value => createHash('sha256').update(value).digest('hex');
const absent = path => assert.rejects(stat(path), { code: 'ENOENT' });
async function put(root, name, value) {
  const path = join(root, name);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, value);
}
async function snapshot(root) {
  const result = {};
  for (const name of (await readdir(root, { recursive: true })).sort()) {
    if ((await stat(join(root, name))).isFile()) result[name] = digest(await readFile(join(root, name)));
  }
  return result;
}
async function fixture(publicFiles, generated, run) {
  const root = await mkdtemp(join(tmpdir(), 'cinev-assets-'));
  const publicDir = join(root, 'public');
  const dist = join(root, 'dist');
  await mkdir(publicDir);
  await mkdir(dist);
  try {
    for (const [name, value] of Object.entries(publicFiles)) {
      await put(publicDir, name, value);
      // Astro copies every public file before the deployment preparation step.
      await put(dist, name, value);
    }
    for (const [name, value] of Object.entries(generated)) await put(dist, name, value);
    const sourceBefore = await snapshot(publicDir);
    await run({ publicDir, dist });
    assert.deepEqual(await snapshot(publicDir), sourceBefore, 'Deployment must never alter the archived public source');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}
async function manifestFiles(dist, report) {
  const seen = new Set();
  for (const entry of report.assets) {
    assert(!seen.has(entry.path), `Duplicate manifest asset: ${entry.path}`);
    seen.add(entry.path);
    const bytes = await readFile(join(dist, entry.path));
    assert.equal(bytes.length, entry.bytes, entry.path);
    assert.equal(digest(bytes), entry.sha256, entry.path);
  }
  assert.equal(report.assetBytes, report.assets.reduce((total, entry) => total + entry.bytes, 0));
  assert.deepEqual(JSON.parse(await readFile(join(dist, 'asset-manifest.json'), 'utf8')), report);
  return seen;
}

test('prune only unused WordPress files, retain CSS imports/fonts and new authored assets', async () => {
  const publicFiles = {
    'wp-content/css/main.css': '@import "theme.css"; @import url("wrapped.css"); .logo { background: url(../images/logo.png?v=1); }',
    'wp-content/css/theme.css': '@font-face { font-family: Blog; src: url("../fonts/blog.woff2#font"); }',
    'wp-content/fonts/blog.woff2': Buffer.from([0, 1, 2, 3, 4]),
    'wp-content/css/wrapped.css': '@font-face { font-family: Wrapped; src: url("../fonts/wrapped.woff2"); }',
    'wp-content/fonts/wrapped.woff2': Buffer.from([0, 1, 2, 3, 5]),
    'wp-content/images/logo.png': Buffer.from([137, 80, 78, 71]),
    'wp-content/unused-photo.png': 'unused archived image',
    'wp-includes/unused-script.js': 'window.oldWordPressRuntime = true;',
    'wp-includes/used.css': ':root { --blog-background: white; }',
    'styles/custom.css': '@import "/insights/wp-includes/used.css";',
    'images/new-article.png': 'new manually authored image, not referenced yet',
    '_astro/public-module.js': 'export const asset = true;',
    'site.js': 'window.blogLoaded = true;',
    'download-guide.pdf': 'new manually authored download',
  };
  const html = '<link rel="stylesheet" href="/insights/wp-content/css/main.css"><main>Blog</main>';
  await fixture(publicFiles, { 'index.html': html, 'feed.xml': '<rss><channel/></rss>' }, async ({ dist, publicDir }) => {
    const report = await prepareAssets({ dist, publicDir });
    const assets = await manifestFiles(dist, report);
    assert.equal(report.sourceBytes, Object.values(publicFiles).reduce((total, value) => total + Buffer.byteLength(value), 0));
    for (const name of ['wp-content/css/main.css', 'wp-content/css/theme.css', 'wp-content/css/wrapped.css', 'wp-content/fonts/wrapped.woff2', 'wp-content/fonts/blog.woff2', 'wp-content/images/logo.png', 'wp-includes/used.css', 'images/new-article.png', '_astro/public-module.js']) {
      assert(assets.has('/insights/' + name), `Referenced or authored asset was dropped: ${name}`);
      await absent(join(dist, name));
      assert.deepEqual(await readFile(join(dist, 'insights', name)), Buffer.from(publicFiles[name]));
    }
    assert.deepEqual(report.excluded, ['/wp-content/unused-photo.png', '/wp-includes/unused-script.js']);
    for (const path of report.excluded) {
      await absent(join(dist, path));
      await absent(join(dist, 'insights', path));
    }
    for (const name of ['site.js', 'styles/custom.css', 'download-guide.pdf']) {
      assert.deepEqual(await readFile(join(dist, name)), await readFile(join(dist, 'insights', name)));
    }
    assert.equal(await readFile(join(dist, 'index.html'), 'utf8'), html);
    assert.equal(await readFile(join(dist, 'insights/index.html'), 'utf8'), html);
    assert.equal(await readFile(join(dist, 'insights/feed.xml'), 'utf8'), '<rss><channel/></rss>');
  });
});

test('identical videos normalize in HTML, RSS and absolute/relative CSS and deploy once', async () => {
  const video = Buffer.from([0, 1, 2, 3, 255, 16]);
  const aliases = {
    '/wp-content/uploads/duplicate.mp4': '/wp-content/uploads/canonical.mp4',
    '/wp-content/uploads/중복.mp4': '/wp-content/uploads/canonical.mp4',
  };
  const publicFiles = {
    'wp-content/uploads/duplicate.mp4': video,
    'wp-content/uploads/중복.mp4': video,
    'wp-content/uploads/canonical.mp4': video,
    'wp-content/css/video.css': '.absolute { --video: url("/insights/wp-content/uploads/duplicate.mp4"); } .relative { --video: url("../uploads/duplicate.mp4"); }',
  };
  const html = `<link rel="stylesheet" href="/insights/wp-content/css/video.css"><video src="/insights/wp-content/uploads/duplicate.mp4"></video><video src="${encodeURI('/insights/wp-content/uploads/중복.mp4')}"></video>`;
  const feed = '<rss xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel><item><content:encoded><![CDATA[<video src="https://cinev.com/insights/wp-content/uploads/duplicate.mp4"></video>]]></content:encoded></item></channel></rss>';
  await fixture(publicFiles, { 'index.html': html, 'feed.xml': feed }, async ({ dist, publicDir }) => {
    const report = await prepareAssets({ dist, publicDir, aliases });
    const assets = await manifestFiles(dist, report);
    assert(assets.has('/insights/wp-content/uploads/canonical.mp4'));
    for (const alias of Object.keys(aliases)) {
      assert(report.excluded.includes(alias));
      await absent(join(dist, alias));
      await absent(join(dist, 'insights', alias));
    }
    const deployedVideoFiles = Object.keys(await snapshot(dist)).filter(name => name.endsWith('.mp4'));
    assert.deepEqual(deployedVideoFiles, ['insights/wp-content/uploads/canonical.mp4']);
    for (const name of ['index.html', 'insights/index.html', 'feed.xml', 'insights/feed.xml', 'insights/wp-content/css/video.css']) {
      const output = await readFile(join(dist, name), 'utf8');
      assert(!output.includes('duplicate.mp4'), `Old video path remains in ${name}`);
      assert(!output.includes(encodeURI('중복.mp4')), `Encoded old video path remains in ${name}`);
      assert(output.includes('canonical.mp4'), `Canonical video missing from ${name}`);
    }
    const css = await readFile(join(dist, 'insights/wp-content/css/video.css'), 'utf8');
    for (const match of css.matchAll(/url\("([^"]+)"\)/g)) {
      const target = new URL(match[1], 'https://cinev.com/insights/wp-content/css/video.css');
      assert.deepEqual(await readFile(join(dist, target.pathname)), video);
    }
  });
});

test('aliases with different bytes fail before modifying deployment or source files', async () => {
  await fixture({ 'wp-content/a.mp4': 'first video', 'wp-content/b.mp4': 'different video' }, { 'index.html': 'unchanged generated page' }, async ({ dist, publicDir }) => {
    const before = await snapshot(dist);
    await assert.rejects(prepareAssets({ dist, publicDir, aliases: { '/wp-content/a.mp4': '/wp-content/b.mp4' } }), /identical bytes/);
    assert.deepEqual(await snapshot(dist), before);
  });
});

test('Astro-generated modules, styles and images move to the shared prefix and remain in the manifest', async () => {
  const generated = {
    'index.html': '<script type="module" src="/insights/_astro/entry.js"></script><link rel="stylesheet" href="/insights/_astro/style.css">',
    '_astro/entry.js': 'import "./chunk.js";',
    '_astro/chunk.js': 'export const answer = 42;',
    '_astro/style.css': '.illustration { background: url("./picture.png"); }',
    '_astro/picture.png': Buffer.from([137, 80, 78, 71, 1]),
  };
  await fixture({ 'images/new.png': 'new user image' }, generated, async ({ dist, publicDir }) => {
    const report = await prepareAssets({ dist, publicDir });
    const assets = await manifestFiles(dist, report);
    for (const [name, bytes] of Object.entries(generated).filter(([name]) => name.startsWith('_astro/'))) {
      assert(assets.has('/insights/' + name), `Generated Astro asset omitted from manifest: ${name}`);
      await absent(join(dist, name));
      assert.deepEqual(await readFile(join(dist, 'insights', name)), Buffer.from(bytes));
    }
    const firstDeployment = await snapshot(dist);
    const firstSource = await snapshot(publicDir);
    const repeatedReport = await prepareAssets({ dist, publicDir });
    assert.deepEqual(repeatedReport, report, 'Repeated preparation must preserve the asset manifest');
    await manifestFiles(dist, repeatedReport);
    assert.deepEqual(await snapshot(dist), firstDeployment, 'Repeated preparation must preserve generated Astro chunks');
    assert.deepEqual(await snapshot(publicDir), firstSource, 'Repeated preparation must preserve public sources');
  });
});


test('fresh root Astro chunks take precedence over a previous prefixed deployment', async () => {
  await fixture({}, {
    'index.html': '<script type="module" src="/insights/_astro/entry.js"></script>',
    '_astro/entry.js': 'export const version = "fresh";',
    'insights/_astro/entry.js': 'export const version = "previous";',
  }, async ({ dist, publicDir }) => {
    const report = await prepareAssets({ dist, publicDir });
    await manifestFiles(dist, report);
    assert.equal(await readFile(join(dist, 'insights/_astro/entry.js'), 'utf8'), 'export const version = "fresh";');
    await absent(join(dist, '_astro/entry.js'));
  });
});


test('font conversions rewrite absolute and relative CSS URLs and format, deploying only WOFF2', async () => {
  const sourceFont = Buffer.from([0, 1, 0, 0, 16, 32, 64, 128]);
  const compressedFont = Buffer.concat([Buffer.from('wOF2'), Buffer.from([1, 2, 3])]);
  const conversion = {
    source: '/wp-content/fonts/blog.ttf',
    target: '/wp-content/fonts/blog.woff2',
    sourceSha256: digest(sourceFont),
    sha256: digest(compressedFont),
  };
  const css = `@font-face { font-family: Absolute; src: url("https://cinev.com/insights/wp-content/fonts/blog.ttf?v=1#font") format("truetype"); }
@font-face { font-family: Relative; src: url('../fonts/blog.ttf?v=2') format('truetype'); }`;
  await fixture({
    'wp-content/fonts/blog.ttf': sourceFont,
    'wp-content/fonts/blog.woff2': compressedFont,
    'wp-content/css/fonts.css': css,
  }, { 'index.html': '<link rel="stylesheet" href="/insights/wp-content/css/fonts.css">' }, async ({ dist, publicDir }) => {
    const report = await prepareAssets({ dist, publicDir, fontConversions: [conversion] });
    const assets = await manifestFiles(dist, report);
    assert.deepEqual(report.fontConversions, [conversion]);
    assert(report.excluded.includes(conversion.source));
    assert(!assets.has('/insights' + conversion.source));
    assert(assets.has('/insights' + conversion.target));
    await absent(join(dist, conversion.source));
    await absent(join(dist, 'insights', conversion.source));
    await absent(join(dist, conversion.target));
    assert.deepEqual(await readFile(join(dist, 'insights', conversion.target)), compressedFont);
    const output = await readFile(join(dist, 'insights/wp-content/css/fonts.css'), 'utf8');
    assert(!output.includes('.ttf'), 'Stylesheet still references the undeployed original font');
    assert(!output.includes('truetype'), 'Converted WOFF2 must not advertise a TrueType format');
    assert.equal([...output.matchAll(/format\(['"]woff2['"]\)/g)].length, 2);
    assert(output.includes('blog.woff2?v=1#font'));
    assert(output.includes('blog.woff2?v=2'));
    for (const match of output.matchAll(/url\(['"]([^'"]+)['"]\)/g)) {
      const url = new URL(match[1], 'https://cinev.com/insights/wp-content/css/fonts.css');
      assert.equal(url.pathname, '/insights/wp-content/fonts/blog.woff2');
      assert.deepEqual(await readFile(join(dist, url.pathname)), compressedFont);
    }
  });
});

test('stale source or converted font hashes fail before changing deployment or source files', async () => {
  const sourceFont = Buffer.from([0, 1, 0, 0, 16, 32, 64, 128]);
  const compressedFont = Buffer.concat([Buffer.from('wOF2'), Buffer.from([1, 2, 3])]);
  const conversion = {
    source: '/wp-content/fonts/blog.ttf',
    target: '/wp-content/fonts/blog.woff2',
    sourceSha256: digest(sourceFont),
    sha256: digest(compressedFont),
  };
  for (const field of ['sourceSha256', 'sha256']) {
    await fixture({ 'wp-content/fonts/blog.ttf': sourceFont, 'wp-content/fonts/blog.woff2': compressedFont }, {
      'index.html': 'unchanged generated page',
      'insights/_astro/existing.js': 'previous deployment must survive failed validation',
    }, async ({ dist, publicDir }) => {
      const before = await snapshot(dist);
      const stale = { ...conversion, [field]: '0'.repeat(64) };
      await assert.rejects(prepareAssets({ dist, publicDir, fontConversions: [stale] }), /Font conversion is missing or stale/);
      assert.deepEqual(await snapshot(dist), before, `Failed ${field} validation must not mutate deployment`);
    });
  }
});
