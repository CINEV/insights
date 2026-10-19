import { load } from 'cheerio';

const trackingCode = /\b(?:gtag|__gaTracker)\s*\(|\b(?:dataLayer|_gaq)\b|(?:googletagmanager|google-analytics)\.com/i;
const executableType = /^(?:(?:text|application)\/(?:java|ecma)script|text\/javascript1\.[0-5]|module)$/i;
const resourceRels = new Set(['stylesheet', 'preload', 'modulepreload', 'prefetch', 'preconnect', 'dns-prefetch']);

function trackingUrl(value) {
  try {
    const url = new URL(value, 'https://local.invalid/');
    return /(?:^|\.)(?:googletagmanager|google-analytics)\.com$/i.test(url.hostname)
      || /(?:^|\/)analytics\.js$/i.test(url.pathname);
  } catch { return false; }
}

function inspectCss(source, report) {
  // Only URL-bearing CSS constructs fetch resources; ordinary text is inert.
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of css.matchAll(/(?:url\(\s*|@import\s+)(?:"([^"]*)"|'([^']*)'|([^\s;)]+))/gi)) {
    if (trackingUrl(match[1] ?? match[2] ?? match[3])) report('CSS resource');
  }
}

export function trackingReferences(file, source) {
  const found = new Set();
  const report = kind => found.add(kind);
  if (/\.(?:js|mjs)$/i.test(file)) {
    if (trackingCode.test(source)) report('JavaScript');
  } else if (/\.css$/i.test(file)) {
    inspectCss(source, report);
  } else if (/\.(?:html|svg)$/i.test(file)) {
    const $ = load(source, file.endsWith('.svg') ? { xmlMode: true } : { scriptingEnabled: false });
    $('*').each((_, element) => {
      const node = $(element);
      if (node.parents('template').length) return;
      const tag = element.name.toLowerCase();
      const executable = tag === 'script' && (!node.attr('type')?.trim() || executableType.test(node.attr('type').trim()));
      if (executable && trackingCode.test(node.text())) report('inline JavaScript');
      if (tag === 'style') inspectCss(node.text(), report);
      if (node.attr('style')) inspectCss(node.attr('style'), report);
      for (const [name, value] of Object.entries(element.attribs || {})) {
        if (/^on/i.test(name) && trackingCode.test(value)) report('event handler');
        if (/^(?:href|xlink:href)$/i.test(name) && /^\s*javascript:/i.test(value) && trackingCode.test(value)) report('JavaScript URL');
      }
      const attributes = executable ? ['src', 'href', 'xlink:href']
        : ['img', 'iframe', 'embed', 'audio', 'video', 'source', 'track', 'input'].includes(tag) ? ['src', 'poster']
        : tag === 'object' ? ['data']
        : tag === 'image' ? ['href', 'xlink:href']
        : tag === 'link' && (node.attr('rel') || '').toLowerCase().split(/\s+/).some(rel => resourceRels.has(rel)) ? ['href']
        : [];
      for (const name of attributes) if (node.attr(name) && trackingUrl(node.attr(name))) report(`${tag}[${name}]`);
      if (['img', 'source'].includes(tag)) {
        for (const candidate of (node.attr('srcset') || '').split(',')) {
          if (trackingUrl(candidate.trim().split(/\s+/)[0])) report(`${tag}[srcset]`);
        }
      }
    });
  }
  // JSON, XML feeds and plain text are data, not executable page scripts.
  return [...found];
}
