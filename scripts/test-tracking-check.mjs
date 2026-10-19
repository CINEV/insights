import assert from 'node:assert/strict';
import test from 'node:test';
import { trackingReferences } from './lib/tracking-check.mjs';

test('allow prose, escaped code, ordinary links and metadata mentioning analytics', () => {
  const html = `<p><code>dataLayer</code>도 삭제했다.</p>
    <pre><code>window.dataLayer = [];
    &lt;script src="https://www.googletagmanager.com/gtag/js"&gt;&lt;/script&gt;</code></pre>
    <a href="https://www.google-analytics.com/">Reference</a>
    <!-- gtag('config', 'example'); -->
    <script type="application/ld+json">{"description":"gtag() and dataLayer"}</script>
    <script type="application/json">{"code":"window.dataLayer = []"}</script>
    <meta name="google-site-verification" content="example">`;
  assert.deepEqual(trackingReferences('post/index.html', html), []);
  assert.deepEqual(trackingReferences('search-index.json', '[{"title":"dataLayer 설명"}]'), []);
  assert.deepEqual(trackingReferences('feed.xml', '<description><![CDATA[window.dataLayer = []]]></description>'), []);
  assert.deepEqual(trackingReferences('llms.txt', 'dataLayer 설명'), []);
});

test('reject executable tracking scripts and handlers, including redirect and 404 pages', () => {
  for (const html of [
    '<script>window.dataLayer = [];</script>',
    '<script type="module">gtag("event", "page_view");</script>',
    '<script type="text/javascript">__gaTracker("send", "pageview");</script>',
    '<script src="https://www.googletagmanager.com/gtag/js?id=example"></script>',
    '<script src="/insights/analytics.js?v=1"></script>',
    '<button onclick="gtag(\'event\', \'click\')">Click</button>',
    '<a href="javascript:gtag(\'event\', \'click\')">Click</a>',
  ]) {
    assert(trackingReferences('404.html', html).length, html);
    assert(trackingReferences('redirect/index.html', html).length, html);
  }
  assert(trackingReferences('site.js', 'window.dataLayer = [];').length);
  assert(trackingReferences('site.mjs', 'gtag("config", "example");').length);
});

test('reject resource requests while allowing similarly named third-party hosts', () => {
  for (const html of [
    '<link rel="dns-prefetch" href="//www.googletagmanager.com">',
    '<link rel="preconnect" href="https://region1.google-analytics.com">',
    '<noscript><iframe src="https://www.googletagmanager.com/ns.html"></iframe></noscript>',
    '<img src="https://www.google-analytics.com/collect">',
    '<img srcset="/local.png 1x, https://www.google-analytics.com/collect 2x">',
    '<style>.pixel { background: url(https://www.google-analytics.com/collect) }</style>',
  ]) assert(trackingReferences('index.html', html).length, html);
  assert(trackingReferences('site.css', '@import "https://www.googletagmanager.com/example.css";').length);
  assert.deepEqual(trackingReferences('index.html', '<img src="https://google-analytics.com.example.org/image.png">'), []);
});
