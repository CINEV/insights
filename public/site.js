(() => {
  const mobileMedia = matchMedia('(max-width: 921px)');
  const popup = document.getElementById('ast-mobile-popup');
  const toggleButtons = [...document.querySelectorAll('.main-header-menu-toggle')];
  let previousFocus;
  function updateViewport() {
    document.body.classList.toggle('ast-header-break-point', mobileMedia.matches);
    document.body.classList.toggle('ast-desktop', !mobileMedia.matches);
    if (!mobileMedia.matches) setMobileMenu(false);
  }
  function setMobileMenu(open) {
    if (!popup) return;
    if (open) previousFocus = document.activeElement;
    popup.classList.toggle('active', open);
    popup.setAttribute('aria-hidden', String(!open));
    document.body.classList.toggle('cinev-mobile-menu-open', open);
    toggleButtons.forEach(button => button.setAttribute('aria-expanded', String(open)));
    if (open) popup.querySelector('button, a')?.focus();
    else if (previousFocus instanceof HTMLElement) previousFocus.focus();
  }
  popup?.setAttribute('aria-hidden', 'true');
  toggleButtons.forEach(button => button.addEventListener('click', () => setMobileMenu(!popup?.classList.contains('active'))));
  document.querySelector('.ast-mobile-popup-overlay')?.addEventListener('click', () => setMobileMenu(false));
  document.getElementById('menu-toggle-close')?.addEventListener('click', () => setMobileMenu(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') setMobileMenu(false);
    if (event.key !== 'Tab' || !popup?.classList.contains('active')) return;
    const controls = [...popup.querySelectorAll('a[href], button, [tabindex="0"]')].filter(element => element.getClientRects().length);
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  mobileMedia.addEventListener('change', updateViewport);
  updateViewport();

  document.querySelectorAll('.menu-item-has-children').forEach(item => {
    const link = item.querySelector(':scope > a');
    const controls = item.querySelectorAll(':scope > .ast-menu-toggle, :scope > a .dropdown-menu-toggle');
    function toggle(event) {
      event.preventDefault();
      event.stopPropagation();
      const open = item.classList.toggle('cinev-menu-open');
      controls.forEach(control => control.setAttribute('aria-expanded', String(open)));
      link?.setAttribute('aria-expanded', String(open));
    }
    controls.forEach(control => {
      control.addEventListener('click', toggle);
      control.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') toggle(event); });
    });
    if (link?.getAttribute('href') === '#') link.addEventListener('click', toggle);
  });

  let faqAnswerIndex = 0;
  document.querySelectorAll('.wp-block-uagb-faq').forEach(group => {
    const items = [...group.querySelectorAll('.uagb-faq-item')].filter(item => item.closest('.wp-block-uagb-faq') === group);
    const expandedItem = location.hash ? items.find(item => `#${item.id}` === location.hash) : undefined;
    const firstExpanded = group.classList.contains('uagb-faq-expand-first-true');
    const allExpanded = group.classList.contains('uagb-faq-inactive-other-false');
    const exclusive = group.getAttribute('data-faqtoggle') === 'true';
    const controls = [];
    group.removeAttribute('role');
    items.forEach((item, index) => {
      const question = item.querySelector('.uagb-faq-questions-button');
      const answer = item.querySelector('.uagb-faq-content');
      if (!question || !answer) return;
      item.removeAttribute('role');
      item.removeAttribute('tabindex');
      question.setAttribute('role', 'button');
      question.setAttribute('tabindex', '0');
      answer.id ||= `cinev-faq-answer-${faqAnswerIndex++}`;
      question.setAttribute('aria-controls', answer.id);
      function setOpen(open) {
        item.classList.toggle('uagb-faq-item-active', open);
        question.setAttribute('aria-expanded', String(open));
        answer.hidden = !open;
      }
      controls.push({ item, setOpen });
      setOpen(expandedItem ? item === expandedItem : allExpanded || (firstExpanded && index === 0) || item.classList.contains('uagb-faq-item-active'));
      const toggle = () => {
        const open = answer.hidden;
        if (open && exclusive) controls.forEach(control => { if (control.item !== item) control.setOpen(false); });
        setOpen(open);
      };
      question.addEventListener('click', toggle);
      question.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); }
      });
    });
  });

  document.querySelectorAll('.uagb-slider-container').forEach(slider => {
    const wrapper = slider.querySelector('.swiper-wrapper');
    if (!wrapper) return;
    const slides = [...wrapper.children].filter(child => child.classList.contains('swiper-slide'));
    if (!slides.length) return;
    slider.classList.add('cinev-slider-ready');
    slider.setAttribute('role', 'region');
    slider.setAttribute('aria-roledescription', 'carousel');
    slider.setAttribute('aria-label', 'CineV workflow');
    let current = 0;
    const pagination = slider.querySelector('.swiper-pagination');
    pagination?.classList.add('swiper-pagination-bullets', 'swiper-pagination-horizontal');
    slider.querySelector('.uagb-swiper')?.classList.add('swiper-horizontal');
    const bullets = slides.map((_, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'swiper-pagination-bullet';
      button.setAttribute('aria-label', `Go to slide ${index + 1}`);
      button.addEventListener('click', () => show(index));
      pagination?.append(button);
      return button;
    });
    function show(index) {
      current = (index + slides.length) % slides.length;
      wrapper.style.transform = `translate3d(${-current * 100}%, 0, 0)`;
      slides.forEach((slide, i) => {
        slide.classList.toggle('cinev-slide-active', i === current);
        slide.setAttribute('aria-hidden', String(i !== current));
        slide.inert = i !== current;
      });
      bullets.forEach((bullet, i) => {
        bullet.classList.toggle('swiper-pagination-bullet-active', i === current);
        bullet.setAttribute('aria-current', String(i === current));
      });
    }
    [['.swiper-button-prev', -1, 'Previous slide'], ['.swiper-button-next', 1, 'Next slide']].forEach(([selector, offset, label]) => {
      const control = slider.querySelector(selector);
      if (!control) return;
      control.setAttribute('role', 'button');
      control.setAttribute('tabindex', '0');
      control.setAttribute('aria-label', label);
      const move = () => show(current + offset);
      control.addEventListener('click', move);
      control.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); move(); } });
    });
    let touchStartX;
    slider.addEventListener('touchstart', event => { touchStartX = event.touches[0]?.clientX; }, { passive: true });
    slider.addEventListener('touchend', event => {
      const end = event.changedTouches[0]?.clientX;
      if (typeof touchStartX === 'number' && typeof end === 'number' && Math.abs(end - touchStartX) > 50) show(current + (end < touchStartX ? 1 : -1));
    }, { passive: true });
    show(0);
  });

  // These partner galleries used Slick's five-column (two on mobile),
  // 900 ms autoplay delay and 6000 ms slide transition in WordPress.
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.uagb-slick-carousel').forEach(gallery => {
    const slides = [...gallery.children].filter(child => child.classList.contains('spectra-image-gallery__media-wrapper'));
    if (!slides.length) return;
    const scope = gallery.closest('.wp-block-uagb-image-gallery');
    scope?.classList.add('cinev-gallery-ready');
    gallery.classList.add('cinev-gallery-ready');
    gallery.setAttribute('role', 'region');
    gallery.setAttribute('aria-roledescription', 'carousel');
    gallery.setAttribute('aria-label', 'CineV partners');
    const viewport = document.createElement('div');
    viewport.className = 'slick-list cinev-logo-viewport';
    const track = document.createElement('div');
    track.className = 'cinev-logo-track';
    slides.forEach(slide => track.append(slide));
    slides.forEach(slide => {
      const clone = slide.cloneNode(true);
      clone.removeAttribute('id');
      clone.querySelectorAll('[id]').forEach(element => element.removeAttribute('id'));
      clone.setAttribute('aria-hidden', 'true');
      clone.inert = true;
      track.append(clone);
    });
    viewport.append(track);
    gallery.append(viewport);
    let current = 0;
    let autoplayTimer;
    let transitionTimer;
    let animating = false;
    let hovered = false;
    let touchStartX;
    const columns = () => innerWidth < 767 ? 2 : 5;
    const render = animate => {
      track.style.transition = animate && !reducedMotion.matches ? 'transform 6000ms ease' : 'none';
      track.style.transform = `translate3d(${-current * viewport.clientWidth / columns()}px, 0, 0)`;
    };
    const schedule = () => {
      clearTimeout(autoplayTimer);
      if (!reducedMotion.matches && !document.hidden && !hovered && !gallery.contains(document.activeElement) && slides.length > columns() && !animating) {
        autoplayTimer = setTimeout(() => move(1), 900);
      }
    };
    function move(offset) {
      if (animating) return;
      clearTimeout(autoplayTimer);
      if (current === 0 && offset < 0) {
        current = slides.length;
        render(false);
        track.getBoundingClientRect();
      }
      current += offset;
      animating = true;
      render(true);
      transitionTimer = setTimeout(() => {
        if (current >= slides.length) { current = 0; render(false); }
        animating = false;
        schedule();
      }, reducedMotion.matches ? 0 : 6000);
    }
    const resize = () => {
      clearTimeout(transitionTimer);
      current %= slides.length;
      animating = false;
      render(false);
      schedule();
    };
    gallery.addEventListener('mouseenter', () => { hovered = true; clearTimeout(autoplayTimer); });
    gallery.addEventListener('mouseleave', () => { hovered = false; schedule(); });
    gallery.addEventListener('focusin', () => clearTimeout(autoplayTimer));
    gallery.addEventListener('focusout', () => setTimeout(schedule, 0));
    gallery.addEventListener('touchstart', event => { touchStartX = event.touches[0]?.clientX; clearTimeout(autoplayTimer); }, { passive: true });
    gallery.addEventListener('touchend', event => {
      const end = event.changedTouches[0]?.clientX;
      if (typeof touchStartX === 'number' && typeof end === 'number' && Math.abs(end - touchStartX) > 50) move(end < touchStartX ? 1 : -1);
      touchStartX = undefined;
      schedule();
    }, { passive: true });
    window.addEventListener('resize', resize, { passive: true });
    document.addEventListener('visibilitychange', schedule);
    reducedMotion.addEventListener('change', resize);
    new ResizeObserver(resize).observe(viewport);
    resize();
  });

  // The landing pages have their own Spectra header instead of #masthead.
  // Keep its normal-flow space when fixing it, as the original plugin did.
  document.querySelectorAll('.uagb-position__sticky.uagb-block-ip-header').forEach(header => {
    const placeholder = document.createElement('div');
    placeholder.className = 'cinev-sticky-placeholder';
    placeholder.setAttribute('aria-hidden', 'true');
    placeholder.hidden = true;
    header.before(placeholder);
    const originalStyles = Object.fromEntries(['top', 'left', 'width', 'zIndex'].map(key => [key, header.style[key]]));
    let start = 0;
    let left = 0;
    let width = 0;
    const release = () => {
      header.classList.remove('uagb-position__sticky--stuck');
      Object.entries(originalStyles).forEach(([key, value]) => { header.style[key] = value; });
      placeholder.hidden = true;
    };
    const update = () => {
      if (scrollY >= start) {
        placeholder.hidden = false;
        placeholder.style.height = `${header.getBoundingClientRect().height}px`;
        header.classList.add('uagb-position__sticky--stuck');
        header.style.top = '0px';
        header.style.left = `${left}px`;
        header.style.width = `${width}px`;
        header.style.zIndex = '999';
      } else release();
    };
    const measure = () => {
      release();
      const rect = header.getBoundingClientRect();
      start = rect.top + scrollY;
      left = rect.left;
      width = rect.width;
      update();
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('load', measure);
    new ResizeObserver(() => { if (!placeholder.hidden) placeholder.style.height = `${header.getBoundingClientRect().height}px`; }).observe(header);
    document.fonts?.ready.then(measure);
    measure();
  });

  // WordPress TOC blocks with pre-existing links keep their anchors. Newly
  // authored Markdown uses Astro's generated heading IDs automatically.
  document.querySelectorAll('.uagb-toc__title').forEach(title => {
    const content = title.closest('.wp-block-uagb-table-of-contents')?.querySelector('.uagb-toc__list-wrap');
    if (!content) return;
    title.setAttribute('role', 'button');
    title.setAttribute('tabindex', '0');
    title.setAttribute('aria-expanded', 'true');
    const toggle = () => { content.hidden = !content.hidden; title.setAttribute('aria-expanded', String(!content.hidden)); };
    title.addEventListener('click', toggle);
    title.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggle(); } });
  });
  const scrollTop = document.getElementById('ast-scroll-top');
  const updateScroll = () => { if (scrollTop) scrollTop.style.display = scrollY > 400 ? 'block' : 'none'; };
  scrollTop?.setAttribute('role', 'button');
  scrollTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  scrollTop?.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); scrollTop.click(); } });
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Reuse the generated archive pages for the original infinite-scroll UI.
  // The regular links remain a usable fallback if a request cannot complete.
  const infinite = document.querySelector('.ast-ajax-pagination-wrapper .ast-pagination-infinite[data-next]');
  const archiveRow = document.querySelector('#main > .ast-row');
  const archivePagination = document.querySelector('.cinev-pagination');
  if (infinite && archiveRow && archivePagination && 'IntersectionObserver' in window && !new URLSearchParams(location.search).has('s')) {
    const seenPages = new Set([new URL(location.href).pathname]);
    const seenPosts = new Set([...archiveRow.querySelectorAll(':scope > article[id]')].map(article => article.id));
    const loader = infinite.querySelector('.ast-loader');
    let loading = false;
    let stopped = false;
    infinite.setAttribute('aria-live', 'polite');
    document.body.classList.add('cinev-infinite-ready');
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) loadMore();
    }, { rootMargin: '0px 0px 200px 0px' });
    function finish() {
      stopped = true;
      observer.disconnect();
      infinite.removeAttribute('data-next');
      const message = document.createElement('span');
      message.className = 'ast-load-more no-more active';
      message.style.display = 'inline-block';
      message.textContent = 'No more posts to show.';
      infinite.replaceChildren(message);
    }
    async function loadMore() {
      if (loading || stopped) return;
      const next = infinite.getAttribute('data-next');
      if (!next) return finish();
      loading = true;
      archiveRow.setAttribute('aria-busy', 'true');
      if (loader) loader.style.display = 'block';
      try {
        const url = new URL(next, location.href);
        if (url.origin !== location.origin || seenPages.has(url.pathname)) throw new Error('Invalid archive continuation');
        const response = await fetch(url.href);
        if (!response.ok) throw new Error('Archive request failed');
        const page = new DOMParser().parseFromString(await response.text(), 'text/html');
        const posts = [...page.querySelectorAll('#main > .ast-row > article')].filter(article => !article.id || !seenPosts.has(article.id));
        if (!posts.length) throw new Error('Archive continuation has no new posts');
        const nextPagination = page.querySelector('.cinev-pagination');
        const nextLink = nextPagination?.querySelector('a.next.page-numbers');
        posts.forEach(article => {
          if (article.id) seenPosts.add(article.id);
          archiveRow.append(document.importNode(article, true));
        });
        seenPages.add(url.pathname);
        if (nextPagination) archivePagination.replaceChildren(...[...nextPagination.childNodes].map(node => document.importNode(node, true)));
        if (nextLink) {
          infinite.setAttribute('data-next', nextLink.getAttribute('href'));
          infinite.setAttribute('data-page', String(Number(infinite.getAttribute('data-page')) + 1));
          // Re-observe after the row grows so the following page can load too.
          observer.unobserve(infinite);
          observer.observe(infinite);
        } else finish();
      } catch {
        stopped = true;
        observer.disconnect();
        infinite.hidden = true;
        document.body.classList.remove('cinev-infinite-ready');
      } finally {
        loading = false;
        archiveRow.removeAttribute('aria-busy');
        if (loader) loader.style.display = 'none';
      }
    }
    observer.observe(infinite);
  }

  // Any retained theme search form now searches the static content index,
  // without contacting WordPress or requiring a server.
  const query = new URLSearchParams(location.search).get('s');
  if (query) {
    fetch('/insights/search-index.json').then(response => response.json()).then(entries => {
      const main = document.getElementById('main');
      if (!main) return;
      main.replaceChildren();
      const heading = document.createElement('h1');
      heading.textContent = `Search: ${query}`;
      main.append(heading);
      const list = document.createElement('ul');
      list.className = 'cinev-search-results';
      entries.filter(entry => `${entry.title} ${entry.text}`.toLocaleLowerCase().includes(query.toLocaleLowerCase())).forEach(entry => {
        const item = document.createElement('li');
        const link = document.createElement('a');
        link.href = entry.path;
        link.textContent = entry.title;
        const excerpt = document.createElement('p');
        excerpt.textContent = entry.excerpt;
        item.append(link, excerpt);
        list.append(item);
      });
      if (!list.children.length) { const empty = document.createElement('p'); empty.textContent = 'No results found.'; main.append(empty); }
      else main.append(list);
      document.querySelector('.cinev-pagination')?.remove();
      document.querySelector('.ast-ajax-pagination-wrapper')?.remove();
    }).catch(() => {});
  }
})();
