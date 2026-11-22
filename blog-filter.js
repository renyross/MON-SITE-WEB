(() => {
  const filter = document.getElementById('blog-filter');
  const status = document.getElementById('blog-filter-status');
  const buttons = [...filter.querySelectorAll('[data-category]')];
  const cards = [...document.querySelectorAll('#blog-articles [data-categories]')];

  filter.addEventListener('click', event => {
    const selected = event.target.closest('button[data-category]');
    if (!selected) return;

    const category = selected.dataset.category;
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button === selected)));

    let visible = 0;
    cards.forEach(card => {
      card.hidden = category !== 'tout' && !card.dataset.categories.split(' ').includes(category);
      if (!card.hidden) visible += 1;
    });

    status.textContent = visible
      ? (visible === 1 ? '1 article' : `${visible} articles`)
      : 'Aucun article dans cette catégorie pour le moment.';
  });

  filter.hidden = false;
})();
