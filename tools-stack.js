(() => {
  const section = document.querySelector('#outils-seo-ia');
  if (!section) return;
  const toggle = section.querySelector('#tools-stack-motion');
  const label = toggle.closest('label');
  const track = section.querySelector('.tools-stack-track');
  const viewport = section.querySelector('.tools-stack-marquee');
  const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = () => {
    const running = toggle.checked && !preference.matches;
    // Pause in place so changing the control does not reset the visible tools.
    if (!section.classList.contains('is-running') && running) {
      viewport.scrollLeft = 0;
      section.classList.add('is-running');
    }
    track.style.animationPlayState = running ? '' : 'paused';
    if (preference.matches) section.classList.remove('is-running');
  };
  const applyPreference = () => {
    toggle.checked = !preference.matches;
    toggle.disabled = preference.matches;
    toggle.title = preference.matches ? 'Animation désactivée selon vos préférences de mouvement.' : '';
    update();
  };
  label.hidden = false;
  toggle.addEventListener('change', update);
  preference.addEventListener('change', applyPreference);
  applyPreference();
})();
