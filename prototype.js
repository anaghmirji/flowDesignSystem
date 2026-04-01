'use strict';

// ─── Data ─────────────────────────────────────────────────────────────────────

/** Overview edit-bar modes (dropdown). `triggerLabel` = pill (Figma Button/Primary); `menuLabel` = menu row. */
const PROTO_PAGE_MODES = [
  { val: 'view', label: 'View', menuLabel: 'Viewing', triggerLabel: 'Viewing', icon: 'eye-open' },
  { val: 'edit', label: 'Edit', menuLabel: 'Editing', triggerLabel: 'Editing', icon: 'pencil' },
];

const PROPERTIES = [
  {
    id: 0, primary: true, tab: '123 Main St',
    street: '123 Main St', street2: 'Apt 402', city: 'San Francisco', state: 'CA', zip: '94105',
    type: 'SFR', typeLabel: 'SFR (Single Family)', occupancy: 'Investment', use: 'Fix & Flip',
    units: '1', sqft: '1000', yearBuilt: '2015',
    purchase: '$380,000', appraised: '$400,000', arv: '$410000',
    rent: '$4,200', dscr: '1.24',
  },
  {
    id: 1, primary: false, tab: '456 Oak Ave',
    street: '456 Oak Ave', street2: '—', city: 'Oakland', state: 'CA', zip: '94601',
    type: 'Condo', typeLabel: 'Condo', occupancy: 'Investment', use: 'Rental',
    units: '1', sqft: '900', yearBuilt: '2005',
    purchase: '$380,000', appraised: '$395,000', arv: '$430,000',
    rent: '$3,600', dscr: '1.18',
  },
  {
    id: 2, primary: false, tab: '789 West Parmer',
    street: '789 West Parmer', street2: '—', city: 'Austin', state: 'TX', zip: '78753',
    type: 'Multi-Family', typeLabel: 'Multi-Family (4)', occupancy: 'Investment', use: 'Rental',
    units: '4', sqft: '3200', yearBuilt: '1978',
    purchase: '$380,000', appraised: '$410,000', arv: '$480,000',
    rent: '$7,800', dscr: '1.31',
  },
];

// ─── Field Relationships (feeders & eaters) ───────────────────────────────────

const FIELD_RELATIONS = {
  ltv: {
    label: 'LTV — Loan-to-Value',
    type: 'calc',
    formula: 'Loan Amount ÷ [Purchase Price → ARV → Estimated Value] × 100',
    feeders: [
      { key: 'loanAmount',   label: 'Loan Amount',            note: 'numerator'          },
      { key: 'purchasePrice',label: 'Purchase Price',         note: 'primary denominator' },
      { key: 'arv',          label: 'ARV',                    note: 'fallback 1'          },
      { key: 'appraised',    label: 'Appraised / Est. Value', note: 'fallback 2'          },
    ],
    eaters: ['Header strip metrics', 'Stage validation (underwriting threshold)', 'Product eligibility'],
  },
  ltc: {
    label: 'LTC — Loan-to-Cost',
    type: 'calc',
    formula: 'Loan Amount ÷ Total Project Cost × 100',
    feeders: [
      { key: 'loanAmount', label: 'Loan Amount', note: 'numerator' },
    ],
    eaters: ['Header strip metrics', 'Product eligibility (Fix & Flip cap 85–90%)'],
  },
  fico: {
    label: 'FICO / Credit Score',
    type: 'sourced',
    source: 'Manually entered or AI-extracted from credit report',
    eaters: ['Header strip', 'Product eligibility (min FICO threshold)', 'Rate pricing (credit tier)', 'AI findings'],
  },
  dti: {
    label: 'DTI — Debt-to-Income',
    type: 'sourced',
    source: 'Manually entered — not system-calculated',
    formula: 'Total Monthly Debt ÷ Gross Monthly Income × 100 (if system-calculated)',
    eaters: ['Borrower qualification', 'Product eligibility (typically < 43–50%)', 'AI findings'],
  },
  dscr: {
    label: 'DSCR',
    type: 'calc',
    formula: 'Net Operating Income ÷ Total Debt Service',
    feeders: [
      { key: 'rent', label: 'Projected Monthly Rent', note: 'income side' },
    ],
    eaters: ['Product eligibility (min 1.0–1.25)', 'AI findings'],
  },
  loanAmount: {
    label: 'Loan Amount',
    type: 'feeder',
    eaters: ['LTV — numerator', 'LTC — numerator', 'Header strip', 'Pipeline table'],
  },
  purchasePrice: {
    label: 'Purchase Price',
    type: 'feeder',
    eaters: ['LTV — primary denominator', 'LTC — part of total cost', 'Header strip'],
  },
  arv: {
    label: 'ARV — After Repair Value',
    type: 'feeder',
    eaters: ['LTV — fallback denominator', 'Header strip', 'AI findings (flags if ARV > 50% above as-is value)'],
  },
  appraised: {
    label: 'Appraised / Estimated Value',
    type: 'feeder',
    eaters: ['LTV — last resort denominator'],
  },
  rent: {
    label: 'Projected Monthly Rent',
    type: 'feeder',
    eaters: ['DSCR calculation'],
  },
};

// ─── Info tooltip builder (feeders & eaters) ──────────────────────────────────

function buildInfoTooltipHtml(key) {
  const rel = FIELD_RELATIONS[key];
  if (!rel) return '<div class="proto-info-tooltip"><div class="proto-info-tooltip__title">No data</div></div>';

  function getLiveVal(k) {
    const byCalc = document.querySelector(`[data-calc-key="${k}"]`);
    if (byCalc) return byCalc.textContent.trim();
    const byProp = document.querySelector(`[data-prop="${k}"]`);
    if (byProp) return byProp.textContent.trim();
    return null;
  }

  let html = `<div class="proto-info-tooltip">
    <div class="proto-info-tooltip__title">${rel.label}</div>`;

  if (rel.formula) {
    html += `<div class="proto-info-tooltip__formula">${rel.formula}</div>`;
  }

  if (rel.source) {
    html += `<div class="proto-info-tooltip__section">
      <div class="proto-info-tooltip__section-label">Source</div>
      <div class="proto-info-tooltip__source-text">${rel.source}</div>
    </div>`;
  }

  if (rel.feeders?.length) {
    html += `<div class="proto-info-tooltip__section">
      <div class="proto-info-tooltip__section-label">Calculated from</div>`;
    rel.feeders.forEach(f => {
      const val = getLiveVal(f.key);
      const missing = !val || val === '—';
      html += `<div class="proto-info-tooltip__row">
        <span class="proto-info-tooltip__row-label">${f.label}</span>
        <div class="proto-info-tooltip__row-right">
          <span class="proto-info-tooltip__row-val${missing ? ' missing' : ''}">${missing ? 'Not set' : val}</span>
          ${f.note ? `<span class="proto-info-tooltip__row-note">${f.note}</span>` : ''}
        </div>
      </div>`;
    });
    html += `</div>`;
  }

  if (rel.eaters?.length) {
    html += `<div class="proto-info-tooltip__section">
      <div class="proto-info-tooltip__section-label">Used in</div>`;
    rel.eaters.forEach(e => {
      html += `<div class="proto-info-tooltip__eater">${e}</div>`;
    });
    html += `</div>`;
  }

  html += `</div>`;
  return html;
}

// ─── US States ────────────────────────────────────────────────────────────────

const US_STATES = [
  { value: 'AL', label: 'Alabama' },       { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },       { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },    { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },   { value: 'DE', label: 'Delaware' },
  { value: 'DC', label: 'District of Columbia' },
  { value: 'FL', label: 'Florida' },       { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },        { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },      { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },          { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },      { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },         { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },     { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },      { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },      { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },    { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },{ value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },          { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },        { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },         { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },       { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },    { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },     { value: 'WY', label: 'Wyoming' },
];

function formatCurrency(val) {
  const num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return val;
  return '$' + num.toLocaleString('en-US', { maximumFractionDigits: 0 });
}

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

// ─── Borrower Header ──────────────────────────────────────────────────────────

function buildBorrowerHeader() {
  const profileHtml     = buildProfileHtml({ favorited: true });
  const docBtn          = buildBtnPreviewHtml({ id: 's1', icons: ['document'] });
  const assigneesHtml   = buildAssigneesHtml({ count: 2 });
  const statusStageHtml = buildLpStatusStageInteractiveHtml({
    status: { dot: 'green', label: 'Active' },
    stage:  { label: 'Application' },
  });

  return `
    <div class="proto-borrower-header">
      <div class="proto-borrower-header__left">
        ${profileHtml}
        <div class="proto-borrower-header__info">
          <span class="proto-borrower-header__name">Laura Lee</span>
          <span class="proto-borrower-header__address">123 Main St, San Francisco CA</span>
        </div>
      </div>
      <div class="proto-borrower-header__right">
        ${docBtn}
        ${assigneesHtml}
        ${statusStageHtml}
      </div>
    </div>`;
}

// ─── Loan Stats Bar ───────────────────────────────────────────────────────────

function buildLoanStatsHtml() {
  const stats = [
    { label: 'Amount',         value: '$450,000'  },
    { label: 'Purpose',        value: 'Purchase'  },
    { label: 'Type',           value: 'Fix & Flip'},
    { label: 'Term',           value: '12 months' },
    { label: 'Purchase Price', value: '$380,000'  },
    { label: 'ARV',            value: '$520,000'  },
    { label: 'Rate',           value: '12.5%'     },
  ];

  const flexStats = [
    { label: 'LTV',  value: '86.5%' },
    { label: 'FICO', value: '760'   },
  ];

  const renderItem = (s) => `
    <div class="proto-loan-stats__item">
      <span class="proto-loan-stats__label">${s.label}</span>
      <span class="proto-loan-stats__value">${s.value}</span>
    </div>`;

  return `
    <div class="proto-loan-stats">
      <div class="proto-loan-stats__pill">
        <div class="proto-loan-stats__items">
          ${stats.map(renderItem).join('')}
        </div>
      </div>
      <div class="proto-loan-stats__pill proto-loan-stats__pill--flex">
        <div class="proto-loan-stats__items">
          ${flexStats.map(renderItem).join('')}
        </div>
      </div>
    </div>`;
}

// ─── Property helpers (module-level so interactions can call them) ────────────

function buildPropSidebarHtml(activeIdx = 0) {
  const items = PROPERTIES.map((p, i) => `
    <button type="button" class="proto-prop-item${i === activeIdx ? ' proto-prop-item--active' : ''}" data-prop-item="${i}">
      <div class="proto-prop-item__info">
        <span class="proto-prop-item__addr">${p.street}</span>
        <span class="proto-prop-item__price">${p.purchase}</span>
      </div>
      <span class="proto-prop-item__type">${p.type}</span>
    </button>`).join('');
  return items + `<button type="button" class="proto-prop-add-item">${iconSvg('plus')} Add property</button>`;
}

function buildPropControlsHtml(activeIdx) {
  const prop = PROPERTIES[activeIdx];
  if (!prop) return '';
  if (prop.primary) {
    return `<span class="proto-prop-badge--primary">Primary property</span>`;
  }
  return `
    <button class="proto-prop-action proto-prop-action--set-primary" data-set-primary="${activeIdx}">Set as primary</button>
    <span class="proto-prop-action-sep"></span>
    <button class="proto-prop-action proto-prop-action--remove" data-rm-prop="${activeIdx}">Remove property</button>`;
}

// ─── Loan Form (Collapsible Sections) ────────────────────────────────────────

function buildFormHtml() {
  const p0 = PROPERTIES[0];

  const f = (label, value, opts = {}) => {
    const itype    = opts.type || 'text';
    const editable = !opts.readonly && !opts.masked && !opts.link;
    const cls = ['proto-field'];
    if (opts.readonly)  cls.push('proto-field--readonly');
    if (opts.span)      cls.push(`proto-field--span-${opts.span}`);
    if (editable)       cls.push('proto-field--editable');

    const badge = opts.readonly
      ? `<span class="proto-field__badge">calc</span>`
      : opts.meta
      ? `<span class="proto-field__badge proto-field__badge--meta">${typeof opts.meta === 'string' ? opts.meta : 'meta'}</span>`
      : '';

    const infoBtn = opts.infoKey
      ? `<button class="proto-field__info" data-info-key="${opts.infoKey}">i</button>`
      : '';

    const extra = [];
    if (opts.propKey)  extra.push(`data-prop="${opts.propKey}"`);
    if (opts.calcKey)  extra.push(`data-calc-key="${opts.calcKey}"`);
    const attrs = extra.length ? ` ${extra.join(' ')}` : '';

    const valSpan = opts.link
      ? `<a class="proto-field__value proto-field__value--link" href="#">${value}</a>`
      : opts.masked
      ? `<span class="proto-field__value proto-field__value--masked"${attrs}>${value}</span>`
      : editable
      ? `<span class="proto-field__value" contenteditable="true" spellcheck="false"${attrs}>${value || ''}</span>`
      : `<span class="proto-field__value"${attrs}>${value || '—'}</span>`;

    let inputEl = '';
    if (editable) {
      const ph = opts.placeholder ? ` placeholder="${opts.placeholder}"` : '';
      if (itype === 'select' && opts.options) {
        const optHtml = opts.options.map(o => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return `<option value="${v}"${v === value ? ' selected' : ''}>${l}</option>`;
        }).join('');
        inputEl = `<select class="proto-field__select"><option value="">—</option>${optHtml}</select>`;
      } else if (itype === 'textarea') {
        inputEl = `<textarea class="proto-field__textarea" rows="3"${ph}>${value || ''}</textarea>`;
      } else if (itype === 'currency') {
        const rawVal = value ? value.replace(/[^0-9.]/g, '') : '';
        inputEl = `<div class="proto-field__currency-wrap"><span class="proto-field__currency-sign">$</span><input class="proto-field__input" type="text" value="${rawVal}" placeholder="0"></div>`;
      } else {
        const typeAttr = itype === 'number' ? ' type="number"' : itype === 'date' ? ' type="date"' : '';
        inputEl = `<input class="proto-field__input"${typeAttr} value="${value || ''}"${ph}>`;
      }
    }

    const fieldAttrs = opts.individualOnly ? ' data-individual-only' : '';

    return `
      <div class="${cls.join(' ')}"${fieldAttrs}>
        <span class="proto-field__label">${label}${badge}${infoBtn}</span>
        ${valSpan}
        ${inputEl}
      </div>`;
  };

  // sub(label, innerHtml, opts) — labelled sub-group card within a section
  const sub = (label, innerHtml, opts = {}) => {
    const cls = ['proto-sub'];
    if (opts.hidden)  cls.push('proto-sub--hidden');
    if (opts.full)    cls.push('proto-sub--full');
    const dataAttr = opts.dataAttr ? ` ${opts.dataAttr}` : '';
    return `
      <div class="${cls.join(' ')}"${dataAttr}>
        <span class="proto-sub__label">${label}</span>
        <div class="proto-section__grid">${innerHtml}</div>
      </div>`;
  };

  const section = (title, bodyHtml, opts = {}) => {
    const cls = ['proto-section'];
    if (opts.muted)     cls.push('proto-section--muted');
    if (opts.sidebar)   cls.push('proto-section--sidebar');
    if (opts.bodyGrid)  cls.push('proto-section--body-grid');
    return `
      <div class="${cls.join(' ')}" aria-expanded="true">
        <div class="proto-section__head" data-collapse-head>
          <div class="proto-section__head-left">
            <span class="proto-section__title">${title}</span>
            ${opts.badge  ? `<span class="proto-section__badge">${opts.badge}</span>` : ''}
            ${opts.count != null ? `<span class="proto-prop-head__sep">·</span><span class="proto-prop-head__num">${opts.count}</span>` : ''}
          </div>
          <div class="proto-section__head-right">
            <span class="proto-section__chevron">${buildBtnPreviewHtml({ id: 's1', icons: ['chevron-down'] })}</span>
          </div>
        </div>
        <div class="proto-section__body">
          <div class="proto-section__body-inner">${bodyHtml}</div>
        </div>
      </div>`;
  };

  const TOGGLE_ICONS = {
    individual: iconSvg('user'),
    entity:     iconSvg('building-office-2'),
  };

  const toggle = (options, activeIdx = 0) => `
    <div class="proto-toggle" data-toggle>
      <div class="proto-toggle__pill" aria-hidden="true"></div>
      ${options.map((o, i) => `<button
          class="proto-toggle__btn${i === activeIdx ? ' proto-toggle__btn--active' : ''}"
          data-toggle-val="${o.toLowerCase()}">
        <span class="proto-toggle__icon">${TOGGLE_ICONS[o.toLowerCase()] || ''}</span>
        <span class="proto-toggle__label">${o}</span>
      </button>`).join('')}
    </div>`;

  // ── Borrower section ─────────────────────────────────────────────────────────
  const borrowerHtml = `
    ${sub('Identity', `
      <div class="proto-field proto-field--span-2">
        <span class="proto-field__label">Entity type</span>
        ${toggle(['Individual', 'Entity'])}
      </div>
      ${f('Full legal name', 'Laura Lee', { span: 2, placeholder: "Enter borrower's full legal name" })}
      ${f('Date of birth', '04/12/1985', { type: 'date', individualOnly: true })}
      ${f('SSN', '••• – •• – 4832', { masked: true, individualOnly: true })}
    `)}
    ${sub('Entity Details', `
      ${f('Entity legal name',  'Lee Holdings LLC', { span: 2, placeholder: 'Enter entity legal name' })}
      ${f('EIN',                '•• – •••••••',     { masked: true })}
      ${f('Formation state',    'CA',               { type: 'select', options: US_STATES })}
      ${f('Authorized signers', 'Laura Lee',        { span: 2, placeholder: 'Add authorized signer name' })}
    `, { hidden: true, dataAttr: 'data-entity-sub' })}
    ${sub('Contact', `
      ${f('Email address', 'laura.lee@email.com', { placeholder: 'email@example.com' })}
      ${f('Phone number',  '(415) 555-0142',      { placeholder: '(555) 123-4567'   })}
    `)}
    ${sub('Financial Profile', `
      ${f('FICO / Credit score', '760',   { type: 'number', meta: 'reported',  infoKey: 'fico', placeholder: '300–850' })}
      ${f('DTI',                 '38.4',  { type: 'number', meta: 'reported',  infoKey: 'dti',  placeholder: '0–100'   })}
      ${f('Experience summary',  '3 flips completed', { type: 'textarea', span: 2, placeholder: "Describe borrower's relevant experience" })}
    `)}`;

  // ── Properties section ───────────────────────────────────────────────────────
  const isInvestment0 = p0.occupancy === 'Investment';
  const propertiesHtml = `
    <div class="proto-prop-layout">
      <div class="proto-prop-sidebar" data-prop-sidebar>
        ${buildPropSidebarHtml(0)}
      </div>
      <div class="proto-prop-detail">
        <div class="proto-prop-controls" data-prop-controls>${buildPropControlsHtml(0)}</div>
        ${sub('Location', `
          ${f('Street Address Line 1', p0.street,  { propKey: 'street',  placeholder: 'Street address' })}
          ${f('Street Address Line 2', p0.street2, { propKey: 'street2', placeholder: 'Apt, suite, unit' })}
          ${f('City',                  p0.city,    { propKey: 'city',    placeholder: 'City' })}
          ${f('State',                 p0.state,   { propKey: 'state',   type: 'select', options: US_STATES })}
          ${f('Zip Code',              p0.zip,     { propKey: 'zip',     placeholder: '00000' })}
          <div class="proto-field proto-field--location-spacer" aria-hidden="true"></div>
        `)}
        ${sub('Property Details', `
          ${f('Property Type', p0.typeLabel, { propKey: 'typeLabel', type: 'select', options: ['SFR (Single Family)', 'Condo', 'Multi-Family (4)', 'Commercial', 'Mixed-Use', 'Land'] })}
          ${f('Units',         p0.units,     { propKey: 'units',     type: 'number', placeholder: 'Number of units' })}
          ${f('Occupancy',     p0.occupancy, { propKey: 'occupancy', type: 'select', options: ['Owner-Occupied', 'Investment', 'Second Home'] })}
          ${f('Intended use',  p0.use,       { propKey: 'use',       type: 'select', options: ['Primary Residence', 'Investment', 'Fix & Flip', 'Rental', 'Other'] })}
          ${f('Square Footage', p0.sqft,     { propKey: 'sqft',      type: 'number', placeholder: 'Square footage' })}
          ${f('Year Built',    p0.yearBuilt, { propKey: 'yearBuilt', type: 'number', placeholder: 'YYYY' })}
        `)}
        ${sub('Valuation', `
          ${f('Purchase Price',  p0.purchase,  { propKey: 'purchase',  calcKey: 'purchasePrice', type: 'currency', infoKey: 'purchasePrice' })}
          ${f('Appraised Value', p0.appraised, { propKey: 'appraised',                           type: 'currency', infoKey: 'appraised'     })}
          ${f('ARV',             p0.arv,       { propKey: 'arv',        meta: 'estimated',        type: 'currency', infoKey: 'arv'           })}
        `)}
        ${sub('Investment Details', `
          ${f('Projected rent / mo', p0.rent, { propKey: 'rent', type: 'currency', infoKey: 'rent'                                    })}
          ${f('DSCR',                p0.dscr, { propKey: 'dscr', type: 'number',   meta: 'calculated', infoKey: 'dscr', placeholder: '0.00' })}
        `, { hidden: !isInvestment0, dataAttr: 'data-investment-sub' })}
      </div>
    </div>`;

  // ── Loan Terms section ───────────────────────────────────────────────────────
  const loanTermsHtml = `
    ${sub('Core Terms', `
      ${f('Loan amount',  '$450,000',          { type: 'currency', calcKey: 'loanAmount', infoKey: 'loanAmount' })}
      ${f('Loan purpose', 'Purchase',           { type: 'select',  options: ['Purchase', 'Refinance', 'Cash-Out Refi', 'Construction'] })}
      ${f('Product',      'Fix & Flip — 12mo', { link: true })}
    `)}
    ${sub('Calculated Metrics', `
      ${f('LTV', '86.5%', { readonly: true, calcKey: 'ltv', infoKey: 'ltv' })}
      ${f('LTC', '82.3%', { readonly: true, infoKey: 'ltc' })}
    `)}
    ${sub('Rate & Structure', `
      ${f('Rate',        '12.5%',        { type: 'number', placeholder: '0.000'    })}
      ${f('Term',        '12 months',    { placeholder: 'e.g. 12'                  })}
      ${f('Amortization','Interest Only', { type: 'select', options: ['30-Year Fixed', '15-Year Fixed', 'Interest Only', 'ARM', 'Balloon'] })}
    `)}
    ${sub('Timeline', `
      ${f('Est. closing date', '', { type: 'date', span: 2 })}
    `)}`;

  const notesHtml = `
    <div class="proto-section__grid">
      <div class="proto-notes proto-field--span-2">
        <div class="proto-notes__view" data-notes-view>No internal notes yet</div>
        <textarea class="proto-notes__textarea proto-field__textarea" placeholder="Add internal notes for your team..." rows="4"></textarea>
        <div class="proto-notes__footer">
          <span class="proto-notes__staff">Visible to lender staff only — never shared with borrower</span>
          <span class="proto-notes__edited">Last edited by Sarah Chen · 2 hours ago</span>
        </div>
      </div>
    </div>`;

  return `
    <div class="proto-form">
      ${section('Borrower Information', borrowerHtml)}
      ${section('Properties', propertiesHtml, { count: PROPERTIES.length, sidebar: true })}
      ${section('Loan Terms', loanTermsHtml)}
      ${section('Internal Notes', notesHtml)}
    </div>`;
}

// ─── Body (main + ai panel) ───────────────────────────────────────────────────

function buildProtoModeDropdownHtml(activeVal = 'view') {
  const current = PROTO_PAGE_MODES.find(m => m.val === activeVal) || PROTO_PAGE_MODES[0];
  const leadIcon = current.icon ? iconSvg(current.icon) : '';
  const options = PROTO_PAGE_MODES.map(m => {
    const active = m.val === activeVal ? ' loans-dropdown__item--active' : '';
    const optIcon = m.icon ? iconSvg(m.icon) : '';
    return `<div class="loans-dropdown__item${active}" role="option" data-mode-val="${m.val}">
      <span class="proto-mode-menu__icon" aria-hidden="true">${optIcon}</span>
      <span class="loans-dropdown__item-label">${m.menuLabel || m.label}</span>
    </div>`;
  }).join('');
  return `
    <div class="lp-status-dropdown-wrap proto-mode-dropdown-wrap" data-amoeba-wrap data-proto-mode-wrap>
      <div class="proto-overview-mode-trigger" data-proto-mode-trigger role="button" tabindex="0" aria-haspopup="listbox" aria-expanded="false">
        <span class="proto-overview-mode-trigger__main">
          <span class="proto-overview-mode-trigger__icon" data-mode-trigger-icon>${leadIcon}</span>
          <span class="proto-overview-mode-trigger__label" data-mode-trigger-label>${current.triggerLabel}</span>
        </span>
        <span class="proto-overview-mode-trigger__chev" aria-hidden="true">${iconSvg('chevron-down')}</span>
      </div>
      <div class="loans-dropdown loans-dropdown--status-menu loans-dropdown--proto-mode" data-proto-mode-menu role="listbox" style="display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:30">
        ${options}
      </div>
    </div>`;
}

function buildBody() {
  return `
    <div class="proto-body">
      <div class="proto-card">
        ${buildLoansPanelHtml()}
        <div class="proto-main" data-view-mode>
          ${buildBorrowerHeader()}
          ${buildLoanStatsHtml()}
          <div class="proto-edit-bar">
            <span class="proto-edit-bar__title">Overview</span>
            <div class="proto-edit-bar__right">
              ${buildProtoModeDropdownHtml('view')}
            </div>
          </div>
          <div class="proto-main__scroll">
            ${buildFormHtml()}
          </div>
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

function bindBorrowerHeader() {
  const header = document.querySelector('.proto-borrower-header');
  if (!header) return;

  // Profile star toggle
  const profileBtn  = header.querySelector('.profile');
  const profileStar = header.querySelector('.profile__star');
  if (profileBtn && profileStar) {
    let fav = true;
    profileBtn.addEventListener('click', () => {
      fav = !fav;
      profileStar.innerHTML = fav ? iconSvg('star-filled') : iconSvg('star');
      profileStar.style.setProperty('--fill-0', fav ? '#FFCC00' : '');
      profileStar.classList.remove('star-pop');
      void profileStar.offsetWidth;
      profileStar.classList.add('star-pop');
    });
  }

  // Assignees pill toggle + search mode
  const assigneesWrap = header.querySelector('.assignees-wrap');
  const assigneesBtn  = header.querySelector('.assignees');
  if (assigneesWrap && assigneesBtn) {
    assigneesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      assigneesWrap.classList.toggle('open');
      assigneesWrap.classList.remove('search-mode');
    });
    const addBtn = header.querySelector('.assignees-dropdown__add');
    if (addBtn) addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      assigneesWrap.classList.add('search-mode');
    });
    const clearBtn = header.querySelector('.assignees-dropdown__search-clear');
    if (clearBtn) clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      assigneesWrap.classList.remove('search-mode');
    });
    header.querySelectorAll('.assignees-dropdown__role').forEach(badge => {
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        const roleWrap = badge.closest('.assignees-dropdown__role-wrap');
        if (!roleWrap) return;
        const isOpen = roleWrap.classList.contains('open');
        header.querySelectorAll('.assignees-dropdown__role-wrap.open').forEach(w => w.classList.remove('open'));
        if (!isOpen) roleWrap.classList.add('open');
      });
    });
  }

  // Stage forward button — icon slides out right, enters from left; label advances
  const stageBtn   = header.querySelector('.lp-stage__btn');
  const stageLabel = header.querySelector('.lp-stage__label');
  const STAGES = ['Application', 'Underwriting', 'Closing', 'Funded', 'Post-close'];

  if (stageBtn && stageLabel) {
    let stageIndex = 0;
    let stageAnimating = false;

    stageBtn.addEventListener('click', () => {
      if (stageAnimating) return;
      stageAnimating = true;

      const iconEl = stageBtn.querySelector('.icon');

      // Icon: slides out right shrinking down; enters from left scaling back up
      const exitAnim = iconEl.animate([
        { transform: 'translateX(0)    scale(1)',    opacity: 1, offset: 0,    easing: 'cubic-bezier(0.4, 0, 1, 0.8)' },
        { transform: 'translateX(60%)  scale(0.7)',  opacity: 1, offset: 0.55, easing: 'cubic-bezier(0.4, 0, 1, 0.8)' },
        { transform: 'translateX(130%) scale(0.55)', opacity: 0, offset: 1    },
      ], { duration: 220, easing: 'linear', fill: 'none' });

      exitAnim.onfinish = () => {
        iconEl.style.transform = 'translateX(-130%) scale(0.55)';
        iconEl.style.opacity   = '0';
        requestAnimationFrame(() => {
          const enterAnim = iconEl.animate([
            { transform: 'translateX(-130%) scale(0.55)', opacity: 0, offset: 0,    easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            { transform: 'translateX(-40%)  scale(0.75)', opacity: 1, offset: 0.35, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
            { transform: 'translateX(0)     scale(1)',    opacity: 1, offset: 1    },
          ], { duration: 380, easing: 'linear', fill: 'none' });

          enterAnim.onfinish = () => {
            iconEl.style.transform  = '';
            iconEl.style.opacity    = '';
            stageAnimating = false;
          };
        });
      };

      // Label: slip up and out, new text slips in from below
      const labelExit = stageLabel.animate([
        { transform: 'translateY(0)',    opacity: 1, offset: 0,   easing: 'cubic-bezier(0.4, 0, 1, 0.8)' },
        { transform: 'translateY(-8px)', opacity: 0, offset: 1   },
      ], { duration: 180, easing: 'linear', fill: 'none' });

      labelExit.onfinish = () => {
        const stage  = stageLabel.closest('.lp-stage');
        const btnEl  = stage?.querySelector('.lp-stage__btn');
        const oldW   = stage ? stage.offsetWidth : null;

        stageIndex = (stageIndex + 1) % STAGES.length;
        stageLabel.textContent = STAGES[stageIndex];

        if (stage && oldW !== null) {
          const newW  = stage.offsetWidth;
          const delta = newW - oldW;   // positive = grew, negative = shrank
          if (delta !== 0) {
            const expanding = delta > 0;
            const duration  = expanding ? 320 : 220;
            const easing    = expanding ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'cubic-bezier(0.4, 0, 1, 0.8)';

            // Stage is already at its new layout width (newW).
            // Slide it in from -delta so the RIGHT edge never moves —
            // the button stays put and only the left side grows/contracts.
            // translateX only: no width reflow per frame, no border-radius distortion, no height change.
            // fill:'none' returns to base (no transform) cleanly — that IS the end state.
            stage.animate([
              { transform: `translateX(${-delta}px)` },
              { transform: 'translateX(0px)'          },
            ], { duration, easing, fill: 'none' });
          }
        }

        stageLabel.animate([
          { transform: 'translateY(8px)',  opacity: 0, offset: 0,   easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          { transform: 'translateY(-2px)', opacity: 1, offset: 0.7, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
          { transform: 'translateY(0)',    opacity: 1, offset: 1    },
        ], { duration: 340, easing: 'linear', fill: 'none' });
      };
    });
  }

  // Status dropdown
  const statusWrap = header.querySelector('.lp-status-dropdown-wrap');
  if (statusWrap) mountLpStatusDropdown(statusWrap);

  // Close all dropdowns on outside click
  document.addEventListener('click', () => {
    if (assigneesWrap) assigneesWrap.classList.remove('open', 'search-mode');
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

function recalcLTV() {
  const amountEl = document.querySelector('[data-calc-key="loanAmount"]');
  const priceEl  = document.querySelector('[data-calc-key="purchasePrice"]');
  const ltvEl    = document.querySelector('[data-calc-key="ltv"]');
  if (!amountEl || !priceEl || !ltvEl) return;
  const amount = parseFloat(amountEl.textContent.replace(/[^0-9.]/g, ''));
  const price  = parseFloat(priceEl.textContent.replace(/[^0-9.]/g, ''));
  if (!amount || !price) return;
  ltvEl.textContent = (amount / price * 100).toFixed(1) + '%';
  ltvEl.classList.add('proto-field__value--saved');
  setTimeout(() => ltvEl.classList.remove('proto-field__value--saved'), 700);
}

/** Entity Details sub-card — max-height + opacity + slide (matches toggle pill easing). */
const ENTITY_SUB_MS_SHOW = 420;
const ENTITY_SUB_MS_HIDE = 440;
const ENTITY_SUB_EASE_SHOW = 'cubic-bezier(0.16, 1, 0.3, 1)';
/** Exit: ease-out height — no translateY (it fought max-height in a flex column). */
const ENTITY_SUB_EASE_HIDE = 'cubic-bezier(0.33, 1, 0.68, 1)';

function cancelEntitySubAnims(entitySub) {
  if (!entitySub) return;
  entitySub.getAnimations().forEach(a => {
    try {
      a.cancel();
    } catch (_) { /* ignore */ }
  });
}

function setEntitySubVisible(entitySub, visible) {
  if (!entitySub) return;
  cancelEntitySubAnims(entitySub);
  entitySub.style.maxHeight = '';
  entitySub.style.opacity = '';
  entitySub.style.overflow = '';
  entitySub.style.transform = '';
  entitySub.style.paddingTop = '';
  entitySub.style.paddingBottom = '';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) {
    entitySub.classList.toggle('proto-sub--hidden', !visible);
    return;
  }

  const isHidden = entitySub.classList.contains('proto-sub--hidden');

  if (visible) {
    if (!isHidden) return;
    entitySub.classList.remove('proto-sub--hidden');
    const h = entitySub.scrollHeight;
    if (h <= 0) {
      entitySub.style.maxHeight = '';
      entitySub.style.opacity = '';
      entitySub.style.overflow = '';
      entitySub.style.transform = '';
      entitySub.style.paddingTop = '';
      entitySub.style.paddingBottom = '';
      return;
    }
    entitySub.style.overflow = 'hidden';
    entitySub.style.maxHeight = '0px';
    entitySub.style.opacity = '0';
    entitySub.style.transform = 'translateY(-8px)';
    entitySub.style.paddingTop = '0px';
    entitySub.style.paddingBottom = '0px';
    void entitySub.offsetHeight;
    const anim = entitySub.animate(
      [
        {
          maxHeight: '0px',
          opacity: 0,
          transform: 'translateY(-8px)',
          paddingTop: '0px',
          paddingBottom: '0px',
        },
        {
          maxHeight: `${h}px`,
          opacity: 1,
          transform: 'translateY(0)',
          paddingTop: '16px',
          paddingBottom: '16px',
        },
      ],
      { duration: ENTITY_SUB_MS_SHOW, easing: ENTITY_SUB_EASE_SHOW, fill: 'none' }
    );
    anim.onfinish = () => {
      entitySub.style.maxHeight = '';
      entitySub.style.opacity = '';
      entitySub.style.overflow = '';
      entitySub.style.transform = '';
      entitySub.style.paddingTop = '';
      entitySub.style.paddingBottom = '';
    };
    return;
  }

  if (isHidden) return;
  const h = entitySub.scrollHeight;
  if (h <= 0) {
    entitySub.classList.add('proto-sub--hidden');
    return;
  }
  entitySub.style.maxHeight = `${h}px`;
  entitySub.style.overflow = 'hidden';
  void entitySub.offsetHeight;
  const anim = entitySub.animate(
    [
      {
        maxHeight: `${h}px`,
        opacity: 1,
        paddingTop: '16px',
        paddingBottom: '16px',
      },
      {
        maxHeight: '0px',
        opacity: 0,
        paddingTop: '0px',
        paddingBottom: '0px',
      },
    ],
    { duration: ENTITY_SUB_MS_HIDE, easing: ENTITY_SUB_EASE_HIDE, fill: 'none' }
  );
  anim.onfinish = () => {
    entitySub.classList.add('proto-sub--hidden');
    entitySub.style.maxHeight = '';
    entitySub.style.opacity = '';
    entitySub.style.overflow = '';
    entitySub.style.transform = '';
    entitySub.style.paddingTop = '';
    entitySub.style.paddingBottom = '';
  };
}

function bindFormInteractions() {
  // Individual / Entity toggle — WAAPI FLIP sliding pill
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-toggle-val]');
    if (!btn) return;
    const toggleEl = btn.closest('[data-toggle]');
    if (!toggleEl) return;

    // In view mode — block interaction, show tooltip
    if (document.querySelector('[data-view-mode]')) {
      e.stopImmediatePropagation();
      const viewTooltip = document.querySelector('.proto-view-tooltip');
      if (viewTooltip) {
        const r = toggleEl.getBoundingClientRect();
        viewTooltip.style.left = `${r.left}px`;
        viewTooltip.style.top  = `${r.bottom + 6}px`;
        viewTooltip.classList.add('proto-view-tooltip--visible');
      }
      return;
    }

    const oldBtn = toggleEl.querySelector('.proto-toggle__btn--active');
    if (!oldBtn || oldBtn === btn) return;

    const pill      = toggleEl.querySelector('.proto-toggle__pill');
    const oldLabel  = oldBtn.querySelector('.proto-toggle__label');
    const newLabel  = btn.querySelector('.proto-toggle__label');

    if (pill) {
      // 1. Capture old label rect + FROM button rect BEFORE any DOM change
      const oldLabelRect = oldLabel ? oldLabel.getBoundingClientRect() : null;
      const fromRect     = oldBtn.getBoundingClientRect();
      const fromW        = fromRect.width;
      const fromH        = fromRect.height;

      // 2. Switch class with NO label freeze — layout is clean for TO snapshot
      oldBtn.classList.remove('proto-toggle__btn--active');
      btn.classList.add('proto-toggle__btn--active');

      // 3. Measure AFTER reflow (re-take cRect in case toggle shifted)
      const cRect  = toggleEl.getBoundingClientRect();
      const toRect = btn.getBoundingClientRect();
      const toLeft = toRect.left - cRect.left;
      const toTop  = toRect.top  - cRect.top;
      const toW    = toRect.width;
      const toH    = toRect.height;

      // 4. Direction + FLIP delta in viewport space
      const fromCenterVP = fromRect.left + fromW / 2;
      const toCenterVP   = toRect.left   + toW  / 2;
      const goingRight   = toCenterVP > fromCenterVP;
      const dx           = fromCenterVP - toCenterVP;
      const scaleX       = fromW / toW;

      // 5. Commit pill to final position/size
      pill.style.left   = `${toLeft}px`;
      pill.style.top    = `${toTop}px`;
      pill.style.width  = `${toW}px`;
      pill.style.height = `${toH}px`;

      // 6. Pill — gentle fluid-enter glide
      pill.getAnimations().forEach(a => a.cancel());
      const pillAnim = pill.animate([
        { transform: `translateX(${dx}px) scaleX(${scaleX})` },
        { transform: 'translateX(0) scaleX(1)' },
      ], { duration: 380, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'none' });
      pillAnim.onfinish = () => { pill.style.transform = ''; };

      // 7. Old label exit — quick fade out (no layout impact)
      if (oldLabel) {
        oldLabel.getAnimations().forEach(a => a.cancel());
        oldLabel.animate(
          [{ opacity: 1 }, { opacity: 0 }],
          { duration: 120, easing: 'cubic-bezier(0.4, 0, 1, 0.8)', fill: 'none' }
        );
      }

      // 8. New label enter — slides in from destination side, fades in
      if (newLabel) {
        const enterX = goingRight ? 7 : -7;
        newLabel.getAnimations().forEach(a => a.cancel());
        newLabel.animate([
          { transform: `translateX(${enterX}px)`, opacity: 0 },
          { transform: 'translateX(0)',            opacity: 1 },
        ], { duration: 320, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'none', delay: 30 });
      }
    } else {
      oldBtn.classList.remove('proto-toggle__btn--active');
      btn.classList.add('proto-toggle__btn--active');
    }

    const isEntity = btn.dataset.toggleVal === 'entity';
    const entitySub = document.querySelector('[data-entity-sub]');
    setEntitySubVisible(entitySub, isEntity);
    document.querySelectorAll('[data-individual-only]').forEach(el => {
      el.classList.toggle('proto-field--hidden', isEntity);
    });
  });

  // Click-to-edit — commit helper
  function commitEdit(field) {
    const span  = field.querySelector('.proto-field__value');
    const input = field.querySelector('.proto-field__input');
    if (!span || !input) return;
    field.classList.remove('proto-field--editing');
    const newVal = input.value.trim();
    if (newVal) {
      span.textContent = newVal;
      span.classList.add('proto-field__value--saved');
      setTimeout(() => span.classList.remove('proto-field__value--saved'), 700);
      // Recalc LTV if a relevant field changed
      const calcKey = span.dataset.calcKey;
      if (calcKey === 'loanAmount' || calcKey === 'purchasePrice') recalcLTV();
    }
  }

  // Click on editable value → enter edit mode (only when edit mode is active)
  document.addEventListener('click', e => {
    const span = e.target.closest('.proto-field--editable .proto-field__value');
    if (span) {
      if (!document.querySelector('[data-edit-mode]')) return;
      const field = span.closest('.proto-field');
      if (field.classList.contains('proto-field--editing')) return;
      field.classList.add('proto-field--editing');
      const input = field.querySelector('.proto-field__input');
      if (input) { input.focus(); input.select(); }
      return;
    }
    // Click outside editing field → commit
    document.querySelectorAll('.proto-field--editing').forEach(field => {
      if (!field.contains(e.target)) commitEdit(field);
    });
  });

  // Enter = commit, Escape = cancel
  document.addEventListener('keydown', e => {
    const field = e.target.closest('.proto-field--editing');
    if (!field) return;
    if (e.key === 'Enter') { e.preventDefault(); commitEdit(field); }
    if (e.key === 'Escape') {
      const span  = field.querySelector('.proto-field__value');
      const input = field.querySelector('.proto-field__input');
      if (span && input) input.value = span.textContent;
      field.classList.remove('proto-field--editing');
    }
  });
}

/** Proto accordion — height only (no scale); smooth, slow, non-bouncy. */
const PROTO_SECTION_MS_OPEN = 600;
const PROTO_SECTION_MS_CLOSE = 420;
const PROTO_SECTION_EASE_OPEN = 'cubic-bezier(0.4, 0, 0.2, 1)';
const PROTO_SECTION_EASE_CLOSE = 'cubic-bezier(0.4, 0, 0.25, 1)';

const protoSectionRunningAnims = new WeakMap();

function protoSectionCancelAnims(section) {
  const list = protoSectionRunningAnims.get(section);
  if (!list) return;
  list.forEach(a => {
    try {
      a.cancel();
    } catch (_) { /* ignore */ }
  });
  protoSectionRunningAnims.delete(section);
}

function protoSectionAnimateBodyMaxHeightOpen(body, h) {
  return body.animate(
    [{ maxHeight: '0px' }, { maxHeight: `${h}px` }],
    { duration: PROTO_SECTION_MS_OPEN, easing: PROTO_SECTION_EASE_OPEN, fill: 'none' }
  );
}

function protoSectionAnimateBodyMaxHeightClose(body, h) {
  return body.animate(
    [{ maxHeight: `${h}px` }, { maxHeight: '0px' }],
    { duration: PROTO_SECTION_MS_CLOSE, easing: PROTO_SECTION_EASE_CLOSE, fill: 'none' }
  );
}

function bindSectionCollapse() {
  document.addEventListener('click', e => {
    const chevron = e.target.closest('.proto-section__chevron');
    const head = chevron ? chevron.closest('[data-collapse-head]') : e.target.closest('[data-collapse-head]');
    if (!head) return;
    if (!chevron && e.target.closest('button, a, [data-toggle]')) return;

    const section = head.closest('.proto-section');
    if (!section || section.classList.contains('proto-section--muted')) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const body = section.querySelector('.proto-section__body');
    if (!body) return;

    const expanded = section.getAttribute('aria-expanded') !== 'false';
    const willCollapse = expanded;

    if (reduceMotion) {
      protoSectionCancelAnims(section);
      if (willCollapse) {
        section.classList.add('proto-section--collapsed');
        section.setAttribute('aria-expanded', 'false');
      } else {
        section.classList.remove('proto-section--collapsed');
        section.setAttribute('aria-expanded', 'true');
      }
      body.style.maxHeight = '';
      return;
    }

    if (willCollapse) {
      if (section.getAttribute('aria-expanded') === 'false') return;
      const h = body.scrollHeight;
      if (h <= 0) {
        section.classList.add('proto-section--collapsed');
        section.setAttribute('aria-expanded', 'false');
        return;
      }
      protoSectionCancelAnims(section);
      section.setAttribute('aria-expanded', 'false');
      const aH = protoSectionAnimateBodyMaxHeightClose(body, h);
      protoSectionRunningAnims.set(section, [aH]);

      aH.finished
        .catch(() => {})
        .then(() => {
          protoSectionRunningAnims.delete(section);
          section.classList.add('proto-section--collapsed');
          body.style.maxHeight = '';
        });
      return;
    }

    // expand
    protoSectionCancelAnims(section);
    section.setAttribute('aria-expanded', 'true');
    section.classList.remove('proto-section--collapsed');
    body.style.maxHeight = '0px';
    void body.offsetHeight;
    body.style.maxHeight = 'none';
    const h = body.scrollHeight;
    body.style.maxHeight = '0px';
    void body.offsetHeight;

    const aH = protoSectionAnimateBodyMaxHeightOpen(body, h);
    protoSectionRunningAnims.set(section, [aH]);

    aH.finished
      .catch(() => {})
      .then(() => {
        protoSectionRunningAnims.delete(section);
        body.style.maxHeight = '';
      });
  });
}

function bindPropertyTabs() {
  function selectPropItem(idx) {
    const prop = PROPERTIES[idx];
    if (!prop) return;

    // Highlight active sidebar item
    document.querySelectorAll('[data-prop-item]').forEach(el => {
      el.classList.toggle('proto-prop-item--active', parseInt(el.dataset.propItem, 10) === idx);
    });

    // Swap field values across all input types
    document.querySelectorAll('[data-prop]').forEach(el => {
      const key = el.dataset.prop;
      if (prop[key] === undefined) return;
      el.textContent = prop[key];
      const field  = el.closest('.proto-field');
      if (!field) return;
      const select   = field.querySelector('.proto-field__select');
      const textarea = field.querySelector('.proto-field__textarea');
      const currIn   = field.querySelector('.proto-field__currency-wrap .proto-field__input');
      const input    = field.querySelector(':scope > .proto-field__input');
      if (select)        select.value   = prop[key];
      else if (textarea) textarea.value = prop[key];
      else if (currIn)   currIn.value   = prop[key].replace(/[^0-9.]/g, '');
      else if (input)    input.value    = prop[key];
    });

    // Update controls
    const controlsEl = document.querySelector('[data-prop-controls]');
    if (controlsEl) controlsEl.innerHTML = buildPropControlsHtml(idx);

    // Show/hide Investment Details
    const investSub = document.querySelector('[data-investment-sub]');
    if (investSub) investSub.classList.toggle('proto-sub--hidden', prop.occupancy !== 'Investment');

    recalcLTV();
  }

  // Sidebar item click
  document.addEventListener('click', e => {
    const item = e.target.closest('[data-prop-item]');
    if (!item) return;
    selectPropItem(parseInt(item.dataset.propItem, 10));
  });

  // Set as Primary
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-set-primary]');
    if (!btn) return;
    const idx = parseInt(btn.dataset.setPrimary, 10);
    PROPERTIES.forEach(p => { p.primary = false; });
    PROPERTIES[idx].primary = true;
    const sidebarEl = document.querySelector('[data-prop-sidebar]');
    if (sidebarEl) sidebarEl.innerHTML = buildPropSidebarHtml(idx);
    const controlsEl = document.querySelector('[data-prop-controls]');
    if (controlsEl) controlsEl.innerHTML = buildPropControlsHtml(idx);
  });

  // Remove property
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-rm-prop]');
    if (!btn) return;
    const idx = parseInt(btn.dataset.rmProp, 10);
    if (PROPERTIES.length <= 1) return;
    PROPERTIES.splice(idx, 1);
    PROPERTIES.forEach((p, i) => { p.id = i; });
    if (!PROPERTIES.some(p => p.primary)) PROPERTIES[0].primary = true;
    const sidebarEl = document.querySelector('[data-prop-sidebar]');
    if (sidebarEl) sidebarEl.innerHTML = buildPropSidebarHtml(0);
    selectPropItem(0);
    const countNum = document.querySelector('.proto-prop-head__num');
    if (countNum) countNum.textContent = PROPERTIES.length;
  });

  // Add property (prototype: clones first property with new address)
  document.addEventListener('click', e => {
    if (!e.target.closest('.proto-prop-add-item')) return;
    const newProp = { ...PROPERTIES[0], id: PROPERTIES.length, primary: false,
      tab: 'New Property', street: 'New Property', street2: '—', city: '—', state: '—', zip: '—' };
    PROPERTIES.push(newProp);
    const sidebarEl = document.querySelector('[data-prop-sidebar]');
    if (sidebarEl) sidebarEl.innerHTML = buildPropSidebarHtml(PROPERTIES.length - 1);
    selectPropItem(PROPERTIES.length - 1);
    const countNum = document.querySelector('.proto-prop-head__num');
    if (countNum) countNum.textContent = PROPERTIES.length;
  });
}

function bindEditMode() {
  const main = document.querySelector('.proto-main');
  if (!main) return;

  const wrap       = document.querySelector('[data-proto-mode-wrap]');
  const trigger    = wrap?.querySelector('[data-proto-mode-trigger]');
  const menu       = wrap?.querySelector('[data-proto-mode-menu]');

  /** Tooltip hide — assigned after tooltip node exists. */
  let hideTooltip = () => {};

  function syncModeDropdownUI(activeVal) {
    if (!menu || !wrap) return;
    const m = PROTO_PAGE_MODES.find(x => x.val === activeVal) || PROTO_PAGE_MODES[0];
    const triggerLbl = wrap.querySelector('[data-mode-trigger-label]');
    const iconEl     = wrap.querySelector('[data-mode-trigger-icon]');
    if (triggerLbl) triggerLbl.textContent = m.triggerLabel;
    if (iconEl) iconEl.innerHTML = m.icon ? iconSvg(m.icon) : '';
    menu.querySelectorAll('.loans-dropdown__item').forEach(opt => {
      opt.classList.toggle('loans-dropdown__item--active', opt.dataset.modeVal === activeVal);
    });
  }

  function applyMainMode(val) {
    if (!val) return;
    if (val === 'view') {
      hideTooltip();
      if (!main.hasAttribute('data-view-mode')) {
        document.querySelectorAll('.proto-field--editable [contenteditable]').forEach(s => { s.contentEditable = 'false'; });
        main.removeAttribute('data-edit-mode');
        main.setAttribute('data-view-mode', '');
      }
    } else if (val === 'edit') {
      hideTooltip();
      if (main.hasAttribute('data-view-mode')) {
        main.removeAttribute('data-view-mode');
        document.querySelectorAll('.proto-field--editable .proto-field__value').forEach(s => { s.contentEditable = 'true'; });
      }
    }
    syncModeDropdownUI(val);
  }

  let protoModeApi = null;
  function exitViewMode() {
    applyMainMode('edit');
    if (protoModeApi && protoModeApi.isOpen()) protoModeApi.closeMenu();
  }

  document.querySelectorAll('.proto-field--editable [contenteditable]').forEach(s => { s.contentEditable = 'false'; });
  syncModeDropdownUI('view');

  if (wrap && trigger && menu && typeof mountAmoebaDropdownPair === 'function') {
    protoModeApi = mountAmoebaDropdownPair(trigger, menu);
    menu.querySelectorAll('.loans-dropdown__item').forEach(opt => {
      opt.addEventListener('click', e => {
        e.stopPropagation();
        if (opt.classList.contains('loans-dropdown__item--disabled')) return;
        applyMainMode(opt.dataset.modeVal);
        protoModeApi.closeMenu();
      });
    });
  }

  // ── View-mode tooltip ────────────────────────────────────────────────────────
  const tooltip = document.createElement('div');
  tooltip.className = 'proto-view-tooltip';
  tooltip.innerHTML = `<span class="proto-view-tooltip__text">Enable edit mode to make changes</span>
    <button class="proto-view-tooltip__btn">Enable editing</button>`;
  document.body.appendChild(tooltip);

  function showTooltip(anchorEl) {
    const r = anchorEl.getBoundingClientRect();
    tooltip.style.left = `${r.left}px`;
    tooltip.style.top  = `${r.bottom + 6}px`;
    tooltip.classList.add('proto-view-tooltip--visible');
  }
  hideTooltip = () => {
    tooltip.classList.remove('proto-view-tooltip--visible');
  };

  tooltip.querySelector('.proto-view-tooltip__btn').addEventListener('click', (e) => {
    e.stopPropagation();
    hideTooltip();
    if (main.hasAttribute('data-view-mode')) exitViewMode();
  });

  document.addEventListener('click', (e) => {
    if (!main.hasAttribute('data-view-mode')) return;
    const field = e.target.closest('.proto-field--editable');
    if (field) {
      e.preventDefault();
      showTooltip(e.target.closest('.proto-field__value') || field);
      return;
    }
    if (!tooltip.contains(e.target)) hideTooltip();
  }, true);

  function getFieldInputs(field) {
    return {
      select:   field.querySelector('.proto-field__select'),
      textarea: field.querySelector('.proto-field__textarea'),
      currIn:   field.querySelector('.proto-field__currency-wrap .proto-field__input'),
      input:    field.querySelector(':scope > .proto-field__input'),
    };
  }

  function syncToInput(field) {
    const span = field.querySelector('.proto-field__value');
    const val  = span?.textContent.trim() || '';
    const { select, textarea, currIn, input } = getFieldInputs(field);
    if (select)        select.value   = val;
    else if (textarea) textarea.value = val;
    else if (currIn)   currIn.value   = val.replace(/[^0-9.]/g, '');
    else if (input)    input.value    = val;
  }

  function commitToSpan(field) {
    const span = field.querySelector('.proto-field__value');
    const { select, textarea, currIn, input } = getFieldInputs(field);
    let newVal = '';
    if (select   && select.value)       newVal = select.value;
    else if (textarea)                  newVal = textarea.value.trim();
    else if (currIn && currIn.value.trim()) newVal = formatCurrency(currIn.value);
    else if (input  && input.value.trim())  newVal = input.value.trim();
    if (newVal && span) {
      span.textContent = newVal;
      const calcKey = span.dataset.calcKey;
      if (calcKey === 'loanAmount' || calcKey === 'purchasePrice') recalcLTV();
    }
    field.classList.remove('proto-field--editing');
  }

  // Live recalc — contenteditable spans (loan amount / purchase price)
  document.addEventListener('input', e => {
    const span = e.target.closest('.proto-field__value[contenteditable]');
    if (!span) return;
    const calcKey = span.dataset.calcKey;
    if (calcKey === 'loanAmount' || calcKey === 'purchasePrice') recalcLTV();
  });

  // Live sync — selects
  document.addEventListener('change', e => {
    if (!main.hasAttribute('data-edit-mode')) return;
    const select = e.target.closest('.proto-field__select');
    if (!select) return;
    const field = select.closest('.proto-field');
    const span  = field?.querySelector('.proto-field__value');
    if (span && select.value) {
      span.textContent = select.value;
      // Occupancy change → show/hide Investment Details
      if (span.dataset.prop === 'occupancy') {
        const investSub = document.querySelector('[data-investment-sub]');
        if (investSub) investSub.classList.toggle('proto-sub--hidden', select.value !== 'Investment');
      }
    }
  });
}

function initTogglePills() {
  document.querySelectorAll('[data-toggle]').forEach(toggleEl => {
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

function bindInfoTooltips() {
  const wrap = document.createElement('div');
  wrap.className = 'proto-info-tooltip-wrap';
  wrap.style.display = 'none';
  document.body.appendChild(wrap);

  let activeBtn = null;

  document.addEventListener('click', e => {
    const btn = e.target.closest('.proto-field__info');
    if (btn) {
      e.stopPropagation();
      if (activeBtn === btn && wrap.style.display !== 'none') {
        wrap.style.display = 'none';
        activeBtn = null;
        return;
      }
      activeBtn = btn;
      wrap.innerHTML = buildInfoTooltipHtml(btn.dataset.infoKey);
      wrap.style.display = 'block';

      const rect = btn.getBoundingClientRect();
      const tipW = 288;
      let left = rect.left + rect.width / 2 - tipW / 2;
      left = Math.max(8, Math.min(left, window.innerWidth - tipW - 8));
      let top = rect.bottom + 8;
      if (top + 300 > window.innerHeight) top = rect.top - 300 - 8;
      wrap.style.left = left + 'px';
      wrap.style.top  = top  + 'px';
      return;
    }
    if (!wrap.contains(e.target)) {
      wrap.style.display = 'none';
      activeBtn = null;
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { wrap.style.display = 'none'; activeBtn = null; }
  });
}

// ─── Loan Card Drag & Drop ────────────────────────────────────────────────────

function bindLoanDragDrop() {
  const panel = document.querySelector('.proto-card .loans-panel');
  if (!panel) return;

  const LONG_PRESS_MS = 300;

  let pressTimer   = null;
  let dragItem     = null;   // the .loan-list-item being dragged
  let ghost        = null;   // the floating clone
  let ghostOffX    = 0;
  let ghostOffY    = 0;
  let activeTarget = null;   // the .loan-stage-group__body currently hovered
  let dragging     = false;

  /* ── helpers ── */

  function getPos(e) {
    const t = e.touches ? e.touches[0] : e;
    return { x: t.clientX, y: t.clientY };
  }

  function allBodies() {
    return [...panel.querySelectorAll('.loan-stage-group__body')];
  }

  function bodyForPoint(x, y) {
    // Temporarily hide ghost so elementFromPoint works
    if (ghost) ghost.style.pointerEvents = 'none';
    const el = document.elementFromPoint(x, y);
    if (ghost) ghost.style.pointerEvents = '';
    if (!el) return null;
    return el.closest('.loan-stage-group__body') || null;
  }

  function updateCount(group) {
    const countEl = group.querySelector('.loan-stage-group__count');
    if (!countEl) return;
    const n = group.querySelectorAll('.loan-list-item').length;
    countEl.textContent = n;
  }

  function updateGroupState(group) {
    const body = group.querySelector('.loan-stage-group__body');
    if (!body) return;
    const hasItems = body.querySelector('.loan-list-item') !== null;
    // keep expanded state — only update max-height when open
    if (group.classList.contains('loan-stage-group--expanded')) {
      body.style.maxHeight = body.scrollHeight + 'px';
      // let it settle then clear so it grows naturally
      requestAnimationFrame(() => { body.style.maxHeight = 'none'; });
    }
  }

  /* ── start drag ── */

  function startDrag(item, x, y) {
    dragging  = true;
    dragItem  = item;
    // Prevent text selection across the whole page while dragging
    document.body.style.userSelect       = 'none';
    document.body.style.webkitUserSelect = 'none';

    // Mark original as ghost-source
    item.classList.add('loan-list-item--dragging');

    // Build visual clone
    const rect = item.getBoundingClientRect();
    ghostOffX  = x - rect.left;
    ghostOffY  = y - rect.top;

    ghost = item.cloneNode(true);
    ghost.classList.remove('loan-list-item--dragging');
    ghost.classList.add('loan-drag-ghost');
    ghost.style.width  = rect.width  + 'px';
    ghost.style.height = rect.height + 'px';
    ghost.style.left   = (x - ghostOffX) + 'px';
    ghost.style.top    = (y - ghostOffY) + 'px';
    document.body.appendChild(ghost);
  }

  /* ── move ── */

  function onMove(x, y) {
    if (!dragging) return;
    ghost.style.left = (x - ghostOffX) + 'px';
    ghost.style.top  = (y - ghostOffY) + 'px';

    const body = bodyForPoint(x, y);

    if (body !== activeTarget) {
      if (activeTarget) activeTarget.classList.remove('loan-stage-group__body--drop-target');
      activeTarget = body && body !== dragItem.parentElement ? body : null;
      if (activeTarget) activeTarget.classList.add('loan-stage-group__body--drop-target');
    }
  }

  /* ── end drag ── */

  function endDrag() {
    if (!dragging) return;
    dragging = false;

    // Move item to new body
    if (activeTarget) {
      const srcGroup  = dragItem.parentElement?.closest('.loan-stage-group');
      const destGroup = activeTarget.closest('.loan-stage-group');

      activeTarget.appendChild(dragItem);

      // Re-bind click-to-select for moved item (panel-wide handler still works)
      // Update counts
      if (srcGroup)  updateCount(srcGroup);
      if (destGroup) updateCount(destGroup);
      if (srcGroup)  updateGroupState(srcGroup);
      if (destGroup) updateGroupState(destGroup);

      activeTarget.classList.remove('loan-stage-group__body--drop-target');
    }

    // Restore text selection
    document.body.style.userSelect       = '';
    document.body.style.webkitUserSelect = '';
    // Clean up
    dragItem.classList.remove('loan-list-item--dragging');
    ghost.remove();
    ghost        = null;
    dragItem     = null;
    activeTarget = null;
  }

  function cancel() {
    clearTimeout(pressTimer);
    pressTimer = null;
    if (!dragging) return;
    // Cancel drag without dropping
    if (activeTarget) activeTarget.classList.remove('loan-stage-group__body--drop-target');
    dragItem?.classList.remove('loan-list-item--dragging');
    ghost?.remove();
    // Restore text selection
    document.body.style.userSelect       = '';
    document.body.style.webkitUserSelect = '';
    ghost = null; dragItem = null; activeTarget = null; dragging = false;
  }

  /* ── event wiring ── */

  panel.addEventListener('mousedown', (e) => {
    const item = e.target.closest('.loan-list-item');
    if (!item) return;
    const { x, y } = getPos(e);
    pressTimer = setTimeout(() => { startDrag(item, x, y); }, LONG_PRESS_MS);
  });

  panel.addEventListener('touchstart', (e) => {
    const item = e.target.closest('.loan-list-item');
    if (!item) return;
    const { x, y } = getPos(e);
    pressTimer = setTimeout(() => { startDrag(item, x, y); }, LONG_PRESS_MS);
  }, { passive: true });

  document.addEventListener('mousemove', (e) => {
    if (pressTimer && !dragging) { clearTimeout(pressTimer); pressTimer = null; }
    if (!dragging) return;
    e.preventDefault();
    const { x, y } = getPos(e);
    onMove(x, y);
  });

  document.addEventListener('touchmove', (e) => {
    if (!dragging) return;
    const { x, y } = getPos(e);
    onMove(x, y);
  }, { passive: true });

  document.addEventListener('mouseup', () => {
    clearTimeout(pressTimer); pressTimer = null;
    endDrag();
  });

  document.addEventListener('touchend', () => {
    clearTimeout(pressTimer); pressTimer = null;
    endDrag();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') cancel();
  });
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('app').innerHTML = buildApp();
  if (typeof initLpStatusOutsideClose === 'function') initLpStatusOutsideClose();
  initTogglePills();
  bindInteractions();
  bindResizeHandle();
  bindBorrowerHeader();
  bindEditMode();
  bindFormInteractions();
  bindPropertyTabs();
  bindSectionCollapse();
  bindInfoTooltips();

  // Show edit bar fade only when content is scrolled
  const scrollEl = document.querySelector('.proto-main__scroll');
  const editBar   = document.querySelector('.proto-edit-bar');
  if (scrollEl && editBar) {
    scrollEl.addEventListener('scroll', () => {
      editBar.classList.toggle('proto-edit-bar--scrolled', scrollEl.scrollTop > 4);
    }, { passive: true });
  }

  // Mount loans panel interactivity (expand/collapse, pill dropdown, selection)
  const loansPanelEl = document.querySelector('.proto-card .loans-panel');
  if (loansPanelEl) mountLoansPanelInteractive(loansPanelEl);
  bindLoanDragDrop();

  // Loans panel body top-fade on scroll
  const loansPanelBody = document.querySelector('.proto-card .loans-panel__body');
  if (loansPanelBody) {
    loansPanelBody.addEventListener('scroll', () => {
      loansPanelBody.classList.toggle('loans-panel__body--scrolled', loansPanelBody.scrollTop > 4);
    }, { passive: true });
  }
});
