(() => {
  const main = document.getElementById('main-content');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!main || reducedMotion.matches || !Element.prototype.animate) return;

  const easing = 'cubic-bezier(.22, 1, .36, 1)';
  const playing = new Set();

  function play(element, keyframes, options) {
    const animation = element.animate(keyframes, { easing, fill: 'backwards', ...options });
    playing.add(animation);
    animation.onfinish = animation.oncancel = () => playing.delete(animation);
  }

  function enter(element, { distance = 16, opacity = .48, duration = 620, delay = 0 } = {}) {
    play(element, [
      { opacity, translate: `0 ${distance}px` },
      { opacity: 1, translate: '0 0' }
    ], { duration, delay });
  }

  reducedMotion.addEventListener('change', event => {
    if (event.matches) [...playing].forEach(animation => animation.cancel());
  });

  // The hero image and intro paragraph stay still for a readable first paint.
  const hero = main.querySelector('.ed-hero-content');
  if (hero && window.scrollY < 80) {
    const sequence = [
      ['.ed-eyebrow', 0, 8],
      ['h1', 65, 12],
      ['.ed-hero-links', 140, 10],
      ['.hero-proof-minimal', 210, 8]
    ];
    sequence.forEach(([selector, delay, distance]) => {
      const element = hero.querySelector(selector);
      if (element) enter(element, { distance, opacity: .85, duration: 580, delay });
    });
  }

  if (!('IntersectionObserver' in window)) return;

  const groups = [
    '#approche-seo-geo :is(.seo-position-copy, .seo-position-priorities)',
    '#test-seo :is(.seo-test-heading, .seo-test-panel)',
    '#pourquoi-seo-geo :is(.value-reference-top, .value-reference-card)',
    '#quiz :is(.preaudit-copy, .preaudit-form)',
    '#for-who :is(.audience-heading, .audience-card)',
    '#services :is(.audience-heading, .ross-service)',
    '#process-intro :is(.method-minimal-copy, .method-minimal-steps > li)',
    '#outils-seo-ia .tools-stack-heading',
    '#expected-results :is(.ross-heading, .ross-results)',
    '#about :is(.ross-portrait, .ross-about-copy)',
    '#reviews .supabase-wall-header',
    '#faq :is(.ross-faq-aside, .ross-faq-list)',
    '#contact :is(.ross-contact-copy, .ross-contact-form)'
  ];

  const observer = new IntersectionObserver(entries => {
    let delay = 0;
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      if (reducedMotion.matches || entry.target.matches(':focus-within')) return;

      enter(entry.target, { delay, distance: window.innerWidth <= 760 ? 10 : 18 });
      const step = entry.target.querySelector(':scope > .method-minimal-number');
      if (step) {
        play(step, [{ scale: .82 }, { scale: 1 }], { duration: 500, delay });
      }
      delay = Math.min(delay + 55, 165);
    });
  }, { rootMargin: '0px 0px -24px 0px', threshold: .04 });

  groups.forEach(selector => main.querySelectorAll(selector).forEach(element => observer.observe(element)));
})();
