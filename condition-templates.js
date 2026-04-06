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

/**
 * Horizontal stage-gate track (v3 — clear & scannable)
 *
 * Layout: post ── lane card ── post ── lane card ── … ── post (terminal)
 *
 *  ●          ╔═══════════════╗          ●          ╔══════════════╗          ●
 * App         ║ → Underwriting║         UW          ║  → Closing  ║        Closing …
 *             ║ ──────────────║                     ║─────────────║
 *             ║ Condition 1   ║                     ║ Condition 1 ║
 *             ║ Condition 2   ║                     ║ Condition 2 ║
 *             ╚═══════════════╝                     ╚═════════════╝
 *               ( Add pill )                          ( Add pill )
 *
 * Stage posts sit at boundaries. Lane cards explicitly name the destination stage.
 * Conditions are list rows inside each card — one card per gate, not per condition.
 */

/** Narrow stage-post: dot on the connecting line + label below. */
function buildStagePost(stage, isFirst, isLast) {
  return `<div class="ctg-post${isFirst ? ' ctg-post--first' : ''}${isLast ? ' ctg-post--last' : ''}" data-stage="${stage.id}">
    <div class="ctg-post__dot${isLast ? ' ctg-post__dot--end' : ''}" aria-hidden="true"></div>
    <div class="ctg-post__label">${stage.label}</div>
  </div>`;
}

/** Lane card between two stage posts — conditions required to reach the destination. */
function buildLane(fromStage, toStage) {
  const { id, items } = fromStage;
  const count = items.length;

  const rows = items.length
    ? items.map(t => buildConditionRow(t)).join('')
    : `<div class="ctg-lane__empty">No conditions required</div>`;

  return `<div class="ctg-lane" data-gate="${id}-to-${toStage.id}">
    <div class="ctg-lane__rail" aria-hidden="true">
      <div class="ctg-lane__rule"></div>
      <div class="ctg-lane__dest-tag">
        <span class="ctg-lane__arrow">→</span>
        <span class="ctg-lane__dest-name">${toStage.label}</span>
        ${count > 0 ? `<span class="ctg-lane__count">${count}</span>` : ''}
      </div>
      <div class="ctg-lane__rule"></div>
    </div>
    <div class="ctg-lane__drop" aria-hidden="true"></div>
    <div class="ctg-lane__body">
      <div class="ctg-lane__card">
        <div class="ctg-lane__list" data-ct-list="${id}">${rows}</div>
      </div>
      <button type="button" class="ctg-lane__add" data-ct-add="${id}">Add Condition</button>
    </div>
  </div>`;
}

/**
 * Full horizontal track:
 *   post[0] lane[0→1] post[1] lane[1→2] … post[n-1] lane[n-1→n] post[n]
 */
function buildConditionTemplateGridHtml() {
  const parts = CT_STAGES.map((stage, i) => {
    const isFirst = i === 0;
    const isLast  = i === CT_STAGES.length - 1;
    const post = buildStagePost(stage, isFirst, isLast);
    const lane = !isLast ? buildLane(stage, CT_STAGES[i + 1]) : '';
    return post + lane;
  }).join('');

  return `<div class="ctg-h-track">${parts}</div>`;
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
      <div class="ct-manage__tpl-viewport">
        <div class="ct-manage__tpl-scroll" data-ct-tpl-list>
          ${buildSidebarTemplateRows()}
        </div>
        <!-- After scroll in DOM so the gradient paints above scrolling list items -->
        <div class="ct-manage__tpl-edge ct-manage__tpl-edge--top" aria-hidden="true"></div>
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
  // Remove "no conditions" placeholder on first real add
  const placeholder = list.querySelector('.ctg-lane__empty');
  if (placeholder) placeholder.remove();
  const n = list.querySelectorAll('[data-ct-condition]').length + 1;
  const div = document.createElement('div');
  div.innerHTML = buildConditionRow(`New condition #${n}`);
  list.appendChild(div.firstElementChild);
  // Sync count badge
  const lane = list.closest('.ctg-lane');
  const badge = lane?.querySelector('.ctg-lane__count');
  if (badge) {
    badge.textContent = list.querySelectorAll('[data-ct-condition]').length;
    badge.style.display = '';
  } else {
    // Badge didn't exist (was empty lane) — insert it
    const tag = lane?.querySelector('.ctg-lane__dest-tag');
    if (tag) {
      const span = document.createElement('span');
      span.className = 'ctg-lane__count';
      span.textContent = '1';
      tag.appendChild(span);
    }
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
