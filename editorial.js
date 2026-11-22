document.addEventListener('DOMContentLoaded', () => {
  const button = document.querySelector('.ed-menu');
  const nav = document.querySelector('.ed-navigation');
  if (!button || !nav) return;
  const setOpen = open => {
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
    button.textContent = open ? '×' : '☰';
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('mobile-menu-open', open);
    const main = document.querySelector('main');
    if (main) main.inert = open;
    if (!open) {
      document.body.classList.remove('mobile-menu-search-open');
      const searchButton = document.querySelector('.ed-mobile-search');
      if (searchButton) searchButton.setAttribute('aria-expanded', 'false');
    }
  };
  button.addEventListener('click', () => setOpen(button.getAttribute('aria-expanded') !== 'true'));
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false); button.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.ed-header')) setOpen(false);
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', () => setOpen(false));
});

// Animate each result once, when its number becomes visible.
document.addEventListener('DOMContentLoaded', () => {
  const section = document.querySelector('#expected-results');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!section || motion.matches || !('IntersectionObserver' in window)) return;

  const counters = [...section.querySelectorAll('.ross-result-feature > strong, .ross-metrics dd')]
    .map(element => {
      const original = element.textContent.trim();
      const match = original.match(/^([+×−-]?)(\d+(?:[,.]\d+)?)(%)?$/);
      if (!match) return null;
      const decimals = (match[2].split(/[,.]/)[1] || '').length;
      return { element, original, prefix: match[1], target: Number(match[2].replace(',', '.')),
        suffix: match[3] || '', decimals, frame: null };
    }).filter(Boolean);
  const running = new Set();
  const finish = counter => {
    if (counter.frame !== null) cancelAnimationFrame(counter.frame);
    counter.element.textContent = counter.original;
    running.delete(counter);
  };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const counter = counters.find(item => item.element === entry.target);
      if (motion.matches) return;
      counter.element.setAttribute('aria-label', counter.original);
      running.add(counter);
      const formatter = new Intl.NumberFormat('fr-FR', {
        minimumFractionDigits: counter.decimals, maximumFractionDigits: counter.decimals
      });
      let started;
      const tick = now => {
        if (motion.matches) { finish(counter); return; }
        if (started === undefined) started = now;
        const progress = Math.min((now - started) / 1600, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.element.textContent = counter.prefix + formatter.format(counter.target * eased) + counter.suffix;
        if (progress < 1) counter.frame = requestAnimationFrame(tick);
        else finish(counter);
      };
      counter.frame = requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  counters.forEach(counter => observer.observe(counter.element));
  motion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect();
    [...running].forEach(finish);
  });
});

// Benefit cards: native touch scrolling and synchronized navigation.
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.value-carousel');
  const controls = document.querySelector('.value-carousel-controls');
  if (!track || !controls) return;
  const slides = [...track.querySelectorAll('.value-reference-card')];
  const previous = controls.querySelector('[data-direction="-1"]');
  const next = controls.querySelector('[data-direction="1"]');
  const status = controls.querySelector('.value-carousel-status');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let scheduled = false;
  const position = slide => slide.offsetLeft - slides[0].offsetLeft;
  const update = () => {
    scheduled = false;
    const max = track.scrollWidth - track.clientWidth;
    active = track.scrollLeft >= max - 3 && max > 0 ? slides.length - 1
      : slides.reduce((closest, slide, index) =>
        Math.abs(position(slide) - track.scrollLeft) < Math.abs(position(slides[closest]) - track.scrollLeft) ? index : closest, 0);
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max - 2;
    status.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
  };
  const go = index => {
    const target = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({ left: position(slides[target]), behavior: motion.matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => go(active - 1));
  next.addEventListener('click', () => go(active + 1));
  track.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(update); }
  }, { passive: true });
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); go(active + (event.key === 'ArrowRight' ? 1 : -1));
    }
  });
  window.addEventListener('resize', update);
  update();
});

// Close the services disclosure on selection, outside click and Escape.
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.seo-mega-menu');
  if (!menu) return;
  const summary = menu.querySelector('summary');
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.open = false; }));
  document.addEventListener('click', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      event.stopPropagation();
      menu.open = false;
      summary.focus();
    }
  });
  const mobileToggle = document.querySelector('.ed-menu');
  if (mobileToggle) mobileToggle.addEventListener('click', () => { menu.open = false; });
});

// Search the single-page site's headings and service descriptions.
document.addEventListener('DOMContentLoaded', () => {
  const search = document.querySelector('.header-search');
  if (!search) return;
  const form = search.querySelector('form');
  const input = search.querySelector('input');
  const panel = search.querySelector('.header-search-results');
  const status = panel.querySelector('.header-search-status');
  const list = panel.querySelector('ul');
  const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, ' ');
  const entries = [];
  const used = new Set();
  document.querySelectorAll('main section[id] > .ross-container > .ross-heading h2, main section[id] h2, #services .ross-service h3').forEach(heading => {
    const section = heading.closest('section[id]');
    const card = heading.closest('.ross-service');
    const target = card && card.id ? card : section;
    if (!target || used.has(target.id)) return;
    used.add(target.id);
    const title = heading.innerText.trim().replace(/\s+/g, ' ');
    const context = card || section;
    entries.push({ id: target.id, title, category: card ? 'Service SEO & GEO' : 'Section du site',
      keywords: normalize(title + ' ' + context.textContent) });
  });
  document.querySelectorAll('.seo-mega-group a').forEach(link => {
    const id = link.getAttribute('href').slice(1);
    if (document.getElementById(id)) entries.push({ id, title: link.querySelector('strong').textContent,
      category: 'Service SEO', keywords: normalize(link.textContent) });
  });
  const close = () => { panel.hidden = true; input.setAttribute('aria-expanded', 'false'); };
  const render = () => {
    const query = normalize(input.value.trim());
    list.replaceChildren();
    if (query.length < 2) { close(); return []; }
    const words = query.split(/\s+/).filter(Boolean);
    const matches = entries.filter(entry => words.every(word => entry.keywords.includes(word)))
      .sort((a, b) => Number(normalize(b.title).includes(query)) - Number(normalize(a.title).includes(query)));
    const seen = new Set();
    const results = matches.filter(entry => {
      const key = entry.id + '|' + normalize(entry.title);
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).slice(0, 8);
    status.textContent = results.length ? `${results.length} résultat${results.length > 1 ? 's' : ''}` : 'Aucun résultat. Essayez « audit », « GEO » ou « contact ».';
    results.forEach(entry => {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + entry.id;
      a.append(document.createTextNode(entry.title));
      const small = document.createElement('small'); small.textContent = entry.category; a.append(small);
      a.addEventListener('click', () => {
        close();
        const target = document.getElementById(entry.id);
        if (target) { target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true }); }
      });
      li.append(a); list.append(li);
    });
    panel.hidden = false; input.setAttribute('aria-expanded', 'true');
    return results;
  };
  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  form.addEventListener('submit', event => {
    event.preventDefault();
    render();
    const first = list.querySelector('a');
    if (first) first.focus();
  });
  search.addEventListener('keydown', event => {
    const links = [...list.querySelectorAll('a')];
    if (event.key === 'Escape') { event.stopPropagation(); input.focus(); close(); return; }
    if (panel.hidden || !links.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const current = links.indexOf(document.activeElement);
      const next = event.key === 'ArrowDown' ? (current + 1) % links.length : (current <= 0 ? links.length - 1 : current - 1);
      links[next].focus();
    }
  });
  document.addEventListener('click', event => { if (!search.contains(event.target)) close(); });
  search.addEventListener('focusout', () => requestAnimationFrame(() => {
    if (!search.contains(document.activeElement)) close();
  }));
});

// Full-screen mobile navigation: search access and focus containment.
document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.ed-header');
  const searchButton = document.querySelector('.ed-mobile-search');
  const searchInput = document.querySelector('#site-search');
  if (!header || !searchButton || !searchInput) return;
  searchButton.addEventListener('click', () => {
    const open = !document.body.classList.contains('mobile-menu-search-open');
    document.body.classList.toggle('mobile-menu-search-open', open);
    searchButton.setAttribute('aria-expanded', String(open));
    if (open) searchInput.focus();
  });
  header.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || !document.body.classList.contains('mobile-menu-open')) return;
    const focusable = [...header.querySelectorAll('a[href],button,input,summary,[tabindex="0"]')]
      .filter(node => node.getClientRects().length && !node.disabled && !node.closest('[hidden]'));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
});

// Exit offer: once per tab session, after time to explore the page.
document.addEventListener('DOMContentLoaded', () => {
  const dialog = document.querySelector('#exit-offer');
  if (!dialog || typeof dialog.show !== 'function') return;
  const started = Date.now();
  const storageKey = 'ross-seo-exit-offer-seen';
  let shown = false;
  try { shown = sessionStorage.getItem(storageKey) === '1'; } catch (_) {}
  if (shown) return;
  const mobile = window.matchMedia('(max-width: 760px)');
  const busy = () => document.hidden || document.body.classList.contains('mobile-menu-open')
    || !!document.querySelector('dialog[open]')
    || !!document.activeElement?.matches('input,textarea,select');
  const show = () => {
    if (shown || busy()) return;
    const previousFocus = document.activeElement;
    dialog.show();
    if (previousFocus && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
    shown = true;
    try { sessionStorage.setItem(storageKey, '1'); } catch (_) {}
    document.removeEventListener('mouseleave', onExit);
    window.removeEventListener('scroll', onMobileScroll);
  };
  const onExit = event => {
    if (!mobile.matches && event.clientY <= 0 && Date.now() - started >= 15000) show();
  };
  const onMobileScroll = () => {
    if (!mobile.matches || Date.now() - started < 45000) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollable > 0 && window.scrollY / scrollable >= 0.35) show();
  };
  document.addEventListener('mouseleave', onExit);
  window.addEventListener('scroll', onMobileScroll, { passive: true });
  window.setTimeout(onMobileScroll, 45000);
  dialog.querySelector('.exit-offer-close').addEventListener('click', () => dialog.close());
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) dialog.close();
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right
      || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.querySelectorAll('a').forEach(link => link.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => document.body.classList.remove('exit-offer-open'));
});

document.addEventListener('DOMContentLoaded', () => {
  const button = document.createElement('button');
  button.id = 'scroll-to-top';
  button.className = 'scroll-to-top';
  button.type = 'button';
  button.setAttribute('aria-label', 'Retour en haut');
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';
  document.body.append(button);

  const syncVisibility = () => button.classList.toggle('visible', window.scrollY > 400);
  syncVisibility();
  window.addEventListener('scroll', syncVisibility, { passive: true });
  button.addEventListener('click', () => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'instant' : 'smooth' });
  });
});
