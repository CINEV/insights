import assert from 'node:assert/strict';
import { cp, mkdtemp, readdir, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { load } from 'cheerio';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fixture = await mkdtemp(join(tmpdir(), 'cinev-publishing-'));
function run(command, args) {
  const result = spawnSync(command, args, { cwd: fixture, encoding: 'utf8', timeout: 120_000 });
  assert.equal(result.status, 0, `${command} failed: ${result.error || ''}\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
try {
  for (const name of ['src', 'content', 'migration', 'scripts']) await cp(join(root, name), join(fixture, name), { recursive: true });
  for (const name of ['astro.config.mjs', 'package.json', 'package-lock.json', 'tsconfig.json']) await cp(join(root, name), join(fixture, name));
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'dir');
  await symlink(join(root, 'public'), join(fixture, 'public'), 'dir');
  const cases = [['en', 'tutorials'], ['ko', 'tutorials-ko'], ['ja', 'tutorials-ja']];
  for (const [lang, category] of cases) {
    run(process.execPath, ['scripts/new-post.mjs', `publishing-fixture-${lang}`, '--title', `Publishing fixture ${lang}`, '--lang', lang, '--category', category, '--tags', `publishing-fixture-${lang}`, ...(lang === 'en' ? ['--image', '/insights/wp-content/uploads/2026/03/cinev-bi-white.png', '--image-alt', 'Publishing cover'] : [])]);
    const file = join(fixture, 'content/posts', lang, `publishing-fixture-${lang}.md`);
    const source = await readFile(file, 'utf8');
    assert.match(source, /draft: true/);
    await writeFile(file, source.replace('draft: true', 'draft: false') + '\n## Publishing body\n\n**Markdown works.**\n\n- First\n- Second\n');
  }
  run(process.execPath, ['scripts/new-post.mjs', 'publishing-draft-fixture', '--title', 'PUBLISHING_DRAFT_MUST_STAY_PRIVATE', '--lang', 'ko', '--tags', 'publishing-draft-tag']);
  run('npm', ['run', 'build']);
  const dist = join(fixture, 'dist');
  const read = path => readFile(join(dist, path), 'utf8');
  const search = JSON.parse(await read('search-index.json'));
  const feed = await read('feed.xml');
  const sitemap = await read('sitemap.xml');
  for (const [lang, category] of cases) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
    const path = `/insights/${prefix}publishing-fixture-${lang}/`;
    const $ = load(await read(`${prefix}publishing-fixture-${lang}/index.html`));
    assert.equal($('.cinev-native-post h1').text(), `Publishing fixture ${lang}`);
    assert.equal($('.entry-content h2').last().text(), 'Publishing body');
    assert.equal($('.entry-content strong').text(), 'Markdown works.');
    assert.equal($('.cinev-post-breadcrumb a').last().attr('href'), `/insights/${prefix}${category}/`);
    assert.equal($('meta[property="og:type"]').attr('content'), 'article');
    if (lang === 'en') {
      assert.equal($('meta[property="og:image"]').length, 1);
      assert.equal($('.cinev-markdown-cover').attr('alt'), 'Publishing cover');
    }
    assert(search.some(entry => entry.path === path));
    assert(feed.includes(path) && sitemap.includes(path));
    assert((await read(`${prefix}index.html`)).includes(path));
    assert((await read(`${prefix}tag/publishing-fixture-${lang}/index.html`)).includes(path));
    assert((await read('author/user/index.html')).includes(path));
    assert((await read(`insights/${prefix}publishing-fixture-${lang}/index.html`)).includes('Publishing body'));
  }
  const originalPost = load(await read('empowering-seedance-2-5-from-vision-to-sequence/index.html'));
  let tutorialCount = 0;
  for (const file of await readdir(join(dist, 'tutorials'), { recursive: true })) {
    if (file.endsWith('index.html')) tutorialCount += load(await read(`tutorials/${file}`))('.ast-article-post').length;
  }
  assert.match(originalPost('.uagb-tax-link[href="/insights/tutorials/"]').parent().text(), new RegExp(`\\(${tutorialCount}\\)`));
  for (const value of [JSON.stringify(search), feed, sitemap, await read('ko/index.html')]) {
    assert(!value.includes('publishing-draft-fixture') && !value.includes('PUBLISHING_DRAFT_MUST_STAY_PRIVATE'));
  }
  await assert.rejects(read('ko/publishing-draft-fixture/index.html'), { code: 'ENOENT' });
  await assert.rejects(read('insights/ko/publishing-draft-fixture/index.html'), { code: 'ENOENT' });
  await assert.rejects(read('ko/tag/publishing-draft-tag/index.html'), { code: 'ENOENT' });
  // Editors can change frontmatter by hand; invalid routes must fail before
  // an existing archive or another article is overwritten.
  const invalid = join(fixture, 'content/posts/en/invalid-fixture.md');
  const published = await readFile(join(fixture, 'content/posts/en/publishing-fixture-en.md'), 'utf8');
  for (const [source, message] of [
    [published, /Duplicate content path/],
    [published.replace('/insights/publishing-fixture-en/', '/insights/tutorials/'), /collides with another page or archive/],
    [published.replace('/insights/publishing-fixture-en/', '/insights/invalid\/\/fixture/'), /absolute local path/],
    [published.replace('/insights/publishing-fixture-en/', '/insights/invalid-fixture/').replace('categories: ["tutorials"]', 'categories: ["tutorials-ko"]'), /category language mismatch/],
  ]) {
    await writeFile(invalid, source);
    const result = spawnSync('npm', ['run', 'build'], { cwd: fixture, encoding: 'utf8', timeout: 120_000 });
    assert.notEqual(result.status, 0, 'Invalid content unexpectedly built successfully');
    assert.match(result.stdout + result.stderr, message);
  }
  console.log('Publishing checks passed: new en/ko/ja posts, Markdown, categories, authors, search, RSS, sitemap, Pages paths, draft exclusion, invalid route/category rejection.');
} finally {
  await rm(fixture, { recursive: true, force: true });
}
