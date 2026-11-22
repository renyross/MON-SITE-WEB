(() => {
  const diagnostic = document.getElementById('geo-mini-diagnostic');
  const result = document.getElementById('geo-mini-result');
  const fields = [
    ['mentions', 'Établir un état initial des mentions de votre marque sur des questions représentatives.'],
    ['pages', 'Clarifier vos offres, vos auteurs et les preuves d’expertise sur vos pages stratégiques.'],
    ['sources', 'Examiner les sources externes pertinentes et la cohérence de vos informations de marque.'],
    ['suivi', 'Mettre en place un suivi documenté des citations, des visites et des conversions.']
  ];
  diagnostic?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!diagnostic.reportValidity()) return;
    const data = new FormData(diagnostic);
    const priorities = fields.filter(([key]) => data.get(key) !== 'oui');
    result.replaceChildren();
    const lead = document.createElement('p');
    lead.textContent = priorities.length
      ? 'D’après vos réponses, voici les points à examiner en priorité :'
      : 'Vos réponses indiquent que les premiers repères sont en place. La prochaine étape est de vérifier leur qualité et leur régularité.';
    result.append(lead);
    if (priorities.length) {
      const list = document.createElement('ul');
      priorities.forEach(([, text]) => {
        const item = document.createElement('li');
        item.textContent = text;
        list.append(item);
      });
      result.append(list);
    }
    const note = document.createElement('p');
    note.textContent = 'Ce résultat est un repère déclaratif, pas une mesure de votre présence réelle dans les IA.';
    const next = document.createElement('a');
    next.href = '#diagnostic-geo';
    next.className = 'cp-button';
    next.textContent = 'Préparer mon diagnostic personnalisé ↗';
    result.append(note, next);
    result.hidden = false;
  });

  const form = document.getElementById('geo-contact-form');
  const status = document.getElementById('geo-contact-status');
  const copy = document.getElementById('geo-copy-brief');
  let brief = '';
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    brief = [
      'Bonjour Renel,', '', 'Je souhaite échanger sur un diagnostic GEO.', '',
      `Nom : ${String(data.get('name')).trim()}`,
      `Email : ${String(data.get('email')).trim()}`,
      `Site : ${String(data.get('website')).trim()}`, '',
      'Mon projet :', String(data.get('message')).trim()
    ].join('\n');
    const url = 'mailto:contact@renelrosene.com?subject=' + encodeURIComponent('Demande de diagnostic GEO') + '&body=' + encodeURIComponent(brief);
    status.textContent = 'Votre demande est préparée. Votre messagerie va s’ouvrir pour vous permettre de la relire et de l’envoyer. Si elle ne s’ouvre pas, copiez votre demande ou utilisez le contact direct.';
    status.hidden = false;
    copy.hidden = false;
    window.location.href = url;
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
      text.setAttribute('aria-label', 'Votre demande de diagnostic à copier');
      status.append(text);
      text.focus();
      text.select();
    }
  });
})();
