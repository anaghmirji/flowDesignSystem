// =============================================================================
// PLATFORM.js — Renderer
// Reads from SYSTEM (system.js) and builds all UI.
// No hardcoded data here — all data lives in system.js.
// =============================================================================

/** First nav section is “Global CSS”; default landing page stays Tokens for day-to-day use. */
const DEFAULT_ACTIVE_PAGE = 'tokens';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function iconSvg(name) {
  const icon = SYSTEM.icons.find(i => i.name === name);
  return icon ? icon.svg : '';
}
// legacy alias
function iconUrl(name) { return ''; }

function escHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escAttr(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

// ─── Nav renderer ─────────────────────────────────────────────────────────────

function renderNav() {
  const navBody = document.getElementById('nav-body');
  let html = '';

  const CHEVRON = `<svg class="nav-collapse-chevron" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  SYSTEM.nav.forEach((group, gi) => {
    const isCollapsible = !!group.collapsible;
    const startCollapsed = isCollapsible && group.collapsed;
    const groupId = `nav-group-${gi}`;

    if (isCollapsible) {
      html += `
        <div class="nav-group${gi > 0 ? ' nav-group--spaced' : ''}" id="${groupId}">
          <div class="nav-section nav-section--collapsible" data-group="${groupId}">
            <span>${group.section}</span>
            <span class="nav-chevron-wrap${startCollapsed ? ' is-collapsed' : ''}">${CHEVRON}</span>
          </div>
          <div class="nav-group-items${startCollapsed ? ' nav-group-items--hidden' : ''}">`;
      group.items.forEach(item => {
        const isActive = item.id === DEFAULT_ACTIVE_PAGE;
        if (item.href) {
          html += `<a class="nav-item" href="${item.href}" target="_blank" style="text-decoration:none">${item.icon}${item.label}<svg style="margin-left:auto;opacity:0.4;flex-shrink:0" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
        } else {
          html += `<div class="nav-item${isActive ? ' active' : ''}" data-page="${item.id}">${item.icon}${item.label}</div>`;
        }
      });
      html += `</div></div>`;
    } else {
      html += `<div class="nav-section"${gi > 0 ? ' style="margin-top:8px"' : ''}>${group.section}</div>`;
      group.items.forEach(item => {
        const isActive = item.id === DEFAULT_ACTIVE_PAGE;
        if (item.href) {
          html += `<a class="nav-item" href="${item.href}" target="_blank" style="text-decoration:none">${item.icon}${item.label}<svg style="margin-left:auto;opacity:0.4;flex-shrink:0" width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 8L8 2M8 2H4M8 2V6" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg></a>`;
        } else {
          html += `<div class="nav-item${isActive ? ' active' : ''}" data-page="${item.id}">${item.icon}${item.label}</div>`;
        }
      });
    }
  });

  navBody.innerHTML = html;

  // Wire collapsible toggles after render
  navBody.querySelectorAll('.nav-section--collapsible').forEach(header => {
    header.addEventListener('click', () => {
      const grp    = document.getElementById(header.dataset.group);
      const items  = grp.querySelector('.nav-group-items');
      const chev   = header.querySelector('.nav-chevron-wrap');
      const hidden = items.classList.toggle('nav-group-items--hidden');
      chev.classList.toggle('is-collapsed', hidden);
    });
  });
}

// ─── Token page ───────────────────────────────────────────────────────────────

function renderTokensPage() {
  let html = `
    <div class="section-header">
      <div class="section-title">Tokens</div>
      <div class="section-subtitle">Source: Figma › Current Design System · click a token for code</div>
    </div>
    <div class="token-grid">`;

  SYSTEM.tokenGroups.forEach(group => {
    html += `<div><div class="token-group-title">${group.label}</div><div class="token-list">`;
    group.tokens.forEach(t => {
      const swatchBorder = t.border ? ';border:0.5px solid #e0e0e0' : '';
      html += `
        <div class="token-row"
             data-token="${t.id}"
             data-figma="${t.figma}"
             data-hex="${t.hex}">
          <div class="token-swatch" style="background:${t.hex}${swatchBorder}"></div>
          <div class="token-info">
            <div class="token-figma-name">${t.figma}</div>
            <div class="token-css-name">--${t.id}</div>
          </div>
          <div class="token-hex">${t.hex}</div>
        </div>`;
    });
    html += `</div></div>`;
  });

  html += `</div>`;
  return html;
}

// ─── Icons page ───────────────────────────────────────────────────────────────

function renderIconsPage() {
  let html = `
    <div class="section-header">
      <div class="section-title">Icons</div>
      <div class="section-subtitle">Source: Figma › Icons · 16×16px · click an icon for code</div>
    </div>
    <div class="ds-table">`;

  SYSTEM.icons.forEach(icon => {
    html += `
      <div class="ds-row" data-icon="${icon.name}">
        <div class="icon-row-preview">
          <span class="icon">${icon.svg}</span>
        </div>
        <span class="ds-row-name">${icon.name}</span>
      </div>`;
  });

  html += `</div>`;
  return html;
}

const GLOBAL_CSS_PATH = 'design-system/css/global.css';

function renderGlobalCssPage() {
  return `
    <div class="section-header">
      <div class="section-title">Global CSS</div>
      <div class="section-subtitle">One file for tokens, icons, buttons, and Lender Portal — same file the platform loads</div>
    </div>
    <p class="global-css-intro">
      This file is <strong>generated</strong>. Edit the source sheets in the repo root (<code>global.css</code>, <code>global.css</code>, <code>global.css</code>, <code>global.css</code>), then run
      <code>npm run build</code> or <code>sh scripts/build-css-bundle.sh</code>.
      If you add a new stylesheet, append it to both bundle scripts so it is included here.
      In React apps, import this once (or use the npm export <code>flow-design-system/styles.css</code>).
    </p>
    <div class="global-css-actions">
      <div class="global-css-actions-left">
        <button type="button" class="global-css-btn" id="global-css-copy">Copy all CSS</button>
        <button type="button" class="global-css-btn" id="global-css-reload">Reload from disk</button>
      </div>
      <div class="global-css-search-bar">
        <div class="global-css-search-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="6" cy="6" r="4" stroke="#666666" stroke-width="1.25"/><path d="M9.5 9.5L12 12" stroke="#666666" stroke-width="1.25" stroke-linecap="round"/></svg>
        </div>
        <input class="global-css-search-input" id="global-css-search-input" placeholder="Search" type="text" autocomplete="off" spellcheck="false">
        <span class="global-css-search-count" id="global-css-search-count"></span>
        <button class="global-css-search-nav-btn" id="global-css-search-prev" title="Previous (↑)" disabled>↑</button>
        <button class="global-css-search-nav-btn" id="global-css-search-next" title="Next (↓)" disabled>↓</button>
      </div>
    </div>
    <div class="global-css-error" id="global-css-error" role="alert"></div>
    <div class="global-css-pre-wrap">
      <pre class="global-css-pre" id="global-css-pre"><code id="global-css-source" class="language-css"></code></pre>
    </div>`;
}

function initGlobalCssPage() {
  const url = GLOBAL_CSS_PATH;
  const el = document.getElementById('global-css-source');
  const errEl = document.getElementById('global-css-error');
  if (!el || !errEl) return;

  let highlightedHtml = ''; // hljs-rendered HTML, restored on search clear
  let matchIndex = 0;       // currently active match (0-based)

  async function load() {
    try {
      const r = await fetch(url + '?t=' + Date.now());
      if (!r.ok) throw new Error(String(r.status));
      const text = await r.text();
      el.textContent = text;
      el.className = 'language-css';
      if (window.hljs && typeof window.hljs.highlightElement === 'function') {
        window.hljs.highlightElement(el);
      }
      highlightedHtml = el.innerHTML;
      errEl.style.display = 'none';
      // Re-run search if query is already typed
      const q = document.getElementById('global-css-search-input')?.value.trim();
      if (q) applySearch(q);
    } catch {
      errEl.style.display = 'block';
      errEl.innerHTML =
        'Could not load <code>' +
        escHtml(url) +
        '</code>. From the repo root run <code>npm run build</code> or <code>sh scripts/build-css-bundle.sh</code>, then refresh.';
    }
  }

  // ── Search helpers ────────────────────────────────────────────────────────

  function applySearch(q) {
    const countEl  = document.getElementById('global-css-search-count');
    const prevBtn  = document.getElementById('global-css-search-prev');
    const nextBtn  = document.getElementById('global-css-search-next');

    if (!q) {
      el.innerHTML = highlightedHtml;
      if (countEl) { countEl.textContent = ''; countEl.classList.remove('has-results'); }
      if (prevBtn) prevBtn.disabled = true;
      if (nextBtn) nextBtn.disabled = true;
      return;
    }

    // Work on raw text to find match positions, then rebuild innerHTML with <mark> injected
    const raw = el.textContent || '';
    const escaped = escHtml(raw);
    const re = new RegExp(escRegex(q), 'gi');
    let count = 0;
    const marked = escaped.replace(re, m => {
      const idx = count++;
      return `<mark data-match="${idx}">${m}</mark>`;
    });

    el.innerHTML = marked;

    if (countEl) {
      if (count === 0) {
        countEl.textContent = 'no matches';
        countEl.classList.remove('has-results');
      } else {
        countEl.classList.add('has-results');
      }
    }
    if (prevBtn) prevBtn.disabled = count === 0;
    if (nextBtn) nextBtn.disabled = count === 0;

    matchIndex = 0;
    activateMatch(count);
  }

  function activateMatch(total) {
    const countEl = document.getElementById('global-css-search-count');
    const marks = el.querySelectorAll('mark[data-match]');
    marks.forEach(m => m.classList.remove('active'));
    if (!marks.length) return;
    matchIndex = ((matchIndex % marks.length) + marks.length) % marks.length;
    const active = marks[matchIndex];
    active.classList.add('active');
    active.scrollIntoView({ block: 'center', behavior: 'smooth' });
    if (countEl) countEl.textContent = `${matchIndex + 1} / ${marks.length}`;
  }

  function escRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // ── Wire up search input ──────────────────────────────────────────────────

  const searchInput = document.getElementById('global-css-search-input');
  searchInput?.addEventListener('input', () => {
    matchIndex = 0;
    applySearch(searchInput.value.trim());
  });
  searchInput?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (e.shiftKey) { matchIndex--; } else { matchIndex++; }
      activateMatch(el.querySelectorAll('mark[data-match]').length);
    }
    if (e.key === 'Escape') {
      searchInput.value = '';
      applySearch('');
    }
  });

  document.getElementById('global-css-search-next')?.addEventListener('click', () => {
    matchIndex++;
    activateMatch(el.querySelectorAll('mark[data-match]').length);
  });
  document.getElementById('global-css-search-prev')?.addEventListener('click', () => {
    matchIndex--;
    activateMatch(el.querySelectorAll('mark[data-match]').length);
  });

  // ── Copy / reload ─────────────────────────────────────────────────────────

  document.getElementById('global-css-copy')?.addEventListener('click', async () => {
    await load();
    try {
      await navigator.clipboard.writeText(el.textContent || '');
    } catch { /* ignore */ }
  });
  document.getElementById('global-css-reload')?.addEventListener('click', load);
  load();
}

// ─── Button preview HTML builder ──────────────────────────────────────────────
// Builds the live preview HTML for a button variant row from variant config.

function buildBtnPreviewHtml(v) {
  const wrap = (name) =>
    `<div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector">${iconSvg(name)}</div></div></div>`;

  const slot = (name) =>
    `<div class="btn__icon-slot btn__icon-slot--${name}"><div class="btn__icon-vector">${iconSvg(name)}</div></div>`;

  if (v.id === 's1')
    return `<button class="btn btn--s1" tabindex="-1">${wrap(v.icons[0])}</button>`;

  if (v.id === 's2' || v.id === 's3')
    return `<button class="btn btn--${v.id}" tabindex="-1"><div class="btn__icon-group">${v.icons.map(wrap).join('')}</div></button>`;

  if (v.id === 'label')
    return `<button class="btn btn--label" tabindex="-1">${slot(v.leadIcon)}<span class="btn__label">Label</span></button>`;

  if (v.id === 'label-trail')
    return `<button class="btn btn--label-trail" tabindex="-1">${slot(v.leadIcon)}<span class="btn__label">Label</span>${slot(v.trailIcon)}</button>`;

  return '';
}

// ─── Buttons page ─────────────────────────────────────────────────────────────

function renderButtonsPage() {
  const comp = SYSTEM.components.buttons;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle}</div>
    </div>
    <div class="ds-table ds-table--section-label">
      <span style="font-size:11px;font-weight:600;color:var(--accent-black-40,#999);letter-spacing:.06em;text-transform:uppercase">Primary</span>
    </div>
    <div class="ds-table">`;

  comp.primaryVariants.forEach(v => {
    html += `
      <div class="ds-row" data-variant="${v.id}">
        <span class="ds-row-name" style="min-width:220px">${v.label.replace('Primary — ','')}</span>
        ${buildBtnPreviewHtml(v)}
      </div>`;
  });

  html += `</div>
    <div class="ds-table ds-table--section-label">
      <span style="font-size:11px;font-weight:600;color:var(--accent-black-40,#999);letter-spacing:.06em;text-transform:uppercase">Secondary</span>
    </div>
    <div class="ds-table">`;

  comp.secondaryVariants.forEach(v => {
    html += `
      <div class="ds-row" data-btn-secondary-variant="${v.id}">
        <span class="ds-row-name" style="min-width:220px">${v.label.replace('Secondary — ','')}</span>
        ${buildBtnSecondaryPreviewHtml(v)}
      </div>`;
  });

  html += `</div>`;
  return html;
}

// ─── Button / Secondary ───────────────────────────────────────────────────────

function buildBtnSecondaryPreviewHtml(v) {
  const wrap = (name) =>
    `<div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector">${iconSvg(name)}</div></div></div>`;
  return `<button class="btn btn--secondary" tabindex="-1">${v.icons.map(wrap).join('')}</button>`;
}

function btnSecondaryTabs(variantId) {
  const comp = SYSTEM.components.buttons;
  const v    = comp.secondaryVariants.find(x => x.id === variantId);
  if (!v) return null;
  const wrap = (name) =>
    `<div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector">${iconSvg(name)}</div></div></div>`;
  const iconsHtml = v.icons.map(wrap).join('');
  const css = `/* Button / Secondary — ${v.label} */
.btn--secondary {
  background: var(--accent-black-8, #ebebeb);
  border: none;
  border-radius: 100px;
  padding: 2px;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
.btn--secondary .btn__icon-wrap {
  width: 28px;
  height: 28px;
  border-radius: 160px;
  background: var(--accent-black-8, #ebebeb);
  --stroke-0: var(--accent-black-80, #333);
}
@media (hover: hover) {
  .btn--secondary .btn__icon-wrap:hover {
    background: var(--accent-black-16, #d6d6d6);
  }
}`;
  const react = `import 'flow-design-system/styles.css';
import { BtnSecondary } from 'flow-design-system/react';

<BtnSecondary icons={[${v.icons.map(i => `'${i}'`).join(', ')}]} />`;
  const vue = `<BtnSecondary :icons="[${v.icons.map(i => `'${i}'`).join(', ')}]" />`;
  const svgParts = v.icons.map(n => `<!-- ${n} -->\n<!-- .btn--secondary .btn__icon-wrap { --stroke-0: var(--accent-black-80, #333); } -->\n${SYSTEM.icons.find(i => i.name === n)?.svg || ''}`);
  return {
    'HTML':  `<button class="btn btn--secondary">\n${iconsHtml}\n</button>`,
    'CSS':   css,
    'SVG':   svgParts.join('\n\n'),
    'React': react,
    'Vue':   vue,
  };
}

// ─── Search Bar ───────────────────────────────────────────────────────────────

function buildSearchBarHtml(v = {}) {
  const wrap = (name) =>
    `<div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector">${iconSvg(name)}</div></div></div>`;
  const state = v.state || 'default';
  const stateClass = state !== 'default' ? ` search-bar__input--${state}` : '';
  const content = v.value
    ? `<span class="search-bar__value">${v.value}</span>`
    : `<span class="search-bar__placeholder">Search</span>`;
  return `<div class="search-bar__input${stateClass}">
  ${wrap('magnifying-glass')}
  ${content}
</div>`;
}

function buildSearchSectionHtml() {
  const wrap = (name) =>
    `<div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector">${iconSvg(name)}</div></div></div>`;
  return `<div class="search-section">
  <div class="search-section__row">
    <div class="search-bar__input">
      ${wrap('magnifying-glass')}
      <span class="search-bar__placeholder">Search</span>
    </div>
    <button class="btn btn--secondary" aria-label="Filter and archive">
      ${wrap('funnel')}
      ${wrap('archive-box')}
    </button>
  </div>
</div>`;
}

function mountSearchBarInteractive(el) {
  el.querySelectorAll('.search-bar__input').forEach(wrap => {
    const span = wrap.querySelector('.search-bar__placeholder, .search-bar__value');
    if (!span) return;
    const initialVal = wrap.classList.contains('search-bar__input--filled') ? (span.textContent || '') : '';
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'search-bar__field';
    input.placeholder = 'Search';
    input.value = initialVal;
    span.replaceWith(input);
    if (wrap.classList.contains('search-bar__input--focused')) {
      setTimeout(() => input.focus(), 50);
    }
    input.addEventListener('focus', () => wrap.classList.add('search-bar__input--focused'));
    input.addEventListener('blur',  () => { if (!input.value) wrap.classList.remove('search-bar__input--focused'); });
    wrap.addEventListener('click', (e) => { e.stopPropagation(); input.focus(); });
  });
}

function renderLenderSearchBarPage() {
  const comp = SYSTEM.products.lenderPortal.searchBar;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:420px">`;
  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-search-bar-variant="${v.id}" style="padding:16px 20px;align-items:center">
        <span class="ds-row-name" style="min-width:80px">${v.label}</span>
        <div style="flex:1;max-width:260px">${buildSearchBarHtml(v)}</div>
      </div>`;
  });
  html += `</div>`;
  return html;
}

function renderLenderSearchSectionPage() {
  const comp = SYSTEM.products.lenderPortal.searchSection;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table">
      <div class="ds-row" data-search-section-variant="search-section-default" style="padding:0;align-items:flex-start;overflow:hidden">
        <div style="width:320px">${buildSearchSectionHtml()}</div>
      </div>
    </div>`;
  return html;
}

function lenderSearchBarTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.searchBar;
  const v    = comp.variants.find(x => x.id === variantId) || comp.variants[0];
  const magnifySvg = SYSTEM.icons.find(i => i.name === 'magnifying-glass')?.svg || '';
  const css = `/* Search Bar — standalone input pill */
.search-bar__input {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  height: 36px;
  padding: 4px;
  background: var(--accent-white-100, #ffffff);
  border: 0.5px solid var(--accent-black-12, #e0e0e0);
  border-radius: 100px;
  overflow: hidden;
  cursor: text;
  box-sizing: border-box;
  transition: border-color 0.2s var(--ease-smooth);
}
.search-bar__input .btn__icon-wrap {
  background: unset;
  background-color: var(--accent-white-100);
  --stroke-0: var(--accent-black-60, #666);
  flex-shrink: 0;
}
/* Focused */
.search-bar__input:focus-within,
.search-bar__input--focused {
  border-color: var(--accent-black-30, #b3b3b3);
}
/* Placeholder (static) */
.search-bar__placeholder {
  font-family: 'Circular Std', -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--accent-black-60, #666);
  white-space: nowrap;
  flex-shrink: 0;
  pointer-events: none;
}
/* Value text (static filled) */
.search-bar__value {
  font-family: 'Circular Std', -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--accent-black-80, #333);
  white-space: nowrap;
  flex-shrink: 0;
  pointer-events: none;
}
/* Interactive input field */
.search-bar__field {
  flex: 1;
  min-width: 0;
  border: none;
  outline: none;
  background: transparent;
  font-family: 'Circular Std', -apple-system, sans-serif;
  font-size: 11px;
  font-weight: 400;
  color: var(--accent-black-80, #333);
}
.search-bar__field::placeholder {
  color: var(--accent-black-60, #666);
}`;
  const react = `import 'flow-design-system/styles.css';
import { SearchBarInput } from 'flow-design-system/react';

<SearchBarInput placeholder="Search" />`;
  const vue = `<!-- import 'flow-design-system/styles.css' in app root -->
<SearchBarInput placeholder="Search" />`;
  const svg = `<!-- magnifying-glass icon (stroke colour set via --stroke-0 on .btn__icon-wrap) -->
<!-- Set icon colour on the parent: -->
<!-- .search-bar__input .btn__icon-wrap { --stroke-0: var(--accent-black-60, #666); } -->

${magnifySvg}`;
  return {
    'HTML':  buildSearchBarHtml(v),
    'CSS':   css,
    'SVG':   svg,
    'React': react,
    'Vue':   vue,
  };
}

function lenderSearchSectionTabs(variantId) {
  const magnifySvg  = SYSTEM.icons.find(i => i.name === 'magnifying-glass')?.svg  || '';
  const funnelSvg   = SYSTEM.icons.find(i => i.name === 'funnel')?.svg             || '';
  const archiveSvg  = SYSTEM.icons.find(i => i.name === 'archive-box')?.svg        || '';
  const css = `/* Search Section — sticky bottom bar */
.search-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 0 12px;
  background: var(--background-1, #fcfcfd);
  border-top: 0.5px solid rgba(0, 0, 0, 0.12);
  width: 100%;
  box-sizing: border-box;
}
.search-section__row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 0;
  width: 100%;
}
/* Search Bar pill (nested) — see Search Bar component for full rules */
.search-bar__input {
  flex: 1;
  height: 36px;
  padding: 4px;
  background: var(--accent-white-100, #ffffff);
  border: 0.5px solid var(--accent-black-12, #e0e0e0);
  border-radius: 100px;
  transition: border-color 0.2s var(--ease-smooth);
}
.search-bar__input .btn__icon-wrap {
  --stroke-0: var(--accent-black-60, #666);
}
/* Action buttons (btn--secondary) — see Button/Secondary for full rules */
.btn--secondary .btn__icon-wrap {
  background: var(--accent-black-8, #ebebeb);
  --stroke-0: var(--accent-black-80, #333);
}`;
  const react = `import 'flow-design-system/styles.css';
import { SearchSection } from 'flow-design-system/react';

<SearchSection placeholder="Search" />`;
  const vue = `<!-- import 'flow-design-system/styles.css' in app root -->
<SearchSection placeholder="Search" />`;
  const svg = `<!-- Icons used in Search Section -->
<!-- Stroke colour set via --stroke-0 on the .btn__icon-wrap container -->

<!-- magnifying-glass (search input icon) -->
<!-- .search-bar__input .btn__icon-wrap { --stroke-0: var(--accent-black-60, #666); } -->
${magnifySvg}

<!-- funnel (filter action) -->
<!-- .btn--secondary .btn__icon-wrap { --stroke-0: var(--accent-black-80, #333); } -->
${funnelSvg}

<!-- archive-box (archive action) -->
${archiveSvg}`;
  return {
    'HTML':  buildSearchSectionHtml(),
    'CSS':   css,
    'SVG':   svg,
    'React': react,
    'Vue':   vue,
  };
}

// ─── Lender Portal — preview builders ────────────────────────────────────────

function buildDropdownHtml() {
  const items = SYSTEM.products.lenderPortal.loans.variants
    .find(v => v.id === 'loans-dropdown')?.items || [];
  return `<div class="loans-dropdown">${items.map(item =>
    `<div class="loans-dropdown__item${item.active ? ' loans-dropdown__item--active' : ''}">
      <span class="loans-dropdown__item-label">${item.label}</span>
      <span class="loans-dropdown__item-count">${item.count}</span>
    </div>`
  ).join('')}</div>`;
}

function buildLoansPillInteractivePreview(v) {
  return `
    <div class="loans-pill-wrap">
      <div class="loans-pill" style="cursor:pointer">
        <span class="loans-pill__label">${v.defaultText}</span>
        <div class="loans-pill__badge">
          <span class="loans-pill__count">${v.defaultCount}</span>
          <div class="loans-pill__icon"><span class="icon">${v.iconSvg || ''}</span></div>
        </div>
      </div>
      <div class="loans-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:10">
        ${buildDropdownHtml().replace(/<div class="loans-dropdown"[^>]*>|<\/div>$/, '').trim()}
      </div>
    </div>`;
}

// ─── Lender Portal — Loans page ───────────────────────────────────────────────

function renderLenderLoansPage() {
  const data = SYSTEM.products.lenderPortal.loans;
  let html = `
    <div class="section-header">
      <div class="section-title">${data.title}</div>
      <div class="section-subtitle">${data.subtitle} · <a href="${data.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table">`;

  data.variants.forEach(v => {
    let rowPreview = '';
    if (v.id === 'loans-pill') {
      rowPreview = `
        <div class="loans-pill">
          <span class="loans-pill__label">${v.defaultText}</span>
          <div class="loans-pill__badge">
            <span class="loans-pill__count">${v.defaultCount}</span>
            <div class="loans-pill__icon"><span class="icon">${v.iconSvg || ''}</span></div>
          </div>
        </div>`;
    } else if (v.id === 'loans-dropdown') {
      rowPreview = buildDropdownHtml();
    }
    html += `
      <div class="ds-row" data-lender-variant="${v.id}" data-product="loans">
        <span class="ds-row-name" style="min-width:200px">${v.label}</span>
        ${rowPreview}
      </div>`;
  });

  html += `</div>`;
  return html;
}

function lenderLoansTabs(variant) {
  if (variant === 'loans-dropdown') return lenderDropdownTabs();
  const v = SYSTEM.products.lenderPortal.loans.variants.find(x => x.id === variant);
  if (!v) return {};

  return {
    'HTML': `<!-- Include global.css -->
<div class="loans-pill">
  <span class="loans-pill__label">My Loans</span>
  <div class="loans-pill__badge">
    <span class="loans-pill__count">52</span>
    <div class="loans-pill__icon">
      <img src="[sort-icon]" alt="" />
    </div>
  </div>
</div>`,

    'CSS': `/* global.css */
/* Tokens used: accent-white-100, accent-black-12, accent-black-80, accent-black-60 */

.loans-pill {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding: 8px 8px 8px 12px;
  background: var(--accent-white-100);
  border: 0.5px solid var(--accent-black-12);
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.2s var(--ease-smooth);
}
.loans-pill:hover {
  background: var(--accent-black-2);
}
.loans-pill__label {
  font-size: 15px;
  font-weight: 500;
  color: var(--accent-black-80);
  white-space: nowrap;
}
.loans-pill__badge {
  display: flex;
  align-items: center;
  gap: 2px;
}
.loans-pill__count {
  font-size: 12px;
  color: var(--accent-black-60);
}
.loans-pill__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}`,

    'React': `import 'flow-design-system/styles.css'; /* global: tokens + icons + buttons + lender */
import { LoansPill } from 'flow-design-system-react';

// Usage
<LoansPill label="My Loans" count={52} iconSrc={sortIconUrl} onClick={openDropdown} />`,

    'Vue': `<!-- LoansPill.vue -->
<template>
  <div class="loans-pill" @click="$emit('click')">
    <span class="loans-pill__label">{{ label }}</span>
    <div class="loans-pill__badge">
      <span class="loans-pill__count">{{ count }}</span>
      <div class="loans-pill__icon">
        <img :src="icon" alt="" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label?: string;
  count?: number;
  icon: string;
}>();
defineEmits(['click']);
</script>

<!-- Usage -->
<LoansPill label="My Loans" :count="52" :icon="sortIcon" />`,

    'Tailwind': `<!-- Using Tailwind arbitrary values with token CSS vars -->
<div class="inline-flex items-center gap-3 pl-3 pr-2 py-2
            bg-[var(--accent-white-100)]
            border border-[0.5px] border-[var(--accent-black-12)]
            rounded-full cursor-pointer
            hover:bg-[var(--accent-black-2)]
            transition-colors">
  <span class="text-[15px] font-medium
               text-[var(--accent-black-80)] whitespace-nowrap">
    My Loans
  </span>
  <div class="flex items-center gap-0.5">
    <span class="text-xs text-[var(--accent-black-60)]">52</span>
    <img src="[sort-icon]" alt="" class="w-4 h-4 block" />
  </div>
</div>`,
  };
}

function lenderDropdownTabs() {
  return {
    'HTML': `<!-- Include global.css -->
<div class="loans-dropdown">
  <div class="loans-dropdown__item loans-dropdown__item--active">
    <span class="loans-dropdown__item-label">My Loans</span>
    <span class="loans-dropdown__item-count">52</span>
  </div>
  <div class="loans-dropdown__item">
    <span class="loans-dropdown__item-label">All Loans</span>
    <span class="loans-dropdown__item-count">101</span>
  </div>
  <div class="loans-dropdown__item">
    <span class="loans-dropdown__item-label">Unassigned Loans</span>
    <span class="loans-dropdown__item-count">49</span>
  </div>
</div>`,

    'CSS': `/* global.css */
/* Tokens: accent-bg-1, accent-black-12, accent-black-8,
           accent-black-80, accent-black-50, accent-black-4 */

.loans-dropdown {
  background: var(--accent-bg-1);
  border: 0.5px solid var(--accent-black-12);
  border-radius: 16px;
  padding: 4px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 154px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
}
.loans-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s var(--ease-smooth);
}
.loans-dropdown__item:hover { background: var(--accent-black-4); }
.loans-dropdown__item--active { background: var(--accent-black-8); }
.loans-dropdown__item-label {
  font-size: 12px;
  color: var(--accent-black-80);
}
.loans-dropdown__item-count {
  font-size: 12px;
  color: var(--accent-black-50);
}`,

    'React': `import { useState } from 'react';
import 'flow-design-system/styles.css'; /* global: tokens + icons + buttons + lender */

interface DropdownItem {
  label: string;
  count: number;
}

interface LoansDropdownProps {
  items: DropdownItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
}

export function LoansDropdown({
  items,
  activeIndex = 0,
  onSelect,
}: LoansDropdownProps) {
  return (
    <div className="loans-dropdown">
      {items.map((item, i) => (
        <div
          key={i}
          className={\`loans-dropdown__item\${i === activeIndex ? ' loans-dropdown__item--active' : ''}\`}
          onClick={() => onSelect?.(i)}
        >
          <span className="loans-dropdown__item-label">{item.label}</span>
          <span className="loans-dropdown__item-count">{item.count}</span>
        </div>
      ))}
    </div>
  );
}

// Usage — typically paired with LoansPill
const [activeIdx, setActiveIdx] = useState(0);
<LoansDropdown
  items={[
    { label: 'My Loans', count: 52 },
    { label: 'All Loans', count: 101 },
    { label: 'Unassigned Loans', count: 49 },
  ]}
  activeIndex={activeIdx}
  onSelect={setActiveIdx}
/>`,

    'Vue': `<!-- LoansDropdown.vue -->
<template>
  <div class="loans-dropdown">
    <div
      v-for="(item, i) in items"
      :key="i"
      :class="['loans-dropdown__item', { 'loans-dropdown__item--active': i === modelValue }]"
      @click="$emit('update:modelValue', i)"
    >
      <span class="loans-dropdown__item-label">{{ item.label }}</span>
      <span class="loans-dropdown__item-count">{{ item.count }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: { label: string; count: number }[]; modelValue?: number }>();
defineEmits(['update:modelValue']);
</script>

<!-- Usage -->
<LoansDropdown :items="loanItems" v-model="activeIdx" />`,

    'Tailwind': `<div class="bg-[var(--accent-bg-1)] border border-[0.5px]
         border-[var(--accent-black-12)] rounded-2xl p-1
         flex flex-col gap-1 w-[154px]
         shadow-[0_4px_16px_rgba(0,0,0,0.07)]">
  <!-- Active item -->
  <div class="flex items-center justify-between px-2 py-2
              rounded-xl bg-[var(--accent-black-8)] cursor-pointer">
    <span class="text-xs text-[var(--accent-black-80)]">My Loans</span>
    <span class="text-xs text-[var(--accent-black-50)]">52</span>
  </div>
  <!-- Default item -->
  <div class="flex items-center justify-between px-2 py-2
              rounded-xl hover:bg-[var(--accent-black-4)] cursor-pointer transition-colors">
    <span class="text-xs text-[var(--accent-black-80)]">All Loans</span>
    <span class="text-xs text-[var(--accent-black-50)]">101</span>
  </div>
  <div class="flex items-center justify-between px-2 py-2
              rounded-xl hover:bg-[var(--accent-black-4)] cursor-pointer transition-colors">
    <span class="text-xs text-[var(--accent-black-80)]">Unassigned Loans</span>
    <span class="text-xs text-[var(--accent-black-50)]">49</span>
  </div>
</div>`,
  };
}

// ─── Page registry ────────────────────────────────────────────────────────────
// Maps page id → render function.
// To add a new section: add a renderer here and a new key in SYSTEM.

// ─── Dropdown Item page ───────────────────────────────────────────────────────

function renderDropdownItemPage() {
  const comp = SYSTEM.components.dropdownItem;
  const stateClass = { default: '', hover: ' loans-dropdown__item--hover', selected: ' loans-dropdown__item--selected' };
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle}</div>
    </div>
    <div class="ds-table" style="max-width:640px">`;

  comp.variants.forEach(v => {
    const cls = stateClass[v.state] || '';
    const itemHtml = `
      <div class="loans-dropdown__item${cls}" style="width:200px">
        <span class="loans-dropdown__item-label">My Loans</span>
        <span class="loans-dropdown__item-count">12</span>
      </div>`;
    html += `
      <div class="ds-row" data-dropdown-variant="${v.id}">
        <span class="ds-row-name" style="min-width:180px">${v.label}</span>
        ${itemHtml}
      </div>`;
  });

  html += `</div>`;
  return html;
}

function dropdownItemTabs(variantId) {
  const state = variantId.replace('dropdown-item-', ''); // 'default' | 'hover' | 'selected'
  const modClass = state === 'hover' ? ' loans-dropdown__item--hover'
                 : state === 'selected' ? ' loans-dropdown__item--selected'
                 : '';
  const stateComment = state === 'hover'    ? '<!-- hover state -->'
                     : state === 'selected' ? '<!-- selected state -->'
                     : '<!-- default state -->';
  return {
    'HTML': `<!-- Include global.css -->
${stateComment}
<div class="loans-dropdown__item${modClass}">
  <span class="loans-dropdown__item-label">My Loans</span>
  <span class="loans-dropdown__item-count">12</span>
</div>`,

    'CSS': `/* global.css — source of truth */
/* Tokens: accent-black-80, accent-black-50, accent-black-8, accent-black-4 */

/* Base */
.loans-dropdown__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.2s var(--ease-smooth);
}

/* Hover state — applied on :hover or .--hover modifier */
.loans-dropdown__item:hover,
.loans-dropdown__item--hover {
  background: var(--accent-black-4);   /* #f5f5f5 */
}

/* Selected state */
.loans-dropdown__item--selected {
  background: var(--accent-black-8);   /* #ebebeb */
}

.loans-dropdown__item-label { font-size: 12px; color: var(--accent-black-80); }
.loans-dropdown__item-count { font-size: 12px; color: var(--accent-black-50); }`,

    'React': `import 'flow-design-system/styles.css'; /* global: tokens + icons + buttons + lender */

type DropdownItemState = 'default' | 'hover' | 'selected';

interface DropdownItemProps {
  label: string;
  count?: number;
  state?: DropdownItemState;
  onClick?: () => void;
}

export function DropdownItem({
  label,
  count,
  state = 'default',
  onClick,
}: DropdownItemProps) {
  return (
    <div
      className={\`loans-dropdown__item\${
        state === 'selected' ? ' loans-dropdown__item--selected' : ''
      }\`}
      onClick={onClick}
    >
      <span className="loans-dropdown__item-label">{label}</span>
      {count !== undefined && (
        <span className="loans-dropdown__item-count">{count}</span>
      )}
    </div>
  );
}

// Usage
<DropdownItem label="My Loans" count={12} state="selected" />
<DropdownItem label="All Loans" count={101} />`,

    'Vue': `<!-- DropdownItem.vue -->
<template>
  <div
    :class="['loans-dropdown__item', { 'loans-dropdown__item--selected': state === 'selected' }]"
    @click="$emit('click')"
  >
    <span class="loans-dropdown__item-label">{{ label }}</span>
    <span v-if="count !== undefined" class="loans-dropdown__item-count">
      {{ count }}
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  count?: number;
  state?: 'default' | 'hover' | 'selected';
}>();
defineEmits(['click']);
</script>

<!-- Usage -->
<DropdownItem label="My Loans" :count="12" state="selected" />`,

    'Tailwind': `<!-- Default -->
<div class="flex items-center justify-between p-2
            rounded-xl hover:bg-[var(--accent-black-4)]
            cursor-pointer transition-colors">
  <span class="text-xs text-[var(--accent-black-80)]">My Loans</span>
  <span class="text-xs text-[var(--accent-black-50)]">12</span>
</div>

<!-- Hover (force-show) -->
<div class="flex items-center justify-between p-2
            rounded-xl bg-[var(--accent-black-4)] cursor-pointer">
  <span class="text-xs text-[var(--accent-black-80)]">My Loans</span>
  <span class="text-xs text-[var(--accent-black-50)]">12</span>
</div>

<!-- Selected -->
<div class="flex items-center justify-between p-2
            rounded-xl bg-[var(--accent-black-8)] cursor-pointer">
  <span class="text-xs text-[var(--accent-black-80)]">My Loans</span>
  <span class="text-xs text-[var(--accent-black-50)]">12</span>
</div>`,
  };
}

// ─── Segment Picker ───────────────────────────────────────────────────────────

function buildSegmentPickerHtml(v) {
  const userIcon     = iconSvg('user');
  const buildingIcon = iconSvg('building-office-2');
  const indActive    = v.activeVal === 'individual';
  const indClass     = `proto-toggle__btn${indActive ? ' proto-toggle__btn--active' : (!indActive && v.hoverVal === 'individual' ? ' proto-toggle__btn--preview-hover' : '')}`;
  const entClass     = `proto-toggle__btn${!indActive ? ' proto-toggle__btn--active' : (v.hoverVal === 'entity' ? ' proto-toggle__btn--preview-hover' : '')}`;
  return `<div class="proto-toggle" data-toggle>
  <div class="proto-toggle__pill"></div>
  <button class="${indClass}" data-toggle-val="individual">
    <span class="proto-toggle__icon">${userIcon}</span>
    <span class="proto-toggle__label">Individual</span>
  </button>
  <button class="${entClass}" data-toggle-val="entity">
    <span class="proto-toggle__icon">${buildingIcon}</span>
    <span class="proto-toggle__label">Entity</span>
  </button>
</div>`;
}

/** Position the pill over the active button inside a given container element. */
function initSegmentPill(el) {
  el.querySelectorAll('[data-toggle]').forEach(toggleEl => {
    const pill      = toggleEl.querySelector('.proto-toggle__pill');
    const activeBtn = toggleEl.querySelector('.proto-toggle__btn--active');
    if (!pill || !activeBtn) return;
    const cRect = toggleEl.getBoundingClientRect();
    const bRect = activeBtn.getBoundingClientRect();
    pill.style.left   = `${bRect.left - cRect.left}px`;
    pill.style.top    = `${bRect.top  - cRect.top}px`;
    pill.style.width  = `${bRect.width}px`;
    pill.style.height = `${bRect.height}px`;
  });
}

function renderSegmentPickerPage() {
  const comp = SYSTEM.components.segmentPicker;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle}</div>
    </div>
    <div class="ds-table" style="max-width:640px">`;
  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-segment-picker-variant="${v.id}">
        <span class="ds-row-name" style="min-width:180px">${v.label}</span>
        ${buildSegmentPickerHtml(v)}
      </div>`;
  });
  html += `</div>`;
  return html;
}

function segmentPickerTabs(variantId) {
  const comp     = SYSTEM.components.segmentPicker;
  const v        = comp.variants.find(vv => vv.id === variantId) || comp.variants[0];
  const indActive = v.activeVal === 'individual';

  return {
    'HTML': `<!-- Include global.css -->
${indActive ? '<!-- Individual active -->' : '<!-- Entity active -->'}
<div class="proto-toggle" data-toggle>
  <div class="proto-toggle__pill"></div>

  <button class="proto-toggle__btn${indActive ? ' proto-toggle__btn--active' : ''}"
          data-toggle-val="individual">
    <span class="proto-toggle__icon"><!-- user icon --></span>
    <span class="proto-toggle__label">Individual</span>
  </button>

  <button class="proto-toggle__btn${!indActive ? ' proto-toggle__btn--active' : ''}"
          data-toggle-val="entity">
    <span class="proto-toggle__icon"><!-- building-office-2 icon --></span>
    <span class="proto-toggle__label">Entity</span>
  </button>
</div>

<script>
  document.querySelectorAll('[data-toggle]').forEach(initSegmentPicker);
</script>`,

    'CSS': `/* global.css */
/* Tokens: accent-black-8 (#ebebeb), accent-black-12 (#e0e0e0), accent-white-100 (#fff) */

.proto-toggle {
  display: inline-flex;
  align-self: flex-start;
  background: var(--accent-black-8, #ebebeb);
  border-radius: 100px;
  padding: 4px;
  gap: 2px;
  position: relative;
}

/* Sliding pill — left/top/width/height set by JS on load and on each switch */
.proto-toggle__pill {
  position: absolute;
  background: var(--accent-white-100, #fff);
  border-radius: 100px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.10), 0 0 0 0.5px rgba(0,0,0,0.06);
  pointer-events: none;
  z-index: 0;
}

.proto-toggle__btn {
  display: inline-flex;
  align-items: center;
  padding: 8px;
  border-radius: 100px;
  position: relative;
  z-index: 1;
  cursor: pointer;
  transition: background 0.16s cubic-bezier(0.4, 0, 1, 0.8);
}

/* Active button expands right to reveal label */
.proto-toggle__btn--active { padding-right: 12px; }

/* Inactive hover */
.proto-toggle__btn:not(.proto-toggle__btn--active):hover {
  background: var(--accent-black-12, #e0e0e0);
}

.proto-toggle__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Label: collapsed by default, revealed on active via max-width */
.proto-toggle__label {
  font-size: 12px;
  font-weight: 400;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  max-width: 0;
  opacity: 0;
  margin-left: 0;
  /* No CSS transitions — WAAPI animates opacity; max-width/margin snap instantly */
}

.proto-toggle__btn--active .proto-toggle__label {
  max-width: 80px;
  opacity: 1;
  margin-left: 8px;
}`,

    'JS': `// Call once after DOM is ready.
// Uses getBoundingClientRect() to measure positions — avoids offsetParent issues.
function initSegmentPicker(toggleEl) {
  const pill      = toggleEl.querySelector('.proto-toggle__pill');
  const activeBtn = toggleEl.querySelector('.proto-toggle__btn--active');
  if (!pill || !activeBtn) return;

  // Position pill over the active button
  const cRect = toggleEl.getBoundingClientRect();
  const bRect = activeBtn.getBoundingClientRect();
  pill.style.left   = \`\${bRect.left - cRect.left}px\`;
  pill.style.top    = \`\${bRect.top  - cRect.top}px\`;
  pill.style.width  = \`\${bRect.width}px\`;
  pill.style.height = \`\${bRect.height}px\`;

  toggleEl.querySelectorAll('.proto-toggle__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const oldBtn = toggleEl.querySelector('.proto-toggle__btn--active');
      if (!oldBtn || oldBtn === btn) return;

      // Snapshot FROM geometry before any DOM change
      const fromRect = oldBtn.getBoundingClientRect();

      // Switch class — layout reflows here
      oldBtn.classList.remove('proto-toggle__btn--active');
      btn.classList.add('proto-toggle__btn--active');

      // Snapshot TO geometry AFTER reflow (re-read cRect too — toggle may shift)
      const cRect2  = toggleEl.getBoundingClientRect();
      const toRect  = btn.getBoundingClientRect();
      const goRight = toRect.left > fromRect.left;
      const dx      = (fromRect.left + fromRect.width / 2) - (toRect.left + toRect.width / 2);
      const scaleX  = fromRect.width / toRect.width;

      // Commit pill to final position
      pill.style.left   = \`\${toRect.left - cRect2.left}px\`;
      pill.style.top    = \`\${toRect.top  - cRect2.top}px\`;
      pill.style.width  = \`\${toRect.width}px\`;
      pill.style.height = \`\${toRect.height}px\`;

      // Pill glide — fluid-enter (fast start, long deceleration)
      pill.getAnimations().forEach(a => a.cancel());
      const pillAnim = pill.animate([
        { transform: \`translateX(\${dx}px) scaleX(\${scaleX})\` },
        { transform: 'translateX(0) scaleX(1)' },
      ], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'none' });
      pillAnim.onfinish = () => { pill.style.transform = ''; };

      // Old label exit — quick fluid-exit fade
      const oldLabel = oldBtn.querySelector('.proto-toggle__label');
      if (oldLabel) {
        oldLabel.getAnimations().forEach(a => a.cancel());
        oldLabel.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 120, easing: 'cubic-bezier(0.4, 0, 1, 0.8)', fill: 'none' }
        );
      }

      // New label enter — slides in from the direction of travel
      const newLabel = btn.querySelector('.proto-toggle__label');
      if (newLabel) {
        const enterX = goRight ? 7 : -7;
        newLabel.getAnimations().forEach(a => a.cancel());
        newLabel.animate([
          { transform: \`translateX(\${enterX}px)\`, opacity: 0 },
          { transform: 'translateX(0)',              opacity: 1 },
        ], { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'none', delay: 30 });
      }
    });
  });
}

// Usage
document.querySelectorAll('[data-toggle]').forEach(initSegmentPicker);`,

    'React': `import { useRef, useLayoutEffect, useState } from 'react';
import 'flow-design-system/styles.css';

type SegmentValue = 'individual' | 'entity';

interface SegmentPickerProps {
  value?: SegmentValue;
  onChange?: (value: SegmentValue) => void;
}

export function SegmentPicker({ value = 'individual', onChange }: SegmentPickerProps) {
  const [active, setActive] = useState<SegmentValue>(value);
  const toggleRef = useRef<HTMLDivElement>(null);
  const pillRef   = useRef<HTMLDivElement>(null);

  // Position pill after every render (active changes trigger re-position)
  useLayoutEffect(() => {
    const el   = toggleRef.current;
    const pill = pillRef.current;
    if (!el || !pill) return;
    const btn = el.querySelector<HTMLElement>('.proto-toggle__btn--active');
    if (!btn) return;
    const cRect = el.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    pill.style.left   = \`\${bRect.left - cRect.left}px\`;
    pill.style.top    = \`\${bRect.top  - cRect.top}px\`;
    pill.style.width  = \`\${bRect.width}px\`;
    pill.style.height = \`\${bRect.height}px\`;
  }, [active]);

  const handleClick = (val: SegmentValue) => {
    if (val === active) return;
    setActive(val);
    onChange?.(val);
  };

  const options: { val: SegmentValue; label: string }[] = [
    { val: 'individual', label: 'Individual' },
    { val: 'entity',     label: 'Entity'     },
  ];

  return (
    <div className="proto-toggle" ref={toggleRef}>
      <div className="proto-toggle__pill" ref={pillRef} />
      {options.map(({ val, label }) => (
        <button
          key={val}
          className={\`proto-toggle__btn\${active === val ? ' proto-toggle__btn--active' : ''}\`}
          data-toggle-val={val}
          onClick={() => handleClick(val)}
        >
          <span className="proto-toggle__icon">
            {val === 'individual' ? <UserIcon /> : <BuildingIcon />}
          </span>
          <span className="proto-toggle__label">{label}</span>
        </button>
      ))}
    </div>
  );
}

// Usage
<SegmentPicker value="individual" onChange={(v) => console.log('switched to', v)} />`,
  };
}

// ─── Lender Portal — Status / Stage / Status Stage ────────────────────────────

function buildLpStatusHtml(v) {
  return `<div class="lp-status">
  <div class="lp-status__dot lp-status__dot--${v.dot}"></div>
  <span class="lp-status__label">${v.statusLabel}</span>
</div>`;
}

function getStatusMenuItems() {
  return SYSTEM.products.lenderPortal.status.statusMenuItems || [];
}

function buildStatusMenuInnerHtml(selectedLabel) {
  return getStatusMenuItems()
    .map(
      item => `
    <div class="loans-dropdown__item${item.label === selectedLabel ? ' loans-dropdown__item--active' : ''}" data-status-dot="${item.dot}">
      <span class="loans-dropdown__item-label">${item.label}</span>
    </div>`
    )
    .join('');
}

/** Interactive row + panel preview: click pill → loans-dropdown menu (design system pattern). */
function buildLpStatusInteractiveHtml(v) {
  return `<div class="lp-status-dropdown-wrap" data-amoeba-wrap>
    <div class="lp-status lp-status--clickable" data-lp-status-trigger role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
      <div class="lp-status__dot lp-status__dot--${v.dot}"></div>
      <span class="lp-status__label">${v.statusLabel}</span>
    </div>
    <div class="loans-dropdown loans-dropdown--status-menu" data-lp-status-menu style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:30">
      ${buildStatusMenuInnerHtml(v.statusLabel)}
    </div>
  </div>`;
}

/** WeakMap: wrap element → { isOpen, closeMenu, openMenu } for outside-click / Escape. */
const amoebaWrapToApi = new WeakMap();
/** All mounted amoeba APIs — close others when opening one. */
const amoebaDropdownApis = new Set();

/**
 * Shared “amoeba” open/close (LP status menu + prototype overview mode).
 * Trigger/menu markup: absolute menu, display:none → flex, same keyframes as lp-status.
 */
function mountAmoebaDropdownPair(trigger, menu) {
  if (!trigger || !menu) return null;

  const wrap = trigger.closest('[data-amoeba-wrap]');
  let menuAnim = null;

  const api = {
    isOpen() {
      return trigger.getAttribute('aria-expanded') === 'true';
    },
    closeMenu: null,
    openMenu: null,
  };

  function closeOthers() {
    amoebaDropdownApis.forEach(other => {
      if (other !== api && other.isOpen()) other.closeMenu();
    });
  }

  function animateTriggerSplit() {
    trigger.animate([
      { transform: 'scaleX(1)    scaleY(1)',    offset: 0,    easing: 'cubic-bezier(0.4, 0, 1, 0.8)'   },
      { transform: 'scaleX(0.86) scaleY(1.14)', offset: 0.18, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
      { transform: 'scaleX(1)    scaleY(1)',    offset: 1                                               },
    ], { duration: 480, easing: 'linear', fill: 'none' });
  }

  function animateTriggerMerge() {
    trigger.animate([
      { transform: 'scaleX(1)    scaleY(1)',    offset: 0,    easing: 'cubic-bezier(0.34, 1.48, 0.64, 1)' },
      { transform: 'scaleX(1.08) scaleY(0.88)', offset: 0.35, easing: 'cubic-bezier(0.34, 1.48, 0.64, 1)' },
      { transform: 'scaleX(1)    scaleY(1)',    offset: 1                                                   },
    ], { duration: 280, easing: 'linear', fill: 'none' });
  }

  function setOriginToTriggerCenter() {
    const originX = trigger.offsetWidth / 2;
    menu.style.transformOrigin = `${originX}px top`;
  }

  api.closeMenu = function closeMenu() {
    if (!api.isOpen()) return;
    trigger.setAttribute('aria-expanded', 'false');
    animateTriggerMerge();
    setOriginToTriggerCenter();
    if (menuAnim) { menuAnim.onfinish = null; menuAnim.cancel(); menuAnim = null; }

    menuAnim = menu.animate([
      { transform: 'scaleX(1)    scaleY(1)      translateY(0px)',  borderRadius: '16px',  offset: 0,    easing: 'cubic-bezier(0.4, 0, 1, 0.8)'  },
      { transform: 'scaleX(0.60) scaleY(0.08)  translateY(-3px)', borderRadius: '100px', offset: 0.75, easing: 'cubic-bezier(0.4, 0, 1, 0.8)'  },
      { transform: 'scaleX(0.44) scaleY(0.02)  translateY(-4px)', borderRadius: '100px', offset: 1                                                },
    ], { duration: 240, easing: 'linear', fill: 'none' });

    menuAnim.onfinish = () => {
      menu.style.display = 'none';
      menuAnim = null;
    };
  };

  api.openMenu = function openMenu() {
    closeOthers();
    trigger.setAttribute('aria-expanded', 'true');
    menu.style.display = 'flex';
    setOriginToTriggerCenter();
    animateTriggerSplit();
    if (menuAnim) { menuAnim.onfinish = null; menuAnim.cancel(); menuAnim = null; }

    menuAnim = menu.animate([
      { transform: 'scaleX(0.44) scaleY(0.02)  translateY(-4px)', borderRadius: '100px', offset: 0,    easing: 'cubic-bezier(0.12, 0, 0.36, 0)'  },
      { transform: 'scaleX(0.72) scaleY(0.28)  translateY(-2px)', borderRadius: '80px',  offset: 0.22, easing: 'cubic-bezier(0.16, 1, 0.3, 1)'  },
      { transform: 'scaleX(1.01) scaleY(1.03)  translateY(0px)',  borderRadius: '16px',  offset: 0.72, easing: 'cubic-bezier(0.16, 1, 0.3, 1)'  },
      { transform: 'scaleX(1)    scaleY(1)      translateY(0px)',  borderRadius: '16px',  offset: 1                                               },
    ], { duration: 520, easing: 'linear', fill: 'none' });

    menuAnim.onfinish = () => { menuAnim = null; };
  };

  amoebaDropdownApis.add(api);
  if (wrap) amoebaWrapToApi.set(wrap, api);

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    api.isOpen() ? api.closeMenu() : api.openMenu();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    api.isOpen() ? api.closeMenu() : api.openMenu();
  });

  return api;
}

function mountLpStatusDropdown(root) {
  const trigger = root.querySelector('[data-lp-status-trigger]');
  const menu    = root.querySelector('[data-lp-status-menu]');
  const api     = mountAmoebaDropdownPair(trigger, menu);
  if (!api) return;

  menu.querySelectorAll('.loans-dropdown__item').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const labelSpan = opt.querySelector('.loans-dropdown__item-label');
      const dot        = opt.dataset.statusDot;
      const text       = labelSpan ? labelSpan.textContent : '';
      const dotEl      = trigger.querySelector('.lp-status__dot');
      const statusLabel = trigger.querySelector('.lp-status__label');
      if (dotEl && dot) dotEl.className = `lp-status__dot lp-status__dot--${dot}`;
      if (statusLabel) statusLabel.textContent = text;
      menu.querySelectorAll('.loans-dropdown__item').forEach(x => x.classList.remove('loans-dropdown__item--active'));
      opt.classList.add('loans-dropdown__item--active');
      api.closeMenu();
    });
  });
}

function buildLpStageHtml(v) {
  return `<div class="lp-stage">
  <span class="lp-stage__label">${v.stageLabel}</span>
  <div class="lp-stage__btn">
    <div class="lp-stage__btn-inner">
      <span class="icon">${iconSvg('forward')}</span>
    </div>
  </div>
</div>`;
}

function buildLpStatusStageHtml(v) {
  const statusV = { dot: v.status.dot, statusLabel: v.status.label };
  return `<div class="lp-status-stage">
    ${buildLpStatusHtml(statusV)}
    ${buildLpStageHtml({ stageLabel: v.stage.label })}
  </div>`;
}

/** Status Stage = interactive Status (dropdown) + Stage from the same builders as those pages. */
function buildLpStatusStageInteractiveHtml(v) {
  const statusAsVariant = { dot: v.status.dot, statusLabel: v.status.label };
  return `<div class="lp-status-stage">
    ${buildLpStatusInteractiveHtml(statusAsVariant)}
    ${buildLpStageHtml({ stageLabel: v.stage.label })}
  </div>`;
}

function renderLenderStatusPage() {
  const comp = SYSTEM.products.lenderPortal.status;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">`;

  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-lp-status-variant="${v.id}">
        <span class="ds-row-name" style="min-width:120px">${v.label}</span>
        ${buildLpStatusInteractiveHtml(v)}
      </div>`;
  });

  html += `</div>`;
  return html;
}

function renderLenderStagePage() {
  const comp = SYSTEM.products.lenderPortal.stage;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">`;

  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-lp-stage-variant="${v.id}">
        <span class="ds-row-name" style="min-width:120px">${v.label}</span>
        ${buildLpStageHtml(v)}
      </div>`;
  });

  html += `</div>`;
  return html;
}

function renderLenderStatusStagePage() {
  const comp = SYSTEM.products.lenderPortal.statusStage;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">`;

  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-lp-status-stage-variant="${v.id}">
        <span class="ds-row-name" style="min-width:160px">${v.label}</span>
        ${buildLpStatusStageInteractiveHtml(v)}
      </div>`;
  });

  html += `</div>`;
  return html;
}

function lpStatusTabs(variantId) {
  const v = SYSTEM.products.lenderPortal.status.variants.find(x => x.id === variantId);
  if (!v) return {};
  return {
    'HTML': `<!-- Include global.css -->
<!-- Click pill to open. Menu rows = same .loans-dropdown__item pattern as Dropdown Item. -->
${buildLpStatusInteractiveHtml(v)}`,

    'CSS': `/* global.css */
/* Tokens: accent-black-8, accent-black-12, accent-black-80, accent-green-100 */

.lp-status {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 8px 12px;
  background: var(--accent-black-8);
  border-radius: 100px 4px 4px 100px;
  transition: background 0.2s var(--ease-smooth);
}
.lp-status:hover { background: var(--accent-black-12); }
.lp-status__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lp-status__dot--green { background: var(--accent-green-100); }
.lp-status__dot--amber { background: #f59e0b; }
.lp-status__dot--red   { background: var(--accent-red-100); }
.lp-status__label { font-size: 12px; color: var(--accent-black-80); white-space: nowrap; }

.lp-status-dropdown-wrap { position: relative; display: inline-block; }
.lp-status--clickable { cursor: pointer; }
.loans-dropdown--status-menu { width: auto; min-width: 168px; }`,

    'React': `import 'flow-design-system/styles.css'; /* global: tokens + icons + buttons + lender */
import { LpStatusWithMenu, LP_STATUS_MENU_DEFAULT } from 'flow-design-system-react';

// Usage — default options (Active / On Hold / Withdrawn / Cancelled / Denied)
<LpStatusWithMenu initialLabel="Active" initialDot="green" />

// Custom options
<LpStatusWithMenu
  initialLabel="Active"
  initialDot="green"
  options={[
    { label: 'Active',    dot: 'green' },
    { label: 'On Hold',   dot: 'amber' },
    { label: 'Withdrawn', dot: 'red'   },
  ]}
/>`,

    'Vue': `<!-- LpStatus.vue -->
<template>
  <div class="lp-status">
    <div :class="['lp-status__dot', \`lp-status__dot--\${dot}\`]" />
    <span class="lp-status__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ dot?: 'green' | 'amber' | 'red'; label: string }>();
</script>

<!-- Usage -->
<LpStatus dot="green" label="Active" />`,

    'Tailwind': `<div class="inline-flex items-center gap-2 h-8 px-3 py-2
            bg-[var(--accent-black-8)]
            rounded-[100px_4px_4px_100px]
            hover:bg-[var(--accent-black-12)] transition-colors">
  <div class="w-2 h-2 rounded-full shrink-0 bg-[var(--accent-green-100)]"></div>
  <span class="text-xs text-[var(--accent-black-80)] whitespace-nowrap">Active</span>
</div>`,
  };
}

function lpStageTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.stage;
  const v = comp.variants.find(x => x.id === variantId);
  if (!v) return {};
  return {
    'HTML': `<!-- Include global.css -->
${buildLpStageHtml(v)}`,

    'CSS': `/* global.css */
/* Tokens: accent-black-8, accent-black-12, accent-black-20, accent-black-80, accent-white-100 */

.lp-stage {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  height: 32px;
  padding-left: 12px;
  background: var(--accent-black-8);
  border-radius: 4px 100px 100px 4px;
  overflow: hidden;
  transition: background 0.2s var(--ease-smooth);
}
.lp-stage:hover { background: var(--accent-black-12); }
.lp-stage__label { font-size: 12px; color: var(--accent-black-80); white-space: nowrap; }
/* Outer ring */
.lp-stage__btn {
  border-radius: 100px;
  border: 2px solid var(--accent-white-100);
  padding: 2px;
  flex-shrink: 0; cursor: pointer;
}
/* Inner circle — 28×28, holds icon */
.lp-stage__btn-inner {
  width: 28px; height: 28px; border-radius: 100px;
  background: var(--accent-black-8); overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s var(--ease-smooth);
}
.lp-stage__btn-inner {
  --stroke-0: var(--accent-black-80, #333);
}
.lp-stage__btn:hover .lp-stage__btn-inner { background: var(--accent-black-20); }`,

    'SVG': `<!-- forward icon (stroke colour set via --stroke-0 on .lp-stage__btn-inner) -->
<!-- .lp-stage__btn-inner { --stroke-0: var(--accent-black-80, #333); } -->
${SYSTEM.icons.find(i => i.name === 'forward')?.svg || ''}`,

    'React': `import 'flow-design-system/styles.css'; /* global: tokens + icons + buttons + lender */
import { LpStage } from 'flow-design-system-react';

// forwardIconUrl — URL to the forward icon asset from your project
// Usage
<LpStage label="Underwriting" forwardIconUrl={forwardIconUrl} onForward={handleForward} />`,

    'Vue': `<!-- LpStage.vue -->
<template>
  <div class="lp-stage">
    <span class="lp-stage__label">{{ label }}</span>
    <button class="lp-stage__btn" @click="$emit('forward')">
      <div class="lp-stage__btn-inner">
        <span class="icon" v-html="ICONS['forward']" />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ICONS } from './icons';
defineProps<{ label: string }>();
defineEmits(['forward']);
</script>

<!-- Usage -->
<LpStage label="Underwriting" @forward="handleForward" />`,

    'Tailwind': `<div class="inline-flex items-center gap-[10px] h-8 pl-3
            bg-[var(--accent-black-8)]
            rounded-[4px_100px_100px_4px] overflow-hidden">
  <span class="text-xs text-[var(--accent-black-80)] whitespace-nowrap">Underwriting</span>
  <button class="rounded-full shrink-0 flex items-center justify-center p-0.5
                 border-2 border-white cursor-pointer
                 hover:[&_.lp-stage__btn-inner]:bg-[var(--accent-black-20)]">
    <div class="size-7 rounded-full bg-[var(--accent-black-8)]
                flex items-center justify-center">
      <span class="icon size-4">${iconSvg('forward')}</span>
    </div>
  </button>
</div>`,
  };
}

function statusStageTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.statusStage;
  const v = comp.variants.find(x => x.id === variantId);
  if (!v) return {};
  return {
    'HTML': `<!-- Include global.css -->
<!-- Click the left status pill to open the menu (.loans-dropdown pattern). -->
${buildLpStatusStageInteractiveHtml(v)}`,

    'CSS': `/* global.css */
/* Tokens: accent-black-8, accent-black-12, accent-black-20, accent-black-80, accent-green-100, accent-white-100 */

/* Composite wrapper */
.lp-status-stage { display: inline-flex; align-items: center; gap: 2px; height: 32px; }

/* Left pill — Status */
.lp-status {
  display: inline-flex; align-items: center; gap: 8px;
  height: 32px; padding: 8px 12px;
  background: var(--accent-black-8);
  border-radius: 100px 4px 4px 100px; transition: background 0.2s var(--ease-smooth);
}
.lp-status:hover { background: var(--accent-black-12); }
.lp-status__dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.lp-status__dot--green { background: var(--accent-green-100); }
.lp-status__label { font-size: 12px; color: var(--accent-black-80); white-space: nowrap; }

/* Right pill — Stage */
.lp-stage {
  display: inline-flex; align-items: center; gap: 10px;
  height: 32px; padding-left: 12px;
  background: var(--accent-black-8);
  border-radius: 4px 100px 100px 4px; overflow: hidden; transition: background 0.2s var(--ease-smooth);
}
.lp-stage:hover { background: var(--accent-black-12); }
.lp-stage__label { font-size: 12px; color: var(--accent-black-80); white-space: nowrap; }
/* Outer ring */
.lp-stage__btn {
  border-radius: 100px;
  border: 2px solid var(--accent-white-100);
  padding: 2px; flex-shrink: 0; cursor: pointer;
}
/* Inner circle — 28×28, holds icon */
.lp-stage__btn-inner {
  width: 28px; height: 28px; border-radius: 100px;
  background: var(--accent-black-8); overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s var(--ease-smooth);
  --stroke-0: var(--accent-black-80, #333);
}
.lp-stage__btn:hover .lp-stage__btn-inner { background: var(--accent-black-20); }`,

    'SVG': `<!-- forward icon (stroke colour set via --stroke-0 on .lp-stage__btn-inner) -->
${SYSTEM.icons.find(i => i.name === 'forward')?.svg || ''}`,

    'React': `import 'flow-design-system/styles.css'; /* global: tokens + icons + buttons + lender */
import { LpStatusWithMenu, LpStage } from 'flow-design-system-react';

// Status Stage = Status page piece + Stage page piece (same imports as those sections).
// Shortcut: import { LpStatusStage } if you prefer one component.

interface Props {
  fwdIcon: string;
}

export function LoanStatusStageRow({ fwdIcon }: Props) {
  return (
    <div className="lp-status-stage">
      <LpStatusWithMenu initialLabel="Active" initialDot="green" />
      <LpStage
        label="Underwriting"
        forwardIconUrl={fwdIcon}
        onForward={() => {}}
      />
    </div>
  );
}

// Usage — wrap in your screen where you have the forward icon URL:
export function ExampleLoanToolbar({ fwdIcon }: { fwdIcon: string }) {
  return <LoanStatusStageRow fwdIcon={fwdIcon} />;
}

// Usage — same layout without LoanStatusStageRow (wire props from your data):
export function ExampleInline({
  fwdIcon,
  statusLabel = 'Active',
  statusDot = 'green',
  stageLabel = 'Underwriting',
}: {
  fwdIcon: string;
  statusLabel?: string;
  statusDot?: 'green' | 'amber' | 'red';
  stageLabel?: string;
}) {
  return (
    <div className="lp-status-stage">
      <LpStatusWithMenu initialLabel={statusLabel} initialDot={statusDot} />
      <LpStage label={stageLabel} forwardIconUrl={fwdIcon} onForward={() => {}} />
    </div>
  );
}`,

    'Vue': `<!-- Compose the same pieces as Status + Stage pages -->
<template>
  <div class="lp-status-stage">
    <LpStatusWithMenu :initial-label="status.label" :initial-dot="status.dot" />
    <LpStage :label="stage.label" :forward-icon-url="forwardIconUrl" @forward="$emit('forward')" />
  </div>
</template>

<script setup lang="ts">
import LpStatusWithMenu from './LpStatusWithMenu.vue';
import LpStage from './LpStage.vue';
defineProps<{
  status: { dot: 'green' | 'amber' | 'red'; label: string };
  stage: { label: string };
  forwardIconUrl: string;
}>();
defineEmits(['forward']);
</script>`,

    'Tailwind': `<!-- Status Stage — node 438:3545 -->
<div class="inline-flex items-center gap-0.5 h-8">
  <!-- Status pill -->
  <div class="inline-flex items-center gap-2 h-8 px-3 py-2
              bg-[var(--accent-black-8)] rounded-[100px_4px_4px_100px]
              hover:bg-[var(--accent-black-12)] transition-colors">
    <div class="w-2 h-2 rounded-full shrink-0 bg-[var(--accent-green-100)]"></div>
    <span class="text-xs text-[var(--accent-black-80)] whitespace-nowrap">Active</span>
  </div>
  <!-- Stage pill -->
  <div class="inline-flex items-center gap-[10px] h-8 pl-3
              bg-[var(--accent-black-8)] rounded-[4px_100px_100px_4px] overflow-hidden
              hover:bg-[var(--accent-black-12)] transition-colors">
    <span class="text-xs text-[var(--accent-black-80)] whitespace-nowrap">Underwriting</span>
    <button class="w-8 h-8 rounded-full shrink-0 flex items-center justify-center
                   border-2 border-white bg-[var(--accent-black-8)]
                   hover:bg-[var(--accent-black-20)] transition-colors cursor-pointer">
      <img src="[forward-icon]" alt="forward" class="w-4 h-4 block" />
    </button>
  </div>
</div>`,
  };
}

function bindLpStatusRows() {
  document.querySelectorAll('[data-lp-status-variant]').forEach(row => {
    const wrap = row.querySelector('.lp-status-dropdown-wrap');
    if (wrap) mountLpStatusDropdown(wrap);

    row.addEventListener('click', () => {
      const variantId = row.dataset.lpStatusVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const comp = SYSTEM.products.lenderPortal.status;
      const v = comp.variants.find(x => x.id === variantId);
      openPanel({
        type: 'Lender Portal · Status',
        name: v?.label || variantId,
        preview: buildLpStatusInteractiveHtml(v),
        onPreviewMount: (el) => {
          el.querySelectorAll('.lp-status-dropdown-wrap').forEach(mountLpStatusDropdown);
        },
        tabs: lpStatusTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

function bindLpStageRows() {
  document.querySelectorAll('[data-lp-stage-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.lpStageVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const comp = SYSTEM.products.lenderPortal.stage;
      const v = comp.variants.find(x => x.id === variantId);
      openPanel({
        type: 'Lender Portal · Stage',
        name: v?.label || variantId,
        preview: buildLpStageHtml(v),
        tabs: lpStageTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

function bindStatusStageRows() {
  document.querySelectorAll('[data-lp-status-stage-variant]').forEach(row => {
    row.querySelectorAll('.lp-status-dropdown-wrap').forEach(mountLpStatusDropdown);

    row.addEventListener('click', () => {
      const variantId = row.dataset.lpStatusStageVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const comp = SYSTEM.products.lenderPortal.statusStage;
      const v = comp.variants.find(x => x.id === variantId);
      openPanel({
        type: 'Lender Portal · Status Stage',
        name: v?.label || variantId,
        preview: buildLpStatusStageInteractiveHtml(v),
        onPreviewMount: (el) => {
          el.querySelectorAll('.lp-status-dropdown-wrap').forEach(mountLpStatusDropdown);
        },
        tabs: statusStageTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

// ── Profile ────────────────────────────────────────────────────────────────────

function buildProfileHtml(v) {
  const comp     = SYSTEM.products.lenderPortal.profile;
  const fav      = v?.favorited !== false;
  const starSvg  = fav ? iconSvg('star-filled') : iconSvg('star');
  const starStyle = fav ? ' style="--fill-0:#FFCC00"' : '';
  return `<button class="profile" type="button">
  <span class="profile__star icon"${starStyle}>${starSvg}</span>
  <span class="profile__avatar">
    <img src="${comp.avatarUrl}" alt="">
  </span>
</button>`;
}

function renderLenderProfilePage() {
  const comp = SYSTEM.products.lenderPortal.profile;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">`;

  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-lp-profile-variant="${v.id}">
        <span class="ds-row-name" style="min-width:100px">${v.label}</span>
        ${buildProfileHtml(v)}
      </div>`;
  });

  html += `</div>`;
  return html;
}

function profileTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.profile;
  return {
    'HTML': `<!-- Include global.css (design-system/css/global.css) -->

${buildProfileHtml()}`,

    'CSS': `/* global.css — .profile, .profile__avatar, .profile__star */

.profile {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 2px 2px 8px;
  background: var(--accent-bg-1);
  border: 0.5px solid var(--accent-black-12);
  border-radius: 100px;
  cursor: pointer;
  transition: background 0.2s var(--ease-smooth);
}
.profile:hover { background: var(--accent-black-4); }

.profile__avatar {
  width: 32px; height: 32px;
  border-radius: 100px; overflow: hidden;
  flex-shrink: 0; background: var(--accent-white-100);
}
.profile__avatar img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  transition: transform 0.35s var(--ease-spring);
}
.profile__avatar:hover img { transform: scale(1.2); }

/* Star — unfavourited uses black-50 stroke, favourited overrides --fill-0 to gold */
.profile__star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  --stroke-0: var(--accent-black-50); /* unfavourited colour */
  transition: transform 0.2s var(--ease-spring);
}
/* Favourited: set --fill-0:#FFCC00 via inline style on the element */`,

    'SVG': `<!-- star (outline — unfavourited) -->
<!-- .profile__star { --stroke-0: var(--accent-black-50); } -->
${SYSTEM.icons.find(i => i.name === 'star')?.svg || ''}

<!-- star-filled (favourited) -->
<!-- .profile__star { --fill-0: #FFCC00; } -->
${SYSTEM.icons.find(i => i.name === 'star-filled')?.svg || ''}`,

    'React': `import { useState } from 'react';
import { BorrowerProfile } from 'flow-design-system/react';
import 'flow-design-system/styles.css';

// Controlled usage — toggle favourite on click
export function ProfileDemo() {
  const [isFavorited, setIsFavorited] = useState(false);
  return (
    <BorrowerProfile
      avatarSrc={avatarUrl}
      isFavorited={isFavorited}
      onFavoriteToggle={() => setIsFavorited(f => !f)}
    />
  );
}`,
  };
}

function bindProfileRows() {
  document.querySelectorAll('[data-lp-profile-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.lpProfileVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const comp = SYSTEM.products.lenderPortal.profile;
      const v    = comp.variants.find(x => x.id === variantId);

      openPanel({
        type: 'Lender Portal · Profile',
        name: v?.label || variantId,
        preview: buildProfileHtml(v),
        onPreviewMount: (el) => {
          const btn  = el.querySelector('.profile');
          const star = el.querySelector('.profile__star');
          if (!btn || !star) return;
          let fav = v?.favorited !== false;

          btn.addEventListener('click', () => {
            fav = !fav;
            // swap icon
            star.innerHTML = fav ? iconSvg('star-filled') : iconSvg('star');
            star.style.setProperty('--fill-0', fav ? '#FFCC00' : '');
            // pop animation
            star.classList.remove('star-pop');
            void star.offsetWidth;
            star.classList.add('star-pop');
          });
        },
        tabs: profileTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

// ── Assignees ─────────────────────────────────────────────────────────────────

function buildRolePickerHtml(activeRole, personName) {
  const roles = ['Loan Officer', 'Processor', 'Underwriter', 'Closer'];
  const items = roles.map(r =>
    `<button class="role-picker__item${r === activeRole ? ' role-picker__item--active' : ''}" data-role="${r}">${r}</button>`
  ).join('');
  return `<div class="role-picker">
  ${items}
  <div class="role-picker__section">
    <button class="role-picker__item">Transfer Loan Officer...</button>
    <button class="role-picker__item role-picker__item--danger">Remove ${personName}</button>
  </div>
</div>`;
}

function buildAssigneesDropdownHtml(viewerRole = "Loan Officer") {
  const chevSmall   = `<svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--stroke-0,#808080)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const magnifySvg  = iconSvg('magnifying-glass');
  const userPlusSvg = iconSvg('user-plus');
  const xMarkSvg    = iconSvg('x-mark');

  const isLoanOfficer = viewerRole === 'Loan Officer';
  const people = [
    { name: 'Anagh (You)', role: viewerRole,    img: 'https://i.pravatar.cc/28?img=12', isAdmin: isLoanOfficer },
    { name: 'Sarah K',     role: 'Underwriter', img: 'https://i.pravatar.cc/28?img=5',  isAdmin: isLoanOfficer },
  ];
  const suggested = [
    { name: 'Rosy',  role: 'Underwriter', img: 'https://i.pravatar.cc/28?img=23' },
    { name: 'James', role: 'Processor',   img: 'https://i.pravatar.cc/28?img=53' },
    { name: 'Jeff',  role: 'Closer',      img: 'https://i.pravatar.cc/28?img=11' },
  ];

  const personRows = people.map(p => `
    <div class="assignees-dropdown__item">
      <div class="assignees-dropdown__person">
        <div class="assignees-dropdown__avatar"><img src="${p.img}" alt="${p.name}"></div>
        <span class="assignees-dropdown__name">${p.name}</span>
      </div>
      ${p.isAdmin ? `
      <div class="assignees-dropdown__role-wrap">
        <div class="assignees-dropdown__role">
          <span class="assignees-dropdown__role-label">${p.role}</span>
          <span class="assignees-dropdown__role-chevron">${chevSmall}</span>
        </div>
        ${buildRolePickerHtml(p.role, p.name.split(' ')[0])}
      </div>` : `
      <span class="assignees-dropdown__role-label assignees-dropdown__role-label--static">${p.role}</span>`}
    </div>`).join('');

  const plusSvg = `<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1v12M1 7h12" stroke="var(--stroke-0,#333)" stroke-width="1.5" stroke-linecap="round"/></svg>`;

  const suggestedRows = suggested.map(p => `
    <div class="assignees-dropdown__item assignees-dropdown__item--suggested" data-name="${p.name}" data-role="${p.role}" data-img="${p.img}">
      <div class="assignees-dropdown__person">
        <div class="assignees-dropdown__avatar assignees-dropdown__avatar--suggested">
          <img src="${p.img}" alt="${p.name}">
          <div class="assignees-dropdown__avatar-add">${plusSvg}</div>
        </div>
        <span class="assignees-dropdown__name">${p.name}</span>
      </div>
      <span class="assignees-dropdown__suggested-role">${p.role}</span>
    </div>`).join('');

  return `<div class="assignees-dropdown">
  <div class="assignees-dropdown__header">People this loan</div>
  ${personRows}
  ${isLoanOfficer ? `<button class="assignees-dropdown__add" type="button">
    <span class="assignees-dropdown__add-icon">${userPlusSvg}</span>
    <span class="assignees-dropdown__add-text">Add Teammate</span>
  </button>` : ''}
  <div class="assignees-dropdown__search-section">
    <div class="assignees-dropdown__search-row">
      <div class="assignees-dropdown__search">
        <div class="assignees-dropdown__search-icon-wrap">${magnifySvg}</div>
        <span class="assignees-dropdown__search-placeholder">Search Teammate</span>
      </div>
      <button class="assignees-dropdown__search-clear" type="button">${xMarkSvg}</button>
    </div>
    <div class="assignees-dropdown__suggested-label">Suggested Teammates</div>
    <div class="assignees-dropdown__suggested">${suggestedRows}</div>
  </div>
</div>`;
}

function buildAssigneesHtml(v) {
  const comp  = SYSTEM.products.lenderPortal.assignees;
  const count = v?.count ?? 2;
  const chevronSvg = `<svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--accent-black-50,#808080)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const dropdown = buildAssigneesDropdownHtml();

  // Unassigned state — circular 32px avatar placeholder with user-plus icon (Figma node 545-2607)
  if (count === 0) {
    const userPlusSvg = iconSvg('user-plus');
    return `<div class="assignees-wrap">
  <button class="assignees assignees--unassigned" type="button" style="--stroke-0:var(--accent-black-60,#666)">
    <span class="assignees__unassigned-avatar">
      <span class="assignees__unassigned-icon">${userPlusSvg}</span>
    </span>
  </button>
  ${dropdown}
</div>`;
  }

  // Build avatar stack — show max 3, then +N count bubble
  const avatarUrls  = [comp.avatar1Url, comp.avatar2Url, comp.avatar3Url];
  const initialsArr = comp.initials   || ['AM', 'JS', 'KP'];
  const namesArr    = comp.names      || ['Anagh Mirji', 'James Sullivan', 'Kate Park'];
  const rolesArr    = comp.roles      || ['Loan Officer', 'Processor', 'Underwriter'];
  let avatarsHtml = '';
  const shown = Math.min(count, 3);

  for (let i = 0; i < shown; i++) {
    const initials = initialsArr[i];
    const name     = namesArr[i];
    const role     = rolesArr[i];
    const tooltip  = `${name} (${role})`;
    const hoverClass = (v?.forceHover && i === 0) ? ' assignees__avatar--hover' : '';
    if (v?.initials) {
      avatarsHtml += `<span class="assignees__avatar assignees__avatar--initials${hoverClass}" style="z-index:${3 - i}">
        <span class="assignees__initials">${initials}</span>
        <span class="assignees__tooltip">${tooltip}</span>
      </span>`;
    } else {
      avatarsHtml += `<span class="assignees__avatar${hoverClass}" style="z-index:${3 - i}">
        <img src="${avatarUrls[i]}" alt="${name}">
        <span class="assignees__tooltip">${tooltip}</span>
      </span>`;
    }
  }

  if (count > 3) {
    avatarsHtml += `<span class="assignees__count">+${count - 3}</span>`;
  }

  return `<div class="assignees-wrap">
  <button class="assignees" type="button">
    <span class="assignees__avatars">${avatarsHtml}</span>
    <span class="assignees__chevron">${chevronSvg}</span>
  </button>
  ${dropdown}
</div>`;
}

function renderLenderAssigneesPage() {
  const comp = SYSTEM.products.lenderPortal.assignees;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">`;

  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-lp-assignees-variant="${v.id}">
        <span class="ds-row-name" style="min-width:120px">${v.label}</span>
        ${buildAssigneesHtml(v)}
      </div>`;
  });

  html += `</div>`;
  return html;
}

function assigneesTabs(variantId) {
  const v = SYSTEM.products.lenderPortal.assignees.variants.find(x => x.id === variantId);
  return {
    'HTML': `<!-- Include global.css (design-system/css/global.css) -->

${buildAssigneesHtml(v)}`,

    'CSS': `/* global.css — .assignees */

.assignees {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 2px 4px 2px 2px;
  background: var(--accent-black-8);
  border-radius: 100px;
  cursor: pointer;
  border: none;
  font-family: inherit;
  transition: background 0.2s var(--ease-smooth);
}
.assignees:hover { background: var(--accent-black-12); }

/* Stacked avatars — negative margin creates overlap */
.assignees__avatars {
  display: flex;
  align-items: center;
  padding-right: 8px;
  isolation: isolate;
}
.assignees__avatar {
  width: 28px; height: 28px;
  border-radius: 100px;
  border: 1px solid var(--accent-black-8);
  background: var(--accent-white-100);
  overflow: hidden; flex-shrink: 0;
  margin-right: -8px;
  position: relative;
  transition: transform 0.2s var(--ease-spring), z-index 0s var(--ease-smooth);
}
.assignees__avatar:first-child  { z-index: 2; }
.assignees__avatar:nth-child(2) { z-index: 1; }
.assignees__avatar:nth-child(3) { z-index: 0; }
.assignees__avatar:hover { transform: translateY(-2px); z-index: 10; }
.assignees__avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* Force hover state — used for static variant preview */
.assignees__avatar--hover { transform: translateY(-2px); z-index: 10; }
.assignees__avatar--hover .assignees__tooltip { opacity: 1; transform: translateX(-50%) translateY(0); }

/* Initials avatar — no photo (Figma node 553-2540) */
.assignees__avatar--initials { background: var(--background-1, #fcfcfd); display: flex; align-items: center; justify-content: center; }
.assignees__initials { font-size: 12px; font-weight: 400; color: var(--accent-black-100, #000); line-height: 1; white-space: nowrap; }

/* +N overflow count bubble */
.assignees__count {
  width: 28px; height: 28px;
  border-radius: 100px;
  border: 1px solid var(--accent-black-8);
  background: var(--accent-black-12);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 500; color: var(--accent-black-60);
  flex-shrink: 0; margin-right: -8px; z-index: 0;
}

/* Chevron — springs 180° when open. --stroke-0 sets icon colour */
.assignees__chevron {
  width: 12px; height: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
  --stroke-0: var(--accent-black-50);
  transition: transform 0.28s var(--ease-spring);
}
.assignees__chevron svg { width: 7.5px; height: 3.75px; display: block; }
.assignees-wrap.open .assignees__chevron { transform: rotate(180deg); }

/* Unassigned state — 32px circle (Figma node 545-2607) */
.assignees--unassigned { width: 32px; height: 32px; padding: 2px; gap: 0; }

.assignees__unassigned-avatar {
  width: 28px; height: 28px;
  border-radius: 160px;
  background: var(--accent-black-8);
  overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}

.assignees__unassigned-icon {
  width: 16px; height: 16px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; overflow: hidden;
}
.assignees__unassigned-icon svg { width: 12px; height: 12px; display: block; flex-shrink: 0; }

/* ── Dropdown (Figma node 553:3849) ── */
.assignees-wrap { position: relative; display: inline-flex; }

.assignees-dropdown {
  position: absolute; top: calc(100% + 6px); left: 0;
  width: 242px; background: #fcfcfd;
  border: 0.5px solid var(--accent-black-12); border-radius: 16px;
  padding: 4px 8px; display: flex; flex-direction: column; gap: 4px;
  z-index: 100; opacity: 0; pointer-events: none;
  transform: scale(0.97) translateY(-4px);
  transition: opacity 0.2s var(--ease-smooth), transform 0.2s var(--ease-smooth);
}
.assignees-wrap.open .assignees-dropdown { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }

.assignees-dropdown__header { font-weight: 500; font-size: 12px; color: var(--accent-black-80); padding: 8px 4px; }
.assignees-dropdown__item { display: flex; align-items: center; justify-content: space-between; padding: 4px; border-radius: 12px; cursor: pointer; transition: background 0.2s var(--ease-smooth); }
.assignees-dropdown__item:hover { background: var(--accent-black-8); }
.assignees-dropdown__person { display: flex; align-items: center; gap: 8px; }
.assignees-dropdown__avatar { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 1px solid var(--accent-black-8); }
.assignees-dropdown__avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.assignees-dropdown__name { font-size: 12px; font-weight: 400; color: var(--accent-black-80); white-space: nowrap; }
.assignees-dropdown__role { display: flex; align-items: center; gap: 4px; padding: 4px 4px 4px 6px; border-radius: 8px; cursor: pointer; transition: background 0.2s var(--ease-smooth); }
.assignees-dropdown__role:hover { background: var(--accent-black-8); }
.assignees-dropdown__role-label { font-size: 10px; font-weight: 400; color: var(--accent-black-50); white-space: nowrap; }
.assignees-dropdown__role-chevron { width: 10px; height: 10px; display: flex; align-items: center; justify-content: center; --stroke-0: var(--accent-black-50); }
.assignees-dropdown__role-chevron svg { width: 10px; height: 10px; }

.assignees-dropdown__add { display: flex; align-items: center; gap: 8px; padding: 12px 8px; border-top: 0.5px solid var(--accent-black-12); border-left: none; border-right: none; border-bottom: none; border-radius: 16px; width: 100%; background: none; cursor: pointer; max-height: 80px; overflow: hidden; opacity: 1; transition: max-height 0.25s var(--ease-smooth), opacity 0.15s var(--ease-smooth), padding 0.25s var(--ease-smooth), background 0.2s var(--ease-smooth); }
.assignees-dropdown__add:hover { background: #e6e6e6; } /* accent-black-10 */
.assignees-dropdown__add-icon { width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; overflow: hidden; --stroke-0: var(--accent-black-60); }
.assignees-dropdown__add-icon svg { width: 12px; height: 12px; flex-shrink: 0; } /* Figma inset-[12.5%] */
.assignees-dropdown__add-text { font-size: 12px; font-weight: 400; color: var(--accent-black-60); }

.assignees-dropdown__search-section { border-top: 0.5px solid var(--accent-black-12); display: flex; flex-direction: column; gap: 8px; max-height: 0; overflow: hidden; opacity: 0; padding-top: 0; transition: max-height 0.35s var(--ease-smooth), opacity 0.25s var(--ease-smooth), padding-top 0.35s var(--ease-smooth); }
.assignees-wrap.search-mode .assignees-dropdown__add { max-height: 0; opacity: 0; padding-top: 0; padding-bottom: 0; pointer-events: none; }
.assignees-wrap.search-mode .assignees-dropdown__search-section { max-height: 260px; opacity: 1; padding-top: 8px; }

.assignees-dropdown__search-row { display: flex; align-items: center; gap: 8px; }
.assignees-dropdown__search { flex: 1; display: flex; align-items: center; background: white; border: 0.5px solid var(--accent-black-12); border-radius: 180px; padding: 2px 4px; overflow: hidden; }
.assignees-dropdown__search-icon-wrap { width: 28px; height: 28px; border-radius: 160px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; --stroke-0: var(--accent-black-60); }
.assignees-dropdown__search-icon-wrap svg { width: 16px; height: 16px; }
.assignees-dropdown__search-placeholder { font-size: 11px; font-weight: 400; color: var(--accent-black-60); white-space: nowrap; }
.assignees-dropdown__search-clear { width: 28px; height: 28px; border-radius: 50%; background: var(--accent-black-8); border: none; display: flex; align-items: center; justify-content: center; flex-shrink: 0; cursor: pointer; --stroke-0: var(--accent-black-80); }
.assignees-dropdown__search-clear svg { width: 16px; height: 16px; }
.assignees-dropdown__suggested-label { font-size: 12px; font-weight: 500; color: var(--accent-black-60); }
.assignees-dropdown__suggested { display: flex; flex-direction: column; gap: 4px; }

/* Suggested role text */
.assignees-dropdown__suggested-role { font-size: 11px; font-weight: 400; color: var(--accent-black-40); white-space: nowrap; flex-shrink: 0; }

/* + overlay on suggested avatar */
.assignees-dropdown__avatar--suggested { position: relative; flex-shrink: 0; }
.assignees-dropdown__avatar-add {
  position: absolute; inset: 0; border-radius: 50%;
  background: var(--accent-black-8); display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: opacity 0.2s var(--ease-smooth);
  --stroke-0: var(--accent-black-80);
}
.assignees-dropdown__avatar-add svg { width: 14px; height: 14px; }
.assignees-dropdown__item--suggested:hover .assignees-dropdown__avatar-add { opacity: 1; }
.assignees-dropdown__item--suggested:hover .assignees-dropdown__avatar--suggested img { opacity: 0; transition: opacity 0.2s var(--ease-smooth); }`,

    'SVG': `<!-- chevron-down (pill + role badges) — stroke via --stroke-0 -->
<svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.5 0.5L5.5 5.5L0.5 0.5"
    stroke="var(--stroke-0,#333)" stroke-width="1.5"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- user-plus (unassigned state + Add Teammate) — stroke via --stroke-0 -->
<svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.5 3.5V5.5M10.5 5.5V7.5M10.5 5.5H12.5M10.5 5.5H8.5M7 2.75C7 3.34674 6.76295 3.91903 6.34099 4.34099C5.91903 4.76295 5.34674 5 4.75 5C4.15326 5 3.58097 4.76295 3.15901 4.34099C2.73705 3.91903 2.5 3.34674 2.5 2.75C2.5 2.15326 2.73705 1.58097 3.15901 1.15901C3.58097 0.737053 4.15326 0.5 4.75 0.5C5.34674 0.5 5.91903 0.737053 6.34099 1.15901C6.76295 1.58097 7 2.15326 7 2.75ZM0.5 11.3233V11.25C0.5 10.1228 0.947767 9.04183 1.7448 8.2448C2.54183 7.44777 3.62283 7 4.75 7C5.87717 7 6.95817 7.44777 7.7552 8.2448C8.55223 9.04183 9 10.1228 9 11.25V11.3227C7.71699 12.0954 6.24707 12.5025 4.74933 12.5C3.19533 12.5 1.74133 12.07 0.5 11.3227V11.3233Z"
    stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- x-mark (search clear button) — stroke via --stroke-0 -->
<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M4 4L12 12M12 4L4 12"
    stroke="var(--stroke-0,#333)" stroke-width="1.2"
    stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- magnifying-glass (search input icon) — stroke via --stroke-0 -->
<svg viewBox="0 0 13.2005 13.2005" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12.6005 12.6005L9.13585 9.13585M9.13585 9.13585C10.0736 8.19814 10.6004 6.92632 10.6004 5.60019C10.6004 2.87786 8.3225 0.6 5.60019 0.6C2.87786 0.6 0.6 2.87786 0.6 5.60019C0.6 8.3225 2.87786 10.6004 5.60019 10.6004C6.92632 10.6004 8.19814 10.0736 9.13585 9.13585Z"
    stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

<!-- plus (suggested avatar overlay) — stroke via --stroke-0 -->
<svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M7 1v12M1 7h12"
    stroke="var(--stroke-0,#333)" stroke-width="1.5" stroke-linecap="round"/>
</svg>

<!-- --stroke-0 colour guide:
  Pill chevron:    style="--stroke-0: var(--accent-black-50)"
  Unassigned btn:  style="--stroke-0: var(--accent-black-60)"
  Role chevron:    style="--stroke-0: var(--accent-black-50)"
  Search icon:     style="--stroke-0: var(--accent-black-60)"
  Clear button:    style="--stroke-0: var(--accent-black-80)"
  Suggested +btn:  .assignees-dropdown__avatar-add { --stroke-0: var(--accent-black-80) } -->`,

    'React': `import { useState } from 'react';
import { Assignees } from 'flow-design-system/react';
import 'flow-design-system/styles.css';

// Photo avatars
export function AssigneesDemo() {
  const [open, setOpen] = useState(false);
  return (
    <Assignees
      assignees={[
        { id: '1', name: 'Sarah K.', avatarUrl: '/avatars/sarah.jpg' },
        { id: '2', name: 'James L.', avatarUrl: '/avatars/james.jpg' },
      ]}
      open={open}
      onToggle={() => setOpen(o => !o)}
    />
  );
}

// Initials only (no photo)
<Assignees
  assignees={[
    { id: '1', name: 'Alex M.', initials: 'AM' },
    { id: '2', name: 'Tom K.',  initials: 'TK' },
  ]}
/>

// Unassigned
<Assignees assignees={[]} onToggle={openAssignModal} />`,
  };
}

function bindAssigneesRows() {
  document.querySelectorAll('[data-lp-assignees-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.lpAssigneesVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const comp = SYSTEM.products.lenderPortal.assignees;
      const v    = comp.variants.find(x => x.id === variantId);

      openPanel({
        type: 'Lender Portal · Assignees',
        name: v?.label || variantId,
        preview: buildAssigneesHtml(v),
        onPreviewMount: (el) => {
          const wrap = el.querySelector('.assignees-wrap');
          const btn  = el.querySelector('.assignees');
          if (!wrap || !btn) return;

          // Pill click — toggle dropdown open/closed
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrap.classList.toggle('open');
            wrap.classList.remove('search-mode');
          });

          // "Add Teammate" — switch to search mode
          const addBtn = el.querySelector('.assignees-dropdown__add');
          if (addBtn) addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrap.classList.add('search-mode');
          });

          // X button — back to default list
          const clearBtn = el.querySelector('.assignees-dropdown__search-clear');
          if (clearBtn) clearBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            wrap.classList.remove('search-mode');
          });

          // Role badge clicks — toggle role picker
          el.querySelectorAll('.assignees-dropdown__role').forEach(badge => {
            badge.addEventListener('click', (e) => {
              e.stopPropagation();
              const roleWrap = badge.closest('.assignees-dropdown__role-wrap');
              if (!roleWrap) return;
              const isOpen = roleWrap.classList.contains('open');
              // Close all other role pickers first
              el.querySelectorAll('.assignees-dropdown__role-wrap.open').forEach(w => w.classList.remove('open'));
              if (!isOpen) roleWrap.classList.add('open');
            });
          });

          // Role picker item clicks — update role label and close picker
          el.querySelectorAll('.role-picker__item[data-role]').forEach(item => {
            item.addEventListener('click', (e) => {
              e.stopPropagation();
              const roleWrap = item.closest('.assignees-dropdown__role-wrap');
              if (!roleWrap) return;
              const newRole = item.dataset.role;
              // Update active state
              roleWrap.querySelectorAll('.role-picker__item').forEach(i => i.classList.remove('role-picker__item--active'));
              item.classList.add('role-picker__item--active');
              // Update label
              const label = roleWrap.querySelector('.assignees-dropdown__role-label');
              if (label) label.textContent = newRole;
              roleWrap.classList.remove('open');
            });
          });

          // Suggested item click — add to "People on this loan" + remove from suggested
          el.querySelectorAll('.assignees-dropdown__item--suggested').forEach(item => {
            item.addEventListener('click', (e) => {
              e.stopPropagation();
              const name = item.dataset.name;
              const role = item.dataset.role;
              const img  = item.dataset.img;

              // Build new person row with role picker
              const chevSmall = `<svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--stroke-0,#808080)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
              const newRow = document.createElement('div');
              newRow.className = 'assignees-dropdown__item assignees-dropdown__item--new';
              newRow.innerHTML = `
                <div class="assignees-dropdown__person">
                  <div class="assignees-dropdown__avatar"><img src="${img}" alt="${name}"></div>
                  <span class="assignees-dropdown__name">${name}</span>
                </div>
                <div class="assignees-dropdown__role-wrap">
                  <div class="assignees-dropdown__role">
                    <span class="assignees-dropdown__role-label">${role}</span>
                    <span class="assignees-dropdown__role-chevron">${chevSmall}</span>
                  </div>
                </div>`;

              // Insert before the "Add Teammate" button
              const addBtn = el.querySelector('.assignees-dropdown__add');
              addBtn.parentNode.insertBefore(newRow, addBtn);

              // Bind role badge on new row
              const badge = newRow.querySelector('.assignees-dropdown__role');
              if (badge) badge.addEventListener('click', (ev) => { ev.stopPropagation(); });

              // Animate removal of suggested item
              item.style.transition = 'opacity 0.2s, transform 0.2s';
              item.style.opacity = '0';
              item.style.transform = 'translateX(8px)';
              setTimeout(() => item.remove(), 220);

              // Animate new row entrance
              newRow.style.opacity = '0';
              newRow.style.transform = 'translateY(-6px)';
              newRow.style.transition = 'opacity 0.25s var(--ease-smooth), transform 0.25s var(--ease-spring)';
              requestAnimationFrame(() => requestAnimationFrame(() => {
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateY(0)';
              }));
            });
          });

          // Click outside — close dropdown and role pickers
          document.addEventListener('click', function outsideClick(e) {
            if (!wrap.contains(e.target)) {
              wrap.classList.remove('open', 'search-mode');
              el.querySelectorAll('.assignees-dropdown__role-wrap.open').forEach(w => w.classList.remove('open'));
            }
          });
        },
        tabs: assigneesTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

// ── People Dropdown ───────────────────────────────────────────────────────────

function buildPeopleDropdownHtml(v, standalone = false) {
  const dropdown = buildAssigneesDropdownHtml(v?.viewerRole || "Loan Officer");
  const cls = standalone ? 'class="assignees-dropdown assignees-dropdown--standalone"' : 'class="assignees-dropdown"';
  return dropdown.replace('class="assignees-dropdown"', cls);
}

function renderLenderPeopleDropdownPage() {
  const comp = SYSTEM.products.lenderPortal.peopleDropdown;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">`;
  comp.variants.forEach(v => {
    // For search-open variant, inline-override to show search section
    const dropdownHtml = buildPeopleDropdownHtml(v, true);
    const searchStyle = v.searchOpen
      ? dropdownHtml
          .replace('class="assignees-dropdown__add"', 'class="assignees-dropdown__add" style="max-height:0;opacity:0;padding:0;pointer-events:none"')
          .replace('class="assignees-dropdown__search-section"', 'class="assignees-dropdown__search-section" style="max-height:260px;opacity:1;padding-top:8px;overflow:visible"')
      : dropdownHtml;
    html += `
      <div class="ds-row" data-lp-people-dropdown-variant="${v.id}">
        <span class="ds-row-name" style="min-width:180px">${v.label}</span>
        ${searchStyle}
      </div>`;
  });
  html += `</div>`;
  return html;
}

function peopleDropdownTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.peopleDropdown;
  const v    = comp.variants.find(x => x.id === variantId);
  return {
    'HTML': `<!-- Include global.css (design-system/css/global.css) -->

${buildPeopleDropdownHtml(v)}`,

    'CSS': `/* global.css — .assignees-dropdown (People Dropdown) */

.assignees-dropdown {
  background: #fcfcfd;
  border: 0.5px solid var(--accent-black-12);
  border-radius: 16px;
  padding: 4px 8px;
  display: flex; flex-direction: column; gap: 4px;
  width: 242px;
}

.assignees-dropdown__header { font-weight: 500; font-size: 12px; color: var(--accent-black-80); padding: 8px 4px; }
.assignees-dropdown__item { display: flex; align-items: center; justify-content: space-between; padding: 4px; border-radius: 12px; cursor: pointer; }
.assignees-dropdown__item:hover { background: var(--accent-black-8); }
.assignees-dropdown__avatar { width: 28px; height: 28px; border-radius: 50%; overflow: hidden; border: 1px solid var(--accent-black-8); }
.assignees-dropdown__name { font-size: 12px; font-weight: 400; color: var(--accent-black-80); }
.assignees-dropdown__role { display: flex; align-items: center; gap: 4px; padding: 4px 4px 4px 6px; border-radius: 8px; cursor: pointer; }
.assignees-dropdown__role-label { font-size: 10px; color: var(--accent-black-50); }
.assignees-dropdown__role-chevron { width: 10px; height: 10px; --stroke-0: var(--accent-black-50); }

.assignees-dropdown__add { display: flex; align-items: center; padding: 12px 8px; border-top: 0.5px solid var(--accent-black-12); width: 100%; background: none; cursor: pointer; }
.assignees-dropdown__add-icon { width: 16px; height: 16px; --stroke-0: var(--accent-black-60); }
.assignees-dropdown__add-icon svg { width: 12px; height: 12px; }
.assignees-dropdown__add-text { font-size: 12px; color: var(--accent-black-60); }

.assignees-dropdown__search-section { border-top: 0.5px solid var(--accent-black-12); padding-top: 8px; display: flex; flex-direction: column; gap: 8px; }
.assignees-dropdown__search { display: flex; align-items: center; background: white; border: 0.5px solid var(--accent-black-12); border-radius: 180px; padding: 2px 4px; }
.assignees-dropdown__suggested-label { font-size: 12px; font-weight: 500; color: var(--accent-black-60); }`,

    'SVG': `<!-- user-plus (Add Teammate icon) -->
<svg viewBox="0 0 13 13" fill="none"><path d="M10.5 3.5V7.5M10.5 5.5H8.5M10.5 5.5H12.5..." stroke="var(--stroke-0,#666)" stroke-width="1.2" stroke-linecap="round"/></svg>

<!-- x-mark (clear search) -->
<svg viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round"/></svg>`,

    'React': `import { PeopleDropdown } from 'flow-design-system/react';
import 'flow-design-system/styles.css';

export function PeopleDropdownDemo() {
  const people = [
    { id: '1', name: 'Anagh (You)', role: 'Loan Officer', avatarUrl: '/avatars/anagh.jpg' },
    { id: '2', name: 'Sarah K',     role: 'Underwriter',  avatarUrl: '/avatars/sarah.jpg' },
  ];
  return (
    <PeopleDropdown
      people={people}
      onRoleChange={(personId, newRole) => console.log(personId, newRole)}
      onAddTeammate={() => console.log('open search')}
    />
  );
}`,
  };
}

function bindPeopleDropdownRows() {
  document.querySelectorAll('[data-lp-people-dropdown-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.lpPeopleDropdownVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const comp = SYSTEM.products.lenderPortal.peopleDropdown;
      const v    = comp.variants.find(x => x.id === variantId);

      openPanel({
        type: 'Lender Portal · People Dropdown',
        name: v?.label || variantId,
        preview: buildPeopleDropdownHtml(v, true),
        onPreviewMount: (el) => {
          // Search mode for search-open variant
          if (v?.searchOpen) {
            const addBtn = el.querySelector('.assignees-dropdown__add');
            const searchSection = el.querySelector('.assignees-dropdown__search-section');
            if (addBtn) { addBtn.style.maxHeight = '0'; addBtn.style.opacity = '0'; addBtn.style.padding = '0'; addBtn.style.pointerEvents = 'none'; }
            if (searchSection) { searchSection.style.maxHeight = '260px'; searchSection.style.opacity = '1'; searchSection.style.paddingTop = '8px'; }
          }
          // Role badge interactions
          el.querySelectorAll('.assignees-dropdown__role').forEach(badge => {
            badge.addEventListener('click', (e) => {
              e.stopPropagation();
              const roleWrap = badge.closest('.assignees-dropdown__role-wrap');
              if (!roleWrap) return;
              const isOpen = roleWrap.classList.contains('open');
              el.querySelectorAll('.assignees-dropdown__role-wrap.open').forEach(w => w.classList.remove('open'));
              if (!isOpen) roleWrap.classList.add('open');
            });
          });
          el.querySelectorAll('.role-picker__item[data-role]').forEach(item => {
            item.addEventListener('click', (e) => {
              e.stopPropagation();
              const roleWrap = item.closest('.assignees-dropdown__role-wrap');
              if (!roleWrap) return;
              roleWrap.querySelectorAll('.role-picker__item').forEach(i => i.classList.remove('role-picker__item--active'));
              item.classList.add('role-picker__item--active');
              const label = roleWrap.querySelector('.assignees-dropdown__role-label');
              if (label) label.textContent = item.dataset.role;
              roleWrap.classList.remove('open');
            });
          });
          document.addEventListener('click', (e) => {
            if (!el.contains(e.target)) {
              el.querySelectorAll('.assignees-dropdown__role-wrap.open').forEach(w => w.classList.remove('open'));
            }
          });
        },
        tabs: peopleDropdownTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

// ── Role Picker ───────────────────────────────────────────────────────────────

function renderLenderRolePickerPage() {
  const comp = SYSTEM.products.lenderPortal.rolePicker;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">`;
  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-lp-role-picker-variant="${v.id}">
        <span class="ds-row-name" style="min-width:140px">${v.label}</span>
        ${buildRolePickerHtml(v.activeRole, v.personName)}
      </div>`;
  });
  html += `</div>`;
  return html;
}

function rolePickerTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.rolePicker;
  const v    = comp.variants.find(x => x.id === variantId);
  return {
    'HTML': `<!-- Include global.css (design-system/css/global.css) -->

${buildRolePickerHtml(v?.activeRole || 'Loan Officer', v?.personName || 'Sarah')}`,

    'CSS': `/* global.css — .role-picker (Figma node 553:3003) */

.role-picker {
  background: #fcfcfd;
  border: 0.5px solid var(--accent-black-12);
  border-radius: 16px;
  padding: 4px;
  display: flex; flex-direction: column;
  width: 146px; overflow: hidden;
}

.role-picker__item {
  display: flex; align-items: center; gap: 10px;
  padding: 8px; border-radius: 12px;
  font-size: 12px; font-weight: 400; color: var(--accent-black-80);
  width: 100%; background: none; border: none; cursor: pointer;
  text-align: left; transition: background 0.2s var(--ease-smooth);
}
.role-picker__item:hover { background: var(--accent-black-4, #f5f5f5); }
.role-picker__item--active { background: var(--accent-black-8, #ebebeb); }
.role-picker__item--danger { color: var(--accent-red-100, #ff383c); }

.role-picker__section {
  display: flex; flex-direction: column;
  border-top: 0.5px solid var(--accent-black-12);
}`,

    'React': `import { RolePicker } from 'flow-design-system/react';
import 'flow-design-system/styles.css';

export function RolePickerDemo() {
  const [role, setRole] = useState('Loan Officer');
  return (
    <RolePicker
      roles={['Loan Officer', 'Processor', 'Underwriter', 'Closer']}
      activeRole={role}
      personName="Sarah"
      onRoleChange={setRole}
      onTransfer={() => console.log('transfer')}
      onRemove={() => console.log('remove')}
    />
  );
}`,
  };
}

function bindRolePickerRows() {
  document.querySelectorAll('[data-lp-role-picker-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.lpRolePickerVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const comp = SYSTEM.products.lenderPortal.rolePicker;
      const v    = comp.variants.find(x => x.id === variantId);

      openPanel({
        type: 'Lender Portal · Role Picker',
        name: v?.label || variantId,
        preview: buildRolePickerHtml(v?.activeRole || 'Loan Officer', v?.personName || 'Sarah'),
        onPreviewMount: (el) => {
          el.querySelectorAll('.role-picker__item[data-role]').forEach(item => {
            item.addEventListener('click', () => {
              el.querySelectorAll('.role-picker__item').forEach(i => i.classList.remove('role-picker__item--active'));
              item.classList.add('role-picker__item--active');
            });
          });
        },
        tabs: rolePickerTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

// ── Sidebar Item ─────────────────────────────────────────────────────────────

function buildSidebarItemHtml(v) {
  const comp = SYSTEM.products.lenderPortal.sidebarItem;
  const svg  = iconSvg(comp.iconName);
  const stateClass = v.state === 'default' ? '' : ` sidebar-item--${v.state}`;
  return `<button class="sidebar-item${stateClass}" type="button">
  <div class="sidebar-item__icon-wrap">
    <span class="sidebar-item__icon">${svg}</span>
  </div>
  <span class="sidebar-item__label">Worklist</span>
</button>`;
}

function renderLenderSidebarItemPage() {
  const comp = SYSTEM.products.lenderPortal.sidebarItem;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">`;
  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-sidebar-item-variant="${v.id}">
        <span class="ds-row-name" style="min-width:100px">${v.label}</span>
        ${buildSidebarItemHtml(v)}
      </div>`;
  });
  html += `</div>`;
  return html;
}

function sidebarItemTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.sidebarItem;
  const v    = comp.variants.find(x => x.id === variantId);
  if (!v) return {};
  const html = buildSidebarItemHtml(v);
  const stateClass = v.state === 'default' ? '' : ` sidebar-item--${v.state}`;
  return {
    'HTML': `<!-- Include global.css + global.css -->
${html}`,

    'CSS': `/* global.css — Sidebar Item */
.sidebar-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  font-family: inherit;
}

.sidebar-item__icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: background 0.2s var(--ease-smooth);
}

.sidebar-item__icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.2s var(--ease-smooth), height 0.2s var(--ease-smooth);
}

.sidebar-item__label {
  font-size: 12px;
  color: var(--accent-black-80);
  white-space: nowrap;
}

/* Hover — icon grows to 24px */
.sidebar-item:hover .sidebar-item__icon-wrap {
  background: var(--accent-black-8);
}
.sidebar-item:hover .sidebar-item__icon {
  width: 24px;
  height: 24px;
}

/* Selected */
.sidebar-item--selected .sidebar-item__icon-wrap {
  background: var(--accent-black-12);
}

/* Icon colour */
.sidebar-item__icon {
  --stroke-0: var(--accent-black-80, #333);
}`,

    'SVG': `<!-- Sidebar item icons (stroke colour set via --stroke-0 on .sidebar-item__icon) -->
<!-- .sidebar-item__icon { --stroke-0: var(--accent-black-80, #333); } -->

<!-- clipboard-document-list (Worklist) -->
${SYSTEM.icons.find(i => i.name === 'clipboard-document-list')?.svg || ''}

<!-- banknotes (Loans) -->
${SYSTEM.icons.find(i => i.name === 'banknotes')?.svg || ''}`,

    'React': `import 'flow-design-system/styles.css';
import { SidebarItem } from 'flow-design-system-react';
import { ICONS } from './icons';

// Usage
<SidebarItem label="Worklist" iconSvg={ICONS['clipboard-document-list']} />
<SidebarItem label="Worklist" iconSvg={ICONS['clipboard-document-list']} state="selected" />
<SidebarItem label="Loans"    iconSvg={ICONS['banknotes']} state="selected" onClick={() => navigate('/loans')} />`,

    'Vue': `<!-- SidebarItem.vue -->
<template>
  <button
    :class="['sidebar-item', state !== 'default' && \`sidebar-item--\${state}\`]"
    type="button"
    @click="$emit('click')"
  >
    <div class="sidebar-item__icon-wrap">
      <span class="sidebar-item__icon" v-html="ICONS[icon]" />
    </div>
    <span class="sidebar-item__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import { ICONS } from './icons';
defineProps<{ label: string; icon: string; state?: string }>();
defineEmits(['click']);
</script>

<!-- Usage -->
<SidebarItem label="Worklist" icon="clipboard-document-list" />`,
  };
}

function bindSidebarItemRows() {
  document.querySelectorAll('[data-sidebar-item-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.sidebarItemVariant;
      const comp = SYSTEM.products.lenderPortal.sidebarItem;
      const v = comp.variants.find(x => x.id === variantId);

      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      openPanel({
        type: 'Lender Portal · Sidebar Item',
        name: v?.label || variantId,
        preview: buildSidebarItemHtml(v),
        tabs: sidebarItemTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

// ── Sidebar ───────────────────────────────────────────────────────────────────

function buildSidebarHtml() {
  const comp = SYSTEM.products.lenderPortal.sidebar;
  const itemsHtml = comp.items.map(item => {
    const svg = iconSvg(item.iconName);
    const selectedClass = item.active ? ' sidebar-item--selected' : '';
    return `  <button class="sidebar-item${selectedClass}" type="button">
    <div class="sidebar-item__icon-wrap">
      <span class="sidebar-item__icon">${svg}</span>
    </div>
    <span class="sidebar-item__label">${item.label}</span>
  </button>`;
  }).join('\n');

  return `<nav class="sidebar-nav" aria-label="Main navigation">
  <div class="sidebar-nav__items">
${itemsHtml}
  </div>
  <div class="sidebar-nav__avatar">
    <img src="${comp.avatarUrl}" alt="" />
  </div>
</nav>`;
}

function renderLenderSidebarPage() {
  const comp = SYSTEM.products.lenderPortal.sidebar;
  return `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:640px">
      <div class="ds-row" data-sidebar-row="sidebar" style="align-items:flex-start;padding:16px 20px">
        <span class="ds-row-name" style="min-width:100px;padding-top:12px">Full panel</span>
        <div style="height:1117px;display:flex;border-radius:8px;overflow:hidden">
          ${buildSidebarHtml()}
        </div>
      </div>
    </div>`;
}

function sidebarTabs() {
  const comp = SYSTEM.products.lenderPortal.sidebar;
  const html = buildSidebarHtml();
  return {
    'HTML': `<!-- Include global.css -->
${html}`,

    'CSS': `/* global.css — Sidebar Nav */
.sidebar-nav {
  width: 77px;
  height: 1117px;
  background: var(--accent-bg-0, #f3f3f4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 52px 16px 12px;
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar-nav__items {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
}

.sidebar-nav__avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 0.5px solid rgba(0, 0, 0, 0.12);
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar-nav__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Icon colour on sidebar items */
.sidebar-item__icon {
  --stroke-0: var(--accent-black-80, #333);
}`,

    'SVG': `<!-- Sidebar nav icons (stroke colour set via --stroke-0 on .sidebar-item__icon) -->
<!-- .sidebar-item__icon { --stroke-0: var(--accent-black-80, #333); } -->

<!-- clipboard-document-list (Worklist) -->
${SYSTEM.icons.find(i => i.name === 'clipboard-document-list')?.svg || ''}

<!-- banknotes (Loans) -->
${SYSTEM.icons.find(i => i.name === 'banknotes')?.svg || ''}`,

    'React': `import 'flow-design-system/styles.css';
import { Sidebar } from 'flow-design-system-react';
import { ICONS } from './icons';

<Sidebar
  items={[
    { id: 'loans',    label: 'Loans',    iconSvg: ICONS['banknotes'],               active: true,  onClick: () => navigate('/loans')    },
    { id: 'worklist', label: 'Worklist', iconSvg: ICONS['clipboard-document-list'],               onClick: () => navigate('/worklist') },
  ]}
  avatarSrc={userPhotoUrl}
  avatarAlt="Jane Doe"
/>`,

    'Vue': `<!-- Sidebar.vue -->
<template>
  <nav class="sidebar-nav" aria-label="Main navigation">
    <div class="sidebar-nav__items">
      <button
        v-for="item in items"
        :key="item.id"
        :class="['sidebar-item', item.active && 'sidebar-item--selected']"
        type="button"
        @click="item.onClick?.()"
      >
        <div class="sidebar-item__icon-wrap">
          <span class="sidebar-item__icon" v-html="ICONS[item.icon]" />
        </div>
        <span class="sidebar-item__label">{{ item.label }}</span>
      </button>
    </div>
    <div class="sidebar-nav__avatar">
      <img :src="avatarSrc" :alt="avatarAlt ?? ''" />
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ICONS } from './icons';
defineProps<{
  items: Array<{ id: string; label: string; icon: string; active?: boolean; onClick?: () => void }>;
  avatarSrc: string;
  avatarAlt?: string;
}>();
</script>`,
  };
}

function mountSidebarInteractive(el) {
  el.querySelectorAll('.sidebar-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('sidebar-item--selected'));
      btn.classList.add('sidebar-item--selected');
    });
  });
}

function bindSidebarRows() {
  // Make the inline page preview interactive
  document.querySelectorAll('[data-sidebar-row]').forEach(row => {
    mountSidebarInteractive(row);
    row.addEventListener('click', () => {
      const comp = SYSTEM.products.lenderPortal.sidebar;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      openPanel({
        type: 'Lender Portal · Sidebar',
        name: comp.title,
        preview: `<div style="height:1117px;display:flex">${buildSidebarHtml()}</div>`,
        onPreviewMount: mountSidebarInteractive,
        tabs: sidebarTabs(),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

// ── Loan List Item ────────────────────────────────────────────────────────────

function buildLoanListItemHtml(v, overrides = {}) {
  const comp   = SYSTEM.products.lenderPortal.loanListItem;
  const s      = { ...comp.sample, ...overrides };
  const stateClass = v.state === 'default' ? '' : ` loan-list-item--${v.state}`;
  const iconName = overrides.iconName || comp.trailingIconName || 'user';
  const userIconSvg = iconSvg(iconName);
  return `<div class="loan-list-item${stateClass}">
  <div class="loan-list-item__left">
    <div class="loan-list-item__top">
      <span class="loan-list-item__name">${s.name}</span>
      <div class="loan-list-item__meta">
        <span class="loan-list-item__meta-amount">${s.amount}</span>
        <span class="loan-list-item__meta-sep">·</span>
        <span class="loan-list-item__meta-type">${s.loanType}</span>
      </div>
    </div>
    <span class="loan-list-item__time">${s.time}</span>
  </div>
  <div class="loan-list-item__right">
    <span class="loan-list-item__badge loan-list-item__badge--${s.statusKey}">${s.status}</span>
    <span class="loan-list-item__icon"><span class="icon">${userIconSvg}</span></span>
  </div>
</div>`;
}

function renderLenderLoanListItemPage() {
  const comp = SYSTEM.products.lenderPortal.loanListItem;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table" style="max-width:420px">`;
  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-loan-list-item-variant="${v.id}" style="padding:16px 20px">
        <span class="ds-row-name" style="min-width:80px">${v.label}</span>
        ${buildLoanListItemHtml(v)}
      </div>`;
  });
  html += `</div>`;
  return html;
}

function loanListItemTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.loanListItem;
  const v    = comp.variants.find(x => x.id === variantId);
  if (!v) return {};
  const html = buildLoanListItemHtml(v);
  return {
    'HTML': `<!-- Include global.css -->
${html}`,

    'CSS': `/* global.css — Loan List Item */
.loan-list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 288px;
  height: 92px;
  padding: 12px;
  box-sizing: border-box;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0;
  border: none;
  border-bottom: 0.5px solid var(--accent-black-16, #d6d6d6);
  transition: background 0.2s var(--ease-smooth), border-radius 0.2s var(--ease-smooth), box-shadow 0.2s var(--ease-smooth);
}

.loan-list-item:hover,
.loan-list-item--hover {
  background: var(--accent-black-8, #EBEBEB);
  border-radius: 16px;
  border-bottom-color: transparent;
}

.loan-list-item:has(+ .loan-list-item:hover),
.loan-list-item:has(+ .loan-list-item--hover),
.loan-list-item:has(+ .loan-list-item--selected) {
  border-bottom-color: transparent;
}

.loan-list-item--selected {
  background: var(--accent-black-2, #FAFAFA);
  border-radius: 16px;
  border: 0.5px solid var(--accent-black-16, #d6d6d6);
  box-shadow:
    0px 35px 10px 0px rgba(0,0,0,0),
    0px 23px  9px 0px rgba(0,0,0,0.01),
    0px 13px  8px 0px rgba(0,0,0,0.02),
    0px  6px  6px 0px rgba(0,0,0,0.03),
    0px  1px  3px 0px rgba(0,0,0,0.04);
}

.loan-list-item__left {
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  align-items: flex-start;
  flex-shrink: 0;
}

.loan-list-item__top {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;
}

.loan-list-item__name {
  font-size: 14px;
  font-weight: 500;
  color: var(--accent-black-80, #333);
  line-height: normal;
  white-space: nowrap;
}

.loan-list-item__meta {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--accent-black-60, #666);
  white-space: nowrap;
  line-height: normal;
}

.loan-list-item__meta-amount { font-weight: 500; }
.loan-list-item__meta-sep,
.loan-list-item__meta-type   { font-weight: 400; }

.loan-list-item__time {
  font-size: 12px;
  font-weight: 400;
  color: var(--accent-black-60, #666);
  white-space: nowrap;
  line-height: normal;
}

.loan-list-item__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  align-self: stretch;
  flex-shrink: 0;
}

.loan-list-item__badge {
  font-size: 11px;
  font-weight: 400;
  padding: 4px 8px;
  border-radius: 100px;
  white-space: nowrap;
  line-height: normal;
}

.loan-list-item__badge--active { background: var(--accent-green-20, #D6F4DE); color: var(--accent-green-100, #34C759); }

.loan-list-item__badge--active   { background: var(--accent-green-20, #D6F4DE); color: var(--accent-green-100, #34C759); }
.loan-list-item__badge--on-hold  { background: #FFF1CC; color: #996600; }
.loan-list-item__badge--withdrawn,
.loan-list-item__badge--cancelled,
.loan-list-item__badge--denied   { background: #FFE5E5; color: #CC3333; }

.loan-list-item__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  --stroke-0: var(--accent-black-50, #808080); /* controls trailing icon colour */
}

/* Same wrapper as Icons page — SVG from SYSTEM.icons[name] */
.loan-list-item__icon .icon {
  display: inline-block;
}`,

    'React': `import 'flow-design-system/styles.css';
// Trailing icon: same string as Icons › user (build from SYSTEM.icons in your app)
import { ICONS } from './icons';

<span className="loan-list-item__icon">
  <span className="icon" dangerouslySetInnerHTML={{ __html: ICONS['user'] }} />
</span>`,

    'Vue': `<!-- LoanListItem.vue -->
<template>
  <div :class="['loan-list-item', state !== 'default' && \`loan-list-item--\${state}\`]">
    <div class="loan-list-item__left">
      <div class="loan-list-item__top">
        <span class="loan-list-item__name">{{ name }}</span>
        <div class="loan-list-item__meta">
          <span class="loan-list-item__meta-amount">{{ amount }}</span>
          <span class="loan-list-item__meta-sep">·</span>
          <span class="loan-list-item__meta-type">{{ loanType }}</span>
        </div>
      </div>
      <span class="loan-list-item__time">{{ time }}</span>
    </div>
    <div class="loan-list-item__right">
      <span :class="['loan-list-item__badge', \`loan-list-item__badge--\${status}\`]">{{ statusLabel }}</span>
      <span class="loan-list-item__icon">
        <span class="icon" v-html="ICONS['user']" />
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ name: String, amount: String, loanType: String, time: String, status: String, state: { default: 'default' } });
const statusLabel = computed(() => ({ active: 'Active', 'on-hold': 'On Hold' })[props.status] ?? props.status);
</script>`,

    'SVG': `<!-- Trailing icon: user (Icons › user) -->
<!-- Container sets --stroke-0 to control colour -->
<span class="loan-list-item__icon">
  <!-- --stroke-0: var(--accent-black-50) set on .loan-list-item__icon in CSS -->
  <span class="icon">
    <svg width="100%" height="100%" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.75 2.75C8.75 3.34674 8.51295 3.91903 8.09099 4.34099C7.66903 4.76295 7.09674 5 6.5 5C5.90326 5 5.33097 4.76295 4.90901 4.34099C4.48705 3.91903 4.25 3.34674 4.25 2.75C4.25 2.15326 4.48705 1.58097 4.90901 1.15901C5.33097 0.737053 5.90326 0.5 6.5 0.5C7.09674 0.5 7.66903 0.737053 8.09099 1.15901C8.51295 1.58097 8.75 2.15326 8.75 2.75ZM2.25 11.3233V11.25C2.25 10.1228 2.697767 9.04183 3.4948 8.2448C4.29183 7.44777 5.37283 7 6.5 7C7.62717 7 8.70817 7.44777 9.5052 8.2448C10.3022 9.04183 10.75 10.1228 10.75 11.25V11.3227C9.46699 12.0954 7.99707 12.5025 6.49933 12.5C4.94533 12.5 3.49133 12.07 2.25 11.3227V11.3233Z"
        stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </span>
</span>`,
  };
}

function bindLoanListItemRows() {
  document.querySelectorAll('[data-loan-list-item-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.loanListItemVariant;
      const comp = SYSTEM.products.lenderPortal.loanListItem;
      const v    = comp.variants.find(x => x.id === variantId);
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      openPanel({
        type: 'Lender Portal · Loan List Item',
        name: v?.label || variantId,
        preview: buildLoanListItemHtml(v),
        tabs: loanListItemTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

// ── Loan Stage Group ──────────────────────────────────────────────────────────

function buildLoanStageGroupHtml(v, sampleOverrides = {}, selectFirst = false) {
  const comp = SYSTEM.products.lenderPortal.loanStageGroup;
  const s    = { ...comp.sample, ...sampleOverrides };
  const isExpanded  = v.expanded;
  const stateClass  = isExpanded ? ' loan-stage-group--expanded' : ' loan-stage-group--collapsed';
  const chevronHtml = iconSvg('chevron-down');

  let bodyHtml = `\n  <div class="loan-stage-group__body">`;
  s.loans.forEach((loan, i) => {
    const loanState = selectFirst && i === 0 ? 'selected' : 'default';
    bodyHtml += '\n' + buildLoanListItemHtml({ state: loanState }, loan);
  });
  bodyHtml += `\n  </div>`;

  return `<div class="loan-stage-group${stateClass}">
  <div class="loan-stage-group__header">
    <span class="loan-stage-group__name">${s.stageName}</span>
    <div class="loan-stage-group__meta">
      <span class="loan-stage-group__count">${s.count}</span>
      <span class="loan-stage-group__chevron">${chevronHtml}</span>
    </div>
  </div>${bodyHtml}
</div>`;
}

function renderLenderLoanStageGroupPage() {
  const comp = SYSTEM.products.lenderPortal.loanStageGroup;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table">`;
  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-loan-stage-group-variant="${v.id}" style="padding:16px 20px;align-items:flex-start">
        <span class="ds-row-name" style="min-width:80px">${v.label}</span>
        ${buildLoanStageGroupHtml(v)}
      </div>`;
  });
  html += `</div>`;
  return html;
}

function loanStageGroupTabs(variantId) {
  const comp = SYSTEM.products.lenderPortal.loanStageGroup;
  const v    = comp.variants.find(x => x.id === variantId);
  if (!v) return {};
  const html = buildLoanStageGroupHtml(v);
  const s    = comp.sample;
  return {
    'HTML': `<!-- Include global.css -->
${html}`,

    'CSS': `/* global.css — Loan Stage Group */
.loan-stage-group {
  width: 254px;
  background: var(--accent-black-4, #f5f5f5);
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 12px 0 12px 0;
  box-sizing: border-box;
}

.loan-stage-group--expanded {
  padding-bottom: 4px;
}

.loan-stage-group__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 12px;
  cursor: pointer;
  user-select: none;
}

.loan-stage-group__name {
  font-size: 12px;
  font-weight: 500;
  color: var(--accent-black-60, #666);
  white-space: nowrap;
}

.loan-stage-group__meta {
  display: flex;
  align-items: center;
  gap: 4px;
}

.loan-stage-group__count {
  font-size: 12px;
  font-weight: 500;
  color: var(--accent-black-60, #666);
}

.loan-stage-group__chevron {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  --stroke-0: var(--accent-black-60, #666);
  transition: transform 340ms var(--ease-smooth);
}

.loan-stage-group__chevron svg {
  width: 10.98px;
  height: 5.99px;
  display: block;
}

.loan-stage-group--expanded .loan-stage-group__chevron {
  transform: rotate(180deg);
}

/* Body open/close is JS-driven (animates from real scrollHeight → 0).
   CSS only defines the collapsed default; JS sets max-height inline.
   overflow switches to visible after expand so item box-shadows show. */
.loan-stage-group__body {
  display: flex;
  flex-direction: column;
  padding: 0 4px;
  overflow: hidden;
  max-height: 0;
}

.loan-stage-group--expanded .loan-stage-group__body {
  max-height: none;
  padding-top: 12px;
}

/* Items inside the group fill the container */
.loan-stage-group__body .loan-list-item {
  width: 100%;
  min-width: 0;
}

/* Last item in group: no bottom border */
.loan-stage-group__body .loan-list-item:last-child {
  border-bottom: none;
}`,

    'SVG': `<!-- Chevron icon — rotates 180° when expanded -->
<!-- --stroke-0: var(--accent-black-60) set on .loan-stage-group__chevron in CSS -->
<span class="loan-stage-group__chevron">
  <svg width="100%" height="100%" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</span>`,

    'React': `import 'flow-design-system/styles.css';
import { LoanStageGroup, LoanListItem } from 'flow-design-system/react';
import { useState } from 'react';

function LoanStageGroup({ stageName, count, loans }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div className={\`loan-stage-group\${expanded ? ' loan-stage-group--expanded' : ' loan-stage-group--collapsed'}\`}>
      <div className="loan-stage-group__header" onClick={() => setExpanded(e => !e)}>
        <span className="loan-stage-group__name">{stageName}</span>
        <div className="loan-stage-group__meta">
          <span className="loan-stage-group__count">{count}</span>
          <span className="loan-stage-group__chevron">
            <span className="icon" dangerouslySetInnerHTML={{ __html: ICONS['chevron-down'] }} />
          </span>
        </div>
      </div>
      <div className="loan-stage-group__body">
        {loans.map((loan, i) => (
          <LoanListItem key={loan.name} {...loan} state={i === 0 ? 'selected' : 'default'} />
        ))}
      </div>
    </div>
  );
}`,

    'Vue': `<!-- LoanStageGroup.vue -->
<template>
  <div :class="['loan-stage-group', expanded ? 'loan-stage-group--expanded' : 'loan-stage-group--collapsed']">
    <div class="loan-stage-group__header" @click="expanded = !expanded">
      <span class="loan-stage-group__name">{{ stageName }}</span>
      <div class="loan-stage-group__meta">
        <span class="loan-stage-group__count">{{ count }}</span>
        <span class="loan-stage-group__chevron">
          <span class="icon" v-html="ICONS['chevron-down']" />
        </span>
      </div>
    </div>
    <div class="loan-stage-group__body">
      <LoanListItem v-for="(loan, i) in loans" :key="loan.name" v-bind="loan" :state="i === 0 ? 'selected' : 'default'" />
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
defineProps({ stageName: String, count: Number, loans: Array });
const expanded = ref(true);
</script>`,
  };
}

function mountLoanStageGroupInteractive(el) {
  const group  = el.classList?.contains('loan-stage-group')
    ? el
    : el.querySelector('.loan-stage-group');
  if (!group) return;
  const header = group.querySelector('.loan-stage-group__header');
  const body   = group.querySelector('.loan-stage-group__body');
  if (!header || !body) return;

  const DUR   = 340;
  const EASE  = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  let running = false;

  // Prime inline styles to match initial class so CSS doesn't fight JS
  const startExpanded = group.classList.contains('loan-stage-group--expanded');
  body.style.overflow   = startExpanded ? 'visible' : 'hidden';
  body.style.maxHeight  = startExpanded ? 'none' : '0px';
  body.style.paddingTop = startExpanded ? '12px'  : '0px';

  function animateTo(open) {
    if (running) return;
    running = true;

    if (open) {
      // Lock overflow during animation so height clip works correctly
      body.style.overflow = 'hidden';
      // Measure natural height before the reveal
      body.style.maxHeight = 'none';
      const fullH = body.scrollHeight;
      body.style.maxHeight  = '0px';
      body.style.paddingTop = '0px';
      group.classList.add('loan-stage-group--expanded');
      group.classList.remove('loan-stage-group--collapsed');

      // Double-rAF ensures the browser sees the starting values before we animate
      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.style.transition = `max-height ${DUR}ms ${EASE}, padding-top ${DUR}ms ${EASE}`;
        body.style.maxHeight  = fullH + 'px';
        body.style.paddingTop = '12px';
        setTimeout(() => {
          body.style.transition = '';
          body.style.maxHeight  = 'none';
          // Release overflow so box-shadows on items aren't clipped
          body.style.overflow   = 'visible';
          running = false;
        }, DUR + 20);
      }));
    } else {
      // Lock overflow before collapsing
      body.style.overflow = 'hidden';
      // Snapshot the live height so we animate from the real pixel value
      const curH = body.scrollHeight;
      body.style.maxHeight  = curH + 'px';
      body.style.paddingTop = '12px';

      requestAnimationFrame(() => requestAnimationFrame(() => {
        body.style.transition = `max-height ${DUR}ms ${EASE}, padding-top ${DUR}ms ${EASE}`;
        body.style.maxHeight  = '0px';
        body.style.paddingTop = '0px';
        setTimeout(() => {
          body.style.transition = '';
          group.classList.remove('loan-stage-group--expanded');
          group.classList.add('loan-stage-group--collapsed');
          running = false;
        }, DUR + 20);
      }));
    }
  }

  header.style.cursor = 'pointer';
  header.addEventListener('click', () => {
    animateTo(!group.classList.contains('loan-stage-group--expanded'));
  });
}

function bindLoanStageGroupRows() {
  document.querySelectorAll('[data-loan-stage-group-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.loanStageGroupVariant;
      const comp = SYSTEM.products.lenderPortal.loanStageGroup;
      const v    = comp.variants.find(x => x.id === variantId);
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      openPanel({
        type: 'Lender Portal · Loan Stage Group',
        name: v?.label || variantId,
        preview: buildLoanStageGroupHtml(v),
        tabs: loanStageGroupTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
        onPreviewMount: mountLoanStageGroupInteractive,
      });
    });
  });
}

const PAGE_RENDERERS = {
  'global-css':               renderGlobalCssPage,
  tokens:                     renderTokensPage,
  icons:                      renderIconsPage,
  buttons:                    renderButtonsPage,
  'dropdown-item':            renderDropdownItemPage,
  'segment-picker':           renderSegmentPickerPage,
  'lender-loans':             renderLenderLoansPage,
  'lender-status':            renderLenderStatusPage,
  'lender-stage':             renderLenderStagePage,
  'lender-status-stage':      renderLenderStatusStagePage,
  'lender-profile':           renderLenderProfilePage,
  'lender-sidebar-item':      renderLenderSidebarItemPage,
  'lender-sidebar':           renderLenderSidebarPage,
  'lender-assignees':         renderLenderAssigneesPage,
  'lender-people-dropdown':   renderLenderPeopleDropdownPage,
  'lender-role-picker':       renderLenderRolePickerPage,
  'lender-loan-list-item':    renderLenderLoanListItemPage,
  'lender-loan-stage-group':  renderLenderLoanStageGroupPage,
  'lender-search-bar':        renderLenderSearchBarPage,
  'lender-search-section':    renderLenderSearchSectionPage,
  'lender-loans-panel':       renderLenderLoansPanelPage,
};

// ─── Init ─────────────────────────────────────────────────────────────────────

function init() {
  renderNav();

  const container = document.getElementById('pages-container');
  const allPageIds = SYSTEM.nav.flatMap(g => g.items.map(i => i.id));

  allPageIds.forEach((id) => {
    const renderer = PAGE_RENDERERS[id];
    if (!renderer) return;
    const div = document.createElement('div');
    div.className = 'page' + (id === DEFAULT_ACTIVE_PAGE ? ' active' : '');
    div.id = 'page-' + id;
    div.innerHTML = renderer();
    container.appendChild(div);
  });

  bindNav();
  initGlobalCssPage();
  bindTokenRows();
  bindIconRows();
  bindButtonRows();
  bindButtonSecondaryRows();
  bindDropdownItemRows();
  bindSegmentPickerRows();
  bindLenderRows();
  bindLpStatusRows();
  bindLpStageRows();
  bindStatusStageRows();
  bindProfileRows();
  bindSidebarItemRows();
  bindSidebarRows();
  bindAssigneesRows();
  bindPeopleDropdownRows();
  bindRolePickerRows();
  bindLoanListItemRows();
  bindLoanStageGroupRows();
  bindSearchBarRows();
  bindSearchSectionRows();
  bindLoansPanelRows();
  // Mount interactive inputs on the page-level ds-table so typed states are live
  document.querySelectorAll('[data-search-bar-variant]').forEach(row => mountSearchBarInteractive(row));
  document.querySelectorAll('[data-search-section-variant]').forEach(row => mountSearchBarInteractive(row));
  initLpStatusOutsideClose();
  initSearch();
}

let _amoebaOutsideCloseBound = false;

/** Close amoeba dropdowns when clicking outside their [data-amoeba-wrap] (animated close). Safe to call from prototype + platform. */
function initLpStatusOutsideClose() {
  if (_amoebaOutsideCloseBound) return;
  _amoebaOutsideCloseBound = true;

  document.addEventListener('click', (ev) => {
    document.querySelectorAll('[data-amoeba-wrap]').forEach(wrap => {
      if (wrap.contains(ev.target)) return;
      const api = amoebaWrapToApi.get(wrap);
      if (api && api.isOpen()) api.closeMenu();
    });
  });

  document.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Escape') return;
    document.querySelectorAll('[data-amoeba-wrap]').forEach(wrap => {
      const api = amoebaWrapToApi.get(wrap);
      if (api && api.isOpen()) api.closeMenu();
    });
  });
}

// ─── Global search ────────────────────────────────────────────────────────────

function buildSearchIndex() {
  const idx = [
    { type: 'Global CSS', label: 'Global CSS bundle', pageId: 'global-css', sub: GLOBAL_CSS_PATH, sel: null },
  ];

  // Tokens — searchable by Figma name, CSS var, and hex
  SYSTEM.tokenGroups.forEach(group => {
    group.tokens.forEach(t => {
      idx.push({ type: 'Token', label: t.figma, sub: `--${t.id}  ${t.hex}`, pageId: 'tokens', sel: `[data-token="${t.id}"]` });
    });
  });

  // Icons
  SYSTEM.icons.forEach(icon => {
    idx.push({ type: 'Icon', label: icon.name, pageId: 'icons', sel: `[data-icon="${icon.name}"]` });
  });

  // Buttons
  SYSTEM.components.buttons.variants.forEach(v => {
    idx.push({ type: 'Button', label: v.label, pageId: 'buttons', sel: `[data-variant="${v.id}"]` });
  });

  // Dropdown Item
  SYSTEM.components.dropdownItem.variants.forEach(v => {
    idx.push({ type: 'Dropdown Item', label: v.label, pageId: 'dropdown-item', sel: `[data-dropdown-variant="${v.id}"]` });
  });

  // Products — Lender Portal loans
  SYSTEM.products.lenderPortal.loans.variants.forEach(v => {
    idx.push({ type: 'Loans', label: v.label, pageId: 'lender-loans', sel: `[data-lender-variant="${v.id}"]` });
  });

  // Products — Lender Portal status
  SYSTEM.products.lenderPortal.status.variants.forEach(v => {
    idx.push({ type: 'Status', label: v.label, pageId: 'lender-status', sel: `[data-lp-status-variant="${v.id}"]` });
  });

  // Products — Lender Portal stage
  SYSTEM.products.lenderPortal.stage.variants.forEach(v => {
    idx.push({ type: 'Stage', label: v.label, pageId: 'lender-stage', sel: `[data-lp-stage-variant="${v.id}"]` });
  });

  // Products — Lender Portal status stage
  SYSTEM.products.lenderPortal.statusStage.variants.forEach(v => {
    idx.push({ type: 'Status Stage', label: v.label, pageId: 'lender-status-stage', sel: `[data-lp-status-stage-variant="${v.id}"]` });
  });

  // Products — Lender Portal profile
  SYSTEM.products.lenderPortal.profile.variants.forEach(v => {
    idx.push({ type: 'Profile', label: v.label, pageId: 'lender-profile', sel: `[data-lp-profile-variant="${v.id}"]` });
  });

  // Products — Lender Portal sidebar item
  SYSTEM.products.lenderPortal.sidebarItem.variants.forEach(v => {
    idx.push({ type: 'Sidebar Item', label: v.label, pageId: 'lender-sidebar-item', sel: `[data-sidebar-item-variant="${v.id}"]` });
  });

  // Products — Lender Portal loan list item
  SYSTEM.products.lenderPortal.loanListItem.variants.forEach(v => {
    idx.push({ type: 'Loan List Item', label: v.label, pageId: 'lender-loan-list-item', sel: `[data-loan-list-item-variant="${v.id}"]` });
  });
  SYSTEM.products.lenderPortal.loanStageGroup.variants.forEach(v => {
    idx.push({ type: 'Loan Stage Group', label: v.label, pageId: 'lender-loan-stage-group', sel: `[data-loan-stage-group-variant="${v.id}"]` });
  });
  SYSTEM.components.buttons.secondaryVariants.forEach(v => {
    idx.push({ type: 'Button / Secondary', label: v.label, pageId: 'buttons-secondary', sel: `[data-btn-secondary-variant="${v.id}"]` });
  });
  SYSTEM.products.lenderPortal.searchBar.variants.forEach(v => {
    idx.push({ type: 'Search Bar', label: v.label, pageId: 'lender-search-bar', sel: `[data-search-bar-variant="${v.id}"]` });
  });
  SYSTEM.products.lenderPortal.searchSection.variants.forEach(v => {
    idx.push({ type: 'Search Section', label: v.label, pageId: 'lender-search-section', sel: `[data-search-section-variant="${v.id}"]` });
  });
  SYSTEM.products.lenderPortal.loansPanel.variants.forEach(v => {
    idx.push({ type: 'Loans Panel', label: v.label, pageId: 'lender-loans-panel', sel: `[data-loans-panel-variant="${v.id}"]` });
  });

  return idx;
}

function navigateTo(pageId, rowSel) {
  document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const navItem = document.querySelector(`.nav-item[data-page="${pageId}"]`);
  if (navItem) {
    navItem.classList.add('active');
    // Expand collapsible group if needed
    const grpItems = navItem.closest('.nav-group-items');
    if (grpItems && grpItems.classList.contains('nav-group-items--hidden')) {
      grpItems.classList.remove('nav-group-items--hidden');
      const chev = grpItems.closest('[id]')?.previousElementSibling?.querySelector('.nav-chevron-wrap');
      if (chev) chev.classList.remove('is-collapsed');
    }
  }
  const page = document.getElementById('page-' + pageId);
  if (page) page.classList.add('active');
  if (rowSel) {
    const row = document.querySelector(rowSel);
    if (row) { row.scrollIntoView({ block: 'nearest' }); row.click(); }
  }
}

function initSearch() {
  const searchIndex = buildSearchIndex();
  const input   = document.getElementById('nav-search-input');
  const results = document.getElementById('nav-search-results');
  let focusedIdx = -1;

  function showResults(matches) {
    if (!matches.length) {
      results.innerHTML = `<div class="nav-search-empty">No results</div>`;
    } else {
      results.innerHTML = matches.map((item, i) =>
        `<div class="nav-search-result" data-idx="${i}">
          <span class="nav-search-result-type">${item.type}</span>
          <span class="nav-search-result-label">${item.label}</span>
        </div>`
      ).join('');
      results.querySelectorAll('.nav-search-result').forEach((el, i) => {
        el.addEventListener('mousedown', (e) => {
          e.preventDefault();
          selectResult(matches[i]);
        });
      });
    }
    results.style.display = '';
    focusedIdx = -1;
  }

  function hideResults() {
    results.style.display = 'none';
    focusedIdx = -1;
  }

  function selectResult(item) {
    input.value = '';
    hideResults();
    navigateTo(item.pageId, item.sel);
  }

  function updateFocus(dir) {
    const items = results.querySelectorAll('.nav-search-result');
    if (!items.length) return;
    items[focusedIdx]?.classList.remove('focused');
    focusedIdx = (focusedIdx + dir + items.length) % items.length;
    items[focusedIdx].classList.add('focused');
    items[focusedIdx].scrollIntoView({ block: 'nearest' });
  }

  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    if (!q) { hideResults(); return; }
    const matches = searchIndex.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q) ||
      (item.sub && item.sub.toLowerCase().includes(q))
    ).slice(0, 10);
    showResults(matches);
  });

  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.nav-search-result');
    if (e.key === 'ArrowDown')  { e.preventDefault(); updateFocus(1); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); updateFocus(-1); }
    if (e.key === 'Enter' && focusedIdx >= 0) {
      const q = input.value.trim().toLowerCase();
      const matches = searchIndex.filter(item =>
        item.label.toLowerCase().includes(q) || item.type.toLowerCase().includes(q) ||
        (item.sub && item.sub.toLowerCase().includes(q))
      ).slice(0, 10);
      if (matches[focusedIdx]) selectResult(matches[focusedIdx]);
    }
    if (e.key === 'Escape') { input.value = ''; hideResults(); input.blur(); }
  });

  input.addEventListener('blur', () => setTimeout(hideResults, 150));
}

// ─── Nav binding ──────────────────────────────────────────────────────────────

function bindNav() {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
      document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
      item.classList.add('active');
      const page = document.getElementById('page-' + item.dataset.page);
      page.classList.add('active');
      closePanel();
      // Re-initialize pills now that the page is visible and rects are valid
      if (item.dataset.page === 'segment-picker') {
        requestAnimationFrame(() => {
          page.querySelectorAll('[data-segment-picker-variant]').forEach(row => initSegmentPill(row));
        });
      }
    });
  });
}

// ─── Row bindings ─────────────────────────────────────────────────────────────

function bindTokenRows() {
  document.querySelectorAll('.token-row').forEach(row => {
    row.addEventListener('click', () => {
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const { token, figma, hex } = row.dataset;
      openPanel({
        type: 'Token',
        name: figma,
        preview: `<div style="width:48px;height:48px;border-radius:12px;background:${hex};border:0.5px solid #e0e0e0"></div>`,
        tabs: tokenTabs(token, figma, hex),
        defaultLang: 'CSS',
        relations: null,
      });
    });
  });
}

function bindIconRows() {
  document.querySelectorAll('[data-icon]').forEach(row => {
    row.addEventListener('click', () => {
      const name = row.dataset.icon;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const iconDef = SYSTEM.icons.find(i => i.name === name);
      openPanel({
        type: 'Icon',
        name,
        preview: `<span class="icon" style="width:24px;height:24px;display:inline-flex;align-items:center;justify-content:center">${iconSvg(name)}</span>`,
        tabs: iconTabs(name),
        defaultLang: 'HTML',
        relations: iconDef?.relations || null,
      });
    });
  });
}

function bindButtonSecondaryRows() {
  document.querySelectorAll('[data-btn-secondary-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.btnSecondaryVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const variantDef = SYSTEM.components.buttons.secondaryVariants.find(x => x.id === variantId);
      const btn = row.querySelector('.btn');
      openPanel({
        type: 'Button / Secondary',
        name: variantDef ? variantDef.label : variantId,
        preview: btn ? btn.outerHTML : '',
        tabs: btnSecondaryTabs(variantId),
        defaultLang: 'HTML',
        relations: SYSTEM.components.buttons.relations || null,
      });
    });
  });
}

function bindSearchBarRows() {
  document.querySelectorAll('[data-search-bar-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.searchBarVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const comp = SYSTEM.products.lenderPortal.searchBar;
      const v    = comp.variants.find(x => x.id === variantId) || comp.variants[0];
      openPanel({
        type: 'Component · Lender Portal',
        name: v?.label || variantId,
        preview: buildSearchBarHtml(v),
        onPreviewMount: mountSearchBarInteractive,
        tabs: lenderSearchBarTabs(variantId),
        defaultLang: 'HTML',
        relations: comp.relations || null,
      });
    });
  });
}

function bindSearchSectionRows() {
  document.querySelectorAll('[data-search-section-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.searchSectionVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      openPanel({
        type: 'Component · Lender Portal',
        name: 'Default',
        preview: buildSearchSectionHtml(),
        onPreviewMount: mountSearchBarInteractive,
        tabs: lenderSearchSectionTabs(variantId),
        defaultLang: 'HTML',
        relations: SYSTEM.products.lenderPortal.searchSection.relations || null,
      });
    });
  });
}

// ─── Lender Portal — Loans Panel (composed sidebar) ─────────────────────────

function buildLoansPanelHtml() {
  const comp      = SYSTEM.products.lenderPortal.loansPanel;
  const loansPill = SYSTEM.products.lenderPortal.loans.variants.find(x => x.id === 'loans-pill');
  const plusSvg   = iconSvg('plus');

  const wrap = (name) =>
    `<div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector">${iconSvg(name)}</div></div></div>`;

  let stageGroupsHtml = '';
  comp.stageGroups.forEach((sg, i) => {
    stageGroupsHtml += buildLoanStageGroupHtml(
      { expanded: sg.expanded },
      { stageName: sg.stageName, count: sg.count, loans: sg.loans || undefined },
      i === 0
    );
  });

  const dropdownItems = (SYSTEM.products.lenderPortal.loans.variants.find(v => v.id === 'loans-dropdown')?.items || [])
    .map(item => `<div class="loans-dropdown__item${item.active ? ' loans-dropdown__item--active' : ''}">
      <span class="loans-dropdown__item-label">${item.label}</span>
      <span class="loans-dropdown__item-count">${item.count}</span>
    </div>`).join('');

  return `<div class="loans-panel">
  <div class="loans-panel__header">
    <div style="position:relative">
      <div class="loans-pill" style="cursor:pointer">
        <span class="loans-pill__label">${loansPill.defaultText}</span>
        <div class="loans-pill__badge">
          <span class="loans-pill__count">${loansPill.defaultCount}</span>
          <div class="loans-pill__icon"><span class="icon">${loansPill.iconSvg || ''}</span></div>
        </div>
      </div>
      <div class="loans-dropdown" style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:10">${dropdownItems}</div>
    </div>
    <button class="btn btn--s1" tabindex="-1">${wrap('plus')}</button>
  </div>
  <div class="loans-panel__body">
    ${stageGroupsHtml}
  </div>
  <div class="loans-panel__footer">
    ${buildSearchSectionHtml()}
  </div>
</div>`;
}

function renderLenderLoansPanelPage() {
  const comp = SYSTEM.products.lenderPortal.loansPanel;
  let html = `
    <div class="section-header">
      <div class="section-title">${comp.title}</div>
      <div class="section-subtitle">${comp.subtitle} · <a href="${comp.figmaUrl}" target="_blank" style="color:var(--accent-black-50);text-decoration:none">Open in Figma ↗</a></div>
    </div>
    <div class="ds-table">`;
  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-loans-panel-variant="${v.id}" style="padding:16px 20px;align-items:flex-start">
        <span class="ds-row-name" style="min-width:80px">${v.label}</span>
        <div style="height:551px;overflow:hidden;border-radius:12px;border:0.5px solid var(--accent-black-8)">
          ${buildLoansPanelHtml()}
        </div>
      </div>`;
  });
  html += `</div>`;
  return html;
}

function loansPanelTabs() {
  const comp = SYSTEM.products.lenderPortal.loansPanel;
  const plusSvg      = iconSvg('plus');
  const magnifySvg   = SYSTEM.icons.find(i => i.name === 'magnifying-glass')?.svg || '';
  const funnelSvg    = SYSTEM.icons.find(i => i.name === 'funnel')?.svg           || '';
  const archiveSvg   = SYSTEM.icons.find(i => i.name === 'archive-box')?.svg      || '';
  const chevronSvg   = SYSTEM.icons.find(i => i.name === 'chevron-down')?.svg     || '';

  const html = buildLoansPanelHtml();

  const css = `/* Loans Panel — composed sidebar */
.loans-panel {
  display: flex;
  flex-direction: column;
  width: 278px;
  height: 100%;
  background: var(--background-1, #fcfcfd);
  border-right: 0.5px solid var(--accent-black-12, #e0e0e0);
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}
.loans-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: var(--background-1, #fcfcfd);
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}
.loans-panel__body {
  flex: 1 1 0;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-gutter: stable;
  padding: 0 6px 0 12px;
  z-index: 1;
}

.loans-panel__body::-webkit-scrollbar {
  width: 6px;
}

.loans-panel__body::-webkit-scrollbar-track {
  background: transparent;
  margin: 8px 2px;
}

.loans-panel__body::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 6px;
  transition: background 0.2s var(--ease-smooth);
}

.loans-panel__body:hover::-webkit-scrollbar-thumb {
  background: var(--accent-black-20, rgba(0, 0, 0, 0.2));
}

.loans-panel__body::-webkit-scrollbar-thumb:hover {
  background: var(--accent-black-40, rgba(0, 0, 0, 0.4));
}
.loans-panel__footer {
  flex-shrink: 0;
  z-index: 2;
}
.loans-panel .loan-stage-group { width: 100%; margin-bottom: 12px; }
.loans-panel .loan-stage-group:last-child { margin-bottom: 0; }

/* Sub-component styles — see individual component pages for full rules:
   Loans Pill, Button/Primary, Loan Stage Group, Loan List Item, Search Section */`;

  const react = `import 'flow-design-system/styles.css';
import { LoansPanel } from 'flow-design-system';

const getIconSrc = (name) => \`/icons/\${name}.svg\`;

export default function App() {
  return (
    <LoansPanel
      getIconSrc={getIconSrc}
      pillLabel="My Loans"
      pillCount={52}
      pillIconSrc="/icons/sort.svg"
      magnifyIconSrc="/icons/magnifying-glass.svg"
      funnelIconSrc="/icons/funnel.svg"
      archiveIconSrc="/icons/archive-box.svg"
      chevronIconSrc="/icons/chevron-down.svg"
      stageGroups={[
        { stageName: 'Application',  count: 4, expanded: true,  body: <>{/* LoanListItems */}</> },
        { stageName: 'Underwriting', count: 4, expanded: true,  body: <>{/* LoanListItems */}</> },
        { stageName: 'Closing',      count: 4, expanded: false },
        { stageName: 'Funded',       count: 4, expanded: false },
      ]}
      onAddClick={() => {}}
      onStageToggle={(name, expanded) => {}}
    />
  );
}`;

  const svg = `<!-- SVGs used in the Loans Panel -->
<!-- Set icon colour via --stroke-0 on the container:
     .btn__icon-wrap { --stroke-0: var(--accent-black-80, #333); }
-->

<!-- Plus icon (header add button) -->
${plusSvg}

<!-- Chevron-down (stage group expand/collapse) -->
${chevronSvg}

<!-- Magnifying glass (search bar) -->
${magnifySvg}

<!-- Funnel (filter action) -->
${funnelSvg}

<!-- Archive box (archive action) -->
${archiveSvg}`;

  return {
    'HTML': `<!-- Include global.css -->\n${html}`,
    'CSS':  css,
    'SVG':  svg,
    'React': react,
  };
}

function mountLoansPanelInteractive(el) {
  mountSearchBarInteractive(el);
  el.querySelectorAll('.loan-stage-group').forEach(group => {
    mountLoanStageGroupInteractive(group);
  });

  // Panel-wide single selection for loan list items
  const panelBody = el.querySelector('.loans-panel__body');
  if (panelBody) {
    panelBody.addEventListener('click', (e) => {
      const item = e.target.closest('.loan-list-item');
      if (!item) return;
      panelBody.querySelectorAll('.loan-list-item').forEach(i =>
        i.classList.remove('loan-list-item--selected')
      );
      item.classList.add('loan-list-item--selected');
    });
  }

  // Wire up pill → dropdown toggle
  const pill     = el.querySelector('.loans-pill');
  const dropdown = el.querySelector('.loans-dropdown');
  if (pill && dropdown) {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.style.display !== 'none';
      dropdown.style.display = isOpen ? 'none' : 'flex';
    });

    dropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('.loans-dropdown__item');
      if (!item) return;
      dropdown.querySelectorAll('.loans-dropdown__item').forEach(i =>
        i.classList.remove('loans-dropdown__item--active')
      );
      item.classList.add('loans-dropdown__item--active');
      const label = item.querySelector('.loans-dropdown__item-label')?.textContent || '';
      const count = item.querySelector('.loans-dropdown__item-count')?.textContent || '';
      const pillLabel = pill.querySelector('.loans-pill__label');
      const pillCount = pill.querySelector('.loans-pill__count');
      if (pillLabel) pillLabel.textContent = label;
      if (pillCount) pillCount.textContent = count;
      dropdown.style.display = 'none';
    });

    document.addEventListener('click', function closeHandler() {
      dropdown.style.display = 'none';
      document.removeEventListener('click', closeHandler);
    });
  }
}

function bindLoansPanelRows() {
  document.querySelectorAll('[data-loans-panel-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.loansPanelVariant;
      const comp = SYSTEM.products.lenderPortal.loansPanel;
      const v    = comp.variants.find(x => x.id === variantId);
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      openPanel({
        type: 'Lender Portal · Loans Panel',
        name: v?.label || variantId,
        preview: buildLoansPanelHtml(),
        tabs: loansPanelTabs(),
        defaultLang: 'HTML',
        relations: comp.relations || null,
        onPreviewMount: mountLoansPanelInteractive,
      });
    });
  });
}

function bindButtonRows() {
  document.querySelectorAll('[data-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const v = row.dataset.variant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const btn = row.querySelector('.btn');
      const variantDef = SYSTEM.components.buttons.variants.find(x => x.id === v);
      openPanel({
        type: 'Button / Primary',
        name: variantDef ? variantDef.label : v,
        preview: btn ? btn.outerHTML : '',
        tabs: btnTabs(v),
        defaultLang: 'HTML',
        relations: SYSTEM.components.buttons.relations || null,
      });
    });
  });
}

// ─── Tailwind helpers ─────────────────────────────────────────────────────────

// Builds the full colors block for tailwind.config.js from SYSTEM.tokenGroups
function tailwindColorsBlock() {
  const lines = [];
  SYSTEM.tokenGroups.forEach(group => {
    lines.push(`        // ${group.label}`);
    group.tokens.forEach(t => {
      lines.push(`        '${t.id}': 'var(--${t.id})',`);
    });
  });
  return lines.join('\n');
}

function bindDropdownItemRows() {
  const stateClass = { default: '', hover: ' loans-dropdown__item--hover', selected: ' loans-dropdown__item--selected' };
  document.querySelectorAll('[data-dropdown-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.dropdownVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const variantDef = SYSTEM.components.dropdownItem.variants.find(v => v.id === variantId);
      const cls = stateClass[variantDef?.state || 'default'];
      openPanel({
        type: 'Component · Global',
        name: variantDef?.label || variantId,
        preview: `<div class="loans-dropdown__item${cls}" style="width:200px"><span class="loans-dropdown__item-label">My Loans</span><span class="loans-dropdown__item-count">12</span></div>`,
        tabs: dropdownItemTabs(variantId),
        defaultLang: 'HTML',
        relations: SYSTEM.components.dropdownItem.relations || null,
      });
    });
  });
}

function bindSegmentPickerRows() {
  document.querySelectorAll('[data-segment-picker-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.segmentPickerVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);
      const v = SYSTEM.components.segmentPicker.variants.find(vv => vv.id === variantId);
      openPanel({
        type: 'Component · Global',
        name: v?.label || variantId,
        preview: buildSegmentPickerHtml(v || SYSTEM.components.segmentPicker.variants[0]),
        onPreviewMount: (el) => { requestAnimationFrame(() => initSegmentPill(el)); },
        tabs: segmentPickerTabs(variantId),
        defaultLang: 'HTML',
      });
    });
  });
}

function bindLenderRows() {
  document.querySelectorAll('[data-lender-variant]').forEach(row => {
    row.addEventListener('click', () => {
      const variantId = row.dataset.lenderVariant;
      if (activeRow === row && document.getElementById('panel-content').style.display !== 'none') { closePanel(); return; }
      setActive(row);

      const variantDef = SYSTEM.products.lenderPortal.loans.variants.find(v => v.id === variantId);

      // Build preview — pill gets interactive dropdown, dropdown shows static
      let previewHtml = '';
      let onMount = null;

      if (variantId === 'loans-pill') {
        previewHtml = buildLoansPillInteractivePreview(variantDef);
        onMount = (el) => {
          const pill     = el.querySelector('.loans-pill');
          const dropdown = el.querySelector('.loans-dropdown');
          if (!pill || !dropdown) return;

          // Toggle dropdown open/close on pill click
          pill.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = dropdown.style.display !== 'none';
            dropdown.style.display = isOpen ? 'none' : 'flex';
          });

          // When a dropdown item is clicked → make it active + update pill label
          dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
            const item = e.target.closest('.loans-dropdown__item');
            if (!item) return;
            dropdown.querySelectorAll('.loans-dropdown__item').forEach(i =>
              i.classList.remove('loans-dropdown__item--active')
            );
            item.classList.add('loans-dropdown__item--active');
            const label = item.querySelector('.loans-dropdown__item-label')?.textContent || '';
            const count = item.querySelector('.loans-dropdown__item-count')?.textContent || '';
            const pillLabel = pill.querySelector('.loans-pill__label');
            const pillCount = pill.querySelector('.loans-pill__count');
            if (pillLabel) pillLabel.textContent = label;
            if (pillCount) pillCount.textContent = count;
            dropdown.style.display = 'none';
          });

          // Close on outside click
          document.addEventListener('click', function handler() {
            dropdown.style.display = 'none';
            document.removeEventListener('click', handler);
          });
        };
      } else if (variantId === 'loans-dropdown') {
        previewHtml = buildDropdownHtml();
        onMount = (el) => {
          const dropdown = el.querySelector('.loans-dropdown');
          if (!dropdown) return;
          // Clicking an item makes it the active selection
          dropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.loans-dropdown__item');
            if (!item) return;
            dropdown.querySelectorAll('.loans-dropdown__item').forEach(i =>
              i.classList.remove('loans-dropdown__item--active')
            );
            item.classList.add('loans-dropdown__item--active');
          });
        };
      }

      openPanel({
        type: 'Lender Portal · Loans',
        name: variantDef?.label || variantId,
        preview: previewHtml,
        onPreviewMount: onMount,
        tabs: lenderLoansTabs(variantId),
        defaultLang: 'HTML',
        relations: variantDef?.relations || null,
      });
    });
  });
}

// ─── Code generators ──────────────────────────────────────────────────────────

function tokenTabs(token, figma, hex) {
  return {
    'CSS': `/* Figma: ${figma} */
.element {
  color: var(--${token});
  background: var(--${token});
  border-color: var(--${token});
}

/* Definition in global.css */
:root {
  --${token}: ${hex};
}`,
    'SCSS': `// Figma: ${figma}
$${token.replace(/-/g, '_')}: ${hex};

// Usage
.element {
  color: $${token.replace(/-/g, '_')};
  background: $${token.replace(/-/g, '_')};
  border-color: $${token.replace(/-/g, '_')};
}`,
    'JS / TS': `// tokens.ts
export const tokens = {
  '${figma}': '${hex}',
} as const;

// Usage
import { tokens } from './tokens';
element.style.color = tokens['${figma}'];`,
    'React': `import 'flow-design-system/styles.css';

// Inline style
<div style={{ color: 'var(--${token})' }} />

// CSS Module
import styles from './Component.module.css';
// In Component.module.css:
// .element { color: var(--${token}); }
<div className={styles.element} />

// Tailwind arbitrary value
<div className="text-[var(--${token})]" />`,

    'Tailwind': `// tailwind.config.js
// Map all design tokens → Tailwind theme so you get
// class autocomplete for every token (text-*, bg-*, border-*)
//
// Requires global.css imported in your global CSS.

module.exports = {
  theme: {
    extend: {
      colors: {
${tailwindColorsBlock()}
      },
    },
  },
};

// ── Usage for ${figma} ──────────────────────────
// Text colour
<p class="text-${token}">...</p>

// Background
<div class="bg-${token}">...</div>

// Border
<div class="border border-${token}">...</div>

// Arbitrary value (no config needed)
<div class="text-[var(--${token})]">...</div>`,
  };
}

function iconTabs(name) {
  const svg = iconSvg(name);
  const iconNames = SYSTEM.icons.map(i => `'${i.name}'`).join(' | ');
  return {
    'HTML': `<!-- SVG is inline — no image files, no URLs, never expires -->
<!-- Include global.css for .icon base styles -->

<span class="icon">
  ${svg}
</span>

<!-- Larger size -->
<span class="icon" style="width:24px;height:24px">
  ${svg}
</span>`,

    'CSS': `/* global.css — base icon styles */
.icon {
  width: 16px;
  height: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

/* Theming — override stroke/fill colour on any container */
.icon-container {
  --stroke-0: var(--accent-black-80, #333);
  --fill-0:   var(--accent-black-80, #333);
}`,

    'React': `import 'flow-design-system/styles.css';
// Icon.tsx — inline SVGs, no assets needed
import { ICONS } from './icons'; // map of name → svg string

type IconName = ${iconNames};

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
}

export function Icon({ name, size = 16, className }: IconProps) {
  return (
    <span
      className={\`icon\${className ? ' ' + className : ''}\`}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

// Usage
<Icon name="${name}" />
<Icon name="${name}" size={24} />`,

    'Vue': `<!-- Icon.vue — inline SVGs, no assets needed -->
<template>
  <span
    class="icon"
    :style="{ width: size + 'px', height: size + 'px' }"
    v-html="ICONS[name]"
  />
</template>

<script setup lang="ts">
import { ICONS } from './icons';
const props = defineProps<{ name: string; size?: number }>();
</script>

<!-- Usage -->
<Icon name="${name}" />`,

    'Tailwind': `<!-- Inline SVG — pairs cleanly with Tailwind utilities -->

<span class="icon inline-flex items-center justify-center shrink-0 size-4">
  ${svg}
</span>

<!-- With label -->
<div class="flex items-center gap-2">
  <span class="icon inline-flex items-center justify-center shrink-0 size-4">
    ${svg}
  </span>
  <span class="text-sm text-[var(--accent-black-80)]">Label</span>
</div>`,

    'SVG': svg,
  };
}

function btnHtml(variant) {
  const map = {
    s1: `<!-- global.css required -->
<button class="btn btn--s1" aria-label="magnifying-glass">
  <div class="btn__icon-wrap">
    <div class="btn__icon-inner">
      <div class="btn__icon-vector">
        <img src="[magnifying-glass]" alt="" />
      </div>
    </div>
  </div>
</button>`,
    s2: `<!-- global.css required -->
<button class="btn btn--s2">
  <div class="btn__icon-group">
    <div class="btn__icon-wrap">
      <div class="btn__icon-inner">
        <div class="btn__icon-vector">
          <img src="[icon-1]" alt="" />
        </div>
      </div>
    </div>
    <div class="btn__icon-wrap">
      <div class="btn__icon-inner">
        <div class="btn__icon-vector">
          <img src="[icon-2]" alt="" />
        </div>
      </div>
    </div>
  </div>
</button>`,
    s3: `<!-- global.css required -->
<button class="btn btn--s3">
  <div class="btn__icon-group">
    <div class="btn__icon-wrap">
      <div class="btn__icon-inner">
        <div class="btn__icon-vector">
          <img src="[icon-1]" alt="" />
        </div>
      </div>
    </div>
    <div class="btn__icon-wrap">
      <div class="btn__icon-inner">
        <div class="btn__icon-vector">
          <img src="[icon-2]" alt="" />
        </div>
      </div>
    </div>
    <div class="btn__icon-wrap">
      <div class="btn__icon-inner">
        <div class="btn__icon-vector">
          <img src="[icon-3]" alt="" />
        </div>
      </div>
    </div>
  </div>
</button>`,
    label: `<!-- global.css required -->
<button class="btn btn--label">
  <div class="btn__icon-slot btn__icon-slot--magnifying-glass">
    <div class="btn__icon-vector">
      <img src="[magnifying-glass]" alt="" />
    </div>
  </div>
  <span class="btn__label">Label</span>
</button>`,
    'label-trail': `<!-- global.css required -->
<button class="btn btn--label-trail">
  <div class="btn__icon-slot btn__icon-slot--magnifying-glass">
    <div class="btn__icon-vector">
      <img src="[magnifying-glass]" alt="" />
    </div>
  </div>
  <span class="btn__label">Label</span>
  <div class="btn__icon-slot btn__icon-slot--chevron-down">
    <div class="btn__icon-vector">
      <img src="[chevron-down]" alt="" />
    </div>
  </div>
</button>`,
  };
  return map[variant];
}

function btnCss(variant) {
  const specific = {
    s1: `/* Variant — Symbol 1 */
.btn.btn--s1 { padding: 2px; }
.btn__icon-wrap {
  width: 28px; height: 28px;
  border-radius: 160px;
  background: var(--accent-white-100);
  overflow: hidden; position: relative;
}
.btn__icon-wrap:hover {
  background: var(--accent-black-4);
}`,
    s2: `/* Variant — Symbol 2 */
.btn.btn--s2 { padding: 2px; }
.btn__icon-group { display: flex; align-items: center; }
/* Hover targets individual icon-wrap only */
.btn__icon-wrap:hover {
  background: var(--accent-black-4);
}`,
    s3: `/* Variant — Symbol 3 */
.btn.btn--s3 { padding: 2px; }
.btn__icon-group { display: flex; align-items: center; }
.btn__icon-wrap:hover {
  background: var(--accent-black-4);
}`,
    label: `/* Variant — Symbol + Text */
.btn.btn--label {
  padding: 8px 12px 8px 8px;
  gap: 8px;
}
.btn__label {
  font-size: 12px;
  font-weight: 400;
  color: var(--accent-black-80);
  white-space: nowrap;
}
.btn--label:hover {
  background: var(--accent-black-2);
}`,
    'label-trail': `/* Variant — Symbol + Text + Symbol */
.btn.btn--label-trail {
  padding: 8px;
  gap: 8px;
}
.btn__label {
  font-size: 12px;
  font-weight: 400;
  color: var(--accent-black-80);
  white-space: nowrap;
}
.btn--label-trail:hover {
  background: var(--accent-black-2);
}`,
  };

  return `/* ── Tokens used ─────────────────────────────── */
/* @import 'global.css';  @import 'flow-design-system/styles.css'; /* global bundle */ */

/* Accent/White/100  → background   */
/* Accent/Black/12   → border       */
/* Accent/Black/80   → label text   */
/* Accent/Black/4    → icon hover   */
/* Accent/Black/2    → btn hover    */

/* ── Shared base ────────────────────────────── */
.btn {
  background: var(--accent-white-100);
  border: 0.5px solid var(--accent-black-12);
  border-radius: 100px;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  cursor: pointer;
}
.btn .btn__icon-wrap {
  --stroke-0: var(--accent-black-80, #333);
}

/* ── Variant ─────────────────────────────────── */
${specific[variant]}`;
}

function btnReact(variant) {
  const map = {
    s1: `import { Icon } from './Icon';
import 'flow-design-system/styles.css'; /* global bundle */

export function Button() {
  return (
    <button className="btn btn--s1" aria-label="magnifying-glass">
      <div className="btn__icon-wrap">
        <div className="btn__icon-inner">
          <div className="btn__icon-vector">
            <Icon name="magnifying-glass" />
          </div>
        </div>
      </div>
    </button>
  );
}`,
    s2: `import { Icon } from './Icon';
import 'flow-design-system/styles.css'; /* global bundle */

interface Props {
  icons: [string, string];
}

export function Button({ icons }: Props) {
  return (
    <button className="btn btn--s2">
      <div className="btn__icon-group">
        {icons.map((name, i) => (
          <div className="btn__icon-wrap" key={i}>
            <div className="btn__icon-inner">
              <div className="btn__icon-vector">
                <Icon name={name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </button>
  );
}`,
    s3: `import { Icon } from './Icon';
import 'flow-design-system/styles.css'; /* global bundle */

interface Props {
  icons: [string, string, string];
}

export function Button({ icons }: Props) {
  return (
    <button className="btn btn--s3">
      <div className="btn__icon-group">
        {icons.map((name, i) => (
          <div className="btn__icon-wrap" key={i}>
            <div className="btn__icon-inner">
              <div className="btn__icon-vector">
                <Icon name={name} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </button>
  );
}`,
    label: `import { Icon } from './Icon';
import 'flow-design-system/styles.css'; /* global bundle */

interface Props {
  label: string;
  leadIcon?: string;
  onClick?: () => void;
}

export function Button({
  label,
  leadIcon = 'magnifying-glass',
  onClick,
}: Props) {
  return (
    <button className="btn btn--label" onClick={onClick}>
      <div className={\`btn__icon-slot btn__icon-slot--\${leadIcon}\`}>
        <div className="btn__icon-vector">
          <Icon name={leadIcon} />
        </div>
      </div>
      <span className="btn__label">{label}</span>
    </button>
  );
}`,
    'label-trail': `import { Icon } from './Icon';
import 'flow-design-system/styles.css'; /* global bundle */

interface Props {
  label: string;
  leadIcon?: string;
  trailIcon?: string;
  onClick?: () => void;
}

export function Button({
  label,
  leadIcon = 'magnifying-glass',
  trailIcon = 'chevron-down',
  onClick,
}: Props) {
  return (
    <button className="btn btn--label-trail" onClick={onClick}>
      <div className={\`btn__icon-slot btn__icon-slot--\${leadIcon}\`}>
        <div className="btn__icon-vector">
          <Icon name={leadIcon} />
        </div>
      </div>
      <span className="btn__label">{label}</span>
      <div className={\`btn__icon-slot btn__icon-slot--\${trailIcon}\`}>
        <div className="btn__icon-vector">
          <Icon name={trailIcon} />
        </div>
      </div>
    </button>
  );
}`,
  };
  return map[variant];
}

function btnVue(variant) {
  const map = {
    s1: `<template>
  <button class="btn btn--s1" :aria-label="icon">
    <div class="btn__icon-wrap">
      <div class="btn__icon-inner">
        <div class="btn__icon-vector">
          <Icon :name="icon" />
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';
defineProps<{ icon?: string }>();
</script>`,
    s2: `<template>
  <button class="btn btn--s2">
    <div class="btn__icon-group">
      <div v-for="(name, i) in icons" :key="i" class="btn__icon-wrap">
        <div class="btn__icon-inner">
          <div class="btn__icon-vector">
            <Icon :name="name" />
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';
defineProps<{ icons: [string, string] }>();
</script>`,
    s3: `<template>
  <button class="btn btn--s3">
    <div class="btn__icon-group">
      <div v-for="(name, i) in icons" :key="i" class="btn__icon-wrap">
        <div class="btn__icon-inner">
          <div class="btn__icon-vector">
            <Icon :name="name" />
          </div>
        </div>
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';
defineProps<{ icons: [string, string, string] }>();
</script>`,
    label: `<template>
  <button class="btn btn--label" @click="$emit('click')">
    <div :class="\`btn__icon-slot btn__icon-slot--\${leadIcon}\`">
      <div class="btn__icon-vector">
        <Icon :name="leadIcon" />
      </div>
    </div>
    <span class="btn__label">{{ label }}</span>
  </button>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';
defineProps<{ label: string; leadIcon?: string }>();
defineEmits(['click']);
</script>`,
    'label-trail': `<template>
  <button class="btn btn--label-trail" @click="$emit('click')">
    <div :class="\`btn__icon-slot btn__icon-slot--\${leadIcon}\`">
      <div class="btn__icon-vector">
        <Icon :name="leadIcon" />
      </div>
    </div>
    <span class="btn__label">{{ label }}</span>
    <div :class="\`btn__icon-slot btn__icon-slot--\${trailIcon}\`">
      <div class="btn__icon-vector">
        <Icon :name="trailIcon" />
      </div>
    </div>
  </button>
</template>

<script setup lang="ts">
import Icon from './Icon.vue';
defineProps<{ label: string; leadIcon?: string; trailIcon?: string }>();
defineEmits(['click']);
</script>`,
  };
  return map[variant] || map['label'];
}

function btnTailwind(variant) {
  const base = `<!-- global.css + global.css must be imported globally   -->
<!-- Recommended: use .btn classes as-is — they're already   -->
<!-- token-based. Tailwind utilities add layout/spacing only. -->

/* tailwind.config.js — register btn classes as safe-listed */
module.exports = {
  content: ['./src/**/*.{html,js,ts,jsx,tsx,vue}'],
  safelist: ['btn', 'btn--s1', 'btn--s2', 'btn--s3', 'btn--label', 'btn--label-trail'],
  theme: {
    extend: {
      colors: {
${tailwindColorsBlock()}
      },
    },
  },
};`;

  const usage = {
    s1: `
<!-- Usage with Tailwind layout -->
<div class="flex items-center gap-2">
  <button class="btn btn--s1">
    <div class="btn__icon-wrap">
      <div class="btn__icon-inner">
        <div class="btn__icon-vector">
          <img src="[icon]" alt="" />
        </div>
      </div>
    </div>
  </button>
</div>

<!-- Tailwind-only equivalent (no btn classes) -->
<button class="inline-flex items-center overflow-hidden rounded-full
               border border-[var(--accent-black-12)]
               bg-[var(--accent-white-100)] p-0.5 cursor-pointer">
  <div class="w-7 h-7 rounded-[160px] bg-[var(--accent-white-100)]
              hover:bg-[var(--accent-black-4)] overflow-hidden relative">
    <img class="absolute inset-0 w-full h-full object-contain p-1" src="[icon]" alt="" />
  </div>
</button>`,

    s2: `
<!-- Usage with Tailwind layout -->
<div class="flex items-center gap-2">
  <button class="btn btn--s2">
    <div class="btn__icon-group">
      <div class="btn__icon-wrap">...</div>
      <div class="btn__icon-wrap">...</div>
    </div>
  </button>
</div>

<!-- Tailwind-only equivalent -->
<button class="inline-flex items-center overflow-hidden rounded-full
               border border-[var(--accent-black-12)]
               bg-[var(--accent-white-100)] p-0.5 cursor-pointer">
  <div class="flex items-center">
    <div class="w-7 h-7 rounded-[160px] overflow-hidden relative
                hover:bg-[var(--accent-black-4)]">
      <img class="absolute inset-0 w-full h-full object-contain p-1" src="[icon-1]" alt="" />
    </div>
    <div class="w-7 h-7 rounded-[160px] overflow-hidden relative
                hover:bg-[var(--accent-black-4)]">
      <img class="absolute inset-0 w-full h-full object-contain p-1" src="[icon-2]" alt="" />
    </div>
  </div>
</button>`,

    s3: `
<!-- Usage with Tailwind layout -->
<button class="btn btn--s3">
  <div class="btn__icon-group">
    <div class="btn__icon-wrap">...</div>
    <div class="btn__icon-wrap">...</div>
    <div class="btn__icon-wrap">...</div>
  </div>
</button>

<!-- Tailwind-only equivalent -->
<button class="inline-flex items-center overflow-hidden rounded-full
               border border-[var(--accent-black-12)]
               bg-[var(--accent-white-100)] p-0.5 cursor-pointer">
  <div class="flex items-center">
    <div class="w-7 h-7 rounded-[160px] overflow-hidden relative
                hover:bg-[var(--accent-black-4)]">
      <img class="absolute inset-0 w-full h-full object-contain p-1" src="[icon-1]" alt="" />
    </div>
    <div class="w-7 h-7 rounded-[160px] overflow-hidden relative
                hover:bg-[var(--accent-black-4)]">
      <img class="absolute inset-0 w-full h-full object-contain p-1" src="[icon-2]" alt="" />
    </div>
    <div class="w-7 h-7 rounded-[160px] overflow-hidden relative
                hover:bg-[var(--accent-black-4)]">
      <img class="absolute inset-0 w-full h-full object-contain p-1" src="[icon-3]" alt="" />
    </div>
  </div>
</button>`,

    label: `
<!-- Usage with Tailwind utilities for spacing/layout -->
<button class="btn btn--label">
  <div class="btn__icon-slot btn__icon-slot--magnifying-glass">...</div>
  <span class="btn__label">Label</span>
</button>

<!-- Tailwind-only equivalent -->
<button class="inline-flex items-center gap-2 overflow-hidden rounded-full
               border border-[var(--accent-black-12)]
               bg-[var(--accent-white-100)]
               hover:bg-[var(--accent-black-2)]
               py-2 pl-2 pr-3 cursor-pointer">
  <span class="w-4 h-4 flex-shrink-0"><!-- icon --></span>
  <span class="text-xs text-[var(--accent-black-80)]">Label</span>
</button>`,

    'label-trail': `
<!-- Usage with Tailwind utilities -->
<button class="btn btn--label-trail">
  <div class="btn__icon-slot btn__icon-slot--magnifying-glass">...</div>
  <span class="btn__label">Label</span>
  <div class="btn__icon-slot btn__icon-slot--chevron-down">...</div>
</button>

<!-- Tailwind-only equivalent -->
<button class="inline-flex items-center gap-2 overflow-hidden rounded-full
               border border-[var(--accent-black-12)]
               bg-[var(--accent-white-100)]
               hover:bg-[var(--accent-black-2)]
               p-2 cursor-pointer">
  <span class="w-4 h-4 flex-shrink-0"><!-- lead icon --></span>
  <span class="text-xs text-[var(--accent-black-80)]">Label</span>
  <span class="w-4 h-4 flex-shrink-0"><!-- trail icon --></span>
</button>`,
  };

  return base + (usage[variant] || usage['label']);
}

function btnTabs(variant) {
  const v = SYSTEM.components.buttons.variants.find(x => x.id === variant);
  const iconNames = v ? (v.icons || [v.leadIcon, v.trailIcon].filter(Boolean)) : ['magnifying-glass'];
  const svgParts = iconNames.map(n => `<!-- ${n} -->\n<!-- .btn__icon-wrap { --stroke-0: var(--accent-black-80, #333); } -->\n${SYSTEM.icons.find(i => i.name === n)?.svg || ''}`);
  return {
    'HTML':     btnHtml(variant),
    'CSS':      btnCss(variant),
    'SVG':      svgParts.join('\n\n'),
    'React':    btnReact(variant),
    'Vue':      btnVue(variant),
    'Tailwind': btnTailwind(variant),
  };
}

// ─── Panel logic ──────────────────────────────────────────────────────────────

const panel     = document.getElementById('panel');
const panelType = document.getElementById('panel-type');
const panelName = document.getElementById('panel-name');
const panelPrev = document.getElementById('panel-preview');
panelPrev.addEventListener('click', (e) => {
  const btn = e.target.closest('.sidebar-item');
  if (!btn) return;
  btn.classList.toggle('sidebar-item--selected');
});
const panelTabs = document.getElementById('panel-tabs');
const codeWrap  = document.getElementById('panel-code-wrap');
const panelCopy = document.getElementById('panel-copy');
const mainEl    = document.getElementById('main');
let activeRow   = null;
let activeLang  = null;
let currentTabs = {};

function renderTabs(tabs, defaultLang) {
  const lang = (activeLang && tabs[activeLang]) ? activeLang : defaultLang;
  activeLang = lang;

  panelTabs.innerHTML = Object.keys(tabs).map(l =>
    `<button class="tab-btn${l === lang ? ' active' : ''}" data-lang="${l}">${l}</button>`
  ).join('');

  codeWrap.innerHTML = Object.entries(tabs).map(([l, code]) => {
    const langClass = l === 'CSS' || l === 'SCSS' ? 'language-css'
                    : l === 'JS / TS' ? 'language-typescript'
                    : l === 'Vue' ? 'language-html'
                    : 'language-jsx';
    return `<div class="tab-pane${l === lang ? ' active' : ''}" data-lang="${l}">
      <pre><code class="${langClass}">${escHtml(code)}</code></pre>
    </div>`;
  }).join('');

  codeWrap.querySelectorAll('code').forEach(el => hljs.highlightElement(el));

  panelTabs.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeLang = btn.dataset.lang;
      panelTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      codeWrap.querySelectorAll('.tab-pane').forEach(p =>
        p.classList.toggle('active', p.dataset.lang === activeLang)
      );
      resetCopy();
    });
  });
}

// ─── Relationship graph ────────────────────────────────────────────────────────
// To add a connection: edit system.js only — add `relations: { uses: [...], usedBy: [...] }`
// to any component, variant, or icon. platform.js reads it automatically.

function buildRelationsHtml(name, relations) {
  if (!relations) return '';
  const { uses = [], usedBy = [] } = relations;
  if (!uses.length && !usedBy.length) return '';

  const arrow = `<svg width="16" height="8" viewBox="0 0 16 8" fill="none"><path d="M0 4h13" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/><path d="M9.5 1l3 3-3 3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const extIcon = `<svg width="8" height="8" viewBox="0 0 8 8" fill="none" style="flex-shrink:0;opacity:0.5"><path d="M1 7 7 1M7 1H3M7 1v4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const selfNode = (label) =>
    `<div class="rel-node"><div class="rel-chip rel-chip--self">${label}</div><span class="rel-role rel-role--self">this component</span></div>`;

  const linkNode = (label, role, pageId) =>
    `<div class="rel-node"><button class="rel-chip rel-chip--link" data-nav-page="${pageId}">${label}${extIcon}</button><span class="rel-role">${role}</span></div>`;

  const arrowEl = `<div class="rel-arrow">${arrow}</div>`;

  const parts = [];
  uses.forEach(dep => { parts.push(linkNode(dep.name, 'feeds in', dep.pageId)); parts.push(arrowEl); });
  parts.push(selfNode(name));
  usedBy.forEach(parent => { parts.push(arrowEl); parts.push(linkNode(parent.name, 'used by', parent.pageId)); });

  return `<div class="panel-relations">
    <div class="rel-header"><span class="rel-section-label">Relationships</span><span class="rel-section-desc">click a node to navigate</span></div>
    <div class="rel-graph">${parts.join('')}</div>
  </div>`;
}

function openPanel({ type, name, preview, tabs, defaultLang, onPreviewMount, relations }) {
  panelType.textContent = type;
  panelName.textContent = name;

  const relEl = document.getElementById('panel-relations');
  const relHtml = buildRelationsHtml(name, relations);
  if (relHtml) {
    relEl.innerHTML = relHtml;
    relEl.style.display = '';
    relEl.querySelectorAll('[data-nav-page]').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.navPage;
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        const navItem = document.querySelector(`.nav-item[data-page="${pid}"]`);
        if (navItem) navItem.classList.add('active');
        const page = document.getElementById('page-' + pid);
        if (page) page.classList.add('active');
        closePanel();
      });
    });
  } else {
    relEl.style.display = 'none';
    relEl.innerHTML = '';
  }

  panelPrev.innerHTML   = preview;
  if (onPreviewMount) onPreviewMount(panelPrev);
  currentTabs = tabs;
  renderTabs(tabs, defaultLang || Object.keys(tabs)[0]);
  document.getElementById('panel-empty').style.display   = 'none';
  document.getElementById('panel-content').style.display = 'flex';
  panel.classList.add('open');
  resetCopy();
}

function closePanel() {
  document.getElementById('panel-content').style.display = 'none';
  document.getElementById('panel-empty').style.display   = '';
  panel.classList.remove('open');
  if (activeRow) { activeRow.classList.remove('active'); activeRow = null; }
}

function setActive(row) {
  if (activeRow) activeRow.classList.remove('active');
  activeRow = row;
  row.classList.add('active');
}

function resetCopy() {
  panelCopy.innerHTML = `<svg class="copy-icon" viewBox="0 0 14 14" fill="none"><rect x="4.5" y="4.5" width="8" height="8" rx="1.5" stroke="#808080" stroke-width="1"/><path d="M4.5 9.5H3A1.5 1.5 0 0 1 1.5 8V3A1.5 1.5 0 0 1 3 1.5H8A1.5 1.5 0 0 1 9.5 3v1.5" stroke="#808080" stroke-width="1" stroke-linecap="round"/></svg> Copy code`;
  panelCopy.className = 'panel-copy';
}

panelCopy.addEventListener('click', () => {
  const code = currentTabs[activeLang] || '';
  navigator.clipboard.writeText(code).then(() => {
    panelCopy.innerHTML = `<svg class="copy-icon" viewBox="0 0 14 14" fill="none"><path d="M2 7l3.5 3.5L12 3" stroke="#16a34a" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Copied!`;
    panelCopy.className = 'panel-copy copied';
    setTimeout(resetCopy, 2000);
  });
});

document.getElementById('panel-close').addEventListener('click', closePanel);

// ─── Boot ─────────────────────────────────────────────────────────────────────
init();
