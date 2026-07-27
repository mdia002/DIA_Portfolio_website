/* ============================================================
   Logique commune : chargement des données + rendus
   ============================================================ */

async function loadData() {
  const res = await fetch('data/projects.json');
  if (!res.ok) throw new Error('Impossible de charger data/projects.json');
  return res.json();
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function accentColorVar(accent) {
  return { gold: 'var(--gold)', teal: 'var(--teal)', violet: 'var(--violet)', coral: 'var(--coral)', blue: 'var(--blue)' }[accent] || 'var(--gold)';
}

function categoryLookup(data) {
  const map = {};
  data.categories.forEach(c => map[c.id] = c);
  return map;
}

function countProjectsInCategory(data, catId) {
  let count = 0;
  data.projects.forEach(p => {
    if (p.categories.includes(catId)) count++;
    (p.subprojects || []).forEach(sp => {
      // sous-projets héritent des catégories du parent pour le comptage
      if (p.categories.includes(catId)) return; // déjà compté au niveau parent
    });
  });
  return count;
}

/* ============================================================
   PAGE D'ACCUEIL
   ============================================================ */

function renderCategoryTiles(data, activeFilter) {
  const grid = document.getElementById('category-grid');
  grid.innerHTML = data.categories.map(cat => {
    const count = countProjectsInCategory(data, cat.id);
    const isActive = activeFilter === cat.id;
    return `
      <button class="category-tile${isActive ? ' is-active' : ''}" data-accent="${cat.accent}" data-cat="${cat.id}" aria-pressed="${isActive}">
        <span class="tile-icon">${ICONS[cat.icon] || ICONS.chart}</span>
        <div class="tile-label">${escapeHtml(cat.label)}</div>
        <div class="tile-desc">${escapeHtml(cat.description)}</div>
        <div class="tile-count">${count} projet${count > 1 ? 's' : ''}</div>
      </button>`;
  }).join('');

  grid.querySelectorAll('.category-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const cat = tile.dataset.cat;
      const next = activeFilter === cat ? null : cat;
      renderCategoryTiles(data, next);
      renderProjectGrid(data, next);
      document.getElementById('clear-filter').hidden = !next;
      document.getElementById('projects').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function certStatusBadge(cert) {
  const map = {
    obtained: { cls: 'badge-obtained', label: 'Obtenue' },
    'in-progress': { cls: 'badge-in-progress', label: 'En cours' },
    planned: { cls: 'badge-planned', label: 'Année' }
  };
  const s = map[cert.status] || map.planned;
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

function renderCertifications(data) {
  const grid = document.getElementById('cert-grid');
  if (!grid) return;
  const certs = data.certifications || [];
  if (!certs.length) {
    grid.innerHTML = `<div class="empty-note">Certifications à venir.</div>`;
    return;
  }
  grid.innerHTML = certs.map(c => `
    <div class="cert-card">
      <div class="cert-logo">
        ${c.logo ? `<img src="${c.logo}" alt="${escapeHtml(c.issuer)}" onerror="this.parentElement.innerHTML='<span class=\\'cert-fallback\\'>${escapeHtml((c.issuer || '?').slice(0,2).toUpperCase())}</span>'">` : `<span class="cert-fallback">${escapeHtml((c.issuer || '?').slice(0,2).toUpperCase())}</span>`}
      </div>
      <div class="cert-body">
        <div class="cert-name">${escapeHtml(c.name)}</div>
        <div class="cert-issuer">${escapeHtml(c.issuer)}</div>
        ${c.description ? `<div class="cert-desc">${escapeHtml(c.description)}</div>` : ''}
        <div class="cert-footer">
          <div style="display:flex;align-items:center;gap:8px;">
            ${certStatusBadge(c)}
            <span class="cert-date">${escapeHtml(c.date || '')}</span>
          </div>
          ${c.credentialUrl ? `<a class="cert-link" href="${c.credentialUrl}" target="_blank" rel="noopener">Vérifier${ICONS.eye}</a>` : ''}
        </div>
      </div>
    </div>`).join('');
}

function statusBadge(project) {
  if (project.status === 'draft') return '<span class="badge badge-draft">Contenu à venir</span>';
  return project.confidential
    ? '<span class="badge badge-confidential">Confidentiel</span>'
    : '<span class="badge badge-public">Portfolio public</span>';
}

function renderProjectGrid(data, filter) {
  const grid = document.getElementById('project-grid');
  const catMap = categoryLookup(data);
  const projects = filter ? data.projects.filter(p => p.categories.includes(filter)) : data.projects;

  if (!projects.length) {
    grid.innerHTML = `<div class="empty-note">Aucun projet dans cette catégorie pour le moment.</div>`;
    return;
  }

  grid.innerHTML = projects.map(p => {
    const accents = p.categories.map(cid => accentColorVar(catMap[cid] ? catMap[cid].accent : 'gold'));
    const stripes = accents.map(a => `<span style="background:${a}"></span>`).join('');
    const subCount = (p.subprojects || []).length;
    return `
      <a class="project-card" href="project.html?id=${encodeURIComponent(p.id)}">
        <div class="card-top">${stripes}</div>
        <div class="card-body">
          <div class="card-sector">${escapeHtml(p.sector)}</div>
          <h3>${escapeHtml(p.title)}</h3>
          <div class="card-subtitle">${escapeHtml(p.subtitle)}</div>
          <div class="badge-row">${statusBadge(p)}${subCount ? `<span class="badge badge-sub">${subCount} cas d'usage</span>` : ''}</div>
          <div class="card-footer">
            <span class="card-link">Voir le projet ${ICONS.arrow}</span>
            ${subCount ? `<span class="card-subcount">${subCount} sous-projets</span>` : ''}
          </div>
        </div>
      </a>`;
  }).join('');
}

function renderKpiTicker(data) {
  const items = [
    // 'BankPerf360 - <strong>50 000</strong> transactions synthétiques traitées',
    `${ICONS.powerbi} <strong>Power BI</strong> - 100+ Mesures DAX écrites`,
    `<strong> IA : LLM + computer vision + Regex -  </strong> Détection automatique de chèques - <strong>Métriques : mAP@50 ~ 98%</strong>`,
    'Extraction de champs - <strong>F1 score ~ 97%</strong>',
    `<strong>${data.projects.length}+</strong> projets documentés dans ce portfolio`,
    'Dashboards Power BI alimentés automatiquement via <strong>Airflow</strong>',
    'Reporting web analytics multi-sources (<strong>Matomo, API REST</strong>)'
  ];
  const track = document.getElementById('kpi-track');
  const doubled = [...items, ...items]; // boucle continue
  track.innerHTML = doubled.map(t => `<span class="kpi-item"><span class="kpi-dot">●</span> ${t}</span>`).join('');
}

async function initHome() {
  const data = await loadData();
  renderKpiTicker(data);
  renderCertifications(data);
  renderCategoryTiles(data, null);
  renderProjectGrid(data, null);
  document.getElementById('clear-filter').addEventListener('click', () => {
    renderCategoryTiles(data, null);
    renderProjectGrid(data, null);
    document.getElementById('clear-filter').hidden = true;
  });
}

/* ============================================================
   PAGE PROJET (project.html)
   ============================================================ */

function findProjectById(data, id) {
  for (const p of data.projects) {
    if (p.id === id) return { project: p, parent: null };
    for (const sp of (p.subprojects || [])) {
      if (sp.id === id) return { project: sp, parent: p, isSub: true };
    }
  }
  return null;
}

function renderConfidentialBanner(project) {
  const isConf = project.confidential;
  return `
    <div class="confidential-banner ${isConf ? 'is-confidential' : 'is-public'}">
      ${isConf ? ICONS.lock : ICONS.unlock}
      <span>${escapeHtml(project.confidentialNote || (isConf ? 'Ce projet contient des éléments confidentiels.' : 'Ce projet est un cas de portfolio public.'))}</span>
    </div>`;
}

function renderTags(list) {
  return `<div class="tag-row">${(list || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>`;
}

function renderWorkflow(project) {
  if (!project.workflowSteps || !project.workflowSteps.length) return '';
  return `
    <div class="project-section">
      <h2>Workflow</h2>
      <p>Étapes suivies pour mener le projet, de la donnée brute à la restitution.</p>
      ${project.workflowImage ? `<div class="shot-card" style="margin-bottom:20px;"><img src="${project.workflowImage}" alt="Schéma du workflow"></div>` : ''}
      <ol class="workflow-steps">
        ${project.workflowSteps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}
      </ol>
    </div>`;
}

function renderScreenshots(project) {
  const shots = project.screenshots || [];
  return `
    <div class="project-section">
      <h2>Interface & résultats</h2>
      <p>Aperçu de l'interface, de l'expérience utilisateur et des résultats obtenus.</p>
      <div class="shot-grid">
        ${shots.length ? shots.map(s => `
          <div class="shot-card">
            <img src="${s.src}" alt="${escapeHtml(s.caption || project.title)}" loading="lazy">
            <div class="shot-caption">${escapeHtml(s.caption || '')}</div>
          </div>`).join('') : `
          <div class="shot-card"><div class="shot-placeholder">Captures d'écran à ajouter - voir /images/projects</div></div>`}
      </div>
    </div>`;
}

function renderUsage(project) {
  if (!project.usageSteps || !project.usageSteps.length) return '';
  return `
    <div class="project-section">
      <h2><span class="num">3</span> Comment naviguer dans les résultats</h2>
      <p>Parcours pas à pas pour explorer le livrable, de A à Z.</p>
      <ul class="usage-steps">
        ${project.usageSteps.map((s, i) => `<li><span class="step-marker">${String(i + 1).padStart(2, '0')}</span>${escapeHtml(s)}</li>`).join('')}
      </ul>
    </div>`;
}

function renderResults(project) {
  if (!project.results || !project.results.length) return '';
  return `
    <div class="project-section">
      <h2><span class="num">4</span> Résultats & impact</h2>
      <ul class="results-list">
        ${project.results.map(r => `<li>${escapeHtml(r)}</li>`).join('')}
      </ul>
    </div>`;
}

function renderSubprojects(project) {
  const subs = project.subprojects || [];
  if (!subs.length) return '';
  return `
    <div class="project-section">
      <h2><span class="num">★</span> Cas d'usage (${subs.length})</h2>
      <p>Ce projet regroupe plusieurs missions concrètes. Cliquez sur un cas pour le détailler.</p>
      <div class="subproject-list">
        ${subs.map((sp, i) => `
          <div class="subproject" data-sub-index="${i}">
            <div class="subproject-head">
              <div>
                <h3>${escapeHtml(sp.title)}</h3>
                <div style="font-family:var(--font-mono);font-size:0.75rem;color:var(--text-light-dim);margin-top:4px;">${escapeHtml(sp.sector)} - ${sp.confidential ? 'Confidentiel' : 'Public'}</div>
              </div>
              <span class="chevron">${ICONS.chevron}</span>
            </div>
            <div class="subproject-panel">
              <div class="subproject-panel-inner">
                ${renderConfidentialBanner(sp)}
                <p><strong style="color:var(--text-light)">Objectif -</strong> ${escapeHtml(sp.objective)}</p>
                ${renderTags(sp.tools)}
                ${sp.workflowSteps && sp.workflowSteps.length ? `
                  <h4 style="font-family:var(--font-mono);font-size:0.74rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-light-dim);margin:20px 0 10px;">Workflow</h4>
                  <ol class="workflow-steps">${sp.workflowSteps.map(s => `<li>${escapeHtml(s)}</li>`).join('')}</ol>` : ''}
                ${sp.usageSteps && sp.usageSteps.length ? `
                  <h4 style="font-family:var(--font-mono);font-size:0.74rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-light-dim);margin:20px 0 10px;">Navigation</h4>
                  <ul class="usage-steps">${sp.usageSteps.map((s, j) => `<li><span class="step-marker">${String(j + 1).padStart(2, '0')}</span>${escapeHtml(s)}</li>`).join('')}</ul>` : ''}
                ${sp.results && sp.results.length ? `
                  <h4 style="font-family:var(--font-mono);font-size:0.74rem;text-transform:uppercase;letter-spacing:0.06em;color:var(--text-light-dim);margin:20px 0 10px;">Résultats</h4>
                  <ul class="results-list">${sp.results.map(r => `<li>${escapeHtml(r)}</li>`).join('')}</ul>` : ''}
                <div style="margin-top:20px;">
                  ${sp.code && sp.code.public && sp.code.url
                    ? `<a class="btn btn-ghost" href="${sp.code.url}" target="_blank" rel="noopener">${ICONS.github} Voir le code</a>`
                    : `<div class="code-locked">${ICONS.lock} Code non public pour ce cas - disponible sur demande en entretien</div>`}
                </div>
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function renderSidePanel(data, project) {
  const catMap = categoryLookup(data);
  const catLabels = project.categories.map(cid => catMap[cid] ? catMap[cid].label : cid);
  return `
    <div class="side-panel">
      <h3>Secteur</h3>
      <p style="margin:0;font-size:0.92rem;">${escapeHtml(project.sector)}</p>
    </div>
    <div class="side-panel">
      <h3>Domaines</h3>
      ${renderTags(catLabels)}
    </div>
    <div class="side-panel">
      <h3>Langages & outils</h3>
      ${renderTags(project.languages)}
      ${renderTags(project.tools)}
    </div>
    <div class="side-panel">
      <h3>Code source</h3>
      ${project.code && project.code.public && project.code.url
        ? `<a class="btn btn-primary" style="width:100%;justify-content:center;" href="${project.code.url}" target="_blank" rel="noopener">${ICONS.github} Voir le code sur GitHub</a>`
        : `<div class="code-locked">${ICONS.lock} Non public - disponible sur demande en entretien</div>`}
    </div>
    ${project.liveUrl ? `
    <div class="side-panel">
      <h3>Application en ligne</h3>
      <a class="btn btn-primary" style="width:100%;justify-content:center;" href="${project.liveUrl}" target="_blank" rel="noopener">${ICONS.external} Ouvrir l'application</a>
    </div>` : ''}
  `;
}

async function initProjectPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const data = await loadData();
  const found = id ? findProjectById(data, id) : null;

  if (!found) {
    document.getElementById('project-root').innerHTML = `
      <div class="container" style="padding:80px 0;">
        <div class="empty-note">Projet introuvable. <a href="index.html" style="color:var(--gold)">Retour à l'accueil</a>.</div>
      </div>`;
    return;
  }

  const { project, parent, isSub } = found;
  document.title = `${project.title} - Mouhamed Dia`;

  const breadcrumbHtml = `
    <div class="breadcrumb">
      <a href="index.html">Accueil</a> <span>/</span> <a href="index.html#projects">Projets</a>
      ${parent ? `<span>/</span> <a href="project.html?id=${parent.id}">${escapeHtml(parent.title)}</a>` : ''}
      <span>/</span> <span style="color:var(--text-light)">${escapeHtml(project.title)}</span>
    </div>`;

  document.getElementById('project-root').innerHTML = `
    <section class="project-hero grid-backdrop">
      <div class="container">
        ${breadcrumbHtml}
        <h1>${escapeHtml(project.title)}</h1>
        ${project.subtitle ? `<div class="subtitle">${escapeHtml(project.subtitle)}</div>` : ''}
        ${renderConfidentialBanner(project)}
      </div>
    </section>
    <div class="container">
      <div class="project-body">
        <div class="project-main">
          <div class="project-section">
            <h2>Objectif</h2>
            <p>${escapeHtml(project.objective)}</p>
            ${project.context ? `<p>${escapeHtml(project.context)}</p>` : ''}
          </div>
          ${!isSub ? renderSubprojects(project) : ''}
          ${renderWorkflow(project)}
          ${renderScreenshots(project)}
          ${renderUsage(project)}
          ${renderResults(project)}
        </div>
        <aside class="project-aside">
          ${renderSidePanel(data, parent || project)}
        </aside>
      </div>
    </div>
  `;

  // Accordéon des sous-projets
  document.querySelectorAll('.subproject-head').forEach(head => {
    head.addEventListener('click', () => {
      const sub = head.closest('.subproject');
      const panel = sub.querySelector('.subproject-panel');
      const isOpen = sub.classList.contains('is-open');
      // ferme les autres
      document.querySelectorAll('.subproject.is-open').forEach(s => {
        if (s !== sub) {
          s.classList.remove('is-open');
          s.querySelector('.subproject-panel').style.maxHeight = null;
        }
      });
      if (isOpen) {
        sub.classList.remove('is-open');
        panel.style.maxHeight = null;
      } else {
        sub.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });
}
