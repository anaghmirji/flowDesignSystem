'use strict';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CT_STAGES_V2 = [
  { id: 'application',  label: 'Application' },
  { id: 'underwriting', label: 'Underwriting' },
  { id: 'closing',      label: 'Closing' },
  { id: 'funded',       label: 'Funded' },
  { id: 'post-close',   label: 'Post-Close' },
];

const CT_PRODUCTS = [
  { id: 'fix-flip',     label: 'Fix & Flip' },
  { id: 'bridge',       label: 'Bridge' },
  { id: 'dscr',         label: 'DSCR' },
  { id: 'construction', label: 'Construction' },
  { id: 'rental-5plus', label: 'Rental 5+' },
];

const CT_RULE_ATTRIBUTES = [
  { value: 'employment_type', label: 'Employment Type' },
  { value: 'loan_type',       label: 'Loan Type' },
  { value: 'credit_score',    label: 'Credit Score' },
  { value: 'loan_amount',     label: 'Loan Amount' },
  { value: 'entity_type',     label: 'Entity Type' },
];

const CT_RULE_OPERATORS = {
  employment_type: [{ value: 'is', label: 'is' }, { value: 'is_not', label: 'is not' }],
  loan_type:       [{ value: 'is', label: 'is' }, { value: 'is_not', label: 'is not' }, { value: 'is_any_of', label: 'is any of' }],
  credit_score:    [{ value: 'gt', label: '>' }, { value: 'lt', label: '<' }, { value: 'gte', label: '≥' }, { value: 'lte', label: '≤' }],
  loan_amount:     [{ value: 'gt', label: '>' }, { value: 'lt', label: '<' }, { value: 'gte', label: '≥' }, { value: 'lte', label: '≤' }],
  entity_type:     [{ value: 'is', label: 'is' }, { value: 'is_not', label: 'is not' }],
};

const CT_RULE_VALUES = {
  employment_type: ['Salaried', 'Self-Employed', 'Retired', 'Other'],
  loan_type:       ['Fix & Flip', 'Bridge', 'DSCR', 'Construction', 'Rental 5+'],
  credit_score:    [],
  loan_amount:     [],
  entity_type:     ['Individual', 'LLC', 'Corporation', 'Trust'],
};

// products: array of { id, dueBefore, type, rules } — per-product config
let CT_CONDITIONS = [
  {
    id: 'c1', name: 'Sign Purchase Agreement',
    products: [
      { id: 'fix-flip', dueBefore: 'application', type: 'always',    rules: [] },
      { id: 'bridge',   dueBefore: 'application', type: 'always',    rules: [] },
    ],
  },
  {
    id: 'c2', name: 'Upload W2',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Salaried' }] },
      { id: 'bridge',   dueBefore: 'closing',       type: 'always',   rules: [] },
    ],
  },
  {
    id: 'c3', name: 'Business Tax Returns',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
    ],
  },
  {
    id: 'c4', name: 'Title Search',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'always', rules: [] })),
  },
  {
    id: 'c5', name: 'Appraisal Report',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'dscr',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'loan_type', op: 'is', val: 'DSCR' }] },
    ],
  },
  {
    id: 'c6', name: 'Proof of Insurance',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'always', rules: [] })),
  },
  {
    id: 'c7', name: 'Bank Statements (3mo)',
    products: [
      { id: 'bridge', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'loan_type', op: 'is', val: 'Bridge' }] },
    ],
  },
];

let CT_SELECTED_ID = null;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getConditionIconType(cond) {
  // Show blue (triggered) if any product has triggered type, grey if all always
  const hasTriggered = (cond.products || []).some(p => p.type === 'triggered');
  return hasTriggered ? 'triggered' : 'always';
}

function ct2LibIcon(cond) {
  const type = typeof cond === 'string' ? cond : getConditionIconType(cond);
  return `<span class="ct2-lib__icon ct2-lib__icon--${type}" aria-hidden="true"></span>`;
}

function getProductLabel(pid) {
  return CT_PRODUCTS.find(p => p.id === pid)?.label || pid;
}

let CT_SELECTED_PROD_ID = null;

// ─── Animation helpers ────────────────────────────────────────────────────────

const CT2_EASE_EXIT  = 'cubic-bezier(0.4, 0, 1, 0.8)';
const CT2_EASE_ENTER = 'cubic-bezier(0.16, 1, 0.3, 1)';

// Slide-fade out to the left (going forward / deeper)
function ct2Out(el, onDone) {
  const a = el.animate(
    [{ opacity: 1, transform: 'translateX(0px)' },
     { opacity: 0, transform: 'translateX(-8px)' }],
    { duration: 160, easing: CT2_EASE_EXIT, fill: 'none' }
  );
  a.onfinish = () => { el.style.opacity = '0'; onDone(); };
}

// Slide-fade out to the right (going back)
function ct2OutBack(el, onDone) {
  const a = el.animate(
    [{ opacity: 1, transform: 'translateX(0px)' },
     { opacity: 0, transform: 'translateX(8px)' }],
    { duration: 160, easing: CT2_EASE_EXIT, fill: 'none' }
  );
  a.onfinish = () => { el.style.opacity = '0'; onDone(); };
}

// Slide-fade in from the right or left
function ct2In(el, fromRight) {
  const tx = fromRight ? '14px' : '-14px';
  el.style.opacity = '0';
  el.style.transform = `translateX(${tx})`;
  const a = el.animate(
    [{ opacity: 0, transform: `translateX(${tx})` },
     { opacity: 1, transform: 'translateX(0px)' }],
    { duration: 340, easing: CT2_EASE_ENTER, fill: 'none' }
  );
  a.onfinish = () => { el.style.opacity = ''; el.style.transform = ''; };
}

// Fade + subtle rise — for panel content swaps (right panel)
function ct2InFade(el) {
  el.style.opacity = '0';
  el.style.transform = 'translateY(5px)';
  const a = el.animate(
    [{ opacity: 0, transform: 'translateY(5px)' },
     { opacity: 1, transform: 'translateY(0px)' }],
    { duration: 280, easing: CT2_EASE_ENTER, fill: 'none' }
  );
  a.onfinish = () => { el.style.opacity = ''; el.style.transform = ''; };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function buildLibItem(cond, isActive) {
  return `<button type="button" class="ct2-lib__item${isActive ? ' ct2-lib__item--active' : ''}" data-ct2-cid="${cond.id}">
    ${ct2LibIcon(cond)}
    <span class="ct2-lib__name">${cond.name}</span>
  </button>`;
}

function buildSidebar(activeId) {
  const items = CT_CONDITIONS.map(c => buildLibItem(c, c.id === activeId)).join('');
  const searchIcon = typeof iconSvg === 'function' ? iconSvg('magnifying-glass') : '';
  const newBtn = buildBtnPreviewHtml({ id: 's1', icons: ['plus'] })
    .replace('<button class="btn btn--s1" tabindex="-1"', '<button class="btn btn--s1" tabindex="-1" data-ct2-new aria-label="New condition"');

  return `<aside class="ct2-sidebar">
  <div class="ct2-sidebar__head">
    <span class="ct2-sidebar__title">Manage Conditions</span>
    ${newBtn}
  </div>
  <div class="ct2-sidebar__body">
    <div class="ct2-lib__list" data-ct2-lib-list>${items}</div>
  </div>
  <div class="ct2-sidebar__footer">
    <div class="ct2-search">
      <span class="ct2-search__icon" aria-hidden="true">${searchIcon}</span>
      <input type="search" class="ct2-search__input" placeholder="Search…" data-ct2-search autocomplete="off" />
    </div>
  </div>
</aside>`;
}

// ─── Canvas (Mode 1) ──────────────────────────────────────────────────────────

function buildCanvasTrack(conditions) {
  // Collect all conditions per stage (use first product's dueBefore as primary)
  const byStage = {};
  CT_STAGES_V2.forEach(s => { byStage[s.id] = []; });
  conditions.forEach(c => {
    const stageIds = [...new Set((c.products || []).map(p => p.dueBefore))];
    stageIds.forEach(sid => {
      if (byStage[sid]) byStage[sid].push(c);
    });
  });

  let html = '<div class="ct2-track">';
  CT_STAGES_V2.forEach((stage, i) => {
    const isLast = i === CT_STAGES_V2.length - 1;

    html += `<div class="ct2-post${isLast ? ' ct2-post--last' : ''}">
      <div class="ct2-post__dot${isLast ? ' ct2-post__dot--filled' : ''}"></div>
      <div class="ct2-post__label">${stage.label}</div>
    </div>`;

    if (!isLast) {
      const next = CT_STAGES_V2[i + 1];
      // Dedupe conditions that appear in this lane
      const seen = new Set();
      const laneConds = (byStage[stage.id] || []).filter(c => {
        if (seen.has(c.id)) return false;
        seen.add(c.id); return true;
      });
      const count = laneConds.length;

      const rows = laneConds.map(c =>
        `<button type="button" class="ct2-canvas__row ct2-canvas__row--${c.type}" data-ct2-cid="${c.id}">
          <span class="ct2-canvas__row-icon ct2-canvas__row-icon--${c.type}" aria-hidden="true"></span>
          <span class="ct2-canvas__row-name">${c.name}</span>
        </button>`
      ).join('');

      html += `<div class="ct2-lane" data-lane="${stage.id}">
        <div class="ct2-lane__rail">
          <div class="ct2-lane__rule-line"></div>
          <div class="ct2-lane__dest-tag">
            <span class="ct2-lane__arrow">→</span>
            <span class="ct2-lane__dest-name">${next.label}</span>
            ${count > 0 ? `<span class="ct2-lane__count">${count}</span>` : ''}
          </div>
          <div class="ct2-lane__rule-line"></div>
        </div>
        <div class="ct2-lane__drop"></div>
        <div class="ct2-lane__card">
          ${count === 0 ? '<div class="ct2-lane__empty">No conditions</div>' : ''}
          <div class="ct2-lane__list">${rows}</div>
        </div>
      </div>`;
    }
  });

  html += '</div>';
  return html;
}

function buildCanvas() {
  return `<div class="ct2-canvas" data-ct2-canvas>
    <div class="ct2-canvas__scroll">
      ${buildCanvasTrack(CT_CONDITIONS)}
    </div>
  </div>`;
}

// ─── Detail (Mode 2) — 3-col: sidebar | center | right ───────────────────────

/** Per-product row — clean Figma-aligned layout */
function buildProductRow(prod, isSelected) {
  const { id: prodId, type } = prod;
  const label     = getProductLabel(prodId);
  const typeLabel = type === 'triggered' ? 'Rule' : 'Always';

  const chevBtn = buildBtnPreviewHtml({ id: 's1', icons: ['chevron-right'] })
    .replace('<button class="btn btn--s1" tabindex="-1"', `<button class="btn btn--s1 ct2-prod-row__chevron" tabindex="-1" aria-label="Configure ${label}"`);

  return `<div class="ct2-prod-row${isSelected ? ' ct2-prod-row--selected' : ''}" data-ct2-prod-row="${prodId}">
    <div class="ct2-prod-row__info">
      <span class="ct2-prod-row__label">${label}</span>
      <span class="ct2-prod-row__type">${typeLabel}</span>
    </div>
    ${chevBtn}
  </div>`;
}

function buildProductPicker(selectedProductIds) {
  const available = CT_PRODUCTS.filter(p => !selectedProductIds.includes(p.id));
  if (!available.length) return '';
  const plusIcon = typeof iconSvg === 'function' ? iconSvg('plus') : '+';
  const opts = available.map(p =>
    `<button type="button" class="ct2-prod-add__pill" data-ct2-prod-add="${p.id}">
      <span class="ct2-prod-add__pill-icon">${plusIcon}</span>${p.label}
    </button>`
  ).join('');
  return `<div class="ct2-prod-add">${opts}</div>`;
}

/** Center panel: name + product/stage matrix */
function buildDetailCenter(cond, selectedProdId) {
  const backBtn = buildBtnPreviewHtml({ id: 's1', icons: ['chevron-left'] })
    .replace('<button class="btn btn--s1" tabindex="-1"', '<button class="btn btn--s1" tabindex="-1" data-ct2-back aria-label="Back to canvas"');
  const prodRows = (cond.products || []).map(p =>
    buildProductRow(p, p.id === selectedProdId)
  ).join('');
  const selectedIds = (cond.products || []).map(p => p.id);

  return `<div class="ct2-detail-center" data-ct2-center>
  <div class="ct2-detail__cond-header">
    ${backBtn}
    <input type="text" class="ct2-detail__name-input" value="${cond.name}"
      data-ct2-name-input placeholder="Condition name…" spellcheck="false" />
  </div>

  <div class="ct2-detail__section">
    <div class="ct2-detail__apply-label">Applies to</div>
    <div class="ct2-prod-list" data-ct2-prod-list>
      ${prodRows}
    </div>
    ${buildProductPicker(selectedIds)}
  </div>
</div>`;
}

/** Large stage track for the right panel */
function buildRightStageTrack(prod) {
  const inner = CT_STAGES_V2.map((stage, i) => {
    const isActive = stage.id === prod.dueBefore;
    const line = i > 0 ? '<div class="ct2-rst__line"></div>' : '';
    return `${line}<div class="ct2-rst__stop${isActive ? ' ct2-rst__stop--active' : ''}" data-ct2-rst-stop="${stage.id}">
      <button type="button" class="ct2-rst__dot-btn" data-ct2-right-stage="${stage.id}" aria-label="Due before ${stage.label}">
        <div class="ct2-rst__pip"></div>
      </button>
      <span class="ct2-rst__label">${stage.label}</span>
    </div>`;
  }).join('');
  return `<div class="ct2-right-stage-track">
    <div class="ct2-rst__track-header">
      <span class="ct2-rst__track-title">Required before stage</span>
      <span class="ct2-rst__track-hint">Select the stage this must be cleared before</span>
    </div>
    <div class="ct2-rst__inner">${inner}</div>
  </div>`;
}

/** Right panel: triggers when (per product) */
function buildDetailRight(prod) {
  if (!prod) {
    return `<div class="ct2-detail-right" data-ct2-right>
  <div class="ct2-right__resize-handle" data-ct2-resize-handle aria-hidden="true"></div>
  <div class="ct2-right__empty">
    <span>Select a product to configure its trigger rules</span>
  </div>
</div>`;
  }

  const isTriggered = prod.type === 'triggered';
  const productLabel = getProductLabel(prod.id);

  return `<div class="ct2-detail-right" data-ct2-right data-ct2-right-prod="${prod.id}">
  <div class="ct2-right__resize-handle" data-ct2-resize-handle aria-hidden="true"></div>
  <div class="ct2-right__header">
    <span class="ct2-right__header-label">Configuration for</span>
    <span class="ct2-right__header-product">${productLabel}</span>
  </div>
  <div class="ct2-detail__section">
    ${buildRightStageTrack(prod)}

    <div class="ct2-detail__label">Triggers when</div>

    <div class="ct2-fires">
      <button type="button" class="ct2-fires__btn${!isTriggered ? ' ct2-fires__btn--active' : ''}" data-ct2-fires="always">Always</button>
      <button type="button" class="ct2-fires__btn${isTriggered ? ' ct2-fires__btn--active' : ''}" data-ct2-fires="triggered">Rule matches</button>
    </div>

    <div class="ct2-detail__rules-wrap${!isTriggered ? ' ct2-detail__rules-wrap--hidden' : ''}" data-ct2-rules-wrap>
      <div class="ct2-rules-list" data-ct2-rules-list>${buildRulesList(prod.rules || [])}</div>
      <button type="button" class="ct2-add-rule" data-ct2-add-rule>+ Add rule</button>
    </div>

    ${!isTriggered ? `<div class="ct2-always-note">This condition always fires.</div>` : ''}
  </div>
</div>`;
}

/** Rule row builder */
function buildRuleRow(rule, idx) {
  const attrOpts = CT_RULE_ATTRIBUTES.map(a =>
    `<option value="${a.value}"${rule.attr === a.value ? ' selected' : ''}>${a.label}</option>`
  ).join('');

  const ops = CT_RULE_OPERATORS[rule.attr] || [{ value: 'is', label: 'is' }];
  const opOpts = ops.map(o =>
    `<option value="${o.value}"${rule.op === o.value ? ' selected' : ''}>${o.label}</option>`
  ).join('');

  const vals = CT_RULE_VALUES[rule.attr] || [];
  const valContent = vals.length
    ? `<select class="ct2-rule__select ct2-rule__val" data-ct2-rule-val>
        ${vals.map(v => `<option value="${v}"${rule.val === v ? ' selected' : ''}>${v}</option>`).join('')}
       </select>`
    : `<input type="text" class="ct2-rule__select ct2-rule__val ct2-rule__val--text"
        data-ct2-rule-val-text value="${rule.val || ''}" placeholder="value…" />`;

  const removeBtn = buildBtnPreviewHtml({ id: 's1', icons: ['x-mark'] })
    .replace('<button class="btn btn--s1" tabindex="-1"', `<button class="btn btn--s1 ct2-rule__remove" tabindex="-1" data-ct2-rule-remove="${idx}" aria-label="Remove rule"`);

  return `<div class="ct2-rule-row" data-ct2-rule-row="${idx}">
    <select class="ct2-rule__select ct2-rule__attr" data-ct2-rule-attr>${attrOpts}</select>
    <select class="ct2-rule__select ct2-rule__op"   data-ct2-rule-op>${opOpts}</select>
    ${valContent}
    ${removeBtn}
  </div>`;
}

function buildRulesList(rules) {
  if (!rules.length) return '';
  return rules.map((r, i) =>
    (i > 0 ? '<div class="ct2-rule-and">and</div>' : '') + buildRuleRow(r, i)
  ).join('');
}

function buildDetail(cond, selectedProdId) {
  const selProd = (cond.products || []).find(p => p.id === selectedProdId) || null;

  return `<div class="ct2-detail-wrap" data-ct2-detail>
  <div class="ct2-white-card">
    <div class="ct2-detail-cols">
      ${buildDetailCenter(cond, selectedProdId)}
      ${buildDetailRight(selProd)}
    </div>
  </div>
</div>`;
}

// ─── Root HTML ────────────────────────────────────────────────────────────────

function buildConditionTemplateModalDialogHtml() {
  const xIcon = typeof iconSvg === 'function' ? iconSvg('x-mark') : '×';

  return `<div class="ct2-root" data-ct2-root>
  ${buildSidebar(null)}
  <div class="ct2-main" data-ct2-main>
    <div class="ct2-main__body" data-ct2-main-body>
      ${buildCanvas()}
    </div>
    <div class="ct2-main__footer">
      <button type="button" class="ct2-footer__btn ct2-footer__btn--ghost" data-ct-cancel>Cancel</button>
      <button type="button" class="ct2-footer__btn ct2-footer__btn--primary">Save Changes</button>
    </div>
  </div>
</div>`;
}

window.buildConditionTemplateModalDialogHtml = buildConditionTemplateModalDialogHtml;

// ─── Mode switching ───────────────────────────────────────────────────────────

function enterDetail(condId, root, selectedProdId) {
  const cond = CT_CONDITIONS.find(c => c.id === condId);
  if (!cond) return;
  CT_SELECTED_ID = condId;
  CT_SELECTED_PROD_ID = selectedProdId || null;

  root.querySelectorAll('.ct2-lib__item').forEach(b =>
    b.classList.toggle('ct2-lib__item--active', b.getAttribute('data-ct2-cid') === condId)
  );

  const body = root.querySelector('[data-ct2-main-body]');
  const existing = body.firstElementChild;

  const showDetail = () => {
    body.innerHTML = buildDetail(cond, CT_SELECTED_PROD_ID);
    bindDetail(root);
    const el = body.firstElementChild;
    if (el) ct2In(el, true);
  };

  existing ? ct2Out(existing, showDetail) : showDetail();
}

function selectProduct(prodId, root) {
  CT_SELECTED_PROD_ID = prodId;
  const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
  if (!cond) return;

  root.querySelectorAll('[data-ct2-prod-row]').forEach(r =>
    r.classList.toggle('ct2-prod-row--selected', r.getAttribute('data-ct2-prod-row') === prodId)
  );

  const selProd = (cond.products || []).find(p => p.id === prodId) || null;
  const oldRight = root.querySelector('[data-ct2-right]');
  const hasContent = oldRight && oldRight.hasAttribute('data-ct2-right-prod');

  const showRight = () => {
    if (oldRight) oldRight.outerHTML = buildDetailRight(selProd);
    const newRight = root.querySelector('[data-ct2-right]');
    if (newRight) {
      bindDetailRight(root);
      ct2InFade(newRight);
    }
  };

  hasContent ? ct2Out(oldRight, showRight) : showRight();
}

function enterCanvas(root) {
  CT_SELECTED_ID = null;
  root.querySelectorAll('.ct2-lib__item').forEach(b => b.classList.remove('ct2-lib__item--active'));

  const body = root.querySelector('[data-ct2-main-body]');
  const existing = body.firstElementChild;

  const showCanvas = () => {
    body.innerHTML = buildCanvas();
    bindCanvas(root);
    const el = body.firstElementChild;
    if (el) ct2In(el, false);
  };

  existing ? ct2OutBack(existing, showCanvas) : showCanvas();
}

function refreshLibList(root, activeId) {
  const list = root.querySelector('[data-ct2-lib-list]');
  if (list) list.innerHTML = CT_CONDITIONS.map(c => buildLibItem(c, c.id === activeId)).join('');
}

function refreshDetailCenter(root) {
  const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
  if (!cond) return;
  const center = root.querySelector('[data-ct2-center]');
  if (!center) return;
  const prodList = center.querySelector('[data-ct2-prod-list]');
  if (prodList) prodList.innerHTML = (cond.products || []).map(p => buildProductRow(p.id, p.dueBefore)).join('');
  const picker = center.querySelector('.ct2-prod-add');
  const selectedIds = (cond.products || []).map(p => p.id);
  const newPickerHtml = buildProductPicker(selectedIds);
  if (picker) {
    picker.outerHTML = newPickerHtml; // replace
  } else {
    center.querySelector('[data-ct2-center]')?.insertAdjacentHTML('beforeend', newPickerHtml);
  }
  // Re-bind product stage dots
  bindProductStages(root);
}

// ─── Detail event binding ─────────────────────────────────────────────────────

function bindRightResize(root) {
  const right = root.querySelector('[data-ct2-right]');
  const handle = right?.querySelector('[data-ct2-resize-handle]');
  if (!right || !handle) return;

  let startX, startWidth;

  handle.addEventListener('mousedown', e => {
    e.preventDefault();
    startX = e.clientX;
    startWidth = right.getBoundingClientRect().width;
    right.classList.add('ct2-detail-right--resizing');

    const onMove = e => {
      const delta = startX - e.clientX; // dragging left = wider
      const newWidth = Math.min(720, Math.max(220, startWidth + delta));
      right.style.flex = `0 0 ${newWidth}px`;
      right.style.width = `${newWidth}px`;
    };

    const onUp = () => {
      right.classList.remove('ct2-detail-right--resizing');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

function bindDetailRight(root) {
  const right = root.querySelector('[data-ct2-right]');
  if (!right) return;
  const prodId = right.getAttribute('data-ct2-right-prod');

  bindRightResize(root);

  right.addEventListener('click', e => {
    // Stage selector
    const stageBtn = e.target.closest('[data-ct2-right-stage]');
    if (stageBtn) {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      const prod = (cond?.products || []).find(p => p.id === prodId);
      if (!prod) return;
      const stageId = stageBtn.getAttribute('data-ct2-right-stage');
      prod.dueBefore = stageId;
      right.querySelectorAll('[data-ct2-rst-stop]').forEach(s =>
        s.classList.toggle('ct2-rst__stop--active', s.getAttribute('data-ct2-rst-stop') === stageId)
      );
      return;
    }

    // Fires toggle
    const firesBtn = e.target.closest('[data-ct2-fires]');
    if (firesBtn) {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      const prod = (cond?.products || []).find(p => p.id === prodId);
      if (!prod) return;
      const type = firesBtn.getAttribute('data-ct2-fires');
      prod.type = type;
      right.querySelectorAll('[data-ct2-fires]').forEach(b =>
        b.classList.toggle('ct2-fires__btn--active', b.getAttribute('data-ct2-fires') === type)
      );
      right.querySelector('[data-ct2-rules-wrap]')?.classList.toggle('ct2-detail__rules-wrap--hidden', type !== 'triggered');
      const note = right.querySelector('.ct2-always-note');
      if (type === 'triggered') {
        note?.remove();
      } else if (!note) {
        right.querySelector('.ct2-detail__section')
          ?.insertAdjacentHTML('beforeend', `<div class="ct2-always-note">This condition always fires for ${getProductLabel(prodId)} loans.</div>`);
      }
      // Update trigger badge on product row
      const row = root.querySelector(`[data-ct2-prod-row="${prodId}"]`);
      if (row) {
        const badge = row.querySelector('.ct2-prod-row__badge');
        if (badge) {
          badge.className = `ct2-prod-row__badge ct2-prod-row__badge--${type === 'triggered' ? 'rule' : 'always'}`;
          badge.textContent = type === 'triggered' ? 'Rule' : 'Always';
        }
      }
      // Update lib icon
      if (cond) {
        const libIcon = root.querySelector(`[data-ct2-cid="${cond.id}"] .ct2-lib__icon`);
        if (libIcon) {
          const newType = getConditionIconType(cond);
          libIcon.className = `ct2-lib__icon ct2-lib__icon--${newType}`;
        }
      }
      return;
    }

    // Add rule
    if (e.target.closest('[data-ct2-add-rule]')) {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      const prod = (cond?.products || []).find(p => p.id === prodId);
      if (!prod) return;
      prod.rules = prod.rules || [];
      prod.rules.push({ attr: 'employment_type', op: 'is', val: 'Salaried' });
      reRenderRules(right, prod.rules);
      return;
    }

    // Remove rule
    const removeRule = e.target.closest('[data-ct2-rule-remove]');
    if (removeRule) {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      const prod = (cond?.products || []).find(p => p.id === prodId);
      if (!prod) return;
      const idx = parseInt(removeRule.getAttribute('data-ct2-rule-remove'), 10);
      prod.rules.splice(idx, 1);
      reRenderRules(right, prod.rules);
      return;
    }
  });

  right.addEventListener('change', e => {
    const attrSel = e.target.closest('[data-ct2-rule-attr]');
    if (!attrSel) return;
    const ruleRow = attrSel.closest('[data-ct2-rule-row]');
    const idx = parseInt(ruleRow.getAttribute('data-ct2-rule-row'), 10);
    const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    const prod = (cond?.products || []).find(p => p.id === prodId);
    if (!prod || !prod.rules[idx]) return;
    prod.rules[idx].attr = attrSel.value;
    prod.rules[idx].op   = (CT_RULE_OPERATORS[attrSel.value] || [])[0]?.value || 'is';
    prod.rules[idx].val  = (CT_RULE_VALUES[attrSel.value] || [])[0] || '';
    reRenderRules(right, prod.rules);
  });
}

function bindDetail(root) {
  const detail = root.querySelector('[data-ct2-detail]');
  if (!detail) return;

  // Back
  detail.querySelector('[data-ct2-back]')?.addEventListener('click', () => enterCanvas(root));

  // Name input
  detail.querySelector('[data-ct2-name-input]')?.addEventListener('input', e => {
    const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    if (!cond) return;
    cond.name = e.target.value;
    const libName = root.querySelector(`[data-ct2-cid="${cond.id}"] .ct2-lib__name`);
    if (libName) libName.textContent = cond.name;
    // update sidebar item name live (title bar removed)
  });

  // Product row click — select product (not via remove/stage buttons)
  detail.querySelector('[data-ct2-prod-list]')?.addEventListener('click', e => {
    if (e.target.closest('[data-ct2-prod-remove]') || e.target.closest('[data-ct2-prod-stage]')) return;
    const row = e.target.closest('[data-ct2-prod-row]');
    if (row) selectProduct(row.getAttribute('data-ct2-prod-row'), root);
  });

  // Stage dot clicks on product rows
  detail.addEventListener('click', e => {
    const stageDot = e.target.closest('[data-ct2-prod-stage]');
    if (stageDot) {
      const row = stageDot.closest('[data-ct2-prod-row]');
      if (!row) return;
      const prodId = row.getAttribute('data-ct2-prod-row');
      const stageId = stageDot.getAttribute('data-ct2-prod-stage');
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      const prod = (cond?.products || []).find(p => p.id === prodId);
      if (!prod) return;
      prod.dueBefore = stageId;
      // Update all stops in this mini track
      row.querySelectorAll('[data-ct2-pmini] .ct2-pmini__stop').forEach(s =>
        s.classList.toggle('ct2-pmini__stop--active', s.getAttribute('data-ct2-prod-stage') === stageId)
      );
      return;
    }

    // Remove product
    const removeBtn = e.target.closest('[data-ct2-prod-remove]');
    if (removeBtn) {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      if (!cond) return;
      const pid = removeBtn.getAttribute('data-ct2-prod-remove');
      cond.products = cond.products.filter(p => p.id !== pid);
      if (CT_SELECTED_PROD_ID === pid) CT_SELECTED_PROD_ID = null;
      reRenderProductSection(detail, cond, root);
      return;
    }

    // Add product
    const addBtn = e.target.closest('[data-ct2-prod-add]');
    if (addBtn) {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      if (!cond) return;
      const pid = addBtn.getAttribute('data-ct2-prod-add');
      if (!cond.products.find(p => p.id === pid)) {
        cond.products.push({ id: pid, dueBefore: 'underwriting', type: 'always', rules: [] });
      }
      reRenderProductSection(detail, cond, root);
      selectProduct(pid, root);
      return;
    }
  });

  bindDetailRight(root);
}

function reRenderProductSection(detail, cond, root) {
  const prodList = detail.querySelector('[data-ct2-prod-list]');
  if (prodList) prodList.innerHTML = (cond.products || []).map(p =>
    buildProductRow(p, p.id === CT_SELECTED_PROD_ID)
  ).join('');

  const existingPicker = detail.querySelector('.ct2-prod-add');
  const selectedIds = (cond.products || []).map(p => p.id);
  const newPickerHtml = buildProductPicker(selectedIds);

  if (existingPicker && newPickerHtml)       { existingPicker.outerHTML = newPickerHtml; }
  else if (existingPicker && !newPickerHtml) { existingPicker.remove(); }
  else if (!existingPicker && newPickerHtml) {
    detail.querySelector('.ct2-detail__section')
      ?.insertAdjacentHTML('beforeend', newPickerHtml);
  }
}

function reRenderRules(container, rules) {
  const list = container.querySelector('[data-ct2-rules-list]');
  if (list) list.innerHTML = buildRulesList(rules);
}

// ─── Canvas event binding ─────────────────────────────────────────────────────

function bindCanvas(root) {
  const canvas = root.querySelector('[data-ct2-canvas]');
  if (!canvas) return;
  canvas.addEventListener('click', e => {
    const row = e.target.closest('[data-ct2-cid]');
    if (row) enterDetail(row.getAttribute('data-ct2-cid'), root);
  });
}

// ─── Root binding ─────────────────────────────────────────────────────────────

function bindConditionTemplates(root) {
  if (!root) return;

  // Search
  root.querySelector('[data-ct2-search]')?.addEventListener('input', e => {
    const q = e.target.value.trim().toLowerCase();
    root.querySelectorAll('.ct2-lib__item').forEach(item => {
      const name = item.querySelector('.ct2-lib__name')?.textContent.toLowerCase() || '';
      item.style.display = !q || name.includes(q) ? '' : 'none';
    });
  });

  // Sidebar clicks
  root.addEventListener('click', e => {
    const libItem = e.target.closest('[data-ct2-cid]');
    if (libItem && libItem.closest('.ct2-sidebar')) {
      enterDetail(libItem.getAttribute('data-ct2-cid'), root);
      return;
    }
    const newBtn = e.target.closest('[data-ct2-new]');
    if (newBtn) {
      const id = `c${Date.now()}`;
      CT_CONDITIONS.push({ id, name: 'New Condition', type: 'always', products: [], rules: [] });
      refreshLibList(root, id);
      enterDetail(id, root);
    }
  });

  bindCanvas(root);
}

// ─── Standalone page ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('ct-page')) return;
  const appRoot = document.getElementById('app');
  if (!appRoot) return;
  appRoot.innerHTML = `<div class="ct2-page-shell">${buildConditionTemplateModalDialogHtml()}</div>`;
  bindConditionTemplates(appRoot.querySelector('[data-ct2-root]'));
});
