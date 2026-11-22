(() => {
  const form = document.getElementById('blog-audit-form');
  const input = document.getElementById('blog-audit-url');
  const status = document.getElementById('blog-audit-status');
  const results = document.getElementById('blog-audit-results');
  const submit = form.querySelector('button[type="submit"]');

  const appendText = (tag, value, parent = results) => {
    const element = document.createElement(tag);
    element.textContent = value;
    parent.append(element);
    return element;
  };

  const addList = (title, items) => {
    if (!items.length) return;
    appendText('h3', title);
    const list = document.createElement('ul');
    for (const item of items) appendText('li', item, list);
    results.append(list);
  };

  const addReportLink = (label, homepage) => {
    const link = appendText('a', label);
    const reportUrl = new URL('https://pagespeed.web.dev/analysis');
    reportUrl.searchParams.set('url', homepage);
    link.href = reportUrl.href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    results.hidden = false;
  };

  const showReport = (report, homepage) => {
    const {categories, audits} = report;
    const labels = {seo: 'SEO', performance: 'Performance mobile'};
    const scores = Object.entries(labels)
      .filter(([key]) => Number.isFinite(categories[key]?.score))
      .map(([key, label]) => `${label} : ${Math.round(categories[key].score * 100)}/100`);

    appendText('p', scores.join(' · '));

    const checks = [...new Set([
      ...categories.seo?.auditRefs?.map(({id}) => id) ?? [],
      ...categories.performance?.auditRefs?.map(({id}) => id) ?? []
    ])].map(id => audits[id]).filter(audit =>
      audit?.title && Number.isFinite(audit.score)
      && ['binary', 'numeric'].includes(audit.scoreDisplayMode)
    );
    addList('Points forts', checks.filter(audit => audit.score === 1).slice(0, 3).map(audit => audit.title));
    addList('À améliorer', checks.filter(audit => audit.score < .9).slice(0, 4).map(audit => audit.title));

    addReportLink('Ouvrir PageSpeed Insights', homepage);
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submit.disabled) return;
    results.hidden = true;
    results.replaceChildren();

    let homepage;
    try {
      const value = input.value.trim();
      const url = new URL(/^[a-z]+:\/\//i.test(value) ? value : `https://${value}`);
      if (!['http:', 'https:'].includes(url.protocol) || !url.hostname.includes('.') || url.username || url.password) {
        throw new Error('Invalid URL');
      }
      homepage = `${url.origin}/`;
    } catch {
      status.textContent = 'Saisissez une adresse publique valide, par exemple votre-site.fr.';
      return;
    }

    submit.disabled = true;
    status.textContent = 'Analyse de votre page d’accueil en cours…';

    const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
    endpoint.searchParams.set('url', homepage);
    endpoint.searchParams.set('strategy', 'mobile');
    endpoint.searchParams.set('locale', 'fr');
    endpoint.searchParams.append('category', 'seo');
    endpoint.searchParams.append('category', 'performance');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 65000);
    try {
      const response = await fetch(endpoint, {
        signal: controller.signal,
        credentials: 'omit',
        referrerPolicy: 'no-referrer'
      });
      if (!response.ok) throw new Error('PageSpeed unavailable');
      const {lighthouseResult} = await response.json();
      if (lighthouseResult?.runtimeError || !lighthouseResult?.categories || !lighthouseResult.audits) {
        throw new Error('No audit result');
      }
      showReport(lighthouseResult, homepage);
      status.textContent = 'Analyse terminée.';
    } catch {
      status.textContent = 'L’analyse intégrée est momentanément indisponible. Vous pouvez essayer directement avec PageSpeed Insights.';
      results.replaceChildren();
      addReportLink('Analyser avec PageSpeed Insights', homepage);
    } finally {
      clearTimeout(timeout);
      submit.disabled = false;
    }
  });
})();
