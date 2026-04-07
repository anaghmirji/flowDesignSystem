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

const CT_CONDITION_TYPES = [
  { id: 'document_upload', label: 'Document Upload', icon: 'document',              hint: 'Borrower or party uploads a specific file' },
  { id: 'order_service',   label: 'Order Service',   icon: 'bolt',                  hint: 'Staff orders an external service or report' },
  { id: 'verification',    label: 'Verification',    icon: 'eye-open',              hint: 'A fact or status is confirmed or checked' },
  { id: 'internal_task',   label: 'Internal Task',   icon: 'clipboard-document-list', hint: 'A team member completes an internal action' },
];

const CT_CONDITION_GROUPS = [
  { id: 'agreements', label: 'Agreements' },
  { id: 'income',     label: 'Income & Employment' },
  { id: 'property',   label: 'Property' },
];

const CT_DOC_CLASSES = [
  { value: 'BORROWER_ID',               label: 'Gov ID / Driver\'s License',  category: 'Identity' },
  { value: 'SCHEDULE_OF_REO',           label: 'Schedule of REO',             category: 'Assets' },
  { value: 'BANK_STATEMENT_BUSINESS',   label: 'Business Bank Statements',    category: 'Assets' },
  { value: 'BANK_STATEMENT_INDIVIDUAL', label: 'Individual Bank Statements',  category: 'Assets' },
  { value: 'MORTGAGE_STATEMENT',        label: 'Mortgage Statement',          category: 'Assets' },
  { value: 'ARTICLES_OF_ORGANIZATION',  label: 'Articles of Organization',    category: 'Entity' },
  { value: 'OPERATING_AGREEMENT',       label: 'Operating Agreement',         category: 'Entity' },
  { value: 'STOCK_CERTIFICATE',         label: 'Stock Certificate / Ledger',  category: 'Entity' },
  { value: 'EARNEST_MONEY_PROOF',       label: 'Earnest Money Proof',         category: 'Property' },
  { value: 'PURCHASE_CONTRACT',         label: 'Purchase Contract',           category: 'Property' },
  { value: 'RECORDED_DEED',             label: 'Recorded Deed',               category: 'Property' },
  { value: 'INSURANCE_HOI',             label: 'Homeowner\'s Insurance',      category: 'Property' },
  { value: 'RENT_ROLL',                 label: 'Rent Roll / Lease',           category: 'Income' },
  { value: 'PAY_STUBS',                 label: 'Pay Stubs',                   category: 'Income' },
  { value: 'W2',                        label: 'W-2',                         category: 'Income' },
  { value: 'BUDGET_CSV',               label: 'Budget (.CSV)',                category: 'Budget' },
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
// conditionType: 'document_upload' | 'order_service' | 'verification' | 'internal_task'
// docClass: CT_DOC_CLASSES value — only present when conditionType === 'document_upload'
let CT_CONDITIONS = [
  {
    id: 'c1', name: 'Sign Purchase Agreement', group: 'agreements',
    conditionType: 'document_upload', docClass: 'PURCHASE_CONTRACT',
    description: 'Please upload a fully executed purchase agreement signed by all parties.',
    products: [
      { id: 'fix-flip', dueBefore: 'application', type: 'always',    rules: [] },
      { id: 'bridge',   dueBefore: 'application', type: 'always',    rules: [] },
    ],
  },
  {
    id: 'c2', name: 'Upload W2', group: 'income',
    conditionType: 'document_upload', docClass: 'W2',
    description: 'Please provide your most recent W-2 form.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Salaried' }] },
      { id: 'bridge',   dueBefore: 'closing',       type: 'always',   rules: [] },
    ],
  },
  {
    id: 'c3', name: 'Business Tax Returns', group: 'income',
    conditionType: 'document_upload', docClass: 'BANK_STATEMENT_BUSINESS',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
    ],
  },
  {
    id: 'c4', name: 'Title Search', group: 'property',
    conditionType: 'order_service',
    description: 'Order a preliminary title report from an approved title company.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'always', rules: [] })),
  },
  {
    id: 'c5', name: 'Appraisal Report', group: 'property',
    conditionType: 'order_service',
    description: 'Order a full appraisal from an AMC-approved appraiser.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'dscr',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'loan_type', op: 'is', val: 'DSCR' }] },
    ],
  },
  {
    id: 'c6', name: 'Proof of Insurance', group: 'property',
    conditionType: 'document_upload', docClass: 'INSURANCE_HOI',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'always', rules: [] })),
  },
  {
    id: 'c7', name: 'Bank Statements (3mo)', group: 'income',
    conditionType: 'document_upload', docClass: 'BANK_STATEMENT_INDIVIDUAL',
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
    <span class="ct2-lib__item-body">
      <span class="ct2-lib__name">${cond.name}</span>
    </span>
  </button>`;
}

function buildLibGroupHtml(group, conds, activeId) {
  if (!conds.length) return '';
  const items = conds.map(c => buildLibItem(c, c.id === activeId)).join('');
  const plusIcon = typeof iconSvg === 'function' ? iconSvg('plus') : '+';
  return `<div class="ct2-lib__group" data-ct2-group="${group.id}">
    <div class="ct2-lib__group-header">
      <span class="ct2-lib__group-label">${group.label}</span>
      <button type="button" class="ct2-lib__group-add" aria-label="Add condition to ${group.label}">${plusIcon}</button>
    </div>
    <div class="ct2-lib__group-items">${items}</div>
  </div>`;
}

function buildLibListHtml(activeId) {
  const groupedIds = new Set(CT_CONDITION_GROUPS.map(g => g.id));
  const grouped = CT_CONDITION_GROUPS.map(g =>
    buildLibGroupHtml(g, CT_CONDITIONS.filter(c => c.group === g.id), activeId)
  ).join('');
  const ungrouped = CT_CONDITIONS
    .filter(c => !c.group || !groupedIds.has(c.group))
    .map(c => buildLibItem(c, c.id === activeId)).join('');
  return grouped + ungrouped;
}

function buildSidebar(activeId) {
  const items = buildLibListHtml(activeId);
  const searchIcon = typeof iconSvg === 'function' ? iconSvg('magnifying-glass') : '';

  return `<aside class="ct2-sidebar">
  <div class="ct2-sidebar__head">
    <span class="ct2-sidebar__title">Manage Conditions</span>
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

function getStageLabel(stageId) {
  return CT_STAGES_V2.find(s => s.id === stageId)?.label || stageId;
}

/** Inline "Set all products at once" panel */
function buildSetAllPanel() {
  const stagePills = CT_STAGES_V2.map((s, i) =>
    `<button type="button"
       class="ct2-stage-pill${i === 0 ? ' ct2-stage-pill--active' : ''}"
       data-ct2-set-all-stage="${s.id}">${s.label}</button>`
  ).join('');

  return `<div class="ct2-set-all-panel" data-ct2-set-all-panel hidden>
  <div class="ct2-set-all-panel__row">
    <span class="ct2-set-all-panel__field-label">Required before</span>
    <div class="ct2-stage-pills" data-ct2-set-all-stages>${stagePills}</div>
  </div>
  <div class="ct2-set-all-panel__row">
    <span class="ct2-set-all-panel__field-label">Triggers when</span>
    <div class="ct2-fires" data-ct2-set-all-fires>
      <button type="button" class="ct2-fires__btn ct2-fires__btn--active" data-ct2-set-all-fire="always">Always</button>
      <button type="button" class="ct2-fires__btn" data-ct2-set-all-fire="triggered">Rule matches</button>
    </div>
  </div>
  <div class="ct2-set-all-panel__actions">
    <button type="button" class="ct2-set-all-panel__apply" data-ct2-set-all-apply>Apply to all products</button>
    <button type="button" class="ct2-set-all-panel__cancel" data-ct2-set-all-cancel>Cancel</button>
  </div>
</div>`;
}

/** Per-product row — clean Figma-aligned layout */
function buildProductRow(prod, isSelected) {
  const { id: prodId, type, dueBefore } = prod;
  const label      = getProductLabel(prodId);
  const stageLabel = getStageLabel(dueBefore);
  const typeLabel  = type === 'triggered' ? 'Rule matches' : 'Always';
  const metaLabel  = `Before ${stageLabel} · ${typeLabel}`;

  const chevBtn = buildBtnPreviewHtml({ id: 's1', icons: ['chevron-right'] })
    .replace('<button class="btn btn--s1" tabindex="-1"', `<button class="btn btn--s1 ct2-prod-row__chevron" tabindex="-1" aria-label="Configure ${label}"`);

  return `<div class="ct2-prod-row${isSelected ? ' ct2-prod-row--selected' : ''}" data-ct2-prod-row="${prodId}">
    <div class="ct2-prod-row__info">
      <span class="ct2-prod-row__label">${label}</span>
      <span class="ct2-prod-row__type">${metaLabel}</span>
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

/** Condition type picker — 2×2 card grid + optional doc class select */
function buildConditionTypePicker(cond) {
  const activeType = cond.conditionType || 'document_upload';
  const isDocUpload = activeType === 'document_upload';

  const cards = CT_CONDITION_TYPES.map(t => {
    const icon = typeof iconSvg === 'function' ? iconSvg(t.icon) : '';
    const isActive = t.id === activeType;
    return `<button type="button"
      class="ct2-type-card${isActive ? ' ct2-type-card--active' : ''}"
      data-ct2-type="${t.id}"
      data-tooltip="${t.hint}"
      aria-pressed="${isActive}">
      <span class="ct2-type-card__icon">${icon}</span>
      <span class="ct2-type-card__label">${t.label}</span>
    </button>`;
  }).join('');

  const selectedDocClass = CT_DOC_CLASSES.find(d => d.value === cond.docClass) || CT_DOC_CLASSES[0];
  const chevron = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  return `<div class="ct2-detail__section">
    <div class="ct2-detail__label">Condition type</div>
    <div class="ct2-type-grid" data-ct2-type-grid>${cards}</div>
    <div class="ct2-docclass-wrap${isDocUpload ? '' : ' ct2-docclass-wrap--hidden'}" data-ct2-docclass-wrap>
      <div class="ct2-detail__label">Document class</div>
      <div class="ct2-docclass-dropdown" data-ct2-docclass-dropdown>
        <button type="button" class="ct2-docclass-trigger" data-ct2-docclass-trigger>
          <span class="ct2-docclass-trigger__label" data-ct2-docclass-label>${selectedDocClass.label}</span>
          <span class="ct2-docclass-trigger__icon">${chevron}</span>
        </button>
      </div>
    </div>
  </div>`;
}

/** Center panel: name + condition type + product list */
function buildDetailCenter(cond, selectedProdId) {
  const backBtn = buildBtnPreviewHtml({ id: 's1', icons: ['chevron-left'] })
    .replace('<button class="btn btn--s1" tabindex="-1"', '<button class="btn btn--s1" tabindex="-1" data-ct2-back aria-label="Back to canvas"');
  const prodRows = (cond.products || []).map(p =>
    buildProductRow(p, p.id === selectedProdId)
  ).join('');
  const selectedIds = (cond.products || []).map(p => p.id);

  const pencilIcon = typeof iconSvg === 'function' ? iconSvg('pencil') : '';

  return `<div class="ct2-detail-center" data-ct2-center>
  <div class="ct2-detail__cond-header">
    ${backBtn}
    <div class="ct2-name-field" data-ct2-name-field>
      <span class="ct2-name-sizer" aria-hidden="true"></span>
      <input type="text" class="ct2-detail__name-input" value="${cond.name}"
        data-ct2-name-input placeholder="Condition name…" spellcheck="false" />
      <button type="button" class="ct2-name-field__edit" data-ct2-name-edit aria-label="Edit name">
        <span class="ct2-name-field__edit-icon">${pencilIcon}</span>
      </button>
    </div>
  </div>

  <textarea class="ct2-detail__cond-subtitle" data-ct2-cond-subtitle
    placeholder="Add a short description…"
    spellcheck="false">${cond.subtitle || ''}</textarea>

  ${buildConditionTypePicker(cond)}

  <div class="ct2-detail__section">
    <div class="ct2-detail__apply-label">Applies to</div>
    <div class="ct2-prod-list" data-ct2-prod-list>
      ${prodRows}
    </div>
    ${buildProductPicker(selectedIds)}
  </div>

  <div class="ct2-detail__msg-footer">
    <div class="ct2-detail__label">Message to recipient</div>
    <textarea class="ct2-desc-textarea" data-ct2-description
      placeholder="Add instructions or context sent to whoever fulfills this condition…"
      rows="3"
      spellcheck="false">${cond.description || ''}</textarea>
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

  <div class="ct2-right__sticky-footer">
    <button type="button" class="ct2-apply-all-btn" data-ct2-apply-all>
      Apply to all products
    </button>
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
    // Remove any stale docclass menu from a previous detail view
    document.querySelectorAll('.ct2-docclass-menu').forEach(m => m.remove());
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
  // Remove any orphaned docclass menu from body
  document.querySelectorAll('.ct2-docclass-menu').forEach(m => m.remove());

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
  if (list) list.innerHTML = buildLibListHtml(activeId);
}

function refreshDetailCenter(root) {
  const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
  if (!cond) return;
  const center = root.querySelector('[data-ct2-center]');
  if (!center) return;
  const prodList = center.querySelector('[data-ct2-prod-list]');
  if (prodList) prodList.innerHTML = (cond.products || []).map(p => buildProductRow(p, p.id === CT_SELECTED_PROD_ID)).join('');
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

function syncProdRowType(root, prodId) {
  const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
  const prod = (cond?.products || []).find(p => p.id === prodId);
  if (!prod) return;
  const row = root.querySelector(`[data-ct2-prod-row="${prodId}"]`);
  if (!row) return;
  const typeSpan = row.querySelector('.ct2-prod-row__type');
  if (!typeSpan) return;
  const stageLabel = getStageLabel(prod.dueBefore);
  const typeLabel  = prod.type === 'triggered' ? 'Rule matches' : 'Always';
  typeSpan.textContent = `Before ${stageLabel} · ${typeLabel}`;
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
      syncProdRowType(root, prodId);
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
      // Update trigger badge and type label on product row
      const row = root.querySelector(`[data-ct2-prod-row="${prodId}"]`);
      if (row) {
        const badge = row.querySelector('.ct2-prod-row__badge');
        if (badge) {
          badge.className = `ct2-prod-row__badge ct2-prod-row__badge--${type === 'triggered' ? 'rule' : 'always'}`;
          badge.textContent = type === 'triggered' ? 'Rule' : 'Always';
        }
      }
      syncProdRowType(root, prodId);
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

    // Apply current product's settings to all products
    if (e.target.closest('[data-ct2-apply-all]')) {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      const sourceProd = (cond?.products || []).find(p => p.id === prodId);
      if (!cond || !sourceProd) return;
      const { dueBefore, type, rules } = sourceProd;
      cond.products.forEach(prod => {
        if (prod.id === prodId) return; // skip the source product
        prod.dueBefore = dueBefore;
        prod.type = type;
        prod.rules = type === 'triggered' ? JSON.parse(JSON.stringify(rules || [])) : [];
        syncProdRowType(root, prod.id);
      });
      // Visual confirmation flash on the button
      const btn = e.target.closest('[data-ct2-apply-all]');
      const orig = btn.textContent;
      btn.textContent = 'Applied ✓';
      btn.classList.add('ct2-apply-all-btn--done');
      setTimeout(() => {
        btn.textContent = orig;
        btn.classList.remove('ct2-apply-all-btn--done');
      }, 1800);
      // Re-render product list in center so mini-tracks reflect new values
      const detail = root.querySelector('[data-ct2-detail]');
      if (detail) reRenderProductSection(detail, cond, root);
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

  // Name field: pencil activates edit mode, blur exits it
  const nameField = detail.querySelector('[data-ct2-name-field]');
  const nameInput = detail.querySelector('[data-ct2-name-input]');
  const nameSizer = detail.querySelector('.ct2-name-sizer');

  const syncNameWidth = () => {
    if (!nameSizer || !nameInput) return;
    nameSizer.textContent = nameInput.value || nameInput.placeholder;
    nameInput.style.width = nameSizer.offsetWidth + 'px';
  };
  syncNameWidth();

  detail.querySelector('[data-ct2-name-edit]')?.addEventListener('click', () => {
    if (nameField) nameField.classList.add('ct2-name-field--editing');
    nameInput?.focus();
  });

  nameInput?.addEventListener('blur', () => {
    nameField?.classList.remove('ct2-name-field--editing');
  });

  // Name input
  nameInput?.addEventListener('input', e => {
    const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    if (!cond) return;
    cond.name = e.target.value;
    const libName = root.querySelector(`[data-ct2-cid="${cond.id}"] .ct2-lib__name`);
    if (libName) libName.textContent = cond.name;
    syncNameWidth();
  });

  // Condition type card clicks
  detail.querySelector('[data-ct2-type-grid]')?.addEventListener('click', e => {
    const card = e.target.closest('[data-ct2-type]');
    if (!card) return;
    const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    if (!cond) return;
    const newType = card.getAttribute('data-ct2-type');
    if (cond.conditionType === newType) return;
    cond.conditionType = newType;
    if (newType !== 'document_upload') delete cond.docClass;

    // Update active card
    detail.querySelectorAll('[data-ct2-type]').forEach(c => {
      c.classList.toggle('ct2-type-card--active', c.getAttribute('data-ct2-type') === newType);
      c.setAttribute('aria-pressed', c.getAttribute('data-ct2-type') === newType);
    });

    // Show/hide doc class picker with animation
    const wrap = detail.querySelector('[data-ct2-docclass-wrap]');
    if (wrap) {
      const show = newType === 'document_upload';
      if (show) {
        wrap.classList.remove('ct2-docclass-wrap--hidden');
        wrap.animate(
          [{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 220, easing: CT2_EASE_ENTER, fill: 'none' }
        );
      } else {
        const a = wrap.animate(
          [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(4px)' }],
          { duration: 140, easing: CT2_EASE_EXIT, fill: 'none' }
        );
        a.onfinish = () => wrap.classList.add('ct2-docclass-wrap--hidden');
      }
    }
  });

  // Doc class custom dropdown — menu built fresh in JS, appended directly to body
  // (never placed inside the modal's filter context, so position:fixed works correctly)
  const docclassDropdown = detail.querySelector('[data-ct2-docclass-dropdown]');
  if (docclassDropdown) {
    const trigger = docclassDropdown.querySelector('[data-ct2-docclass-trigger]');
    const label   = docclassDropdown.querySelector('[data-ct2-docclass-label]');

    // Build menu element from scratch — born outside the modal
    const menu = document.createElement('div');
    menu.className = 'loans-dropdown ct2-docclass-menu';
    menu.style.display = 'none';

    const currentCond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    const selectedVal = currentCond?.docClass || CT_DOC_CLASSES[0].value;
    const categories  = [...new Set(CT_DOC_CLASSES.map(d => d.category))];
    categories.forEach(cat => {
      const group = document.createElement('div');
      group.className = 'ct2-docclass-menu__group';
      const catEl = document.createElement('div');
      catEl.className = 'ct2-docclass-menu__cat';
      catEl.textContent = cat;
      group.appendChild(catEl);
      CT_DOC_CLASSES.filter(d => d.category === cat).forEach(d => {
        const item = document.createElement('div');
        item.className = 'loans-dropdown__item' + (d.value === selectedVal ? ' loans-dropdown__item--active' : '');
        item.dataset.ct2DocclassItem = d.value;
        const lbl = document.createElement('span');
        lbl.className = 'loans-dropdown__item-label';
        lbl.textContent = d.label;
        item.appendChild(lbl);
        group.appendChild(item);
      });
      menu.appendChild(group);
    });
    document.body.appendChild(menu);

    const openMenu = () => {
      const r = trigger.getBoundingClientRect();
      const menuTop = r.bottom + 4;
      menu.style.top       = `${menuTop}px`;
      menu.style.left      = `${r.left}px`;
      menu.style.width     = `${r.width}px`;
      menu.style.minWidth  = `${r.width}px`;
      menu.style.maxHeight = `${window.innerHeight - menuTop - 16}px`;
      menu.style.display   = 'flex';
      // Trigger animation on next frame so transition fires
      requestAnimationFrame(() => menu.classList.add('ct2-docclass-menu--open'));
      docclassDropdown.classList.add('ct2-docclass-dropdown--open');
    };
    const closeMenu = () => {
      menu.classList.remove('ct2-docclass-menu--open');
      // Only hide after fade-out if the menu hasn't been reopened in the meantime
      menu.addEventListener('transitionend', () => { if (!isOpen()) menu.style.display = 'none'; }, { once: true });
      docclassDropdown.classList.remove('ct2-docclass-dropdown--open');
    };
    const isOpen = () => menu.classList.contains('ct2-docclass-menu--open');

    trigger.addEventListener('click', e => { e.stopPropagation(); isOpen() ? closeMenu() : openMenu(); });

    menu.addEventListener('click', e => {
      const item = e.target.closest('[data-ct2-docclass-item]');
      if (!item) return;
      const val = item.dataset.ct2DocclassItem;
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      if (cond) cond.docClass = val;
      const found = CT_DOC_CLASSES.find(d => d.value === val);
      if (found && label) label.textContent = found.label;
      menu.querySelectorAll('[data-ct2-docclass-item]').forEach(el =>
        el.classList.toggle('loans-dropdown__item--active', el.dataset.ct2DocclassItem === val)
      );
      closeMenu();
    });

    document.addEventListener('click', function onOutside(e) {
      if (!docclassDropdown.contains(e.target) && !menu.contains(e.target)) {
        closeMenu();
        if (!document.body.contains(docclassDropdown)) {
          menu.remove();
          document.removeEventListener('click', onOutside);
        }
      }
    });
  }

  // Description textarea — auto-resize + save
  const descTA = detail.querySelector('[data-ct2-description]');
  if (descTA) {
    const autoResize = () => {
      descTA.style.height = 'auto';
      descTA.style.height = descTA.scrollHeight + 'px';
    };
    autoResize();
    descTA.addEventListener('input', e => {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      if (cond) cond.description = e.target.value;
      autoResize();
    });
  }

  // Condition subtitle input — save
  const subtitleInput = detail.querySelector('[data-ct2-cond-subtitle]');
  if (subtitleInput) {
    subtitleInput.addEventListener('input', e => {
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      if (cond) cond.subtitle = e.target.value;
    });
  }

  // ── Set-all panel ────────────────────────────────────────────────────────
  const setAllPanel  = detail.querySelector('[data-ct2-set-all-panel]');
  const setAllToggle = detail.querySelector('[data-ct2-set-all-toggle]');

  const openSetAll = () => {
    // Pre-populate from first product's current settings (or defaults)
    const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    const firstProd = (cond?.products || [])[0];
    const initStage = firstProd?.dueBefore || CT_STAGES_V2[0].id;
    const initFire  = firstProd?.type || 'always';
    setAllPanel.querySelectorAll('[data-ct2-set-all-stage]').forEach(b =>
      b.classList.toggle('ct2-stage-pill--active', b.getAttribute('data-ct2-set-all-stage') === initStage)
    );
    setAllPanel.querySelectorAll('[data-ct2-set-all-fire]').forEach(b =>
      b.classList.toggle('ct2-fires__btn--active', b.getAttribute('data-ct2-set-all-fire') === initFire)
    );
    setAllPanel.hidden = false;
    setAllToggle.classList.add('ct2-set-all-btn--active');
  };

  const closeSetAll = () => {
    setAllPanel.hidden = true;
    setAllToggle.classList.remove('ct2-set-all-btn--active');
  };

  setAllToggle?.addEventListener('click', () => {
    setAllPanel.hidden ? openSetAll() : closeSetAll();
  });

  setAllPanel?.addEventListener('click', e => {
    // Stage pill selection
    const stagePill = e.target.closest('[data-ct2-set-all-stage]');
    if (stagePill) {
      setAllPanel.querySelectorAll('[data-ct2-set-all-stage]').forEach(b =>
        b.classList.toggle('ct2-stage-pill--active', b === stagePill)
      );
      return;
    }
    // Fire toggle
    const fireBtn = e.target.closest('[data-ct2-set-all-fire]');
    if (fireBtn) {
      setAllPanel.querySelectorAll('[data-ct2-set-all-fire]').forEach(b =>
        b.classList.toggle('ct2-fires__btn--active', b === fireBtn)
      );
      return;
    }
    // Apply
    if (e.target.closest('[data-ct2-set-all-apply]')) {
      const stageId = setAllPanel.querySelector('.ct2-stage-pill--active')
        ?.getAttribute('data-ct2-set-all-stage');
      const fireType = setAllPanel.querySelector('[data-ct2-set-all-fire].ct2-fires__btn--active')
        ?.getAttribute('data-ct2-set-all-fire');
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      if (cond && stageId && fireType) {
        cond.products.forEach(prod => {
          prod.dueBefore = stageId;
          prod.type = fireType;
          // Rules are only meaningful for 'triggered' — clear them when switching to 'always'
          if (fireType === 'always') prod.rules = [];
          syncProdRowType(root, prod.id);
        });
        // Re-render the product list so mini-tracks and badges all reflect the new values
        reRenderProductSection(detail, cond, root);
      }
      closeSetAll();
      return;
    }
    // Cancel
    if (e.target.closest('[data-ct2-set-all-cancel]')) {
      closeSetAll();
    }
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

  // Wire up tooltips on all [data-tooltip] elements in the detail panel
  attachTooltips(detail);
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
    root.querySelectorAll('.ct2-lib__group').forEach(group => {
      const hasVisible = [...group.querySelectorAll('.ct2-lib__item')].some(i => i.style.display !== 'none');
      group.style.display = hasVisible ? '' : 'none';
    });
  });

  // Sidebar clicks
  root.addEventListener('click', e => {
    const libItem = e.target.closest('[data-ct2-cid]');
    if (libItem && libItem.closest('.ct2-sidebar')) {
      enterDetail(libItem.getAttribute('data-ct2-cid'), root);
      return;
    }
    const groupAddBtn = e.target.closest('.ct2-lib__group-add');
    if (groupAddBtn) {
      const groupEl = groupAddBtn.closest('[data-ct2-group]');
      const groupId = groupEl ? groupEl.getAttribute('data-ct2-group') : null;
      const id = `c${Date.now()}`;
      CT_CONDITIONS.push({ id, name: 'New Condition', conditionType: 'document_upload', products: [], group: groupId });
      refreshLibList(root, id);
      enterDetail(id, root);
    }
  });

  bindCanvas(root);
}

// ─── Standalone page ──────────────────────────────────────────────────────────

// ─── Fixed-position tooltip ───────────────────────────────────────────────────
let _ct2Tip = null;

function _getTooltipEl() {
  if (!_ct2Tip) {
    _ct2Tip = document.createElement('div');
    _ct2Tip.className = 'ct2-fixed-tooltip';
    document.body.appendChild(_ct2Tip);
  }
  return _ct2Tip;
}

function attachTooltips(container) {
  container.querySelectorAll('[data-tooltip]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      const tip = _getTooltipEl();
      tip.textContent = el.getAttribute('data-tooltip');
      tip.style.left = '-9999px';
      tip.style.top  = '-9999px';
      tip.classList.add('ct2-fixed-tooltip--visible');
      const tw = tip.offsetWidth;
      const th = tip.offsetHeight;
      const r  = el.getBoundingClientRect();
      let left = r.left + r.width / 2 - tw / 2;
      let top  = r.top - th - 7;
      left = Math.max(6, Math.min(left, window.innerWidth - tw - 6));
      if (top < 6) top = r.bottom + 7;
      tip.style.left = `${left}px`;
      tip.style.top  = `${top}px`;
    });
    el.addEventListener('mouseleave', () => {
      _getTooltipEl().classList.remove('ct2-fixed-tooltip--visible');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (!document.body.classList.contains('ct-page')) return;
  const appRoot = document.getElementById('app');
  if (!appRoot) return;
  appRoot.innerHTML = `<div class="ct2-page-shell">${buildConditionTemplateModalDialogHtml()}</div>`;
  bindConditionTemplates(appRoot.querySelector('[data-ct2-root]'));
});
