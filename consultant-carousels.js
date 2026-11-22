document.querySelectorAll('.cp-carousel-controls').forEach((controls) => {
  const track = document.getElementById(controls.dataset.carousel);
  if (!track) return;
  const cards = Array.from(track.children);
  const status = controls.querySelector('.cp-carousel-status');
  const previous = controls.querySelector('[data-direction="-1"]');
  const next = controls.querySelector('[data-direction="1"]');
  const currentIndex = () => {
    const left = track.getBoundingClientRect().left;
    return cards.reduce((closest, card, index) =>
      Math.abs(card.getBoundingClientRect().left - left) <
      Math.abs(cards[closest].getBoundingClientRect().left - left) ? index : closest, 0);
  };
  const update = () => {
    const index = currentIndex();
    status.textContent = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    previous.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
  };
  const move = (direction) => {
    const index = Math.max(0, Math.min(cards.length - 1, currentIndex() + direction));
    const offset = cards[index].getBoundingClientRect().left - track.getBoundingClientRect().left;
    track.scrollTo({ left: track.scrollLeft + offset,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  previous.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));
  track.addEventListener('keydown', (event) => {
    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    move(event.key === 'ArrowRight' ? 1 : -1);
  });
  track.addEventListener('scroll', update, { passive: true });
  new ResizeObserver(update).observe(track);
  update();
});
