'use strict';

// ─── Data ─────────────────────────────────────────────────────────────────────

/** Overview edit-bar modes (dropdown). `triggerLabel` = pill (Figma Button/Primary); `menuLabel` = menu row. */
const PROTO_PAGE_MODES = [
  { val: 'view', label: 'View', menuLabel: 'Viewing', triggerLabel: 'Viewing', icon: 'eye-open' },
  { val: 'edit', label: 'Edit', menuLabel: 'Editing', triggerLabel: 'Editing', icon: 'pencil' },
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

/** Set true to allow the bolt to open Manage Conditions; false keeps it visible but inert. */
const PROTO_CONDITIONS_ENTRY_ENABLED = true;

function buildTopBar() {
  const tabsHtml = tabs.map(t => `
    <button class="proto-tab${t.active ? ' proto-tab--active' : ''}" data-tab="${t.id}">
      <span class="proto-tab__label">${t.label}</span>
      ${t.closeable ? `<span class="proto-tab__close" data-close="${t.id}">${iconSvg('x-mark')}</span>` : ''}
    </button>`).join('');

  // Bolt opens condition-templates modal (Current Design System icon — system.js `bolt`)
  const conditionsBtn = PROTO_CONDITIONS_ENTRY_ENABLED
    ? buildBtnPreviewHtml({ id: 's1', icons: ['bolt'] })
        .replace('<button class="btn btn--s1" tabindex="-1"', '<button class="btn btn--s1 proto-conditions-btn" tabindex="0" aria-label="Condition templates"')
    : buildBtnPreviewHtml({ id: 's1', icons: ['bolt'] })
        .replace('<button class="btn btn--s1" tabindex="-1"', '<button class="btn btn--s1 proto-conditions-btn proto-conditions-btn--disabled" disabled aria-disabled="true" aria-label="Condition templates (not available)" tabindex="-1"');
  // Use the exact same buildBtnPreviewHtml() from platform.js — zero duplication
  const searchBtn = buildBtnPreviewHtml({ id: 's1', icons: ['magnifying-glass'] });
  const bellBtn   = buildBtnPreviewHtml({ id: 's1', icons: ['bell'] });

  // Panel-toggle button — matches Figma node 8:312
  // The inner bar slides from right-narrow (closed) to center-wide (open) on click
  // NOTE: raw SVG required — animated .proto-panel-toggle__bar element prevents iconSvg() usage
  const panelBtn = `<button class="btn btn--s1 proto-panel-toggle" data-panel-open="false" tabindex="-1" aria-label="Toggle panel">
    <div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector">
      <svg width="100%" height="100%" viewBox="0 0 20 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2.6" y="1.35" width="14.8" height="12.3" rx="3.75"
              stroke="var(--stroke-0,#333)" stroke-width="1.2"/>
        <rect class="proto-panel-toggle__bar"
              x="14.35" y="4.375" width="1.45" height="6.25" rx="1.2"
              fill="var(--stroke-0,#333)"/>
      </svg>
    </div></div></div>
  </button>`;

  return `
    <div class="proto-topbar">
      <div class="proto-topbar__tabs">${tabsHtml}</div>
      <div class="proto-topbar__actions">
        ${conditionsBtn}
        ${searchBtn}
        ${bellBtn}
        ${panelBtn}
      </div>
    </div>`;
}

// ─── Pipeline loan details (main panel) — keyed by encodeLoanKey(name) ────────
// Default matches sidebar/board selection (Michael Chen / Underwriting).
const DEFAULT_LOAN_DETAIL_KEY = 'michael-chen';

/** Same rules as platform `encodeLoanKey` — list row keys must match. */
function loanKeyFromName(name) {
  if (!name || typeof name !== 'string') return '';
  return name.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Synced with board + system.js list rows; each line is a distinct “real” scenario. */
const LOAN_DETAIL_ENTRIES = [
  /* Application */
  { name: 'Laura Lee',     addressLine: '1847 Union St #4, San Francisco, CA',     statusDot: 'green', statusLabel: 'Active',  stage: 'Application',  amount: '$372,500', purpose: 'Purchase',  loanProduct: 'Fix & Flip',     term: '12 months', purchase: '$498,000', arv: '$655,000', rate: '11.75%', ltv: '74.8%', fico: '752' },
  { name: 'James Wilson',  addressLine: '2200 Lakeshore Dr, Oakland, CA',         statusDot: 'green', statusLabel: 'Active',  stage: 'Application',  amount: '$418,000', purpose: 'Refinance', loanProduct: 'DSCR Rental',    term: '30 yr fixed', purchase: '—',        arv: '—',        rate: '8.40%',  ltv: '68.2%', fico: '701' },
  { name: 'Emily Davis',   addressLine: '910 Congress Ave, Austin, TX',             statusDot: 'green', statusLabel: 'Active',  stage: 'Application',  amount: '$565,000', purpose: 'Construction', loanProduct: 'Ground-up',   term: '18 months', purchase: '$210,000', arv: '$890,000', rate: '12.10%', ltv: '63.5%', fico: '736' },
  { name: 'Anna Martinez', addressLine: '44 Pearl St, Denver, CO',                 statusDot: 'amber', statusLabel: 'On Hold', stage: 'Application',  amount: '$292,500', purpose: 'Bridge',    loanProduct: 'Bridge',         term: '9 months',  purchase: '$340,000', arv: '$410,000', rate: '10.50%', ltv: '86.0%', fico: '684' },
  /* Underwriting */
  { name: 'Michael Chen',  addressLine: '77 Geary St, San Francisco, CA',           statusDot: 'green', statusLabel: 'Active',  stage: 'Underwriting', amount: '$518,750', purpose: 'Refinance', loanProduct: 'Bridge',         term: '18 months', purchase: '$640,000', arv: '—',        rate: '11.25%', ltv: '81.1%', fico: '722' },
  { name: 'Sarah Parker',  addressLine: '15 Magnolia Ln, Sacramento, CA',          statusDot: 'green', statusLabel: 'Active',  stage: 'Underwriting', amount: '$305,000', purpose: 'Purchase',  loanProduct: 'Fix & Flip',     term: '12 months', purchase: '$385,000', arv: '$495,000', rate: '12.00%', ltv: '79.2%', fico: '768' },
  { name: 'Robert Torres', addressLine: '400 Brickell Ave, Miami, FL',               statusDot: 'green', statusLabel: 'Active',  stage: 'Underwriting', amount: '$712,000', purpose: 'Cash-out',  loanProduct: 'Rental 5+',      term: '24 months', purchase: '—',        arv: '—',        rate: '9.65%',  ltv: '72.4%', fico: '695' },
  { name: 'Jessica Kim',   addressLine: '3300 NE Sandy Blvd, Portland, OR',          statusDot: 'amber', statusLabel: 'On Hold', stage: 'Underwriting', amount: '$238,900', purpose: 'Purchase',  loanProduct: 'Fix & Flip',     term: '12 months', purchase: '$312,000', arv: '$398,000', rate: '11.90%', ltv: '76.6%', fico: '658' },
  /* Closing */
  { name: 'David Brown',   addressLine: '88 King St, Charleston, SC',               statusDot: 'green', statusLabel: 'Active',  stage: 'Closing',      amount: '$445,200', purpose: 'Cash-out',  loanProduct: 'Bridge',         term: '14 months', purchase: '$520,000', arv: '$575,000', rate: '10.80%', ltv: '85.6%', fico: '734' },
  { name: 'Rachel Green',  addressLine: '2601 N Sheffield Ave, Chicago, IL',         statusDot: 'green', statusLabel: 'Active',  stage: 'Closing',      amount: '$593,000', purpose: 'Purchase',  loanProduct: 'Fix & Flip',     term: '12 months', purchase: '$720,000', arv: '$925,000', rate: '12.35%', ltv: '82.4%', fico: '781' },
  { name: 'Mark Johnson',  addressLine: '1020 Boren Ave, Seattle, WA',               statusDot: 'green', statusLabel: 'Active',  stage: 'Closing',      amount: '$401,500', purpose: 'Refinance', loanProduct: 'Bridge',         term: '12 months', purchase: '—',        arv: '—',        rate: '11.05%', ltv: '77.9%', fico: '709' },
  { name: 'Lisa Wong',     addressLine: '9 Mercer St, New York, NY',                 statusDot: 'amber', statusLabel: 'On Hold', stage: 'Closing',      amount: '$287,000', purpose: 'Purchase',  loanProduct: 'Rental',         term: '30 yr fixed', purchase: '$410,000', arv: '—',        rate: '8.95%',  ltv: '70.0%', fico: '742' },
  /* Funded */
  { name: 'Tom Harris',    addressLine: '5550 Spring Mountain Rd, Las Vegas, NV', statusDot: 'green', statusLabel: 'Active',  stage: 'Funded',       amount: '$625,000', purpose: 'Refinance', loanProduct: 'Bridge',         term: '15 months', purchase: '—',        arv: '—',        rate: '10.25%', ltv: '74.0%', fico: '718' },
  { name: 'Amy Scott',     addressLine: '77 Hemenway St, Boston, MA',                statusDot: 'green', statusLabel: 'Active',  stage: 'Funded',       amount: '$352,400', purpose: 'Purchase',  loanProduct: 'Fix & Flip',     term: '12 months', purchase: '$428,000', arv: '$515,000', rate: '12.20%', ltv: '82.3%', fico: '764' },
  { name: 'Chris Lee',     addressLine: '1900 Pearl St, Boulder, CO',                statusDot: 'green', statusLabel: 'Active',  stage: 'Funded',       amount: '$499,950', purpose: 'Refinance', loanProduct: 'DSCR Rental',    term: '30 yr fixed', purchase: '—',        arv: '—',        rate: '8.55%',  ltv: '69.8%', fico: '733' },
  { name: 'Mia Turner',    addressLine: '402 E Travis St, San Antonio, TX',          statusDot: 'amber', statusLabel: 'On Hold', stage: 'Funded',       amount: '$318,000', purpose: 'Bridge',    loanProduct: 'Bridge',         term: '11 months', purchase: '$365,000', arv: '$420,000', rate: '11.50%', ltv: '87.1%', fico: '671' },
];

/**
 * One adult portrait per row in LOAN_DETAIL_ENTRIES (same order). Curated Unsplash
 * headshots — distinct faces, no duplicates; avoids kid-oriented stock sets.
 */
const BORROWER_PORTRAIT_URLS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=256&h=256&q=80',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&h=256&q=80',
];

function parseMoneyNum(s) {
  if (s == null || s === '' || s === '—') return NaN;
  return parseFloat(String(s).replace(/[^0-9.]/g, ''));
}

function parseAddressLine(line) {
  const parts = String(line || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (parts.length === 0) return { street: '—', city: '—', state: 'CA', zip: '00000' };
  if (parts.length === 1) return { street: parts[0], city: '—', state: 'CA', zip: '94102' };
  const last = parts[parts.length - 1];
  const stateZip = last.split(/\s+/).filter(Boolean);
  const state = stateZip[0] || 'CA';
  const zip = stateZip[1] || `9${String(1000 + (last.length * 17) % 9000).slice(-4)}`;
  const city = parts[parts.length - 2] || '—';
  const street = parts.length > 2 ? parts.slice(0, -2).join(', ') : parts[0];
  return { street, city, state, zip };
}

function slugEmail(name) {
  const parts = String(name || '').trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0]}.${parts[parts.length - 1]}@email.com`;
  return `${parts[0] || 'borrower'}@email.com`;
}

/** Borrower / properties / loan terms / notes for the overview form — tied to each pipeline row. */
function makeLoanFormPayload(e) {
  const key = loanKeyFromName(e.name);
  const seed = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const addr = parseAddressLine(e.addressLine);
  const amountNum = parseMoneyNum(e.amount);
  const purchaseNum = parseMoneyNum(e.purchase);
  const arvNum = parseMoneyNum(e.arv);
  let ltc = '—';
  if (purchaseNum && amountNum) ltc = `${((amountNum / purchaseNum) * 100).toFixed(1)}%`;

  let typeLabel = 'SFR (Single Family)';
  let typeCode = 'SFR';
  let use = 'Fix & Flip';
  let occupancy = 'Investment';
  let units = '1';
  if (/Rental|DSCR/i.test(e.loanProduct)) {
    use = 'Rental';
    if (/5\+/i.test(e.loanProduct)) {
      typeLabel = 'Multi-Family (4)';
      typeCode = 'Multi-Family';
      units = '4';
    }
  }
  if (/Construction|Ground-up/i.test(e.loanProduct)) {
    typeLabel = 'Land';
    typeCode = 'Land';
    use = 'Fix & Flip';
  }
  if (/Condo/i.test(e.addressLine)) {
    typeLabel = 'Condo';
    typeCode = 'Condo';
  }

  const purchaseDisp = e.purchase !== '—' ? e.purchase : formatCurrency(Math.round(amountNum * 1.12));
  const arvDisp = e.arv !== '—' ? e.arv : purchaseNum ? formatCurrency(Math.round(purchaseNum * 1.1)) : formatCurrency(Math.round(amountNum * 1.22));
  let apprDisp = '—';
  if (purchaseNum && arvNum) apprDisp = formatCurrency(Math.round((purchaseNum + arvNum) / 2));
  else if (purchaseNum) apprDisp = formatCurrency(Math.round(purchaseNum * 1.02));
  else if (amountNum) apprDisp = formatCurrency(Math.round(amountNum * 1.08));

  const rentN = purchaseNum || amountNum;
  const rent = formatCurrency(Math.round(rentN * (0.006 + (seed % 5) / 1000)));
  const dscr = (1.08 + (seed % 22) / 100).toFixed(2);

  const streetShort = addr.street.length > 24 ? `${addr.street.slice(0, 22)}…` : addr.street;
  const primaryProp = {
    id: 0,
    primary: true,
    tab: streetShort,
    street: addr.street,
    street2: '—',
    city: addr.city,
    state: addr.state,
    zip: addr.zip,
    type: typeCode,
    typeLabel,
    occupancy,
    use,
    units,
    sqft: String(850 + (seed % 4200)),
    yearBuilt: String(1972 + (seed % 48)),
    purchase: purchaseDisp,
    appraised: apprDisp,
    arv: arvDisp,
    rent,
    dscr,
  };

  const properties = [primaryProp];
  if (seed % 3 !== 0) {
    const secStreet = `${120 + (seed % 780)} ${['Oak', 'Maple', 'Cedar', 'Pine'][seed % 4]} ${['Ln', 'Ave', 'Dr'][seed % 3]}`;
    properties.push({
      id: 1,
      primary: false,
      tab: secStreet,
      street: secStreet,
      street2: '—',
      city: addr.city === '—' ? 'Oakland' : addr.city,
      state: addr.state,
      zip: addr.zip,
      type: 'Condo',
      typeLabel: 'Condo',
      occupancy: 'Investment',
      use: 'Rental',
      units: '1',
      sqft: String(780 + (seed % 400)),
      yearBuilt: String(1998 + (seed % 22)),
      purchase: formatCurrency(Math.round(amountNum * 0.42)),
      appraised: formatCurrency(Math.round(amountNum * 0.45)),
      arv: formatCurrency(Math.round(amountNum * 0.5)),
      rent: formatCurrency(Math.round(amountNum * 0.0032)),
      dscr: (1.02 + (seed % 18) / 100).toFixed(2),
    });
  }

  const purposeMap = { 'Cash-out': 'Cash-Out Refi' };
  const loanPurpose = purposeMap[e.purpose] || e.purpose;

  const last = e.name.split(' ').pop() || 'Borrower';
  const entityMode = seed % 4 === 0 ? 'entity' : 'individual';
  const rateClean = String(e.rate || '').replace(/%/g, '').trim();

  return {
    borrower: {
      entityMode,
      fullName: e.name,
      dob: `${String(1 + (seed % 12)).padStart(2, '0')}/${String(1 + (seed % 27)).padStart(2, '0')}/${1972 + (seed % 30)}`,
      ssnMasked: `••• – •• – ${String(1000 + (seed % 9000)).slice(-4)}`,
      entityLegalName: `${last} Capital LLC`,
      einMasked: '•• – •••••••',
      formationState: addr.state || 'DE',
      signers: e.name,
      email: slugEmail(e.name),
      phone: `(415) 555-${String(1000 + (seed * 13) % 9000).padStart(4, '0')}`,
      fico: e.fico,
      dti: `${32 + (seed % 16)}.${seed % 10}`,
      experience: seed % 2 === 0 ? `${2 + (seed % 8)} completed projects` : `${(seed % 6) + 1} years in rental portfolio`,
    },
    properties,
    loanTerms: {
      loanAmount: e.amount,
      loanPurpose,
      productDisplay: `${e.loanProduct} — ${e.term}`,
      ltv: e.ltv,
      ltc,
      rate: rateClean,
      term: e.term,
      amortization: e.term.includes('30') ? '30-Year Fixed' : e.term.includes('15') ? '15-Year Fixed' : 'Interest Only',
      closingDate: '',
    },
    notes: {
      viewText: `${e.stage} — ${e.name}: ${e.loanProduct} at ${e.rate}. ${e.statusLabel === 'On Hold' ? 'On hold pending outstanding items.' : 'Standard underwriting path; no blockers noted.'}`,
      editedLine: `Last edited by ${['Sarah Chen', 'Jordan M.', 'Alex R.'][seed % 3]} · ${['2 hours ago', 'Yesterday', '3 days ago'][seed % 3]}`,
    },
  };
}

const LOAN_DETAIL_BY_KEY = Object.fromEntries(
  LOAN_DETAIL_ENTRIES.map((e, i) => {
    const key = loanKeyFromName(e.name);
    const form = makeLoanFormPayload(e);
    const portraitUrl = BORROWER_PORTRAIT_URLS[i] || BORROWER_PORTRAIT_URLS[0];
    return [
      key,
      {
        name: e.name,
        addressLine: e.addressLine,
        avatarUrl: portraitUrl,
        status: { dot: e.statusDot, label: e.statusLabel },
        stage: { label: e.stage },
        stats: [
          { label: 'Amount', value: e.amount },
          { label: 'Purpose', value: e.purpose },
          { label: 'Type', value: e.loanProduct },
          { label: 'Term', value: e.term },
          { label: 'Purchase Price', value: e.purchase },
          { label: 'ARV', value: e.arv },
          { label: 'Rate', value: e.rate },
        ],
        flex: [
          { label: 'LTV', value: e.ltv },
          { label: 'FICO', value: e.fico },
        ],
        borrower: form.borrower,
        properties: form.properties,
        loanTerms: form.loanTerms,
        notes: form.notes,
      },
    ];
  })
);

function getLoanDetailForKey(key) {
  if (!key) return LOAN_DETAIL_BY_KEY[DEFAULT_LOAN_DETAIL_KEY];
  return LOAN_DETAIL_BY_KEY[key] || LOAN_DETAIL_BY_KEY[DEFAULT_LOAN_DETAIL_KEY];
}

/** Sidebar / property tab mutations target this loan’s `properties` array. */
let activeLoanDetailKey = DEFAULT_LOAN_DETAIL_KEY;

function getActiveLoanProperties() {
  return getLoanDetailForKey(activeLoanDetailKey).properties;
}

/** Keeps LP stage pill in sync when switching loans (bindBorrowerHeader reads this). */
let protoBorrowerStageIndex = 0;
const PROTO_PIPELINE_STAGES = ['Application', 'Underwriting', 'Closing', 'Funded', 'Post-close'];

function applyMainLoanDetail(key) {
  const resolved = key && LOAN_DETAIL_BY_KEY[key] ? key : DEFAULT_LOAN_DETAIL_KEY;
  activeLoanDetailKey = resolved;
  const d = getLoanDetailForKey(resolved);
  const main = document.querySelector('.proto-main');
  if (!main) return;

  const nameEl = main.querySelector('.proto-borrower-header__name');
  const addrEl = main.querySelector('.proto-borrower-header__address');
  if (nameEl) nameEl.textContent = d.name;
  if (addrEl) addrEl.textContent = d.addressLine;

  const avatarImg = main.querySelector('.proto-borrower-header .profile__avatar img');
  if (avatarImg && d.avatarUrl) avatarImg.src = d.avatarUrl;

  const stageRoot = main.querySelector('.lp-status-stage');
  if (stageRoot) {
    const dotEl = stageRoot.querySelector('.lp-status__dot');
    const statusLab = stageRoot.querySelector('.lp-status__label');
    const stageLab = stageRoot.querySelector('.lp-stage__label');
    if (dotEl) dotEl.className = `lp-status__dot lp-status__dot--${d.status.dot}`;
    if (statusLab) statusLab.textContent = d.status.label;
    if (stageLab) stageLab.textContent = d.stage.label;
  }

  const idx = PROTO_PIPELINE_STAGES.indexOf(d.stage.label);
  protoBorrowerStageIndex = idx >= 0 ? idx : 0;

  const statsRoot = main.querySelector('.proto-loan-stats');
  if (statsRoot) {
    const next = document.createElement('template');
    next.innerHTML = buildLoanStatsHtml(d).trim();
    const el = next.content.firstElementChild;
    if (el) statsRoot.replaceWith(el);
  }

  const scroll = main.querySelector('.proto-main__scroll');
  if (scroll) {
    scroll.innerHTML = buildFormHtml(d);
    initTogglePills();
    if (main.hasAttribute('data-view-mode')) {
      scroll.querySelectorAll('.proto-field--editable [contenteditable]').forEach((s) => { s.contentEditable = 'false'; });
    } else if (main.hasAttribute('data-edit-mode')) {
      scroll.querySelectorAll('.proto-field--editable .proto-field__value').forEach((s) => { s.contentEditable = 'true'; });
    }
  }
}

// ─── Borrower Header ──────────────────────────────────────────────────────────

function buildBorrowerHeader(detail = getLoanDetailForKey(DEFAULT_LOAN_DETAIL_KEY)) {
  const profileHtml     = buildProfileHtml({ favorited: true, avatarUrl: detail.avatarUrl });
  const docBtn          = buildBtnPreviewHtml({ id: 's1', icons: ['document'] });
  const assigneesHtml   = buildAssigneesHtml({ count: 2 });
  const statusStageHtml = buildLpStatusStageInteractiveHtml({
    status: { dot: detail.status.dot, label: detail.status.label },
    stage  : { label: detail.stage.label },
  });

  protoBorrowerStageIndex = Math.max(0, PROTO_PIPELINE_STAGES.indexOf(detail.stage.label));

  return `
    <div class="proto-borrower-header">
      <div class="proto-borrower-header__left">
        ${profileHtml}
        <div class="proto-borrower-header__info">
          <span class="proto-borrower-header__name">${detail.name}</span>
          <span class="proto-borrower-header__address">${detail.addressLine}</span>
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

function buildLoanStatsHtml(detail = getLoanDetailForKey(DEFAULT_LOAN_DETAIL_KEY)) {
  const renderItem = (s) => `
    <div class="proto-loan-stats__item">
      <span class="proto-loan-stats__label">${s.label}</span>
      <span class="proto-loan-stats__value">${s.value}</span>
    </div>`;

  return `
    <div class="proto-loan-stats">
      <div class="proto-loan-stats__pill">
        <div class="proto-loan-stats__items">
          ${detail.stats.map(renderItem).join('')}
        </div>
      </div>
      <div class="proto-loan-stats__pill proto-loan-stats__pill--flex">
        <div class="proto-loan-stats__items">
          ${detail.flex.map(renderItem).join('')}
        </div>
      </div>
    </div>`;
}

// ─── Property helpers (module-level so interactions can call them) ────────────

function buildPropSidebarHtml(activeIdx = 0, props = getActiveLoanProperties()) {
  const items = props.map((p, i) => `
    <button type="button" class="proto-prop-item${i === activeIdx ? ' proto-prop-item--active' : ''}" data-prop-item="${i}">
      <div class="proto-prop-item__info">
        <span class="proto-prop-item__addr">${p.street}</span>
        <span class="proto-prop-item__price">${p.purchase}</span>
      </div>
      <span class="proto-prop-item__type">${p.type}</span>
    </button>`).join('');
  return items + `<button type="button" class="proto-prop-add-item">${iconSvg('plus')} Add property</button>`;
}

function buildPropControlsHtml(activeIdx, props = getActiveLoanProperties()) {
  const prop = props[activeIdx];
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

function buildFormHtml(detail = getLoanDetailForKey(activeLoanDetailKey)) {
  const propsList = detail.properties || [];
  const p0 = propsList[0];
  const b = detail.borrower;
  const lt = detail.loanTerms;
  const n = detail.notes;
  const isEntityBorrower = b.entityMode === 'entity';
  const toggleEntityIdx = isEntityBorrower ? 1 : 0;

  const f = (label, value, opts = {}) => {
    const itype    = opts.type || 'text';
    const editable = !opts.readonly && !opts.masked && !opts.link;
    const cls = ['proto-field'];
    if (opts.readonly)  cls.push('proto-field--readonly');
    if (opts.span)      cls.push(`proto-field--span-${opts.span}`);
    if (editable)       cls.push('proto-field--editable');
    if (opts.entityHide) cls.push('proto-field--hidden');

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
        ${toggle(['Individual', 'Entity'], toggleEntityIdx)}
      </div>
      ${f('Full legal name', b.fullName, { span: 2, placeholder: "Enter borrower's full legal name" })}
      ${f('Date of birth', b.dob, { type: 'date', individualOnly: true, entityHide: isEntityBorrower })}
      ${f('SSN', b.ssnMasked, { masked: true, individualOnly: true, entityHide: isEntityBorrower })}
    `)}
    ${sub('Entity Details', `
      ${f('Entity legal name',  b.entityLegalName, { span: 2, placeholder: 'Enter entity legal name' })}
      ${f('EIN',                b.einMasked,     { masked: true })}
      ${f('Formation state',    b.formationState,               { type: 'select', options: US_STATES })}
      ${f('Authorized signers', b.signers,        { span: 2, placeholder: 'Add authorized signer name' })}
    `, { hidden: !isEntityBorrower, dataAttr: 'data-entity-sub' })}
    ${sub('Contact', `
      ${f('Email address', b.email, { placeholder: 'email@example.com' })}
      ${f('Phone number',  b.phone,      { placeholder: '(555) 123-4567'   })}
    `)}
    ${sub('Financial Profile', `
      ${f('FICO / Credit score', b.fico,   { type: 'number', meta: 'reported',  infoKey: 'fico', placeholder: '300–850' })}
      ${f('DTI',                 b.dti,  { type: 'number', meta: 'reported',  infoKey: 'dti',  placeholder: '0–100'   })}
      ${f('Experience summary',  b.experience, { type: 'textarea', span: 2, placeholder: "Describe borrower's relevant experience" })}
    `)}`;

  // ── Properties section ───────────────────────────────────────────────────────
  const isInvestment0 = p0 && p0.occupancy === 'Investment';
  const propertiesHtml = `
    <div class="proto-prop-layout">
      <div class="proto-prop-sidebar" data-prop-sidebar>
        ${buildPropSidebarHtml(0, propsList)}
      </div>
      <div class="proto-prop-detail">
        <div class="proto-prop-controls" data-prop-controls>${buildPropControlsHtml(0, propsList)}</div>
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
  const purposeOptions = ['Purchase', 'Refinance', 'Cash-Out Refi', 'Construction', 'Bridge'];
  const loanTermsHtml = `
    ${sub('Core Terms', `
      ${f('Loan amount',  lt.loanAmount,          { type: 'currency', calcKey: 'loanAmount', infoKey: 'loanAmount' })}
      ${f('Loan purpose', lt.loanPurpose,           { type: 'select',  options: purposeOptions })}
      ${f('Product',      lt.productDisplay, { link: true })}
    `)}
    ${sub('Calculated Metrics', `
      ${f('LTV', lt.ltv, { readonly: true, calcKey: 'ltv', infoKey: 'ltv' })}
      ${f('LTC', lt.ltc, { readonly: true, infoKey: 'ltc' })}
    `)}
    ${sub('Rate & Structure', `
      ${f('Rate',        lt.rate,        { type: 'number', placeholder: '0.000'    })}
      ${f('Term',        lt.term,    { placeholder: 'e.g. 12'                  })}
      ${f('Amortization', lt.amortization, { type: 'select', options: ['30-Year Fixed', '15-Year Fixed', 'Interest Only', 'ARM', 'Balloon'] })}
    `)}
    ${sub('Timeline', `
      ${f('Est. closing date', lt.closingDate || '', { type: 'date', span: 2 })}
    `)}`;

  const notesHtml = `
    <div class="proto-section__grid">
      <div class="proto-notes proto-field--span-2">
        <div class="proto-notes__view" data-notes-view>${n.viewText}</div>
        <textarea class="proto-notes__textarea proto-field__textarea" placeholder="Add internal notes for your team..." rows="4"></textarea>
        <div class="proto-notes__footer">
          <span class="proto-notes__staff">Visible to lender staff only — never shared with borrower</span>
          <span class="proto-notes__edited">${n.editedLine}</span>
        </div>
      </div>
    </div>`;

  return `
    <div class="proto-form">
      ${section('Borrower Information', borrowerHtml)}
      ${section('Properties', propertiesHtml, { count: propsList.length, sidebar: true })}
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

// ─── Board View ───────────────────────────────────────────────────────────────

// Mirrors system.js loansPanel.stageGroups — names/keys must stay in sync with LOAN_DETAIL_ENTRIES.
const BOARD_STAGES = [
  {
    label: 'Application', count: 4, expanded: true,
    loans: [
      { name: 'Laura Lee',     amount: '$372,500', loanType: 'Fix & Flip',     time: '3 mins ago',    status: 'Active',  statusKey: 'active',  iconName: 'user'              },
      { name: 'James Wilson',  amount: '$418,000', loanType: 'DSCR Rental',    time: '18 mins ago',   status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
      { name: 'Emily Davis',   amount: '$565,000', loanType: 'Construction',   time: '42 mins ago',   status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
      { name: 'Anna Martinez', amount: '$292,500', loanType: 'Bridge',         time: '2 hours ago',   status: 'On Hold', statusKey: 'on-hold', iconName: 'user'              },
    ],
  },
  {
    label: 'Underwriting', count: 4, expanded: true,
    loans: [
      { name: 'Michael Chen',  amount: '$518,750', loanType: 'Bridge',         time: '24 mins ago',   status: 'Active',  statusKey: 'active',  iconName: 'user',              selected: true },
      { name: 'Sarah Parker',  amount: '$305,000', loanType: 'Fix & Flip',     time: '1 hr ago',      status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
      { name: 'Robert Torres', amount: '$712,000', loanType: 'Rental 5+',      time: '3 hours ago',   status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
      { name: 'Jessica Kim',   amount: '$238,900', loanType: 'Fix & Flip',     time: '6 hours ago',   status: 'On Hold', statusKey: 'on-hold', iconName: 'user'              },
    ],
  },
  {
    label: 'Closing', count: 4, expanded: true,
    loans: [
      { name: 'David Brown',  amount: '$445,200', loanType: 'Bridge',         time: '20 hours ago',  status: 'Active',  statusKey: 'active',  iconName: 'user'              },
      { name: 'Rachel Green', amount: '$593,000', loanType: 'Fix & Flip',     time: '1 day ago',     status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
      { name: 'Mark Johnson', amount: '$401,500', loanType: 'Bridge',         time: '2 days ago',    status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
      { name: 'Lisa Wong',    amount: '$287,000', loanType: 'Rental',         time: '2 days ago',    status: 'On Hold', statusKey: 'on-hold', iconName: 'user'              },
    ],
  },
  {
    label: 'Funded', count: 4, expanded: true,
    loans: [
      { name: 'Tom Harris', amount: '$625,000', loanType: 'Bridge',           time: '4 days ago',    status: 'Active',  statusKey: 'active',  iconName: 'user'              },
      { name: 'Amy Scott',  amount: '$352,400', loanType: 'Fix & Flip',       time: '5 days ago',    status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
      { name: 'Chris Lee',  amount: '$499,950', loanType: 'DSCR Rental',      time: '6 days ago',    status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
      { name: 'Mia Turner', amount: '$318,000', loanType: 'Bridge',           time: '8 days ago',    status: 'On Hold', statusKey: 'on-hold', iconName: 'user'              },
    ],
  },
];

function buildBoardCardHtml(loan) {
  const stateClass  = loan.selected ? ' loan-list-item--selected' : '';
  const userIconSvg = iconSvg(loan.iconName || 'user');
  const keyAttr =
    loan.name && typeof encodeLoanKey === 'function'
      ? ` data-loan-key="${encodeLoanKey(loan.name)}"`
      : '';
  return `<div class="loan-list-item board-card${stateClass}"${keyAttr}>
  <div class="loan-list-item__left">
    <div class="loan-list-item__top">
      <span class="loan-list-item__name">${loan.name}</span>
      <div class="loan-list-item__meta">
        <span class="loan-list-item__meta-amount">${loan.amount}</span>
        <span class="loan-list-item__meta-sep">·</span>
        <span class="loan-list-item__meta-type">${loan.loanType}</span>
      </div>
    </div>
    <span class="loan-list-item__time">${loan.time}</span>
  </div>
  <div class="loan-list-item__right">
    <span class="loan-list-item__badge loan-list-item__badge--${loan.statusKey}">${loan.status}</span>
    <span class="loan-list-item__icon"><span class="icon">${userIconSvg}</span></span>
  </div>
</div>`;
}

function buildBoardColHtml(stage) {
  const chevSvg = iconSvg('chevron-down');
  const itemsHtml = stage.loans.map(buildBoardCardHtml).join('');
  return `<div class="board-col${stage.expanded ? ' board-col--expanded' : ''}">
  <div class="board-col__header">
    <span class="board-col__name">${stage.label}</span>
    <div class="board-col__meta">
      <span class="board-col__count">${stage.count}</span>
      <span class="board-col__chev">${chevSvg}</span>
    </div>
  </div>
  ${stage.expanded && itemsHtml ? `<div class="board-col__items">${itemsHtml}</div>` : ''}
</div>`;
}

function buildBoardView() {
  const updownSvg = iconSvg('chevron-up-down');
  const plusBtn = buildBtnPreviewHtml({ id: 's1', icons: ['plus'] });
  const colsHtml = BOARD_STAGES.map(buildBoardColHtml).join('');
  return `<div class="board-view">
  <div class="board-view__header">
    <div class="board-view__pill">
      <span class="board-view__pill-label">My Loans</span>
      <div class="board-view__pill-badge">
        <span class="board-view__pill-count">52</span>
        <span class="board-view__pill-icon">${updownSvg}</span>
      </div>
    </div>
    ${plusBtn}
  </div>
  <div class="board-view__body">
    ${colsHtml}
  </div>
  <div class="board-view__footer">
    ${buildSearchSectionHtml()}
  </div>
</div>`;
}

// ── Board ↔ Sidebar morph state (module-level so reverseToBoard can access) ──
let boardMorphFired = false;
let savedMorphState = null;

/**
 * Drop finished WAAPI fills and pin the morphed column layout as inline CSS so
 * reverse animations (and display:none) do not stack two compositors on the same element.
 */
function expandLoanStageGroup(groupEl) {
  if (!groupEl || groupEl.classList.contains('loan-stage-group--expanded')) return;
  const body = groupEl.querySelector('.loan-stage-group__body');
  if (!body) return;
  groupEl.classList.add('loan-stage-group--expanded');
  groupEl.classList.remove('loan-stage-group--collapsed');
  body.style.transition = '';
  body.style.maxHeight = 'none';
  body.style.paddingTop = '12px';
  body.style.overflow = 'visible';
}

function expandAllLoanStageGroups(panelBody) {
  if (!panelBody) return;
  panelBody.querySelectorAll('.loan-stage-group').forEach((g) => expandLoanStageGroup(g));
}

/** Match loans sidebar selection + board highlight; keep all stage groups expanded. */
function syncLoansPanelFromBoardCard(boardCard, loansPanel, boardView) {
  if (typeof encodeLoanKey !== 'function' || !boardCard || !loansPanel) return;
  const key =
    boardCard.dataset.loanKey ||
    encodeLoanKey(boardCard.querySelector('.loan-list-item__name')?.textContent || '');
  if (!key) return;
  const panelBody = loansPanel.querySelector('.loans-panel__body');
  if (!panelBody) return;

  boardView?.querySelectorAll('.board-card').forEach((el) => {
    el.classList.remove('loan-list-item--selected');
  });
  boardCard.classList.add('loan-list-item--selected');

  panelBody.querySelectorAll('.loan-list-item').forEach((el) => {
    el.classList.remove('loan-list-item--selected');
  });
  let target = panelBody.querySelector(`.loan-list-item[data-loan-key="${key}"]`);
  if (!target) {
    target = [...panelBody.querySelectorAll('.loan-list-item')].find(
      (el) => encodeLoanKey(el.querySelector('.loan-list-item__name')?.textContent || '') === key
    );
  }
  if (target) target.classList.add('loan-list-item--selected');

  expandAllLoanStageGroups(panelBody);
  applyMainLoanDetail(key);
}

/** Ease-out cubic — aligns with prototype morph / panel motion */
function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

/**
 * Smooth scroll within `el` to `targetTop` over `durationMs` (not instant jump).
 * Cancels any in-flight scroll on the same element.
 */
function smoothScrollElementTo(el, targetTop, durationMs = 480) {
  if (!el) return;
  const start = el.scrollTop;
  const maxTop = Math.max(0, el.scrollHeight - el.clientHeight);
  const clampedTarget = Math.min(Math.max(0, targetTop), maxTop);
  const delta = clampedTarget - start;
  if (Math.abs(delta) < 0.5) return;

  if (el._protoSmoothScrollRaf) {
    cancelAnimationFrame(el._protoSmoothScrollRaf);
    el._protoSmoothScrollRaf = null;
  }

  const t0 = performance.now();
  function step(now) {
    const t = Math.min(1, (now - t0) / durationMs);
    el.scrollTop = start + delta * easeOutCubic(t);
    if (t < 1) {
      el._protoSmoothScrollRaf = requestAnimationFrame(step);
    } else {
      el._protoSmoothScrollRaf = null;
    }
  }
  el._protoSmoothScrollRaf = requestAnimationFrame(step);
}

/** True when the row is fully inside the panel viewport (with inset from top/bottom). */
function isLoanRowFullyVisibleInPanel(panelBody, item, inset = 12) {
  const cr = panelBody.getBoundingClientRect();
  const ir = item.getBoundingClientRect();
  return ir.top >= cr.top + inset - 1 && ir.bottom <= cr.bottom - inset + 1;
}

function scrollLoansPanelToSelected(loansPanel) {
  const panelBody = loansPanel?.querySelector('.loans-panel__body');
  const item = panelBody?.querySelector('.loan-list-item--selected');
  if (!panelBody || !item) return;
  if (isLoanRowFullyVisibleInPanel(panelBody, item, 12)) return;

  const br = panelBody.getBoundingClientRect();
  const ir = item.getBoundingClientRect();
  const targetTop = ir.top - br.top + panelBody.scrollTop - 12;
  smoothScrollElementTo(panelBody, targetTop, 520);
}

function syncBoardFromLoansPanel(boardView, loansPanel) {
  if (typeof encodeLoanKey !== 'function' || !boardView || !loansPanel) return;
  const selected = loansPanel.querySelector('.loans-panel__body .loan-list-item--selected');
  const key =
    selected?.dataset?.loanKey ||
    encodeLoanKey(selected?.querySelector('.loan-list-item__name')?.textContent || '');
  if (!key) return;
  boardView.querySelectorAll('.board-card').forEach((c) => {
    const cKey =
      c.dataset.loanKey ||
      encodeLoanKey(c.querySelector('.loan-list-item__name')?.textContent || '');
    c.classList.toggle('loan-list-item--selected', cKey === key);
  });
}

function commitMorphedBoardColumns(cols, colRects, bvRect, PAD, innerW, naturalHeights, targetYs) {
  cols.forEach((col, i) => {
    col.getAnimations().forEach((a) => a.cancel());
    const colLeft = colRects[i].left - bvRect.left;
    Object.assign(col.style, {
      position : 'absolute',
      left     : `${colLeft}px`,
      top      : `${colRects[i].top - bvRect.top}px`,
      width    : `${innerW}px`,
      height   : `${naturalHeights[i]}px`,
      transform: `translate(${PAD - colLeft}px, ${targetYs[i]}px)`,
      margin   : '0',
      flex     : 'none',
      zIndex   : '1',
      overflow : 'hidden',
    });
  });
}

function reverseToBoard() {
  if (!savedMorphState) return;
  const {
    boardView, boardBody, boardPlusBtn, protoMain, loansPanel, sidebarBorder,
    footerEl, headerEl, cols, colRects, naturalHeights, targetYs, bvRect, PAD, innerW,
  } = savedMorphState;

  const numCols   = cols.length;
  const lastLands = 520 + (numCols - 1) * 55; // 685 ms (same as forward)

  // ── R1. Pill capsule collapses (before → after, reversed) ──
  const pillCapsule = loansPanel?.querySelector('.loans-pill-capsule');
  if (pillCapsule) pillCapsule.classList.remove('loans-pill-capsule--expanded');

  // ── R2. Detail panel slides back out to the right ──
  protoMain.classList.remove('proto-main--entering');
  protoMain.classList.add('proto-main--content-hidden');
  Object.assign(protoMain.style, {
    transition : 'opacity 300ms cubic-bezier(0.4,0,0.2,1), transform 300ms cubic-bezier(0.4,0,0.2,1)',
    opacity    : '0',
    transform  : 'translateX(32px)',
  });

  // ── R3. Loans panel fades out ──
  Object.assign(loansPanel.style, {
    transition : 'opacity 350ms cubic-bezier(0.4, 0, 0.2, 1)',
    opacity    : '0',
  });

  // ── R4. Sidebar border fades out ──
  if (sidebarBorder) {
    sidebarBorder.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 0.2, 1)';
    sidebarBorder.style.opacity    = '0';
  }

  // ── R5. Search footer slides back down below clip ──
  if (footerEl) {
    Object.assign(footerEl.style, {
      transition : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      transform  : 'translateY(100%)',
    });
  }

  // ── R6. After pill has had time to visibly collapse (~200ms), board reappears ──
  //    The 200ms phase-1 window lets the user see the pill animate before the
  //    board (z-index:20) covers the loans panel entirely.
  const PHASE1_DELAY = 200;
  setTimeout(() => {
    boardView.style.display = '';         // unhide at 278px (morphed state)
    syncProtoCardBoardSeamClass();
    requestAnimationFrame(() => {
      commitMorphedBoardColumns(cols, colRects, bvRect, PAD, innerW, naturalHeights, targetYs);

      // Inline transition → width animates back to full; radius matches .proto-main / .board-view CSS
      Object.assign(boardView.style, {
        transition   : 'width 685ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 685ms cubic-bezier(0.4, 0, 0.2, 1)',
        width        : 'calc(100% - var(--proto-board-right-inset, 376px))',
        borderRadius : '0 20px 20px 0',
      });
      boardView.classList.remove('board-view--morphing');
      syncProtoCardBoardSeamClass();

      // Animate columns back — reverse stagger (last col first, same duration)
      cols.forEach((col, i) => {
        const colLeft = colRects[i].left - bvRect.left;
        col.animate(
          [
            { transform: `translate(${PAD - colLeft}px, ${targetYs[i]}px)`,
              width    : innerW + 'px',
              height   : naturalHeights[i] + 'px' },
            { transform : 'translate(0, 0)',
              width     : colRects[i].width  + 'px',
              height    : colRects[i].height + 'px' },
          ],
          { duration : 520,
            delay    : (numCols - 1 - i) * 55,
            easing   : 'cubic-bezier(0.4, 0, 0.2, 1)',
            fill     : 'none' }
        );
      });
    });
  }, PHASE1_DELAY);

  // ── R7. Once all columns land: restore flow layout + reset all state ──
  //    Timeout accounts for phase-1 delay + column animation duration.
  setTimeout(() => {
    // Cancel WAAPI fill and clear all inline styles → back to CSS flow
    cols.forEach(col => {
      col.getAnimations().forEach(a => a.cancel());
      col.style.cssText = '';
    });

    // Restore header
    if (headerEl) {
      headerEl.style.width      = '';
      headerEl.style.flexShrink = '';
      headerEl.style.overflow   = '';
    }

    // Restore board board inline styles
    boardView.style.transition   = '';
    boardView.style.width        = '';
    boardView.style.borderRadius = '';

    // Footer → hidden initial state (ready for next forward animation)
    if (footerEl) {
      Object.assign(footerEl.style, {
        opacity    : '0',
        transform  : 'translateY(100%)',
        transition : 'none',
        width      : '',
        flexShrink : '',
      });
    }

    // Restore proto-main to hidden initial state
    protoMain.classList.remove('proto-main--content-hidden');
    Object.assign(protoMain.style, { opacity: '0', transform: 'translateX(32px)', transition: 'none' });

    syncBoardFromLoansPanel(boardView, loansPanel);

    // Restore loans panel
    loansPanel.style.opacity    = '0';
    loansPanel.style.transition = '';

    // Restore + button visibility (was hidden for hero animation)
    if (boardPlusBtn) boardPlusBtn.style.visibility = '';

    // Reset morph state → forward animation can fire again
    savedMorphState  = null;
    boardMorphFired  = false;
    syncProtoCardBoardSeamClass();
  }, PHASE1_DELAY + lastLands + 100);
}

function initBoardView() {
  const boardView     = document.querySelector('.board-view');
  const boardBody     = boardView?.querySelector('.board-view__body');
  const protoMain     = document.querySelector('.proto-main');
  const loansPanel    = document.querySelector('.proto-card .loans-panel');
  const sidebarBorder = document.querySelector('.proto-sidebar-border');
  if (!boardView || !boardBody) return;

  // Default view is the loans list — hide board on load
  boardView.style.display = 'none';
  syncProtoCardBoardSeamClass();

  // Expand the pill capsule so the home/board button is visible from the start
  const pillCapsule = document.querySelector('.loans-pill-capsule');
  if (pillCapsule) pillCapsule.classList.add('loans-pill-capsule--expanded');

  // Footer starts fully below the board's overflow:hidden clip — slides up after columns land
  const footerEl = boardView.querySelector('.board-view__footer');
  if (footerEl) Object.assign(footerEl.style, { opacity: '0', transform: 'translateY(100%)', transition: 'none' });

  syncProtoCardBoardSeamClass();

  boardView.addEventListener('click', e => {
    const card = e.target.closest('.board-card');
    if (!card || boardMorphFired) return;
    boardMorphFired = true;

    syncLoansPanelFromBoardCard(card, loansPanel, boardView);

    const headerEl     = boardView.querySelector('.board-view__header');
    const boardPlusBtn = headerEl?.querySelector('.btn');
    const loansPlusBtn = loansPanel?.querySelector('.loans-panel__header .btn');
    const cols         = [...boardBody.querySelectorAll('.board-col')];

    // ── 0. Measure everything before any DOM mutation ──
    const bvRect         = boardView.getBoundingClientRect();
    const headerRect     = headerEl?.getBoundingClientRect();
    const colRects       = cols.map(c => c.getBoundingClientRect());
    const plusStartRect  = boardPlusBtn?.getBoundingClientRect();
    const plusTargetRect = loansPlusBtn?.getBoundingClientRect();

    const GAP    = 12;
    const PAD    = 12;
    const innerW = 278 - PAD * 2; // 254 px

    // ── 0b. Freeze footer at sidebar width immediately ──
    //    Prevents it from participating in the board's flex width transition,
    //    so it's already 278px wide when it slides up at lastLands.
    if (footerEl) {
      footerEl.style.width      = '278px';
      footerEl.style.flexShrink = '0';
    }

    // ── 1. Freeze header width — pill won't reflow as the board narrows ──
    //    Stays in flex flow (no absolute), board-view overflow:hidden
    //    clips the right side naturally as the board width transitions.
    if (headerEl && headerRect) {
      Object.assign(headerEl.style, {
        width      : headerRect.width + 'px',
        flexShrink : '0',
        overflow   : 'hidden',
      });
    }

    // ── 2. + button hero: physically travels from board header → sidebar header ──
    let heroPlusBtn = null;
    if (boardPlusBtn && plusStartRect && plusTargetRect) {
      boardPlusBtn.style.visibility = 'hidden'; // hero takes its place
      heroPlusBtn = boardPlusBtn.cloneNode(true);
      Object.assign(heroPlusBtn.style, {
        position     : 'fixed',
        left         : plusStartRect.left + 'px',
        top          : plusStartRect.top  + 'px',
        width        : plusStartRect.width  + 'px',
        height       : plusStartRect.height + 'px',
        margin       : '0',
        zIndex       : '200',
        pointerEvents: 'none',
        visibility   : 'visible',
      });
      document.body.appendChild(heroPlusBtn);

      const dx = plusTargetRect.left - plusStartRect.left;
      const dy = plusTargetRect.top  - plusStartRect.top;
      heroPlusBtn.animate(
        [
          { transform: 'translate(0,0)' },
          { transform: `translate(${dx}px,${dy}px)` },
        ],
        { duration: 520, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'none' }
      );
    }

    // ── 3. Pin each column at its exact current size (zero visual change) ──
    cols.forEach((col, i) => {
      const r = colRects[i];
      Object.assign(col.style, {
        position : 'absolute',
        left     : (r.left - bvRect.left) + 'px',
        top      : (r.top  - bvRect.top)  + 'px',
        width    : r.width  + 'px',
        height   : r.height + 'px',
        overflow : 'hidden',
        margin   : '0',
        flex     : 'none',
        zIndex   : '1',
      });
    });

    // ── 4. Measure natural height at sidebar width (sync, no visible flash) ──
    const naturalHeights = cols.map((col, i) => {
      col.style.width  = innerW + 'px';
      col.style.height = 'auto';
      const h = Math.round(col.getBoundingClientRect().height);
      col.style.width  = colRects[i].width  + 'px';
      col.style.height = colRects[i].height + 'px';
      return h;
    });

    // ── 5. Cumulative target Y deltas ──
    const targetYs = [];
    let cumY = 0;
    naturalHeights.forEach(h => { targetYs.push(cumY); cumY += h + GAP; });

    // ── 5b. Save morph state — used by reverseToBoard() ──
    savedMorphState = {
      boardView, boardBody, boardPlusBtn, protoMain, loansPanel, sidebarBorder,
      footerEl, headerEl, cols, colRects, naturalHeights, targetYs, bvRect, PAD, innerW,
    };

    // ── 6. Animate each column into its sidebar slot ──
    cols.forEach((col, i) => {
      const colLeft = colRects[i].left - bvRect.left;
      col.animate(
        [
          { transform: 'translate(0, 0)',
            width:  colRects[i].width  + 'px',
            height: colRects[i].height + 'px' },
          { transform: `translate(${PAD - colLeft}px, ${targetYs[i]}px)`,
            width:  innerW            + 'px',
            height: naturalHeights[i] + 'px' },
        ],
        { duration: 520, delay: i * 55, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'none' }
      );
    });

    // ── 7. Board shrinks to sidebar width; border line appears ──
    boardView.classList.add('board-view--morphing');
    syncProtoCardBoardSeamClass();
    if (sidebarBorder) {
      sidebarBorder.style.transition = 'opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 80ms';
      sidebarBorder.style.opacity    = '1';
    }

    // ── 8. Detail panel slides in from right ──
    //    Content sections are hidden immediately so they don't flash visible
    //    while the board is still animating — they stagger in at lastLands.
    if (protoMain) protoMain.classList.add('proto-main--content-hidden');
    requestAnimationFrame(() => {
      Object.assign(protoMain.style, {
        transition : 'opacity 400ms cubic-bezier(0.4,0,0.2,1) 100ms, transform 400ms cubic-bezier(0.4,0,0.2,1) 100ms',
        opacity    : '1',
        transform  : 'translateX(0)',
      });
    });

    // ── 9. Loans panel fades in under the board ──
    requestAnimationFrame(() => {
      if (loansPanel) {
        Object.assign(loansPanel.style, {
          transition : 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1)',
          opacity    : '1',
        });
      }
    });

    const lastLands = 520 + (cols.length - 1) * 55; // 685 ms with 4 cols

    // ── 10. Once last column lands: search slides up + detail content staggers in ──
    setTimeout(() => {
      // Footer slides up from below
      if (footerEl) {
        requestAnimationFrame(() => {
          Object.assign(footerEl.style, {
            opacity    : '1',
            transition : 'transform 340ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform  : 'translateY(0)',
          });
        });
      }

      // Detail content stagger: swap hidden→entering so sections fade up in sync
      if (protoMain) {
        protoMain.classList.remove('proto-main--content-hidden');
        void protoMain.offsetWidth; // flush layout so animation restarts cleanly
        protoMain.classList.add('proto-main--entering');
        clearTimeout(protoMain._enterTimer);
        protoMain._enterTimer = setTimeout(() => {
          protoMain.classList.remove('proto-main--entering');
        }, 650);
      }

      // Double rAF: wait for expanded groups + opacity so target position is stable, then ease scroll
      requestAnimationFrame(() => {
        requestAnimationFrame(() => scrollLoansPanelToSelected(loansPanel));
      });
    }, lastLands);

    // ── 11. After search lands: swap board for loans panel; remove hero ──
    setTimeout(() => {
      // Persist morphed layout as inline styles; cancel forward fills so home/reverse
      // does not stack two animations (broken flex spacing after return to board).
      commitMorphedBoardColumns(cols, colRects, bvRect, PAD, innerW, naturalHeights, targetYs);
      boardView.style.display = 'none';
      syncProtoCardBoardSeamClass();
      // Morph turns this overlay on for continuity while the board has no right border;
      // loans panel already paints border-right — hide overlay or the seam reads ~2× thick.
      if (sidebarBorder) {
        sidebarBorder.style.transition = 'opacity 140ms cubic-bezier(0.4, 0, 0.2, 1)';
        sidebarBorder.style.opacity = '0';
      }
      if (heroPlusBtn)  heroPlusBtn.remove();
      if (protoMain)    protoMain.style.transition  = '';
      if (loansPanel)   loansPanel.style.transition = '';

      // Pill: "before" → "after" — icon slides in from left on the same frame
      // the board disappears, so the reveal and slide feel simultaneous.
      requestAnimationFrame(() => {
        const pillCapsule = loansPanel?.querySelector('.loans-pill-capsule');
        if (pillCapsule) pillCapsule.classList.add('loans-pill-capsule--expanded');
      });
    }, lastLands + 390);
  });
}

function buildBody() {
  return `
    <div class="proto-body">
      <div class="proto-card">
        <div class="proto-sidebar-border"></div>
        ${buildBoardView()}
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

// ─── Condition templates modal (content from condition-templates.js) ─────────

function buildConditionModalHtml() {
  const inner = typeof buildConditionTemplateModalDialogHtml === 'function'
    ? buildConditionTemplateModalDialogHtml()
    : '<div class="proto-ct-modal__chrome"><p class="proto-ct-modal__fallback">Condition templates script not loaded.</p></div>';
  return `
<div id="proto-ct-modal" class="proto-ct-modal" hidden aria-hidden="true">
  <button type="button" class="proto-ct-modal__backdrop" data-ct-modal-dismiss tabindex="-1" aria-label="Close dialog"></button>
  <div class="proto-ct-modal__panel" role="dialog" aria-modal="true" aria-labelledby="proto-ct-modal-title">
    ${inner}
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
    </div>
    ${buildConditionModalHtml()}`;
}

function bindConditionModal() {
  const modal = document.getElementById('proto-ct-modal');
  const trigger = document.querySelector('.proto-conditions-btn');
  if (!modal || !trigger) return;
  if (!PROTO_CONDITIONS_ENTRY_ENABLED || trigger.disabled) return;

  bindConditionTemplates(modal);

  const open = () => {
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('proto-ct-modal-open');
    modal.querySelector('[data-ct-modal-close]')?.focus();
  };

  const close = () => {
    modal.classList.add('is-closing');
    const onDone = () => {
      modal.classList.remove('is-closing');
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('proto-ct-modal-open');
      trigger.focus();
    };
    // Wait for the exit animation (200ms) then hide
    modal.querySelector('.proto-ct-modal__panel')
      .addEventListener('animationend', onDone, { once: true });
  };

  trigger.addEventListener('click', () => open());

  modal.addEventListener('click', e => {
    if (
      e.target.closest('[data-ct-modal-dismiss]') ||
      e.target.closest('[data-ct-modal-close]') ||
      e.target.closest('[data-ct-cancel]')
    ) {
      close();
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) close();
  });
}

// ─── Interactions ─────────────────────────────────────────────────────────────

/**
 * Keep board overlay flush with .proto-main’s right edge (same seam as main view).
 * The resize handle uses negative horizontal margins so handle.offsetWidth + panel.offsetWidth
 * is wider than the real flex gap — measure from layout instead.
 */
function syncProtoBoardRightInset() {
  const card = document.querySelector('.proto-card');
  const main = document.querySelector('.proto-main');
  if (!card || !main) return;
  const inset = card.clientWidth - main.offsetLeft - main.offsetWidth;
  if (!Number.isFinite(inset)) return;
  card.style.setProperty('--proto-board-right-inset', `${Math.max(0, inset)}px`);
}

/**
 * One hairline toward AI: full kanban board owns border-right; .proto-main owns it otherwise.
 * Avoids double stroke (board + main, or main + AI panel).
 */
function syncProtoCardBoardSeamClass() {
  const card  = document.querySelector('.proto-card');
  const board = document.querySelector('.board-view');
  if (!card || !board) return;
  const hidden =
    board.style.display === 'none' || getComputedStyle(board).display === 'none';
  const morphing = board.classList.contains('board-view--morphing');
  const fullKanban = !hidden && !morphing;
  card.classList.toggle('proto-card--board-kanban-full', fullKanban);
}

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
    syncProtoBoardRightInset();
  });

  document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    handle.classList.remove('proto-resize-handle--active');
    syncProtoBoardRightInset();
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

  if (stageBtn && stageLabel) {
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

        protoBorrowerStageIndex = (protoBorrowerStageIndex + 1) % PROTO_PIPELINE_STAGES.length;
        stageLabel.textContent = PROTO_PIPELINE_STAGES[protoBorrowerStageIndex];

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

  // Panel-toggle button
  const panelToggleBtn = document.querySelector('.proto-panel-toggle');
  if (panelToggleBtn) {
    panelToggleBtn.addEventListener('click', () => {
      const isOpen = panelToggleBtn.dataset.panelOpen === 'true';
      panelToggleBtn.dataset.panelOpen = isOpen ? 'false' : 'true';
    });
  }

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
    const props = getActiveLoanProperties();
    const prop = props[idx];
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
    if (controlsEl) controlsEl.innerHTML = buildPropControlsHtml(idx, props);

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
    const props = getActiveLoanProperties();
    props.forEach(p => { p.primary = false; });
    props[idx].primary = true;
    const sidebarEl = document.querySelector('[data-prop-sidebar]');
    if (sidebarEl) sidebarEl.innerHTML = buildPropSidebarHtml(idx, props);
    const controlsEl = document.querySelector('[data-prop-controls]');
    if (controlsEl) controlsEl.innerHTML = buildPropControlsHtml(idx, props);
  });

  // Remove property
  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-rm-prop]');
    if (!btn) return;
    const idx = parseInt(btn.dataset.rmProp, 10);
    const props = getActiveLoanProperties();
    if (props.length <= 1) return;
    props.splice(idx, 1);
    props.forEach((p, i) => { p.id = i; });
    if (!props.some(p => p.primary)) props[0].primary = true;
    const sidebarEl = document.querySelector('[data-prop-sidebar]');
    if (sidebarEl) sidebarEl.innerHTML = buildPropSidebarHtml(0, props);
    selectPropItem(0);
    const countNum = document.querySelector('.proto-prop-head__num');
    if (countNum) countNum.textContent = props.length;
  });

  // Add property (prototype: clones first property with new address)
  document.addEventListener('click', e => {
    if (!e.target.closest('.proto-prop-add-item')) return;
    const props = getActiveLoanProperties();
    const newProp = { ...props[0], id: props.length, primary: false,
      tab: 'New Property', street: 'New Property', street2: '—', city: '—', state: '—', zip: '—' };
    props.push(newProp);
    const sidebarEl = document.querySelector('[data-prop-sidebar]');
    if (sidebarEl) sidebarEl.innerHTML = buildPropSidebarHtml(props.length - 1, props);
    selectPropItem(props.length - 1);
    const countNum = document.querySelector('.proto-prop-head__num');
    if (countNum) countNum.textContent = props.length;
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
  bindConditionModal();
  if (typeof initLpStatusOutsideClose === 'function') initLpStatusOutsideClose();
  initTogglePills();
  bindInteractions();
  bindResizeHandle();
  syncProtoBoardRightInset();
  syncProtoCardBoardSeamClass();
  const protoCardEl = document.querySelector('.proto-card');
  if (protoCardEl && typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(() => syncProtoBoardRightInset()).observe(protoCardEl);
  }
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

  initBoardView();

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

  // ── Home icon button → show board view ──
  const pillIconBtn = document.querySelector('.proto-card .loans-pill-icon-btn');
  if (pillIconBtn) {
    pillIconBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (savedMorphState) {
        reverseToBoard();
      } else {
        // Board was never shown yet — reveal it directly
        const boardView  = document.querySelector('.board-view');
        const protoMain  = document.querySelector('.proto-main');
        const loansPanel = document.querySelector('.proto-card .loans-panel');
        if (boardView) {
          boardView.style.display = '';
          syncProtoCardBoardSeamClass();
        }
        if (protoMain) Object.assign(protoMain.style, { opacity: '0', transform: 'translateX(32px)', transition: 'none' });
        if (loansPanel) loansPanel.style.opacity = '0';
      }
    });
  }

  // ── Detail panel staggered fade-up on loan selection ──
  const detailMain = document.querySelector('.proto-main');
  if (loansPanelBody && detailMain) {
    loansPanelBody.addEventListener('click', e => {
      const row = e.target.closest('.loan-list-item');
      if (!row) return;
      const rowKey =
        row.dataset.loanKey ||
        (typeof encodeLoanKey === 'function'
          ? encodeLoanKey(row.querySelector('.loan-list-item__name')?.textContent || '')
          : loanKeyFromName(row.querySelector('.loan-list-item__name')?.textContent || ''));
      if (rowKey) applyMainLoanDetail(rowKey);

      // Scroll detail back to top so the enter feels like a fresh load
      const detailScroll = detailMain.querySelector('.proto-main__scroll');
      if (detailScroll) detailScroll.scrollTop = 0;

      // Reset animation: remove → reflow → re-add so it replays every time
      detailMain.classList.remove('proto-main--entering');
      void detailMain.offsetWidth; // force layout flush
      detailMain.classList.add('proto-main--entering');

      // Clean up class after all staggered animations finish (~190 + 380 = ~580ms)
      clearTimeout(detailMain._enterTimer);
      detailMain._enterTimer = setTimeout(() => {
        detailMain.classList.remove('proto-main--entering');
      }, 620);
    });
  }
});
