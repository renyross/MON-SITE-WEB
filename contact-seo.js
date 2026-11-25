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

  const form = document.getElementById('seo-contact-form');
  const status = document.getElementById('seo-contact-status');
  const copy = document.getElementById('seo-copy-brief');
  let brief = '';
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const isWebsiteQuote = form.dataset.contactTopic === 'creation-web';
    const name = data.get('name') ?? [data.get('firstname'), data.get('lastname')].filter(Boolean).join(' ');
    const goal = data.get('goal');
    const website = String(data.get('website') ?? '').trim();
    const budgetField = form.elements.namedItem('budget');
    const budget = budgetField?.value ? budgetField.selectedOptions[0].textContent.trim() : '';
    const projectFields = [['pages', 'Nombre de pages'], ['budget-estimate', 'Budget indicatif'], ['deadline', 'Délai souhaité']];
    const projectDetails = isWebsiteQuote ? projectFields.flatMap(([field, label]) => {
      const value = String(data.get(field) ?? '').trim();
      return value ? [`${label} : ${value}`] : [];
    }) : [];
    const subject = isWebsiteQuote ? 'Demande de devis pour un site web SEO' : 'Demande de diagnostic SEO & GEO';
    brief = [
      'Bonjour Renel,', '', isWebsiteQuote ? 'Je souhaite obtenir un devis pour la création de mon site web.' : 'Je souhaite échanger sur un diagnostic SEO & GEO.', '',
      `Nom : ${String(name).trim()}`,
      `Email : ${String(data.get('email')).trim()}`,
      ...(website || !isWebsiteQuote ? [`Site : ${website}`] : []),
      ...(goal ? [`${isWebsiteQuote ? 'Type de site' : 'Objectif'} : ${goal}`] : []),
      ...projectDetails,
      ...(budget ? [`Budget : ${budget}`] : []), '',
      'Mon projet :', String(data.get('message')).trim()
    ].join('\n');
    const url = 'mailto:contact@renelrosene.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(brief);
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
