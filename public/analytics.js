(() => {
  const script = document.currentScript;
  if (!script || window.location.origin !== script.dataset.origin) return;
  const tag = script.dataset.tag;
  if (!tag || !/^(GT|G)-[A-Z0-9]+$/.test(tag) || window.cinevAnalyticsLoaded) return;
  window.cinevAnalyticsLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', tag);
  const loader = document.createElement('script');
  loader.async = true;
  loader.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(tag);
  document.head.appendChild(loader);
})();
