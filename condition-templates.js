'use strict';

/**
 * Manage Conditions — Stage Gate redesign
 * Conditions live BETWEEN stage milestones, making it clear they are
 * requirements to advance from one stage to the next.
 * Branch: feat/condition-stage-gates
 */

function ctNames(from, to) {
  const out = [];
  for (let n = from; n <= to; n += 1) out.push(`Condition Name #${n}`);
  return out;
}

/**
 * Stage milestones. items = conditions needed to ADVANCE FROM this stage.
 * Post-Close is a terminal node (no conditions after it).
 */
const CT_STAGES = [
  { id: 'application',  label: 'Application',  items: ctNames(1, 4) },
  { id: 'underwriting', label: 'Underwriting',  items: ctNames(1, 8) },
  { id: 'closing',      label: 'Closing',        items: ctNames(1, 6) },
  { id: 'funded',       label: 'Funded',          items: ctNames(1, 12) },
  { id: 'post-close',   label: 'Post-Close',      items: [] },
];

const CT_TEMPLATE_NAMES = Array.from({ length: 19 }, (_, i) => `Condition Template #${i + 1}`);

function buildConditionRow(text) {
  return `<div class="ct-condition" data-ct-condition><span class="ct-condition__text">${text}</span></div>`;
}

/** A single stage milestone: dot + label below. */
function buildStageNode(stage, isFirst, isLast) {
  return `<div class="ctg-node${isFirst ? ' ctg-node--first' : ''}${isLast ? ' ctg-node--last' : ''}" aria-label="Stage: ${stage.label}">
    <div class="ctg-node__rail" aria-hidden="true">
      ${!isFirst ? '<div class="ctg-node__stem ctg-node__stem--before"></div>' : ''}
      <div class="ctg-node__dot"></div>
      ${!isLast ? '<div class="ctg-node__stem ctg-node__stem--after"></div>' : ''}
    </div>
    <div class="ctg-node__label">${stage.label}</div>
  </div>`;
}

/** The gate between two stages: a destination badge on the line + condition cards below. */
function buildStageGate(fromStage, toStage) {
  const { id, items } = fromStage;
  const destLabel = toStage.label;

  const conditionCards = items.length
    ? items.map(t => buildConditionRow(t)).join('')
    : `<div class="ctg-gate__empty">No conditions required</div>`;

  const addBtn = `<button type="button" class="ct-add-condition ctg-gate__add" data-ct-add="${id}">Add Condition</button>`;

  return `<div class="ctg-gate" data-gate="${id}-to-${toStage.id}">
    <div class="ctg-gate__rail" aria-hidden="true">
      <div class="ctg-gate__line"></div>
      <div class="ctg-gate__badge">
        <span class="ctg-gate__arrow">→</span>
        <span class="ctg-gate__badge-label">${destLabel}</span>
      </div>
      <div class="ctg-gate__line"></div>
    </div>
    <div class="ctg-gate__drop" aria-hidden="true"></div>
    <div class="ctg-gate__body">
      <div class="ctg-gate__list" data-ct-list="${id}">
        ${conditionCards}
      </div>
      ${addBtn}
    </div>
  </div>`;
}

/**
 * Full gate track: alternating node → gate → node → gate → … → node (terminal).
 * Conditions sit visually between their enclosing stage milestones.
 */
function buildConditionTemplateGridHtml() {
  const parts = CT_STAGES.map((stage, i) => {
    const isFirst = i === 0;
    const isLast  = i === CT_STAGES.length - 1;
    const nodeHtml = buildStageNode(stage, isFirst, isLast);
    const gateHtml = !isLast ? buildStageGate(stage, CT_STAGES[i + 1]) : '';
    return nodeHtml + gateHtml;
  }).join('');

  return `<div class="ctg-track">${parts}</div>`;
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
  // Remove empty placeholder if present
  const empty = list.querySelector('.ctg-gate__empty');
  if (empty) empty.remove();
  const div = document.createElement('div');
  div.innerHTML = buildConditionRow(label);
  list.appendChild(div.firstElementChild);
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
