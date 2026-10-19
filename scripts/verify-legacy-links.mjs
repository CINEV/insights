import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import vm from 'node:vm';
import { contentMetadata } from './lib/content-metadata.mjs';

const read = path => readFileSync(resolve(path), 'utf8');
const script = read('dist/legacy-links.js');
assert.equal(read('dist/insights/legacy-links.js'), script, 'Pages prefix mirror');
const links = JSON.parse(script.match(/const links = (\{[^\n]+\});/)[1]);
const expected = { p: {}, page_id: {} };
for (const entry of contentMetadata()) {
  if (entry.legacyId === undefined || entry.draft) continue;
  assert(Number.isSafeInteger(entry.legacyId) && entry.legacyId > 0, `Invalid WordPress ID: ${entry.file}`);
  assert(!Object.hasOwn(expected.p, entry.legacyId), `Duplicate WordPress ID: ${entry.legacyId}`);
  expected.p[entry.legacyId] = entry.path;
  if (entry.collection === 'pages') expected.page_id[entry.legacyId] = entry.path;
}
assert.deepEqual(links, expected, 'Legacy IDs must match current published Markdown, excluding drafts/deleted entries');
const run = href => {
  const url = new URL(href);
  const navigation = [];
  const state = { preserved: true };
  const context = {
    URL,
    location: { href, pathname: url.pathname, replace: value => navigation.push(['replace', value]) },
    history: { state, replaceState: (value, _, target) => { assert.equal(value, state); navigation.push(['history', target]); } },
  };
  vm.runInNewContext(script, context);
  return navigation;
};
let cases = 0;
for (const [key, ids] of Object.entries(links)) {
  for (const [id, path] of Object.entries(ids)) {
    assert(existsSync(resolve('dist', decodeURI(path.slice('/insights/'.length)), 'index.html')), path);
    for (const origin of ['https://cinev.com', 'https://cinev.github.io', 'http://localhost:4321']) {
      for (const root of ['/insights', '/insights/', '/insights/ko/', '/insights/ja/index.php', '/', '/index.php']) {
        const current = `${origin}${root}?${key}=${id}&utm_source=newsletter#faq`;
        const expected = new URL(path, origin);
        expected.search = '?utm_source=newsletter';
        expected.hash = '#faq';
        assert.deepEqual(run(current), [['replace', expected.href]], current);
        cases++;
      }
      const landed = new URL(path, origin);
      landed.search = `?${key}=${id}&utm_source=newsletter`;
      landed.hash = '#faq';
      const clean = new URL(landed);
      clean.searchParams.delete(key);
      assert.deepEqual(run(landed.href), [['history', clean.href]], 'Clean Vercel-forwarded ID without another navigation');
      assert.deepEqual(run(clean.href), [], 'No redirect loop after cleanup');
    }
  }
}
for (const query of ['', '?p=9999999999', '?page_id=9999999999', '?p=__proto__', '?p=1269evil', '?p=https%3A%2F%2Fevil.example', '?p=0001269', '?s=animation']) {
  assert.deepEqual(run(`https://cinev.github.io/insights/${query}`), [], query);
}
assert.deepEqual(run('https://cinev.com/insights/tutorials/?p=1269'), [], 'Do not redirect unrelated article/archive paths');
const publicId = Object.keys(links.p)[0];
if (publicId) {
  const injected = run(`https://cinev.github.io/insights/?p=${publicId}&next=https%3A%2F%2Fevil.example#%3Cscript%3E`);
  assert.equal(new URL(injected[0][1]).origin, 'https://cinev.github.io', 'Only same-origin destinations');
  assert.equal(new URL(injected[0][1]).searchParams.get('next'), 'https://evil.example', 'Extra query values remain data');
}
const home = read('dist/index.html');
assert.equal(home.split('src="/insights/legacy-links.js"').length - 1, 1);
const redirects = JSON.parse(execFileSync(process.execPath, ['scripts/export-legacy-redirects.mjs'], { encoding: 'utf8' }));
assert.equal(redirects.length, Object.values(links).reduce((sum, ids) => sum + Object.keys(ids).length, 0));
for (const redirect of redirects) {
  const [{ key, value }] = redirect.has;
  assert.equal(redirect.destination, links[key][value]);
  assert.equal(redirect.permanent, true);
  assert(redirect.destination.startsWith('/insights/'));
}
console.log(`Legacy link checks passed: ${Object.keys(links.p).length} public IDs, ${redirects.length} redirect rules, ${cases} origin/path cases, tracking/hash preservation, unknown IDs and same-origin destinations.`);
