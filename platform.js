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
        html += `<div class="nav-item${isActive ? ' active' : ''}" data-page="${item.id}">${item.icon}${item.label}</div>`;
      });
      html += `</div></div>`;
    } else {
      html += `<div class="nav-section"${gi > 0 ? ' style="margin-top:8px"' : ''}>${group.section}</div>`;
      group.items.forEach(item => {
        const isActive = item.id === DEFAULT_ACTIVE_PAGE;
        html += `<div class="nav-item${isActive ? ' active' : ''}" data-page="${item.id}">${item.icon}${item.label}</div>`;
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
    <div class="ds-table">`;

  comp.variants.forEach(v => {
    html += `
      <div class="ds-row" data-variant="${v.id}">
        <span class="ds-row-name" style="min-width:220px">${v.label}</span>
        ${buildBtnPreviewHtml(v)}
      </div>`;
  });

  html += `</div>`;
  return html;
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
  transition: background 0.1s;
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
  transition: background 0.1s;
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
  transition: background 0.1s;
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
  return `<div class="lp-status-dropdown-wrap">
    <div class="lp-status lp-status--clickable" data-lp-status-trigger role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
      <div class="lp-status__dot lp-status__dot--${v.dot}"></div>
      <span class="lp-status__label">${v.statusLabel}</span>
    </div>
    <div class="loans-dropdown loans-dropdown--status-menu" data-lp-status-menu style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:30">
      ${buildStatusMenuInnerHtml(v.statusLabel)}
    </div>
  </div>`;
}

function mountLpStatusDropdown(root) {
  const trigger = root.querySelector('[data-lp-status-trigger]');
  const menu = root.querySelector('[data-lp-status-menu]');
  if (!trigger || !menu) return;

  function closeAllMenus() {
    document.querySelectorAll('[data-lp-status-menu]').forEach(m => {
      m.style.display = 'none';
    });
    document.querySelectorAll('[data-lp-status-trigger]').forEach(t => {
      t.setAttribute('aria-expanded', 'false');
    });
  }

  function closeMenu() {
    menu.style.display = 'none';
    trigger.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    closeAllMenus();
    menu.style.display = 'flex';
    trigger.setAttribute('aria-expanded', 'true');
  }

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menu.style.display === 'flex';
    if (isOpen) closeMenu();
    else openMenu();
  });

  trigger.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    e.stopPropagation();
    const isOpen = menu.style.display === 'flex';
    if (isOpen) closeMenu();
    else openMenu();
  });

  menu.querySelectorAll('.loans-dropdown__item').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const labelSpan = opt.querySelector('.loans-dropdown__item-label');
      const dot = opt.dataset.statusDot;
      const text = labelSpan ? labelSpan.textContent : '';
      const dotEl = trigger.querySelector('.lp-status__dot');
      const statusLabel = trigger.querySelector('.lp-status__label');
      if (dotEl && dot) dotEl.className = `lp-status__dot lp-status__dot--${dot}`;
      if (statusLabel) statusLabel.textContent = text;
      menu.querySelectorAll('.loans-dropdown__item').forEach(x => x.classList.remove('loans-dropdown__item--active'));
      opt.classList.add('loans-dropdown__item--active');
      closeMenu();
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
  transition: background 0.1s;
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
  transition: background 0.1s;
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
  transition: background 0.1s;
}
.lp-stage__btn:hover .lp-stage__btn-inner { background: var(--accent-black-20); }`,

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
  border-radius: 100px 4px 4px 100px; transition: background 0.1s;
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
  border-radius: 4px 100px 100px 4px; overflow: hidden; transition: background 0.1s;
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
  transition: background 0.1s;
}
.lp-stage__btn:hover .lp-stage__btn-inner { background: var(--accent-black-20); }`,

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
      });
    });
  });
}

// ── Assignees ─────────────────────────────────────────────────────────────────

function buildAssigneesHtml(v) {
  const comp  = SYSTEM.products.lenderPortal.assignees;
  const count = v?.count ?? 2;
  // chevron SVG sized to match Figma: 7.5×3.75px path inside 12×12 container
  const chevronSvg = `<svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--accent-black-50,#808080)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // Build avatar stack — show max 3, then +N count bubble
  const avatarUrls = [comp.avatar1Url, comp.avatar2Url, comp.avatar3Url];
  let avatarsHtml = '';
  const shown = Math.min(count, 3);

  for (let i = 0; i < shown; i++) {
    avatarsHtml += `<span class="assignees__avatar" style="z-index:${3 - i}">
      <img src="${avatarUrls[i]}" alt="">
    </span>`;
  }

  if (count > 3) {
    avatarsHtml += `<span class="assignees__count">+${count - 3}</span>`;
  }

  return `<button class="assignees" type="button">
  <span class="assignees__avatars">${avatarsHtml}</span>
  <span class="assignees__chevron">${chevronSvg}</span>
</button>`;
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
  padding-right: 12px;
  isolation: isolate;
}
.assignees__avatar {
  width: 28px; height: 28px;
  border-radius: 100px;
  border: 1px solid var(--accent-black-8);
  background: var(--accent-white-100);
  overflow: hidden; flex-shrink: 0;
  margin-right: -12px;
  position: relative;
  transition: transform 0.2s var(--ease-spring), z-index 0s;
}
.assignees__avatar:first-child  { z-index: 2; }
.assignees__avatar:nth-child(2) { z-index: 1; }
.assignees__avatar:nth-child(3) { z-index: 0; }
.assignees__avatar:hover { transform: translateY(-2px); z-index: 10; }
.assignees__avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }

/* +N overflow count bubble */
.assignees__count {
  width: 28px; height: 28px;
  border-radius: 100px;
  border: 1px solid var(--accent-black-8);
  background: var(--accent-black-12);
  display: flex; align-items: center; justify-content: center;
  font-size: 9px; font-weight: 500; color: var(--accent-black-60);
  flex-shrink: 0; margin-right: -12px; z-index: 0;
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
.assignees.open .assignees__chevron { transform: rotate(180deg); }`,

    'SVG': `<!-- Chevron icon (chevron-down) — stroke colour via --stroke-0 -->
<svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.5 0.5L5.5 5.5L0.5 0.5"
    stroke="var(--stroke-0,#333)"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"/>
</svg>

<!-- Set --stroke-0 on the container to change colour:
  style="--stroke-0: var(--accent-black-50)" -->`,

    'React': `import { useState } from 'react';
import { Assignees } from 'flow-design-system/react';
import 'flow-design-system/styles.css';

export function AssigneesDemo() {
  const [open, setOpen] = useState(false);
  const assignees = [
    { id: '1', name: 'Sarah K.', avatarUrl: '/avatars/sarah.jpg' },
    { id: '2', name: 'James L.', avatarUrl: '/avatars/james.jpg' },
    { id: '3', name: 'Mia T.',   avatarUrl: '/avatars/mia.jpg'   },
  ];

  return (
    <Assignees
      assignees={assignees}
      open={open}
      onToggle={() => setOpen(o => !o)}
    />
  );
}`,
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
          const btn = el.querySelector('.assignees');
          if (!btn) return;
          btn.addEventListener('click', () => {
            btn.classList.toggle('open');
          });
        },
        tabs: assigneesTabs(variantId),
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
  transition: background 0.15s ease;
}

.sidebar-item__icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.15s ease, height 0.15s ease;
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
}`,

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
}`,

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

const PAGE_RENDERERS = {
  'global-css':               renderGlobalCssPage,
  tokens:                     renderTokensPage,
  icons:                      renderIconsPage,
  buttons:                    renderButtonsPage,
  'dropdown-item':            renderDropdownItemPage,
  'lender-loans':             renderLenderLoansPage,
  'lender-status':            renderLenderStatusPage,
  'lender-stage':             renderLenderStagePage,
  'lender-status-stage':      renderLenderStatusStagePage,
  'lender-profile':           renderLenderProfilePage,
  'lender-sidebar-item':      renderLenderSidebarItemPage,
  'lender-sidebar':           renderLenderSidebarPage,
  'lender-assignees':         renderLenderAssigneesPage,
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
  bindDropdownItemRows();
  bindLenderRows();
  bindLpStatusRows();
  bindLpStageRows();
  bindStatusStageRows();
  bindProfileRows();
  bindSidebarItemRows();
  bindSidebarRows();
  bindAssigneesRows();
  initLpStatusOutsideClose();
  initSearch();
}

/** Close status dropdowns when clicking outside any .lp-status-dropdown-wrap (one listener). */
function initLpStatusOutsideClose() {
  document.addEventListener('click', (ev) => {
    document.querySelectorAll('.lp-status-dropdown-wrap').forEach(wrap => {
      if (wrap.contains(ev.target)) return;
      const m = wrap.querySelector('[data-lp-status-menu]');
      const t = wrap.querySelector('[data-lp-status-trigger]');
      if (m) m.style.display = 'none';
      if (t) t.setAttribute('aria-expanded', 'false');
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
      document.getElementById('page-' + item.dataset.page).classList.add('active');
      closePanel();
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
    'React': `// Inline style
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

/* Theming — override stroke/fill colour */
:root {
  --stroke-0: #333333;
  --fill-0:   #333333;
}`,

    'React': `// Icon.tsx — inline SVGs, no assets needed
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
  return {
    'HTML':     btnHtml(variant),
    'CSS':      btnCss(variant),
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
