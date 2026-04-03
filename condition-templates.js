'use strict';

/**
 * Manage Conditions — Lender Exploration · Figma node 797:5582
 * https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=797-5582
 */

function ctNames(from, to) {
  const out = [];
  for (let n = from; n <= to; n += 1) out.push(`Condition Name #${n}`);
  return out;
}

/** Stage grid: first column wider (279); Post-Close empty in file. */
const CT_STAGES = [
  { id: 'application', label: 'Application', items: ctNames(1, 4), colGrow: 279 },
  { id: 'underwriting', label: 'Underwriting', items: ctNames(1, 8), colGrow: 275 },
  { id: 'closing', label: 'Closing', items: ctNames(1, 6), colGrow: 275 },
  { id: 'funded', label: 'Funded', items: ctNames(1, 12), colGrow: 275 },
  { id: 'post-close', label: 'Post-Close', items: [], colGrow: 275 },
];

const CT_TEMPLATE_NAMES = Array.from({ length: 19 }, (_, i) => `Condition Template #${i + 1}`);

function buildConditionRow(text) {
  return `<div class="ct-condition" data-ct-condition><span class="ct-condition__text">${text}</span></div>`;
}

function buildConditionList(stage) {
  const { items, id } = stage;
  if (!items.length) {
    return `<div class="ct-column__list ct-column__list--empty" data-ct-list="${id}">
      <div class="ct-empty-card"><div class="ct-column__empty">No conditions in this stage yet.</div></div>
    </div>`;
  }
  return `<div class="ct-column__list" data-ct-list="${id}">${items.map(t => buildConditionRow(t)).join('')}</div>`;
}

/** Per-stage interval: dots/lines match stage boundaries; condition cards sit in the band below. */
function buildColumnIntervalHtml(stageIndex) {
  const isFirst = stageIndex === 0;
  const isLast = stageIndex === CT_STAGES.length - 1;
  if (isFirst) {
    return `<div class="ct-column__interval" aria-hidden="true">
      <span class="ct-column__interval-dot"></span>
      <div class="ct-column__interval-rule"></div>
      <span class="ct-column__interval-dot ct-column__interval-dot--junction"></span>
    </div>`;
  }
  if (isLast) {
    return `<div class="ct-column__interval ct-column__interval--last" aria-hidden="true">
      <div class="ct-column__interval-rule"></div>
      <div class="ct-column__interval-rule ct-column__interval-rule--tail"></div>
    </div>`;
  }
  return `<div class="ct-column__interval ct-column__interval--mid" aria-hidden="true">
    <div class="ct-column__interval-rule"></div>
    <span class="ct-column__interval-dot ct-column__interval-dot--junction"></span>
  </div>`;
}

function buildStageHeaders() {
  return CT_STAGES.map((s, i) => {
    const grow = s.colGrow || 275;
    const pad = i < CT_STAGES.length - 1 ? ' ct-stage-head--pad' : '';
    return `<div class="ct-head-slot" style="--ct-col-grow:${grow}"><div class="ct-stage-head${pad}">${s.label}</div></div>`;
  }).join('');
}

function buildStageColumns() {
  return CT_STAGES.map((s, i) => {
    const cardInner = buildConditionList(s);
    const addBtn = `<button type="button" class="ct-add-condition" data-ct-add="${s.id}">Add Condition</button>`;
    const emptyCard = !s.items.length ? ' ct-column__card--empty' : '';
    const grow = s.colGrow || 275;
    const connMod =
      i === 0 ? 'ct-column__connector--first' : i === CT_STAGES.length - 1 ? 'ct-column__connector--last' : 'ct-column__connector--mid';
    return `<div class="ct-column" data-stage-label="${s.label.replace(/"/g, '&quot;')}" style="--ct-col-grow:${grow}">
      ${buildColumnIntervalHtml(i)}
      <div class="ct-column__connector ${connMod}" aria-hidden="true"></div>
      <div class="ct-column__stack">
        <div class="ct-column__card${emptyCard}">${cardInner}</div>
        ${addBtn}
      </div>
    </div>`;
  }).join('');
}

function buildConditionTemplateGridHtml() {
  return `
      <div class="ct-stack ct-stack--figma">
        <div class="ct-row ct-row--heads">${buildStageHeaders()}</div>
        <div class="ct-track-wrap">
          <div class="ct-row ct-row--cols">${buildStageColumns()}</div>
        </div>
      </div>`;
}

function buildSidebarTemplateRows() {
  return CT_TEMPLATE_NAMES.map(
    (label, i) =>
      `<button type="button" class="ct-manage__tpl${i === 0 ? ' ct-manage__tpl--active' : ''}" data-ct-tpl="${i}">${label}</button>`,
  ).join('');
}

function buildManageConditionsInnerHtml(templateTitle) {
  const title = templateTitle || CT_TEMPLATE_NAMES[0];
  const plusIcon = typeof iconSvg === 'function' ? iconSvg('plus') : '';
  const searchIcon = typeof iconSvg === 'function' ? iconSvg('magnifying-glass') : '';
  const closeIcon = typeof iconSvg === 'function' ? iconSvg('x-mark') : '';

  return `
<div class="ct-manage" data-ct-manage>
  <aside class="ct-manage__sidebar">
    <div class="ct-manage__sidebar-inner">
      <div class="ct-manage__sidebar-head">
        <span class="ct-manage__sidebar-title">Manage Conditions</span>
        <button type="button" class="ct-manage__icon-btn ct-manage__icon-btn--pill" aria-label="Add template">${plusIcon}</button>
      </div>
      <div class="ct-manage__tpl-scroll" data-ct-tpl-list>
        ${buildSidebarTemplateRows()}
      </div>
    </div>
    <div class="ct-manage__search-fade">
      <div class="ct-manage__search">
        <span class="ct-manage__search-icon" aria-hidden="true">${searchIcon}</span>
        <input type="search" class="ct-manage__search-input" placeholder="Search" autocomplete="off" data-ct-search />
      </div>
    </div>
  </aside>
  <div class="ct-manage__main">
    <div class="ct-manage__card">
      <button type="button" class="ct-manage__close ct-manage__icon-btn ct-manage__icon-btn--pill" data-ct-modal-close aria-label="Close">${closeIcon}</button>
      <div class="ct-manage__editor">
        <h2 class="ct-manage__editor-title" id="proto-ct-modal-title" data-ct-editor-title>${title}</h2>
        <div class="ct-manage__editor-body">
          ${buildConditionTemplateGridHtml()}
        </div>
      </div>
    </div>
    <div class="ct-manage__footer">
      <button type="button" class="ct-manage__btn ct-manage__btn--ghost" data-ct-cancel>Cancel</button>
      <button type="button" class="ct-manage__btn ct-manage__btn--primary">Save Changes</button>
    </div>
  </div>
</div>`;
}

function buildConditionTemplateModalDialogHtml() {
  return buildManageConditionsInnerHtml(CT_TEMPLATE_NAMES[0]);
}

window.buildConditionTemplateModalDialogHtml = buildConditionTemplateModalDialogHtml;

function buildConditionTemplatesShell() {
  return `
<div class="ct-shell">
  <header class="ct-shell__header">
    <a class="ct-shell__back" href="prototype.html">Overview</a>
    <span class="ct-shell__meta">Figma · Lender Exploration · Manage Conditions · 797:5582</span>
  </header>
  ${buildManageConditionsInnerHtml(CT_TEMPLATE_NAMES[0])}
</div>`;
}

function addConditionToStage(stageId, scope) {
  const root = scope && scope.querySelector ? scope : document;
  const list = root.querySelector(`[data-ct-list="${stageId}"]`);
  if (!list) return;
  const n = list.querySelectorAll('[data-ct-condition]').length + 1;
  const label = `New condition #${n}`;

  if (list.classList.contains('ct-column__list--empty')) {
    list.classList.remove('ct-column__list--empty');
    list.innerHTML = buildConditionRow(label);
    const card = list.closest('.ct-column__card');
    if (card) card.classList.remove('ct-column__card--empty');
  } else {
    const div = document.createElement('div');
    div.innerHTML = buildConditionRow(label);
    list.appendChild(div.firstElementChild);
  }
}

function bindConditionTemplates(root) {
  if (!root) return;
  root.addEventListener('click', e => {
    const add = e.target.closest('[data-ct-add]');
    if (add && root.contains(add)) {
      addConditionToStage(add.getAttribute('data-ct-add'), root);
      return;
    }
    const tpl = e.target.closest('[data-ct-tpl]');
    if (tpl && root.contains(tpl)) {
      const idx = parseInt(tpl.getAttribute('data-ct-tpl'), 10);
      const name = CT_TEMPLATE_NAMES[idx];
      if (!name) return;
      root.querySelectorAll('.ct-manage__tpl').forEach(b => b.classList.remove('ct-manage__tpl--active'));
      tpl.classList.add('ct-manage__tpl--active');
      const titleEl = root.querySelector('[data-ct-editor-title]');
      if (titleEl) titleEl.textContent = name;
    }
  });

  const search = root.querySelector('[data-ct-search]');
  const tplList = root.querySelector('[data-ct-tpl-list]');
  if (search && tplList) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      tplList.querySelectorAll('.ct-manage__tpl').forEach(btn => {
        const t = btn.textContent.toLowerCase();
        btn.style.display = !q || t.includes(q) ? '' : 'none';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('ct-page')) return;
  const appRoot = document.getElementById('app');
  if (!appRoot) return;
  appRoot.innerHTML = buildConditionTemplatesShell();
  bindConditionTemplates(appRoot);
});
