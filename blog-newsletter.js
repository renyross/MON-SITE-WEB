(() => {
  const form = document.getElementById('blog-newsletter-form');
  const email = document.getElementById('blog-newsletter-email');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const subject = encodeURIComponent('Demande d’inscription à la newsletter ROSS SEO');
    const body = encodeURIComponent(`Bonjour,\n\nJe souhaite recevoir la newsletter ROSS SEO à cette adresse : ${email.value.trim()}\n\nMerci.`);
    window.location.href = `mailto:contact@renelrosene.com?subject=${subject}&body=${body}`;
  });

  form.hidden = false;
})();
