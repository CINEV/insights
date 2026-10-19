import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readdir, rm, cp, symlink } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { prepareAssets } from './lib/deployment-assets.mjs';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function snapshot(root) {
  const result = {};
  for (const name of (await readdir(root, {recursive:true})).sort()) {
    try { result[name] = hash(await readFile(join(root, name))); } catch (error) { if(error.code !== 'EISDIR') throw error; }
  }
  return result;
}
const root = await mkdtemp(join(tmpdir(), 'site-assets-'));
const publicDir = join(root, 'public'), dist = join(root, 'dist');
const media = Buffer.from([1,2,3,4]);
const inventory = [{path:'/assets/media/movie.mp4', bytes:media.length, sha256:hash(media)}];
try {
  for (const [name, bytes] of Object.entries({'assets/media/movie.mp4':media, 'assets/styles/theme.css':'body{color:black}', 'images/new.png':'new', 'site.js':'// site'})) {
    await mkdir(dirname(join(publicDir,name)),{recursive:true});await writeFile(join(publicDir,name),bytes);
  }
  await cp(publicDir,dist,{recursive:true});
  await mkdir(join(dist,'_astro'),{recursive:true});
  await writeFile(join(dist,'_astro/chunk.js'),'// generated');
  await writeFile(join(dist,'index.html'),'<video src="/insights/assets/media/movie.mp4"></video>');
  const sourceBefore = await snapshot(publicDir);
  const report = await prepareAssets({dist,publicDir,inventory});
  assert.equal(report.assets.length,5);
  assert.deepEqual(report.excluded,[]);
  assert.equal(await readFile(join(dist,'insights/index.html'),'utf8'), await readFile(join(dist,'index.html'),'utf8'));
  const output = await snapshot(dist);
  assert(!('assets/media/movie.mp4' in output));
  assert(!('_astro/chunk.js' in output));
  assert('insights/_astro/chunk.js' in output);
  assert.equal(output['insights/assets/media/movie.mp4'],hash(media));
  await prepareAssets({dist,publicDir,inventory});
  assert.deepEqual(await snapshot(dist),output,'Repeated preparation preserves output and generated modules');
  assert.deepEqual(await snapshot(publicDir),sourceBefore);
  for(const bad of [
    {...inventory[0],sha256:'bad'}, {...inventory[0],bytes:100},
    {...inventory[0],path:'/assets/missing.mp4'}, {...inventory[0],path:'/assets/../movie.mp4'},
  ]) {
    await assert.rejects(prepareAssets({dist,publicDir,inventory:[bad]}),/integrity|Invalid inventory/);
    assert.deepEqual(await snapshot(dist),output,'Failed integrity checks must precede output mutation');
  }
  await assert.rejects(prepareAssets({dist,publicDir,inventory:[...inventory,...inventory]}),/Invalid inventory/);
  await mkdir(join(publicDir,'wp-content'));
  await writeFile(join(publicDir,'wp-content/original.js'),'old');
  await assert.rejects(prepareAssets({dist,publicDir}),/WordPress source/);
  await rm(join(publicDir,'wp-content'),{recursive:true});
  await symlink(join(publicDir,'site.js'),join(publicDir,'linked.js'));
  await assert.rejects(prepareAssets({dist,publicDir}),/symlinks/);
  console.log('Asset tests passed: single shared library, generated chunks, idempotence, byte integrity, failure atomicity, source-directory and symlink rejection.');
} finally { await rm(root,{recursive:true,force:true}); }
