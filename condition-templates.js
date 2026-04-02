'use strict';

/**
 * Condition template builder — Lender Exploration · Figma node 794:5271
 * https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=794-5271
 * Exploratory UI: LOs define reusable condition sets per pipeline stage for insertion on loan files.
 */

const CT_STAGES = [
  {
    id: 'application',
    label: 'Application',
    listStyle: 'spaced',
    items: ['Condition Name #1', 'Condition Name #2', 'Condition Name #3', 'Condition Name #4'],
  },
  {
    id: 'underwriting',
    label: 'Underwriting',
    listStyle: 'ruled',
    items: [
      'Condition Name #9',
      'Condition Name #10',
      'Condition Name #11',
      'Condition Name #11',
      'Condition Name #11',
      'Condition Name #11',
    ],
  },
  {
    id: 'closing',
    label: 'Closing',
    listStyle: 'ruled',
    items: ['Condition Name #1', 'Condition Name #2', 'Condition Name #3', 'Condition Name #4'],
  },
  {
    id: 'funded',
    label: 'Funded',
    listStyle: 'ruled',
    items: ['Condition Name #5', 'Condition Name #6', 'Condition Name #7', 'Condition Name #8'],
  },
  {
    id: 'post-close',
    label: 'Post-Close',
    listStyle: 'ruled',
    items: [],
  },
];

function buildConditionRow(text, listStyle, isFirst, isLast) {
  const cls = ['ct-condition'];
  if (listStyle === 'ruled') {
    if (!isLast) cls.push('ct-condition--ruled');
    cls.push('ct-condition--padded');
  } else {
    cls.push('ct-condition--spaced');
    if (isFirst) cls.push('ct-condition--spaced-first');
    if (isLast) cls.push('ct-condition--spaced-last');
  }
  return `<div class="${cls.join(' ')}" data-ct-condition><span class="ct-condition__text">${text}</span></div>`;
}

function buildConditionList(stage) {
  const { items, listStyle } = stage;
  if (!items.length) {
    return `<div class="ct-column__list ct-column__list--empty" data-ct-list="${stage.id}" data-list-style="${listStyle}">
      <div class="ct-column__empty">No conditions in this stage yet.</div>
    </div>`;
  }
  const rows = items
    .map((text, i) =>
      buildConditionRow(text, listStyle, i === 0, i === items.length - 1),
    )
    .join('');
  return `<div class="ct-column__list" data-ct-list="${stage.id}" data-list-style="${listStyle}">${rows}</div>`;
}

function buildTimelineCellsHtml() {
  return CT_STAGES.map((s, i) => {
    const isLast = i === CT_STAGES.length - 1;
    const ruleCls = isLast ? 'ct-timeline__rule ct-timeline__rule--tail' : 'ct-timeline__rule';
    return `<div class="ct-timeline__cell">
      <span class="ct-timeline__dot" aria-hidden="true"></span>
      <div class="${ruleCls}"></div>
    </div>`;
  }).join('');
}

function buildStageHeaders() {
  return CT_STAGES.map((s, i) => {
    const pad = i < CT_STAGES.length - 1 ? ' ct-stage-head--pad' : '';
    return `<div class="ct-stage-head${pad}">${s.label}</div>`;
  }).join('');
}

function buildStageColumns() {
  return CT_STAGES.map(s => {
    const cardInner = buildConditionList(s);
    const addBtn = `<button type="button" class="ct-add-condition" data-ct-add="${s.id}">Add Condition</button>`;
    return `<div class="ct-column" data-stage-label="${s.label.replace(/"/g, '&quot;')}">
      <div class="ct-column__card">${cardInner}</div>
      ${addBtn}
    </div>`;
  }).join('');
}

function buildConditionTemplatesShell() {
  return `
<div class="ct-shell">
  <header class="ct-shell__header">
    <a class="ct-shell__back" href="prototype.html">Overview</a>
    <span class="ct-shell__meta">Figma · Lender Exploration · Condition templates</span>
  </header>
  <div class="ct-template" data-ct-template>
    <h1 class="ct-template__title" contenteditable="true" spellcheck="false">Condition Template #1</h1>
    <div class="ct-template__body">
      <div class="ct-stack">
        <div class="ct-row ct-row--heads">${buildStageHeaders()}</div>
        <div class="ct-stack ct-stack--dense">
          <div class="ct-row ct-row--timeline" aria-hidden="true">${buildTimelineCellsHtml()}</div>
          <div class="ct-row ct-row--cols">${buildStageColumns()}</div>
        </div>
      </div>
    </div>
  </div>
</div>`;
}

function refreshListBorders(listEl) {
  if (!listEl || listEl.classList.contains('ct-column__list--empty')) return;
  const style = listEl.dataset.listStyle || 'ruled';
  const rows = listEl.querySelectorAll('[data-ct-condition]');
  rows.forEach((row, i) => {
    row.className = 'ct-condition';
    const isFirst = i === 0;
    const isLast = i === rows.length - 1;
    if (style === 'ruled') {
      if (!isLast) row.classList.add('ct-condition--ruled');
      row.classList.add('ct-condition--padded');
    } else {
      row.classList.add('ct-condition--spaced');
      if (isFirst) row.classList.add('ct-condition--spaced-first');
      if (isLast) row.classList.add('ct-condition--spaced-last');
    }
  });
}

function addConditionToStage(stageId) {
  const list = document.querySelector(`[data-ct-list="${stageId}"]`);
  if (!list) return;
  const meta = CT_STAGES.find(s => s.id === stageId);
  const style = list.dataset.listStyle || meta?.listStyle || 'ruled';
  const n = list.querySelectorAll('[data-ct-condition]').length + 1;
  const label = `New condition #${n}`;

  if (list.classList.contains('ct-column__list--empty')) {
    list.classList.remove('ct-column__list--empty');
    list.innerHTML = buildConditionRow(label, style, true, true);
    list.dataset.listStyle = style;
  } else {
    const rows = list.querySelectorAll('[data-ct-condition]');
    const last = rows[rows.length - 1];
    if (last) {
      if (style === 'ruled') last.classList.add('ct-condition--ruled');
      else {
        last.classList.remove('ct-condition--spaced-last');
        last.classList.add('ct-condition--spaced');
      }
    }
    const div = document.createElement('div');
    div.innerHTML = buildConditionRow(label, style, false, true);
    list.appendChild(div.firstElementChild);
  }
  refreshListBorders(list);
}

function bindConditionTemplates() {
  const app = document.getElementById('app');
  if (!app) return;
  app.addEventListener('click', e => {
    const btn = e.target.closest('[data-ct-add]');
    if (!btn) return;
    addConditionToStage(btn.getAttribute('data-ct-add'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (!root) return;
  root.innerHTML = buildConditionTemplatesShell();
  bindConditionTemplates();
});
