// ── Content helpers ───────────────────────────────────────────────────────────

function getVal(obj, path) {
  return path.split('.').reduce((o, k) => (o != null ? o[k] : undefined), obj);
}

// Meta
document.title = CONTENT.meta.title;
document.querySelector('meta[name="description"]').setAttribute('content', CONTENT.meta.description);

// data-text → textContent
document.querySelectorAll('[data-text]').forEach(el => {
  const val = getVal(CONTENT, el.dataset.text);
  if (val !== undefined) el.textContent = val;
});

// data-html → innerHTML
document.querySelectorAll('[data-html]').forEach(el => {
  const val = getVal(CONTENT, el.dataset.html);
  if (val !== undefined) el.innerHTML = val;
});

// data-placeholder → placeholder attribute
document.querySelectorAll('[data-placeholder]').forEach(el => {
  const val = getVal(CONTENT, el.dataset.placeholder);
  if (val !== undefined) el.placeholder = val;
});

// ── SVG snippets used in generated HTML ──────────────────────────────────────

const SVG_LOC   = `<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;
const SVG_AREA  = `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>`;
const SVG_CHECK = `<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>`;

// ── Stats ─────────────────────────────────────────────────────────────────────

const statsContainer = document.getElementById('stats-container');
statsContainer.innerHTML = CONTENT.stats.map(s => `
  <div class="stat-item reveal">
    <div class="stat-num" data-count="${s.count}">0</div>
    <div class="stat-label">${s.label}</div>
  </div>`).join('');

// ── Services grid ─────────────────────────────────────────────────────────────

document.getElementById('services-grid').innerHTML = CONTENT.services.items.map(s => `
  <div class="srv-card reveal">
    <div class="srv-icon"><svg viewBox="0 0 24 24">${s.icon}</svg></div>
    <h3>${s.title}</h3>
    <p>${s.desc}</p>
  </div>`).join('');

// ── Projects grid ─────────────────────────────────────────────────────────────

const projectCards = CONTENT.projects.items.map(p => {
  const media = p.img
    ? `<img src="${p.img}" alt="${p.alt}">`
    : `<div class="proj-placeholder"><div class="proj-placeholder-bg ${p.placeholder}"></div></div>`;

  const meta = [
    p.location  ? `<span>${SVG_LOC} ${p.location}</span>`  : '',
    p.area      ? `<span>${SVG_AREA} ${p.area}</span>`      : '',
    p.architect ? `<span>${p.architect}</span>`              : '',
    p.subTag    ? `<span>${p.subTag}</span>`                 : ''
  ].join('');

  return `
  <div class="proj-card reveal">
    ${media}
    <div class="proj-overlay">
      <div class="proj-tag">${p.tag}</div>
      <div class="proj-name">${p.name}</div>
      <div class="proj-meta">${meta}</div>
    </div>
  </div>`;
});

projectCards.push(`
  <div class="proj-card reveal" style="display:flex;align-items:center;justify-content:center;background:rgba(0,174,239,0.05);border:1px dashed rgba(0,174,239,0.2);">
    <div style="text-align:center;padding:2rem;">
      <div style="font-size:2.5rem;color:var(--chola-blue);margin-bottom:0.5rem;">+</div>
      <div style="font-family:'Playfair Display',serif;font-size:1.1rem;color:var(--white);margin-bottom:0.3rem;">${CONTENT.projects.more.label}</div>
      <div style="font-size:0.75rem;color:var(--steel);letter-spacing:1px;">${CONTENT.projects.more.sublabel}</div>
    </div>
  </div>`);

document.getElementById('projects-grid').innerHTML = projectCards.join('');

// ── Process steps ─────────────────────────────────────────────────────────────

document.getElementById('process-track').innerHTML = CONTENT.process.steps.map(s => `
  <div class="process-step">
    <div class="step-num">${s.num}</div>
    <h4>${s.title}</h4>
    <p>${s.desc}</p>
  </div>`).join('');

// ── About features ────────────────────────────────────────────────────────────

document.getElementById('about-features').innerHTML = CONTENT.about.features.map(f => `
  <div class="af-item">
    <div class="af-check">${SVG_CHECK}</div>
    <span>${f}</span>
  </div>`).join('');

// ── Contact service select ────────────────────────────────────────────────────

const sel = document.getElementById('contact-service');
sel.innerHTML = `<option value="" disabled selected>${CONTENT.contact.form.selectDefault}</option>`
  + CONTENT.contact.form.serviceOptions.map(o => `<option>${o}</option>`).join('');

// ── Contact form submission ───────────────────────────────────────────────────

function handleEnquiry() {
  alert(CONTENT.contact.form.successMsg);
}

// ── Navbar scroll ─────────────────────────────────────────────────────────────

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ── Hamburger ─────────────────────────────────────────────────────────────────

document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});
document.querySelectorAll('.nav-links a').forEach(a => {
  a.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open'));
});

// ── Scroll reveal ─────────────────────────────────────────────────────────────

const obs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// ── Counter animation ─────────────────────────────────────────────────────────

const cObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = +el.dataset.count;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current + (target >= 10 ? '+' : '');
      }, 30);
      cObs.unobserve(el);
    }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => cObs.observe(el));
