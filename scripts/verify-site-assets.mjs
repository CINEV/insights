import assert from 'node:assert/strict';
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {load} from 'cheerio';
const root=process.cwd();
for(const name of ['migration','public/wp-content','public/wp-includes','dist/insights/wp-content','dist/insights/wp-includes','src/config/legacy-assets.json']) assert(!existsSync(resolve(name)), `Retired source directory: ${name}`);
const manifest=JSON.parse(readFileSync('dist/asset-manifest.json'));
const paths=new Set(manifest.assets.map(a=>a.path));
let refs=0;
function check(raw,owner) {
  if(!raw || /^(?:data:|#)/i.test(raw))return;
  const url=new URL(raw,'https://cinev.com'+owner);
  if(!['cinev.com','cinev.github.io'].includes(url.hostname))return;
  const path=decodeURI(url.pathname);
  assert(!/\/(?:wp-content|wp-includes)\//.test(path),`Retired asset reference: ${owner} -> ${path}`);
  if(!/^\/insights\/(?:assets|images|_astro)\//.test(path))return;
  assert(paths.has(path),`Missing resource in manifest: ${owner} -> ${path}`);
  assert(existsSync(join(root,'dist',path)),`Missing resource file: ${path}`);
  refs++;
}
function css(text,owner) {
  text=text.replace(/\/\*[\s\S]*?\*\//g,'');
  for(const m of text.matchAll(/(?:url\(\s*|@import\s+(?=["']))(?:"([^"]+)"|'([^']+)'|([^\s)]+))/gi))check(m[1]??m[2]??m[3],owner);
}
for(const asset of manifest.assets)if(asset.path.endsWith('.css'))css(readFileSync(join('dist',asset.path),'utf8'),asset.path);
for(const name of readdirSync('dist/insights',{recursive:true}).filter(n=>n.endsWith('.html')&&!/(?:^|\/)feed\/index\.html$/.test(n))) {
 const owner='/insights/'+name;
 const $=load(readFileSync(join('dist/insights',name),'utf8'));
 $('[src],[href],[poster]').each((_,e)=>{for(const a of ['src','href','poster'])check($(e).attr(a),owner);});
 $('[srcset]').each((_,e)=>{for(const candidate of $(e).attr('srcset').split(','))check(candidate.trim().split(/\s+/)[0],owner);});
 $('style').each((_,e)=>css($(e).text(),owner));
 $('[style]').each((_,e)=>css($(e).attr('style'),owner));
}
for(const name of readdirSync('src/templates')) {
 const $=load(readFileSync(join('src/templates',name),'utf8'));
 assert.equal($('script,meta[name="generator"]').length,0,`Executable source in template: ${name}`);
 const body=$('body').is('.blog,.archive')?$('#main .ast-row').first():$('#main > article, #primary article').first().find('.entry-content').first();
 assert.equal(body.html()?.trim()||'','',`Duplicated article/archive content in template: ${name}`);
}
console.log(`Site asset checks passed: ${refs} HTML/CSS resource references, layout-only templates and retired source absence.`);
