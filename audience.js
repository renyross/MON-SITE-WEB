document.querySelectorAll(':is(#for-who, #services, #engagements).audience-reference').forEach(section => {
  const track = section.querySelector('.audience-grid');
  const cards = Array.from(track.children);
  const status = section.querySelector('.audience-reference-status');
  const previous = section.querySelector('[data-direction="-1"]');
  const next = section.querySelector('[data-direction="1"]');
  const current = () => {
    const left = track.getBoundingClientRect().left;
    return cards.reduce((nearest, card, index) =>
      Math.abs(card.getBoundingClientRect().left - left) < Math.abs(cards[nearest].getBoundingClientRect().left - left) ? index : nearest, 0);
  };
  const update = () => {
    status.textContent = `${String(current() + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const move = direction => {
    const index = Math.max(0, Math.min(cards.length - 1, current() + direction));
    track.scrollTo({left: track.scrollLeft + cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('scroll', update, {passive: true});
  track.addEventListener('keydown', event => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  if ('ResizeObserver' in window) new ResizeObserver(update).observe(track);
  window.addEventListener('resize', update);
  update();
});
