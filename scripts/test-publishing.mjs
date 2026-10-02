import assert from 'node:assert/strict';
import { cp, mkdtemp, readdir, readFile, writeFile, symlink, rm } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { load } from 'cheerio';
import { randomUUID } from 'node:crypto';

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
  const reservedScaffold = spawnSync(process.execPath, ['scripts/new-post.mjs', 'insights', '--title', 'Reserved prefix', '--lang', 'en'], { cwd: fixture, encoding: 'utf8' });
  assert.notEqual(reservedScaffold.status, 0, 'Scaffold must reject the Pages mirror prefix');
  assert.match(reservedScaffold.stdout + reservedScaffold.stderr, /예약|reserved|사용 중/);
  const cases = [['en', 'tutorials'], ['ko', 'tutorials-ko'], ['ja', 'tutorials-ja']];
  const rssGuids = new Map();
  for (const [lang, category] of cases) {
    run(process.execPath, ['scripts/new-post.mjs', `publishing-fixture-${lang}`, '--title', `Publishing fixture ${lang}`, '--lang', lang, '--category', category, '--tags', `publishing-fixture-${lang}`, ...(lang === 'en' ? ['--image', '/insights/wp-content/uploads/2026/03/cinev-bi-white.png', '--image-alt', 'Publishing cover'] : [])]);
    const file = join(fixture, 'content/posts', lang, `publishing-fixture-${lang}.md`);
    const source = await readFile(file, 'utf8');
    assert.match(source, /draft: true/);
    const guid = source.match(/^rssGuid: "(urn:uuid:[0-9a-f-]{36})"$/m)?.[1];
    assert(guid, 'Scaffold must persist a stable RSS GUID');
    rssGuids.set(lang, guid);
    await writeFile(file, source.replace('draft: true', 'draft: false\ntranslationKey: "publishing-translations"') + '\n## Publishing body\n\n**Markdown works.**\n\n- First\n- Second\n\n[Home](/insights/)\n\n<img src="/insights/wp-content/uploads/2026/03/cinev-bi-white.png" srcset="/insights/wp-content/uploads/2026/03/cinev-bi-white.png 1x,/insights/wp-content/uploads/2026/03/cinev-bi-black.png 2x" alt="RSS body image">\n');
  }
  run(process.execPath, ['scripts/new-post.mjs', 'publishing-draft-fixture', '--title', 'PUBLISHING_DRAFT_MUST_STAY_PRIVATE', '--lang', 'ko', '--tags', 'publishing-draft-tag']);
  const draftTranslation = join(fixture, 'content/posts/ko/publishing-draft-fixture.md');
  await writeFile(draftTranslation, (await readFile(draftTranslation, 'utf8')).replace('draft: true', 'draft: true\ntranslationKey: "publishing-draft-translations"'));
  await writeFile(join(fixture, 'content/pages/publishing-draft-translation-source.md'), '---\ntitle: "Published translation source"\ndate: "2026-10-02T12:00:00+09:00"\nlang: "en"\npath: "/insights/publishing-draft-translation-source/"\ntranslationKey: "publishing-draft-translations"\n---\n\nPublished source with an unfinished translation.\n');
  const overrideFile = join(fixture, 'content/posts/ko/publishing-fixture-ko.md');
  await writeFile(overrideFile, (await readFile(overrideFile, 'utf8')).replace('draft: false', 'draft: false\nseoTitle: "Custom SEO title"\ndescription: "Custom search description"\nsocialImage: "/insights/wp-content/uploads/2026/03/cinev-bi-black.png"'));
  const noindexFile = join(fixture, 'content/posts/ja/publishing-fixture-ja.md');
  await writeFile(noindexFile, (await readFile(noindexFile, 'utf8')).replace('draft: false', 'draft: false\nnoindex: true'));
  run('npm', ['run', 'build']);
  const dist = join(fixture, 'dist');
  const read = path => readFile(join(dist, path), 'utf8');
  const search = JSON.parse(await read('search-index.json'));
  const feed = await read('all/feed.xml');
  assert.equal(new Set(rssGuids.values()).size, cases.length, 'Scaffolds need distinct RSS GUIDs');
  for (const prefix of ['', 'ko/', 'ja/', 'all/']) {
    const languageFeed = await read(`${prefix}feed.xml`);
    for (const alias of [`${prefix}feed/index.html`, `insights/${prefix}feed.xml`, `insights/${prefix}feed/index.html`]) assert.equal(await read(alias), languageFeed);
  }
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
    assert(feed.includes(path));
    const xml = load(await read(`${prefix}feed.xml`), { xmlMode: true });
    const item = xml('item').filter((_, element) => xml(element).children('link').text() === 'https://cinev.com' + path);
    assert.equal(item.length, 1);
    assert.equal(item.children('guid').text(), rssGuids.get(lang));
    assert.equal(item.children('guid').attr('isPermaLink'), 'false');
    assert.equal(item.children().filter((_, element) => element.name === 'dc:creator').text(), 'CineV');
    assert(item.children('category').map((_, element) => xml(element).text()).get().includes(`publishing-fixture-${lang}`));
    const rssBody = load(item.children().filter((_, element) => element.name === 'content:encoded').text(), null, false);
    assert.equal(rssBody('a').last().attr('href'), 'https://cinev.com/insights/');
    assert.equal(rssBody('img[alt="RSS body image"]').attr('src'), 'https://cinev.com/insights/wp-content/uploads/2026/03/cinev-bi-white.png');
    assert.equal(rssBody('img[alt="RSS body image"]').attr('srcset'), 'https://cinev.com/insights/wp-content/uploads/2026/03/cinev-bi-white.png 1x, https://cinev.com/insights/wp-content/uploads/2026/03/cinev-bi-black.png 2x');
    for (const [other] of cases) if (other !== lang) assert(!xml('channel').text().includes(rssGuids.get(other)));
    assert.equal($('link[type="application/rss+xml"]').attr('href'), `/insights/${prefix}feed.xml`);
    const alternates = Object.fromEntries([...$('head link[hreflang]')].map(element => [$(element).attr('hreflang'), $(element).attr('href')]));
    if (lang === 'ja') {
      assert.deepEqual(alternates, {}, 'Noindex translations must not emit hreflang');
      assert.equal($('.cinev-translations').length, 0);
    } else {
      assert.deepEqual(alternates, {
        en: 'https://cinev.com/insights/publishing-fixture-en/',
        ko: 'https://cinev.com/insights/ko/publishing-fixture-ko/',
      });
      assert.equal($('.cinev-translations a').length, 1);
      assert.equal($('.cinev-translations a').attr('href'), lang === 'en' ? '/insights/ko/publishing-fixture-ko/' : '/insights/publishing-fixture-en/');
      assert.equal($('.cinev-translations [aria-current="page"]').attr('lang'), lang);
    }
    assert.equal(sitemap.includes(path), lang !== 'ja');
    assert.equal((await read('llms.txt')).includes(path), lang !== 'ja');
    assert((await read(`${prefix}index.html`)).includes(path));
    assert((await read(`${prefix}tag/publishing-fixture-${lang}/index.html`)).includes(path));
    const authorRedirect = load(await read('author/user/index.html'));
    assert.equal(authorRedirect('meta[http-equiv="refresh"]').attr('content'), '0; url=/insights/');
    assert(!sitemap.includes('/author/'));
    const tag = load(await read(`${prefix}tag/publishing-fixture-${lang}/index.html`));
    assert(tag('meta[name="robots"]').attr('content').includes('noindex'));
    assert(!sitemap.includes('/tag/'));
    assert.equal($('title').text(), lang === 'ko' ? 'Custom SEO title' : `Publishing fixture ${lang} : CineV`);
    if (lang === 'ko') {
      assert.equal($('meta[name="description"]').attr('content'), 'Custom search description');
      assert.equal($('meta[property="og:image"]').attr('content'), 'https://cinev.com/insights/wp-content/uploads/2026/03/cinev-bi-black.png');
    }
    if (lang === 'ja') {
      assert($('meta[name="robots"]').attr('content').includes('noindex'));
      assert.equal($('meta[property="og:image"]').attr('content'), 'https://cinev.com/insights/wp-content/uploads/2026/03/videoframe_29767.png');
    }
    assert((await read(`insights/${prefix}publishing-fixture-${lang}/index.html`)).includes('Publishing body'));
  }
  const unfinished = load(await read('publishing-draft-translation-source/index.html'));
  assert.equal(unfinished('head link[hreflang]').length, 0, 'Draft counterpart must not be advertised');
  assert.equal(unfinished('.cinev-translations').length, 0);
  await assert.rejects(read('ja/home-日本語/index.html'), { code: 'ENOENT' });
  await assert.rejects(read('insights/ja/home-日本語/index.html'), { code: 'ENOENT' });
  for (const index of [JSON.stringify(search), feed, sitemap, await read('llms.txt')]) assert(!index.includes('/ja/home-日本語/'));
  const originalPost = load(await read('empowering-seedance-2-5-from-vision-to-sequence/index.html'));
  let tutorialCount = 0;
  for (const file of await readdir(join(dist, 'tutorials'), { recursive: true })) {
    if (file.endsWith('index.html')) tutorialCount += load(await read(`tutorials/${file}`))('.ast-article-post').length;
  }
  assert.match(originalPost('.uagb-tax-link[href="/insights/tutorials/"]').parent().text(), new RegExp(`\\(${tutorialCount}\\)`));
  for (const value of [JSON.stringify(search), feed, sitemap, await read('llms.txt'), await read('ko/index.html')]) {
    assert(!value.includes('publishing-draft-fixture') && !value.includes('PUBLISHING_DRAFT_MUST_STAY_PRIVATE'));
  }
  await assert.rejects(read('ko/publishing-draft-fixture/index.html'), { code: 'ENOENT' });
  await assert.rejects(read('insights/ko/publishing-draft-fixture/index.html'), { code: 'ENOENT' });
  await assert.rejects(read('ko/tag/publishing-draft-tag/index.html'), { code: 'ENOENT' });
  // Existing imported translations remain editable after migration. Exercise
  // the actual default verification commands against their changed state.
  const importedDraft = join(fixture, 'content/posts/1066-vrm----------ai.md');
  const importedNoindex = join(fixture, 'content/posts/1235-seedance-2-5.md');
  await writeFile(importedDraft, (await readFile(importedDraft, 'utf8')).replace(/^---\n/, '---\ndraft: true\n'));
  const movedPath = '/insights/ja/seedance-edited-fixture/';
  await writeFile(importedNoindex, (await readFile(importedNoindex, 'utf8')).replace(/^---\n/, '---\nnoindex: true\n').replace(/^path:.*$/m, `path: ${JSON.stringify(movedPath)}`));
  run('npm', ['run', 'build']);
  for (const script of ['verify-seo.mjs', 'verify-rss.mjs', 'verify-legacy-links.mjs']) run(process.execPath, ['scripts/' + script]);
  run('python3', ['scripts/verify-build.py']);
  assert(JSON.parse(await read('search-index.json')).some(entry => entry.path === movedPath), 'Edited imported path must be published');
  assert((await read('ja/feed.xml')).includes('https://cinev.com' + movedPath), 'RSS must use the edited imported path');
  const related = load(await read('ja/corporate-ip-ai-anime-workflow/index.html'));
  assert.equal(related('.ast-single-related-posts-container .post-1066').length, 0, 'Draft imported related post must disappear');
  assert(related(`.ast-single-related-posts-container .post-1235 a[href="${movedPath}"]`).length > 0, 'Still-public noindex related post must use its current path');
  const stillPublic = load(await read('2026-vrm-file-beginners-guide-cinev-tutorial/index.html'));
  assert.equal(stillPublic('head link[hreflang]').length, 0, 'Draft imported counterpart must leave no hreflang');
  const seedance = load(await read('empowering-seedance-2-5-from-vision-to-sequence/index.html'));
  assert.deepEqual([...seedance('head link[hreflang]')].map(node => seedance(node).attr('hreflang')).sort(), ['en', 'ko']);
  for (const [command, args] of [[process.execPath, ['scripts/verify-seo.mjs', '--migration-baseline']], ['python3', ['scripts/verify-build.py', '--migration-baseline']]]) {
    const baseline = spawnSync(command, args, { cwd: fixture, encoding: 'utf8', timeout: 120_000 });
    assert.notEqual(baseline.status, 0, 'Migration audit must still detect changed original publication');
    assert.match(baseline.stdout + baseline.stderr, /Missing required route|ENOENT|Migration translation/);
  }
  // Editors can change frontmatter by hand; invalid routes must fail before
  // an existing archive or another article is overwritten.
  const invalid = join(fixture, 'content/posts/en/invalid-fixture.md');
  const published = await readFile(join(fixture, 'content/posts/en/publishing-fixture-en.md'), 'utf8');
  const distinctGuid = published.replace(/^rssGuid:.*$/m, `rssGuid: "urn:uuid:${randomUUID()}"`);
  const independent = distinctGuid.replace(/^translationKey:.*\n/m, '');
  for (const [source, message] of [
    [independent, /Duplicate content path/],
    [independent.replace('/insights/publishing-fixture-en/', '/insights/insights/'), /reserved path/],
    [independent.replace('/insights/publishing-fixture-en/', '/insights/insights/nested/'), /reserved path/],
    [independent.replace('/insights/publishing-fixture-en/', '/insights/tutorials/'), /collides with another page or archive/],
    [independent.replace('/insights/publishing-fixture-en/', '/insights/invalid\/\/fixture/'), /absolute local path/],
    [independent.replace('/insights/publishing-fixture-en/', '/insights/invalid-fixture/').replace('categories: ["tutorials"]', 'categories: ["tutorials-ko"]'), /category language mismatch/],
    [published.replace(/^translationKey:.*\n/m, '').replace('/insights/publishing-fixture-en/', '/insights/invalid-fixture/'), /Duplicate RSS GUID/],
    [distinctGuid.replace('/insights/publishing-fixture-en/', '/insights/invalid-fixture/'), /Duplicate translation language/],
  ]) {
    await writeFile(invalid, source);
    const result = spawnSync('npm', ['run', 'build'], { cwd: fixture, encoding: 'utf8', timeout: 120_000 });
    assert.notEqual(result.status, 0, 'Invalid content unexpectedly built successfully');
    assert.match(result.stdout + result.stderr, message);
  }
  console.log('Publishing checks passed: new en/ko/ja posts, Markdown, categories, author redirects, search, language RSS/GUIDs/body URLs, sitemap, SEO defaults/overrides/noindex, Pages paths, reciprocal translations, draft/noindex translation exclusion, draft410 exclusion, existing imported draft/noindex/path edits, optional migration baseline, invalid route/category/GUID/translation rejection.');
} finally {
  await rm(fixture, { recursive: true, force: true });
}
