import { mkdir, readFile, readdir, lstat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const languages = ['en', 'ko', 'ja'];
const valueOptions = new Set(['title', 'lang', 'category', 'tag', 'tags', 'excerpt', 'author', 'image', 'image-alt']);

function argsFor(values) {
  const options = { lang: 'ko', author: 'user', category: [], tags: [] };
  let slug;
  const provided = new Set();
  for (let index = 0; index < values.length; index++) {
    const argument = values[index];
    if (argument === '--') continue;
    if (argument === '--help' || argument === '-h') { options.help = true; continue; }
    if (argument === '--list-categories') { options.listCategories = true; continue; }
    if (!argument.startsWith('-')) {
      if (slug !== undefined) throw new Error('슬러그는 하나만 지정하세요.');
      slug = argument;
      continue;
    }
    const match = /^--([a-z-]+)(?:=(.*))?$/.exec(argument);
    if (!match || !valueOptions.has(match[1])) throw new Error(`알 수 없는 옵션: ${argument}`);
    const key = match[1];
    let value = match[2];
    if (value === undefined) {
      value = values[++index];
      if (value === undefined || value.startsWith('--')) throw new Error(`--${key}의 값이 필요합니다.`);
    }
    if (!value.trim()) throw new Error(`--${key}에 빈 값을 사용할 수 없습니다.`);
    if (['category', 'tag', 'tags'].includes(key)) {
      const items = value.split(',').map(item => item.trim());
      if (items.some(item => !item)) throw new Error(`--${key} 목록에 빈 항목이 있습니다.`);
      options[key === 'category' ? 'category' : 'tags'].push(...items);
    } else {
      if (provided.has(key)) throw new Error(`--${key}는 한 번만 지정하세요.`);
      provided.add(key);
      options[key] = value.trim();
    }
  }
  if (!languages.includes(options.lang)) throw new Error('--lang은 en, ko, ja 중 하나여야 합니다.');
  return { ...options, slug };
}

function language(value) { return String(value || 'en').toLowerCase().split(/[-_]/)[0]; }
function prefix(lang) { return `/insights/${lang === 'en' ? '' : `${lang}/`}`; }
function validSlug(value, label = '슬러그') {
  if (typeof value !== 'string' || value.length > 100 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) {
    throw new Error(`${label}는 소문자 영문·숫자와 단어 사이 하이픈으로 작성하세요(최대 100자).`);
  }
  return value;
}

function publicPath(value) {
  if (typeof value !== 'string') throw new Error('콘텐츠 path는 문자열이어야 합니다.');
  const pathname = /^https?:\/\//.test(value) ? new URL(value).pathname : value;
  if (/[?#]/.test(pathname)) throw new Error(`콘텐츠 path에 쿼리나 앵커를 사용할 수 없습니다: ${value}`);
  const decoded = decodeURI(pathname).replace(/\/+$/, '');
  const hasPrefix = decoded === '/insights' || decoded.startsWith('/insights/');
  return `${hasPrefix ? decoded : `/insights${decoded.startsWith('/') ? '' : '/'}${decoded}`}/`.normalize('NFC').toLowerCase();
}

// Only the route fields need reading. Support the one-line scalars and flow
// or block lists used in this repository, without introducing a YAML package.
function withoutComment(value) {
  let quote;
  for (let index = 0; index < value.length; index++) {
    const character = value[index];
    if (quote === '"' && character === '\\') { index++; continue; }
    if (quote === "'" && character === "'" && value[index + 1] === "'") { index++; continue; }
    if (quote && character === quote) quote = undefined;
    else if (!quote && (character === '"' || character === "'")) quote = character;
    else if (!quote && character === '#' && (index === 0 || /\s/.test(value[index - 1]))) return value.slice(0, index).trim();
  }
  return value.trim();
}

function scalar(value) {
  value = withoutComment(value);
  if (!value || ['null', '~'].includes(value)) return undefined;
  if (value.startsWith('"')) return JSON.parse(value);
  if (value.startsWith("'")) {
    if (!/^'(?:[^']|'')*'$/.test(value)) throw new Error('작은따옴표 문자열을 읽을 수 없습니다.');
    return value.slice(1, -1).replace(/''/g, "'");
  }
  if (/^[!&*|>\[{]/.test(value)) throw new Error('경로 필드에는 한 줄 문자열 또는 목록을 사용하세요.');
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
  if (value === 'true' || value === 'false') return value === 'true';
  return value;
}

function flowList(value) {
  value = withoutComment(value);
  if (!value.endsWith(']')) throw new Error('목록의 닫는 대괄호가 없습니다.');
  const tokens = [];
  let quote, start = 1;
  for (let index = 1; index < value.length - 1; index++) {
    const character = value[index];
    if (quote === '"' && character === '\\') { index++; continue; }
    if (quote === "'" && character === "'" && value[index + 1] === "'") { index++; continue; }
    if (quote && character === quote) quote = undefined;
    else if (!quote && (character === '"' || character === "'")) quote = character;
    else if (!quote && character === ',') { tokens.push(value.slice(start, index)); start = index + 1; }
  }
  const last = value.slice(start, -1);
  if (last.trim()) tokens.push(last);
  return tokens.map(scalar);
}

function routeFields(source, file) {
  const match = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);
  if (!match) throw new Error(`${file}: frontmatter를 읽을 수 없습니다.`);
  const lines = match[1].split(/\r?\n/);
  const data = {};
  for (let index = 0; index < lines.length; index++) {
    const field = /^(path|lang|categories|tags):\s*(.*)$/.exec(lines[index]);
    if (!field) continue;
    const key = field[1];
    if (Object.hasOwn(data, key)) throw new Error(`${file}: ${key}가 중복되어 있습니다.`);
    let value = withoutComment(field[2]);
    try {
      if (key === 'categories' || key === 'tags') {
        if (!value) {
          const items = [];
          while (index + 1 < lines.length && /^\s+-\s+/.test(lines[index + 1])) items.push(scalar(lines[++index].replace(/^\s+-\s+/, '')));
          data[key] = items;
        } else {
          if (!value.startsWith('[')) throw new Error(`${key}는 목록이어야 합니다.`);
          while (!value.endsWith(']') && index + 1 < lines.length && /^\s/.test(lines[index + 1])) value += ` ${withoutComment(lines[++index])}`;
          data[key] = flowList(value);
        }
        if (data[key].some(item => typeof item !== 'string' && typeof item !== 'number')) throw new Error(`${key}에는 문자열이나 ID만 사용할 수 있습니다.`);
      } else data[key] = scalar(value);
    } catch (error) { throw new Error(`${file}: ${key} 읽기 실패 — ${error.message}`); }
  }
  if (data.lang !== undefined && typeof data.lang !== 'string') throw new Error(`${file}: lang은 문자열이어야 합니다.`);
  return data;
}

async function markdownFiles(directory) {
  let entries;
  try { entries = await readdir(directory, { withFileTypes: true }); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) throw new Error(`주소 충돌 검증을 위해 심볼릭 링크를 제거하세요: ${relative(root, path)}`);
    if (entry.isDirectory()) files.push(...await markdownFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.md')) files.push(path);
  }
  return files;
}

async function reservedPaths(catalog) {
  const reserved = new Map();
  const reserve = (path, reason) => { if (path) reserved.set(publicPath(path), reason); };
  for (const group of ['routes', 'posts', 'pages', 'categories', 'tags', 'authors']) {
    for (const item of catalog[group] || []) reserve(item.path, `기존 ${group} 주소`);
  }
  reserve('/insights/insights/', 'Pages 호환 배포 경로');
  for (const lang of languages) {
    reserve(prefix(lang), '언어별 글 목록');
    for (const slug of ['blog', 'tag', 'author', 'page', 'feed', 'assets', 'wp-content', 'wp-includes', '404']) reserve(`${prefix(lang)}${slug}/`, '블로그의 예약 경로');
  }
  for (const collection of ['posts', 'pages']) {
    const directory = join(root, 'content', collection);
    for (const file of await markdownFiles(directory)) {
      const label = relative(root, file);
      const data = routeFields(await readFile(file, 'utf8'), label);
      const lang = language(data.lang);
      const id = relative(directory, file).replace(/\.md$/, '').split('\\').join('/');
      reserve(data.path || `${prefix(lang)}${id}/`, label);
      if (collection !== 'posts') continue;
      for (const kind of ['categories', 'tags']) {
        for (const value of data[kind] || []) {
          const known = (catalog[kind] || []).find(term => String(term.id) === String(value) || term.slug === value);
          reserve(known?.path || `${prefix(lang)}${kind === 'tags' ? 'tag/' : ''}${value}/`, `${label}의 ${kind} 목록`);
        }
      }
    }
  }
  return reserved;
}

function termLanguage(term) { return language(term.lang || (term.path?.startsWith('/insights/ko/') ? 'ko' : term.path?.startsWith('/insights/ja/') ? 'ja' : 'en')); }
function categoryList(catalog, lang) { return (catalog.categories || []).filter(term => termLanguage(term) === lang); }

function printCategories(catalog, lang) {
  console.log(`\n${lang} 카테고리:`);
  for (const term of categoryList(catalog, lang)) console.log(`  ${term.slug} (${term.id}) — ${String(term.name).replace(/<[^>]*>/g, '')}`);
}

function seoulDate() {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(new Date()).map(part => [part.type, part.value]));
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}+09:00`;
}

async function main() {
  const options = argsFor(process.argv.slice(2));
  const catalog = JSON.parse(await readFile(join(root, 'src', 'config', 'catalog.json'), 'utf8'));
  if (options.help) {
    console.log(`새 글 초안 생성\n\nnpm run post:new -- slug --title "제목" --lang ko --category tutorials-ko\n\n옵션:\n  --title TEXT       제목(필수)\n  --lang en|ko|ja    언어(기본 ko)\n  --category SLUG    선택 언어의 카테고리 slug 또는 ID; 반복·쉼표 목록 가능\n  --tags SLUG,...    선택 언어의 기존 태그 slug/ID 또는 새 태그 slug; --tag 반복 가능\n  --excerpt TEXT    목록·검색·RSS 요약\n  --author SLUG     기존 작성자 slug 또는 ID(기본 user/CineV)\n  --image PATH      대표 이미지의 로컬 공개 경로 /insights/...\n  --image-alt TEXT  대표 이미지 대체 텍스트\n  --list-categories 선택 언어의 카테고리 목록\n  --help, -h        도움말\n\n슬러그: 소문자 영문·숫자와 단어 사이 하이픈, 최대 100자.\n기존 파일·공개 주소는 덮어쓰지 않습니다. draft: true로 생성됩니다.\n이미지 파일은 별도로 public/에 추가하세요. 생성 시 파일 존재 여부는 검사하지 않습니다.\n초안을 확인한 뒤 draft: false로 변경하고 빌드·배포하세요.`);
    console.log('\n작성자:');
    for (const author of catalog.authors || []) console.log(`  ${author.slug} (${author.id}) — ${author.name}`);
    printCategories(catalog, options.lang);
    return;
  }
  if (options.listCategories) { printCategories(catalog, options.lang); return; }
  validSlug(options.slug);
  if (!options.title) throw new Error('--title로 제목을 지정하세요. --help에서 사용법을 확인할 수 있습니다.');
  const available = categoryList(catalog, options.lang);
  const categories = [...new Set(options.category.map(value => {
    const term = available.find(item => item.slug === value || String(item.id) === value);
    if (!term) throw new Error(`${options.lang} 카테고리가 아닙니다: ${value}. --list-categories로 확인하세요.`);
    return term.slug;
  }))];
  const author = (catalog.authors || []).find(item => item.slug === options.author || String(item.id) === options.author);
  if (!author) throw new Error(`기존 작성자가 아닙니다: ${options.author}. --help에서 작성자 목록을 확인하세요.`);
  const tags = [...new Set(options.tags.map(value => {
    const known = (catalog.tags || []).find(item => item.slug === value || String(item.id) === value);
    if (known && termLanguage(known) !== options.lang) throw new Error(`${options.lang} 태그가 아닙니다: ${value} (${termLanguage(known)} 태그)`);
    return known?.slug || validSlug(value, '새 태그');
  }))];
  if (options['image-alt'] && !options.image) throw new Error('--image-alt를 사용하려면 --image도 지정하세요.');
  if (options.image && (!options.image.startsWith('/insights/') || options.image.length === '/insights/'.length || /[\\\x00-\x1f]/.test(options.image) || /(?:^|\/)\.\.?(?:\/|$)|[?#]/.test(options.image) || /%(?:2e|2f|5c)/i.test(options.image))) {
    throw new Error('--image에는 /insights/로 시작하는 로컬 공개 경로를 지정하세요(상위 경로·쿼리·앵커 제외).');
  }
  const path = `${prefix(options.lang)}${options.slug}/`;
  const collision = (await reservedPaths(catalog)).get(publicPath(path));
  if (collision) throw new Error(`이미 사용 중인 공개 주소입니다: ${path} (${collision})`);
  const destination = join(root, 'content', 'posts', options.lang, `${options.slug}.md`);
  for (const directory of [join(root, 'content'), join(root, 'content', 'posts'), dirname(destination)]) {
    try { if ((await lstat(directory)).isSymbolicLink()) throw new Error(`심볼릭 링크 디렉토리에는 글을 만들 수 없습니다: ${relative(root, directory)}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  const data = {
    title: options.title, date: seoulDate(), lang: options.lang, path,
    rssGuid: `urn:uuid:${randomUUID()}`,
    categories, tags, author: author.slug, excerpt: options.excerpt || '',
    ...(options.image ? { image: options.image, imageAlt: options['image-alt'] || '' } : {}),
    draft: true,
  };
  const starters = { en: '## Getting started\n\nWrite the article in Markdown.', ko: '## 시작하기\n\n본문을 Markdown으로 작성하세요.', ja: '## はじめに\n\n本文をMarkdownで記述してください。' };
  const frontmatter = Object.entries(data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
  await mkdir(dirname(destination), { recursive: true });
  try { await writeFile(destination, `---\n${frontmatter}\n---\n\n${starters[options.lang]}\n`, { flag: 'wx' }); }
  catch (error) { if (error.code === 'EEXIST') throw new Error(`기존 파일은 덮어쓰지 않습니다: ${relative(root, destination)}`); throw error; }
  console.log(`초안 생성: ${relative(root, destination)}\n공개 주소: ${path}\n상태: draft: true`);
}

main().catch(error => { console.error(`오류: ${error.message}`); process.exitCode = 1; });
