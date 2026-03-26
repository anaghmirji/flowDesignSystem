'use strict';

// ─── Data ─────────────────────────────────────────────────────────────────────

const tabs = [
  { id: 'laura-lee',      label: 'Laura Lee',     closeable: true,  active: true  },
  { id: 'alex-johnson',   label: 'Alex Johnson',  closeable: false, active: false },
  { id: 'maria-smith',    label: 'Maria Smith',   closeable: false, active: false },
  { id: 'james-williams', label: 'James Williams',closeable: false, active: false },
];

// ─── Top Bar ──────────────────────────────────────────────────────────────────

function buildTopBar() {
  const tabsHtml = tabs.map(t => `
    <button class="proto-tab${t.active ? ' proto-tab--active' : ''}" data-tab="${t.id}">
      <span class="proto-tab__label">${t.label}</span>
      ${t.closeable ? `<span class="proto-tab__close" data-close="${t.id}">${iconSvg('x-mark')}</span>` : ''}
    </button>`).join('');

  // Use the exact same buildBtnPreviewHtml() from platform.js — zero duplication
  const searchBtn = buildBtnPreviewHtml({ id: 's1', icons: ['magnifying-glass'] });
  const bellBtn   = buildBtnPreviewHtml({ id: 's1', icons: ['bell'] });
  const panelBtn  = buildBtnPreviewHtml({ id: 's1', icons: ['document'] });

  return `
    <div class="proto-topbar">
      <div class="proto-topbar__tabs">${tabsHtml}</div>
      <div class="proto-topbar__actions">
        ${searchBtn}
        ${bellBtn}
        ${panelBtn}
      </div>
    </div>`;
}

// ─── Body (main + ai panel) ───────────────────────────────────────────────────

function buildBody() {
  return `
    <div class="proto-body">
      <div class="proto-card">
        <div class="proto-main">
          <!-- main content goes here -->
        </div>
        <div class="proto-resize-handle" id="ai-resize-handle"></div>
        <div class="proto-ai-panel" id="ai-panel">
          <span class="proto-ai-panel__label">AI Panel</span>
        </div>
      </div>
    </div>`;
}

// ─── App ──────────────────────────────────────────────────────────────────────

function buildApp() {
  return `
    ${buildSidebarHtml()}
    <div class="proto-content">
      ${buildTopBar()}
      ${buildBody()}
    </div>`;
}

// ─── Interactions ─────────────────────────────────────────────────────────────

function bindResizeHandle() {
  const handle = document.getElementById('ai-resize-handle');
  const panel  = document.getElementById('ai-panel');
  if (!handle || !panel) return;

  const MIN_WIDTH = 200;
  const MAX_WIDTH = 600;
  let dragging = false;
  let startX = 0;
  let startWidth = 0;

  handle.addEventListener('mousedown', e => {
    dragging  = true;
    startX    = e.clientX;
    startWidth = panel.offsetWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    handle.classList.add('proto-resize-handle--active');
  });

  document.addEventListener('mousemove', e => {
    if (!dragging) return;
    const delta = startX - e.clientX;          // dragging left = wider panel
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + delta));
    panel.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    handle.classList.remove('proto-resize-handle--active');
  });
}

function bindInteractions() {
  // Sidebar
  document.querySelectorAll('.sidebar-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('sidebar-item--selected'));
      btn.classList.add('sidebar-item--selected');
    });
  });

  // Tabs
  document.querySelectorAll('.proto-tab').forEach(tab => {
    tab.addEventListener('click', e => {
      if (e.target.closest('.proto-tab__close')) return;
      document.querySelectorAll('.proto-tab--active').forEach(t => t.classList.remove('proto-tab--active'));
      tab.classList.add('proto-tab--active');
    });
  });

  // Tab close
  document.querySelectorAll('.proto-tab__close').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const tab = document.querySelector(`.proto-tab[data-tab="${btn.dataset.close}"]`);
      if (!tab) return;
      const wasActive = tab.classList.contains('proto-tab--active');
      tab.remove();
      if (wasActive) {
        const next = document.querySelector('.proto-tab');
        if (next) next.classList.add('proto-tab--active');
      }
    });
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('app').innerHTML = buildApp();
  bindInteractions();
  bindResizeHandle();
});
