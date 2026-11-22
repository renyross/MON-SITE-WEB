(() => {
  const selector = document.getElementById('pricing-selector');
  const result = document.getElementById('pricing-selector-result');
  const recommendations = {
    diagnostic: ['Audit SEO complet', 'Commencer par un état des lieux et une feuille de route priorisée.'],
    technical: ['Optimisation SEO technique', 'Définir les blocages, les corrections nécessaires et les responsabilités de mise en œuvre.'],
    content: ['Stratégie de contenu SEO', 'Identifier les intentions prioritaires et les pages à créer ou à optimiser.'],
    local: ['SEO local et multisites', 'Cadrer le nombre d’établissements et les informations locales à améliorer.'],
    geo: ['Audit GEO et visibilité IA', 'Définir les questions, les plateformes et le protocole de suivi des mentions et citations.'],
    data: ['Data et automatisation SEO', 'Préciser les indicateurs, les sources de données et les tâches à automatiser.']
  };
  selector?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selector.reportValidity()) return;
    const data = new FormData(selector);
    const selected = recommendations[data.get('goal')];
    if (!selected) return;
    result.replaceChildren();
    const lead = document.createElement('p');
    const name = document.createElement('strong');
    name.textContent = 'Orientation : ' + selected[0];
    lead.append(name);
    const description = document.createElement('p');
    description.textContent = selected[1];
    const delivery = document.createElement('p');
    delivery.textContent = data.get('team') === 'internal'
      ? 'Vos équipes peuvent appliquer les recommandations : cadrons les livrables et les points de validation.'
      : 'Prévoyons dans le devis l’aide à la mise en œuvre et les ressources nécessaires.';
    const format = document.createElement('p');
    format.textContent = data.get('duration') === 'ongoing'
      ? 'Un accompagnement régulier peut organiser le déploiement et la mesure dans la durée.'
      : data.get('duration') === 'oneoff'
        ? 'Un forfait ponctuel peut délimiter les livrables et le calendrier de la mission.'
        : 'Le premier échange permettra de choisir entre une mission ponctuelle et un accompagnement régulier.';
    const note = document.createElement('p');
    note.textContent = 'Cette orientation repose sur vos réponses. Le périmètre et le tarif restent à définir sur devis après échange.';
    const next = document.createElement('a');
    next.className = 'cp-button';
    next.href = '#devis-seo-geo';
    next.textContent = 'Préparer mon devis personnalisé ↗';
    result.append(lead, description, delivery, format, note, next);
    result.hidden = false;
  });

  const form = document.getElementById('pricing-contact-form');
  const status = document.getElementById('pricing-contact-status');
  const copy = document.getElementById('pricing-copy-brief');
  let brief = '';
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    brief = [
      'Bonjour Renel,', '', 'Je souhaite recevoir une proposition SEO & GEO adaptée à mon projet.', '',
      `Nom : ${String(data.get('name')).trim()}`,
      `Email : ${String(data.get('email')).trim()}`,
      `Site : ${String(data.get('website')).trim()}`,
      `Budget envisagé : ${String(data.get('budget') || '').trim() || 'À définir ensemble'}`,
      '', 'Mon projet :', String(data.get('message')).trim()
    ].join('\n');
    status.textContent = 'Votre demande est préparée. Votre messagerie va s’ouvrir pour vous permettre de la relire et de l’envoyer. Si elle ne s’ouvre pas, copiez la demande ou utilisez le contact direct.';
    status.hidden = false;
    copy.hidden = false;
    window.location.href = 'mailto:contact@renelrosene.com?subject=' + encodeURIComponent('Demande de devis SEO & GEO') + '&body=' + encodeURIComponent(brief);
  });
  copy?.addEventListener('click', async (event) => {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(brief);
      status.textContent = 'Demande copiée. Collez-la dans un email à contact@renelrosene.com.';
    } catch (_) {
      status.textContent = 'La copie automatique est indisponible. Voici votre demande à sélectionner et copier :';
      const text = document.createElement('textarea');
      text.value = brief;
      text.readOnly = true;
      text.setAttribute('aria-label', 'Votre demande de devis à copier');
      status.append(text);
      text.focus();
      text.select();
    }
  });
})();
