'use strict';

// ─── Data ─────────────────────────────────────────────────────────────────────

const CT_STAGES_V2 = [
  { id: 'application',  label: 'Application' },
  { id: 'underwriting', label: 'Underwriting' },
  { id: 'closing',      label: 'Closing' },
  { id: 'funded',       label: 'Funded' },
  { id: 'post-close',   label: 'Post-Close' },
];

// Stage helpers — dueBefore is "required before X", sidebar shows condition under X-1
function sidebarStageFor(dueBeforeId) {
  const idx = CT_STAGES_V2.findIndex(s => s.id === dueBeforeId);
  if (idx <= 0) return CT_STAGES_V2[0].id;
  return CT_STAGES_V2[idx - 1].id;
}
function dueBeforeForSidebarStage(sidebarStageId) {
  const idx = CT_STAGES_V2.findIndex(s => s.id === sidebarStageId);
  if (idx < 0 || idx >= CT_STAGES_V2.length - 1) return CT_STAGES_V2[CT_STAGES_V2.length - 1].id;
  return CT_STAGES_V2[idx + 1].id;
}

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

/** Party / role this condition applies to (workflow assignment) */
const CT_ROLE_TYPES = [
  { id: 'borrower',      label: 'Borrower' },
  { id: 'co_borrower',   label: 'Co-borrower' },
  { id: 'broker',        label: 'Broker / correspondent' },
  { id: 'processor',     label: 'Loan processor' },
  { id: 'underwriter',   label: 'Underwriter' },
  { id: 'closing_agent', label: 'Closing / title' },
  { id: 'internal',      label: 'Internal (any role)' },
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
// roleType: CT_ROLE_TYPES id — which party this condition is assigned to
let CT_CONDITIONS = [
  {
    id: 'c1', name: 'Sign Purchase Agreement', group: 'agreements',
    roleType: 'borrower',
    conditionType: 'document_upload', docClass: 'PURCHASE_CONTRACT',
    description: 'Please upload a fully executed purchase agreement signed by all parties.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'always',    rules: [] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'always',    rules: [] },
    ],
  },
  {
    id: 'c2', name: 'Upload W2', group: 'income',
    roleType: 'borrower',
    conditionType: 'document_upload', docClass: 'W2',
    description: 'Please provide your most recent W-2 form.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Salaried' }] },
      { id: 'bridge',   dueBefore: 'closing',       type: 'always',   rules: [] },
    ],
  },
  {
    id: 'c3', name: 'Business Tax Returns', group: 'income',
    roleType: 'borrower',
    conditionType: 'document_upload', docClass: 'BANK_STATEMENT_BUSINESS',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
    ],
  },
  {
    id: 'c4', name: 'Title Search', group: 'property',
    roleType: 'internal',
    conditionType: 'order_service',
    description: 'Order a preliminary title report from an approved title company.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'always', rules: [] })),
  },
  {
    id: 'c5', name: 'Appraisal Report', group: 'property',
    roleType: 'internal',
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
    roleType: 'borrower',
    conditionType: 'document_upload', docClass: 'INSURANCE_HOI',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'always', rules: [] })),
  },
  {
    id: 'c7', name: 'Bank Statements (3mo)', group: 'income',
    roleType: 'borrower',
    conditionType: 'document_upload', docClass: 'BANK_STATEMENT_INDIVIDUAL',
    products: [
      { id: 'bridge', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'loan_type', op: 'is', val: 'Bridge' }] },
    ],
  },
  // ── Identity & Agreements ──────────────────────────────────────────────────
  {
    id: 'c8', name: 'Government-Issued ID', group: 'identity',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'GOVT_ID',
    description: 'Upload a valid government-issued photo ID for all borrowers.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'underwriting', type: 'always', rules: [] })),
  },
  {
    id: 'c9', name: 'Entity Operating Agreement', group: 'agreements',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'OPERATING_AGREEMENT',
    description: 'Provide the current operating agreement for the borrowing entity.',
    products: [
      { id: 'fix-flip',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is', val: 'LLC' }] },
      { id: 'bridge',       dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is', val: 'LLC' }] },
      { id: 'dscr',         dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is', val: 'LLC' }] },
      { id: 'construction', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is', val: 'LLC' }] },
    ],
  },
  {
    id: 'c10', name: 'Articles of Incorporation', group: 'agreements',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'ARTICLES_OF_INC',
    description: 'Upload the articles of incorporation for the borrowing corporation.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is', val: 'Corp' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is', val: 'Corp' }] },
    ],
  },
  {
    id: 'c11', name: 'Borrower Authorization Form', group: 'agreements',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'BORROWER_AUTH',
    description: 'Sign and return the borrower authorization to release information.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'underwriting', type: 'always', rules: [] })),
  },
  // ── Income & Employment ────────────────────────────────────────────────────
  {
    id: 'c12', name: 'Personal Tax Returns (2yr)', group: 'income',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'TAX_RETURN_PERSONAL',
    description: 'Provide the last two years of signed personal federal tax returns.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
      { id: 'dscr',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
    ],
  },
  {
    id: 'c13', name: 'Profit & Loss Statement', group: 'income',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'PL_STATEMENT',
    description: 'CPA-prepared P&L for the current year, dated within 60 days.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
      { id: 'dscr',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Self-Employed' }] },
    ],
  },
  {
    id: 'c14', name: 'Pay Stubs (30 days)', group: 'income',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'PAY_STUB',
    description: 'Upload the most recent 30 days of pay stubs from your employer.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Salaried' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Salaried' }] },
    ],
  },
  {
    id: 'c15', name: 'VOE – Verbal Verification', group: 'income',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Complete verbal verification of employment with the borrower\'s employer.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Salaried' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'employment_type', op: 'is', val: 'Salaried' }] },
    ],
  },
  {
    id: 'c16', name: 'DSCR Rent Schedule', group: 'income',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'RENT_SCHEDULE',
    description: 'Provide a current rent schedule or signed leases for all units.',
    products: [
      { id: 'dscr',       dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'rental-5plus', dueBefore: 'underwriting', type: 'always', rules: [] },
    ],
  },
  // ── Assets & Funds ─────────────────────────────────────────────────────────
  {
    id: 'c17', name: 'Proof of Down Payment', group: 'assets',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'DOWN_PAYMENT_PROOF',
    description: 'Provide documentation showing the source of down payment funds.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'underwriting', type: 'always', rules: [] })),
  },
  {
    id: 'c18', name: 'Gift Letter', group: 'assets',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'GIFT_LETTER',
    description: 'If any funds are gifted, provide a signed gift letter and proof of transfer.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'funds_source', op: 'is', val: 'Gift' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'funds_source', op: 'is', val: 'Gift' }] },
    ],
  },
  {
    id: 'c19', name: 'Retirement Account Statement', group: 'assets',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'RETIREMENT_STATEMENT',
    description: 'Provide the most recent quarterly statement for retirement accounts.',
    products: [
      { id: 'dscr',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'reserve_source', op: 'is', val: 'Retirement' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'reserve_source', op: 'is', val: 'Retirement' }] },
    ],
  },
  // ── Property ───────────────────────────────────────────────────────────────
  {
    id: 'c20', name: 'Scope of Work', group: 'property',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'SCOPE_OF_WORK',
    description: 'Submit a detailed scope of work and rehab budget for the project.',
    products: [
      { id: 'fix-flip',     dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'construction', dueBefore: 'underwriting', type: 'always', rules: [] },
    ],
  },
  {
    id: 'c21', name: 'Property Photos', group: 'property',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'PROPERTY_PHOTOS',
    description: 'Upload current interior and exterior photos of the subject property.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'always', rules: [] },
    ],
  },
  {
    id: 'c22', name: 'Environmental Site Assessment', group: 'property',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Order Phase I ESA for commercial or mixed-use properties.',
    products: [
      { id: 'bridge',       dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'property_type', op: 'is', val: 'Commercial' }] },
      { id: 'construction', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'property_type', op: 'is', val: 'Commercial' }] },
    ],
  },
  {
    id: 'c23', name: 'Survey Report', group: 'property',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Order an ALTA/NSPS land survey from a licensed surveyor.',
    products: [
      { id: 'fix-flip', dueBefore: 'closing', type: 'triggered', rules: [{ attr: 'property_type', op: 'is', val: 'Land' }] },
      { id: 'bridge',   dueBefore: 'closing', type: 'triggered', rules: [{ attr: 'property_type', op: 'is', val: 'Land' }] },
    ],
  },
  {
    id: 'c24', name: 'Flood Zone Determination', group: 'property',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Complete FEMA flood zone determination for the subject property.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'underwriting', type: 'always', rules: [] })),
  },
  {
    id: 'c25', name: 'Flood Insurance Policy', group: 'property',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'INSURANCE_FLOOD',
    description: 'Provide a flood insurance policy if the property is in a FEMA flood zone.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'triggered', rules: [{ attr: 'flood_zone', op: 'is', val: 'Yes' }] })),
  },
  {
    id: 'c26', name: "Builder's Risk Insurance", group: 'property',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'INSURANCE_BUILDERS_RISK',
    description: "Upload a builder's risk or course-of-construction insurance policy.",
    products: [
      { id: 'fix-flip',     dueBefore: 'closing', type: 'always', rules: [] },
      { id: 'construction', dueBefore: 'closing', type: 'always', rules: [] },
    ],
  },
  {
    id: 'c27', name: 'Property Tax Statement', group: 'property',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'TAX_STATEMENT',
    description: 'Upload the most recent property tax bill for the subject property.',
    products: [
      { id: 'dscr',       dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'rental-5plus', dueBefore: 'underwriting', type: 'always', rules: [] },
    ],
  },
  // ── Title & Closing ────────────────────────────────────────────────────────
  {
    id: 'c28', name: 'Preliminary Title Report', group: 'title',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Obtain a preliminary title report and review for encumbrances.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'underwriting', type: 'always', rules: [] })),
  },
  {
    id: 'c29', name: 'Title Insurance Commitment', group: 'title',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Secure lender title insurance commitment from an approved title company.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'always', rules: [] })),
  },
  {
    id: 'c30', name: 'Closing Disclosure Review', group: 'title',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Prepare and deliver closing disclosure to borrower 3 business days prior.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'closing', type: 'always', rules: [] })),
  },
  {
    id: 'c31', name: 'Wire Instructions Verified', group: 'title',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Verbally verify wire instructions with title company prior to funding.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'funded', type: 'always', rules: [] })),
  },
  {
    id: 'c32', name: 'Executed Settlement Statement', group: 'title',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'SETTLEMENT_STMT',
    description: 'Upload the fully executed HUD-1 or ALTA settlement statement.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'funded', type: 'always', rules: [] })),
  },
  // ── Credit ─────────────────────────────────────────────────────────────────
  {
    id: 'c33', name: 'Credit Report Pull', group: 'credit',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Pull tri-merge credit report for all borrowers and guarantors.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'underwriting', type: 'always', rules: [] })),
  },
  {
    id: 'c34', name: 'Credit Explanation Letter', group: 'credit',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'CREDIT_LETTER',
    description: 'Provide a written explanation for any derogatory credit items.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'derog_credit', op: 'is', val: 'Yes' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'derog_credit', op: 'is', val: 'Yes' }] },
      { id: 'dscr',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'derog_credit', op: 'is', val: 'Yes' }] },
    ],
  },
  {
    id: 'c35', name: 'Bankruptcy Discharge Documents', group: 'credit',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'BANKRUPTCY_DOCS',
    description: 'Provide full bankruptcy discharge papers if applicable.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'prior_bankruptcy', op: 'is', val: 'Yes' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'prior_bankruptcy', op: 'is', val: 'Yes' }] },
    ],
  },
  // ── Construction ───────────────────────────────────────────────────────────
  {
    id: 'c36', name: 'Construction Contract', group: 'construction',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'CONSTRUCTION_CONTRACT',
    description: 'Upload a signed fixed-price construction contract with the GC.',
    products: [
      { id: 'construction', dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'fix-flip',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'rehab_budget', op: 'gt', val: '50000' }] },
    ],
  },
  {
    id: 'c37', name: 'GC License & Insurance', group: 'construction',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'GC_LICENSE',
    description: 'Provide GC license, liability insurance, and workers\' comp certificates.',
    products: [
      { id: 'construction', dueBefore: 'underwriting', type: 'always', rules: [] },
    ],
  },
  {
    id: 'c38', name: 'Building Permits', group: 'construction',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'BUILDING_PERMITS',
    description: 'Upload all required building permits pulled for the project.',
    products: [
      { id: 'construction', dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'fix-flip',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'permit_required', op: 'is', val: 'Yes' }] },
    ],
  },
  {
    id: 'c39', name: 'Draw Schedule', group: 'construction',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'DRAW_SCHEDULE',
    description: 'Submit a detailed draw schedule aligned to construction milestones.',
    products: [
      { id: 'construction', dueBefore: 'underwriting', type: 'always', rules: [] },
    ],
  },
  {
    id: 'c40', name: 'Construction Progress Inspection', group: 'construction',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Order third-party inspection to verify construction progress before each draw.',
    products: [
      { id: 'construction', dueBefore: 'funded', type: 'always', rules: [] },
    ],
  },
  // ── Post-Close ─────────────────────────────────────────────────────────────
  {
    id: 'c41', name: 'Recorded Deed of Trust', group: 'post-close',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Confirm recorded deed of trust received from county recorder.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'post-close', type: 'always', rules: [] })),
  },
  {
    id: 'c42', name: 'Final Title Policy', group: 'post-close',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Obtain final ALTA lender title policy from title company.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'post-close', type: 'always', rules: [] })),
  },
  {
    id: 'c43', name: 'Hazard Insurance Policy', group: 'post-close',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'INSURANCE_HAZARD',
    description: 'Confirm lender is named as additional insured on hazard policy.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'post-close', type: 'always', rules: [] })),
  },
  {
    id: 'c44', name: 'Collateral File Review', group: 'post-close',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Complete collateral file review and ship to custodian within 10 days.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'post-close', type: 'always', rules: [] })),
  },
  {
    id: 'c44a', name: 'Post-Close Document Audit', group: 'post-close',
    roleType: 'internal', conditionType: 'internal_task',
    description: 'Review the closed loan file for completeness and confirm all final documents are indexed correctly.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'post-close', type: 'always', rules: [] })),
  },
  // ── Compliance ─────────────────────────────────────────────────────────────
  {
    id: 'c45', name: 'OFAC / AML Screening', group: 'compliance',
    roleType: 'internal', conditionType: 'order_service',
    description: 'Run OFAC and AML screening for all borrowers, guarantors, and entities.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'underwriting', type: 'always', rules: [] })),
  },
  {
    id: 'c46', name: 'Patriot Act Certification', group: 'compliance',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'PATRIOT_ACT',
    description: 'Collect completed Patriot Act customer identification documentation.',
    products: CT_PRODUCTS.map(p => ({ id: p.id, dueBefore: 'underwriting', type: 'always', rules: [] })),
  },
  {
    id: 'c47', name: 'Beneficial Ownership Certification', group: 'compliance',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'BENEFICIAL_OWNERSHIP',
    description: 'Complete FinCEN beneficial ownership certification for legal entity borrowers.',
    products: [
      { id: 'fix-flip', dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is_not', val: 'Individual' }] },
      { id: 'bridge',   dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is_not', val: 'Individual' }] },
      { id: 'dscr',     dueBefore: 'underwriting', type: 'triggered', rules: [{ attr: 'entity_type', op: 'is_not', val: 'Individual' }] },
    ],
  },
  // ── DSCR / Rental ──────────────────────────────────────────────────────────
  {
    id: 'c48', name: 'Signed Lease Agreements', group: 'rental',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'LEASE_AGREEMENTS',
    description: 'Provide all current executed leases for the subject property.',
    products: [
      { id: 'dscr',       dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'rental-5plus', dueBefore: 'underwriting', type: 'always', rules: [] },
    ],
  },
  {
    id: 'c49', name: '12-Month Operating Statement', group: 'rental',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'OPERATING_STMT_12MO',
    description: 'Provide a trailing 12-month income and expense statement for the property.',
    products: [
      { id: 'dscr',       dueBefore: 'underwriting', type: 'always', rules: [] },
      { id: 'rental-5plus', dueBefore: 'underwriting', type: 'always', rules: [] },
    ],
  },
  {
    id: 'c50', name: 'Property Management Agreement', group: 'rental',
    roleType: 'borrower', conditionType: 'document_upload', docClass: 'MGMT_AGREEMENT',
    description: 'Upload the executed property management agreement if professionally managed.',
    products: [
      { id: 'dscr',       dueBefore: 'closing', type: 'triggered', rules: [{ attr: 'mgmt_type', op: 'is', val: 'Professional' }] },
      { id: 'rental-5plus', dueBefore: 'closing', type: 'triggered', rules: [{ attr: 'mgmt_type', op: 'is', val: 'Professional' }] },
    ],
  },
];

// ─── Activity log (mock data — prototype) ─────────────────────────────────────
const CT_ACTIVITY_LOG = [
  { id: 'a1',  condId: 'c2', condName: 'Upload W2',                 event: 'fulfilled',  loanId: 'L-4821', loanName: 'Johnson Property',    loanType: 'Fix & Flip', stage: 'underwriting', minsAgo: 28   },
  { id: 'a2',  condId: 'c1', condName: 'Sign Purchase Agreement',   event: 'triggered',  loanId: 'L-5109', loanName: 'Park Ave Deal',        loanType: 'Bridge',     stage: 'application',  minsAgo: 95   },
  { id: 'a3',  condId: 'c5', condName: 'Appraisal Report',          event: 'requested',  loanId: 'L-3302', loanName: 'Martinez Refi',        loanType: 'DSCR',       stage: 'underwriting', minsAgo: 180  },
  { id: 'a4',  condId: 'c7', condName: 'Bank Statements (3mo)',     event: 'pending',    loanId: 'L-3302', loanName: 'Martinez Refi',        loanType: 'Bridge',     stage: 'underwriting', minsAgo: 360  },
  { id: 'a5',  condId: 'c4', condName: 'Title Search',              event: 'triggered',  loanId: 'L-4821', loanName: 'Johnson Property',    loanType: 'Fix & Flip', stage: 'closing',      minsAgo: 1440 },
  { id: 'a6',  condId: 'c6', condName: 'Proof of Insurance',        event: 'fulfilled',  loanId: 'L-2208', loanName: 'Chen Office Bldg',    loanType: 'Bridge',     stage: 'closing',      minsAgo: 1800 },
  { id: 'a7',  condId: 'c3', condName: 'Business Tax Returns',      event: 'waived',     loanId: 'L-2208', loanName: 'Chen Office Bldg',    loanType: 'Bridge',     stage: 'underwriting', minsAgo: 2880 },
  { id: 'a8',  condId: 'c1', condName: 'Sign Purchase Agreement',   event: 'fulfilled',  loanId: 'L-4007', loanName: 'Rivera Townhomes',    loanType: 'Fix & Flip', stage: 'application',  minsAgo: 4320 },
  { id: 'a9',  condId: 'c5', condName: 'Appraisal Report',          event: 'triggered',  loanId: 'L-4007', loanName: 'Rivera Townhomes',    loanType: 'Fix & Flip', stage: 'underwriting', minsAgo: 5040 },
  { id: 'a10', condId: 'c2', condName: 'Upload W2',                 event: 'pending',    loanId: 'L-5109', loanName: 'Park Ave Deal',        loanType: 'Bridge',     stage: 'closing',      minsAgo: 7200 },
  { id: 'a11', condId: 'c4', condName: 'Title Search',              event: 'requested',  loanId: 'L-4007', loanName: 'Rivera Townhomes',    loanType: 'Fix & Flip', stage: 'closing',      minsAgo: 8640 },
  { id: 'a12', condId: 'c6', condName: 'Proof of Insurance',        event: 'triggered',  loanId: 'L-5109', loanName: 'Park Ave Deal',        loanType: 'Bridge',     stage: 'closing',      minsAgo: 10080},
  { id: 'a13', condId: 'c3', condName: 'Entity Docs',               event: 'fulfilled',  loanId: 'L-6614', loanName: 'Nguyen Duplex',        loanType: 'DSCR',       stage: 'underwriting', minsAgo: 11520},
  { id: 'a14', condId: 'c8', condName: 'Rent Roll',                 event: 'requested',  loanId: 'L-6614', loanName: 'Nguyen Duplex',        loanType: 'DSCR',       stage: 'underwriting', minsAgo: 12960},
  { id: 'a15', condId: 'c2', condName: 'Upload W2',                 event: 'fulfilled',  loanId: 'L-3302', loanName: 'Martinez Refi',        loanType: 'DSCR',       stage: 'application',  minsAgo: 14400},
  { id: 'a16', condId: 'c9', condName: 'Credit Authorization',      event: 'triggered',  loanId: 'L-7731', loanName: 'Patel Warehouse',      loanType: 'Bridge',     stage: 'application',  minsAgo: 15120},
  { id: 'a17', condId: 'c5', condName: 'Appraisal Report',          event: 'fulfilled',  loanId: 'L-7731', loanName: 'Patel Warehouse',      loanType: 'Bridge',     stage: 'underwriting', minsAgo: 16560},
  { id: 'a18', condId: 'c4', condName: 'Title Search',              event: 'waived',     loanId: 'L-2208', loanName: 'Chen Office Bldg',    loanType: 'Bridge',     stage: 'closing',      minsAgo: 17280},
  { id: 'a19', condId: 'c7', condName: 'Bank Statements (3mo)',     event: 'fulfilled',  loanId: 'L-4821', loanName: 'Johnson Property',    loanType: 'Fix & Flip', stage: 'application',  minsAgo: 18720},
  { id: 'a20', condId: 'c3', condName: 'Business Tax Returns',      event: 'requested',  loanId: 'L-8802', loanName: 'Kim Mixed-Use',        loanType: 'Fix & Flip', stage: 'underwriting', minsAgo: 20160},
  { id: 'a21', condId: 'c6', condName: 'Proof of Insurance',        event: 'pending',    loanId: 'L-8802', loanName: 'Kim Mixed-Use',        loanType: 'Fix & Flip', stage: 'closing',      minsAgo: 21600},
  { id: 'a22', condId: 'c1', condName: 'Sign Purchase Agreement',   event: 'triggered',  loanId: 'L-6614', loanName: 'Nguyen Duplex',        loanType: 'DSCR',       stage: 'application',  minsAgo: 22320},
  { id: 'a23', condId: 'c9', condName: 'Credit Authorization',      event: 'fulfilled',  loanId: 'L-4007', loanName: 'Rivera Townhomes',    loanType: 'Fix & Flip', stage: 'application',  minsAgo: 24480},
  { id: 'a24', condId: 'c8', condName: 'Rent Roll',                 event: 'waived',     loanId: 'L-5109', loanName: 'Park Ave Deal',        loanType: 'Bridge',     stage: 'underwriting', minsAgo: 25920},
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
let CT_SELECTED_PROD_VIEW = null;
let CT_ORIGINAL_SNAPSHOT = null;

function stableStringify(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(stableStringify).join(',') + ']';
  return '{' + Object.keys(obj).sort().map(k => JSON.stringify(k) + ':' + stableStringify(obj[k])).join(',') + '}';
}

function syncDirty(root) {
  const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
  const main = root?.querySelector('[data-ct2-main]');
  if (!main) return;
  const isDirty = CT_ORIGINAL_SNAPSHOT !== null && (!cond || stableStringify(cond) !== CT_ORIGINAL_SNAPSHOT);
  main.classList.toggle('ct2-main--dirty', isDirty);
}

function markDirty(root) { syncDirty(root); }

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

// Slide up from bottom — true bottom sheet: panel rises from the card's bottom edge
function ct2InSlideUp(el) {
  el.style.transform = 'translateY(100%)';
  const a = el.animate(
    [{ transform: 'translateY(100%)' },
     { transform: 'translateY(0%)' }],
    { duration: 480, easing: CT2_EASE_ENTER, fill: 'none' }
  );
  a.onfinish = () => { el.style.transform = ''; };
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

function buildLibGroupHtml(group, conds, activeId, prodId) {
  if (!conds.length) return '';
  const items = conds.map(c => buildLibItem(c, c.id === activeId)).join('');
  const plusIcon = typeof iconSvg === 'function' ? iconSvg('plus') : '+';
  const isActiveGroup = prodId && CT_SELECTED_PROD_VIEW === prodId;
  return `<div class="ct2-lib__group${isActiveGroup ? ' ct2-lib__group--active' : ''}" data-ct2-group="${group.id}">
    <div class="ct2-lib__group-header${prodId ? ' ct2-lib__group-header--clickable' : ''}" ${prodId ? `data-ct2-prod="${prodId}"` : ''}>
      <span class="ct2-lib__group-label">${group.label}</span>
      <button type="button" class="ct2-lib__group-add" aria-label="Add condition to ${group.label}">${plusIcon}</button>
    </div>
    <div class="ct2-lib__group-items">${items}</div>
  </div>`;
}

function buildLibListHtml(activeId) {
  return CT_PRODUCTS.map(product => {
    const conds = CT_CONDITIONS.filter(c =>
      (c.products || []).some(p => p.id === product.id)
    );
    return buildLibGroupHtml(
      { id: product.id, label: product.label },
      conds,
      activeId,
      product.id
    );
  }).join('');
}

function buildProductList() {
  return CT_PRODUCTS.map(p => {
    const count = CT_CONDITIONS.filter(c => (c.products || []).some(pc => pc.id === p.id)).length;
    const isActive = CT_SELECTED_PROD_VIEW === p.id;
    return `<button type="button" class="ct2-prod-item${isActive ? ' ct2-prod-item--active' : ''}" data-ct2-prod="${p.id}">
      <span class="ct2-prod-item__label">${p.label}</span>
      ${count > 0 ? `<span class="ct2-prod-item__count">${count}</span>` : ''}
    </button>`;
  }).join('');
}

function buildSidebar(activeId) {
  const listIcon = typeof iconSvg === 'function' ? iconSvg('list-bullet') : '';
  return `<aside class="ct2-sidebar">
  <div class="ct2-sidebar__head">
    <span class="ct2-sidebar__title">Manage Conditions</span>
  </div>
  <div class="ct2-sidebar__body">
    <div class="ct2-prod-list" data-ct2-prod-list>${buildProductList()}</div>
  </div>
  <div class="ct2-sidebar__footer">
    <button type="button" class="ct2-library-link${CT_SELECTED_PROD_VIEW === null ? ' ct2-library-link--active' : ''}" data-ct2-library>
      <span class="ct2-library-link__icon" aria-hidden="true">${listIcon}</span>
      <span>See Conditions Library</span>
    </button>
  </div>
</aside>`;
}

// ─── Canvas (Mode 1) — Activity log ──────────────────────────────────────────

function ct2RelTime(minsAgo) {
  if (minsAgo < 60)    return `${minsAgo}m ago`;
  if (minsAgo < 1440)  return `${Math.floor(minsAgo / 60)}h ago`;
  if (minsAgo < 10080) return `${Math.floor(minsAgo / 1440)}d ago`;
  return `${Math.floor(minsAgo / 10080)}w ago`;
}

function buildLogEntry(e) {
  return `<div class="ct2-log-entry" data-ct2-log-event="${e.event}">
    <div class="ct2-log-entry__body">
      <div class="ct2-log-entry__line1">
        <button type="button" class="ct2-log-entry__cond" data-ct2-cid="${e.condId}">${e.condName}</button>
      </div>
      <div class="ct2-log-entry__meta">
        <span class="ct2-log-entry__loan">${e.loanName}</span>
        <span class="ct2-log-entry__sep">·</span>
        <span class="ct2-log-entry__loan-id">${e.loanId}</span>
      </div>
    </div>
    <span class="ct2-log-entry__time">${ct2RelTime(e.minsAgo)}</span>
  </div>`;
}

function ct2LogBucket(minsAgo) {
  if (minsAgo < 1440) return 'Today';
  if (minsAgo < 2880) return 'Yesterday';
  if (minsAgo < 7 * 1440) {
    const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    // Prototype reference date: Tuesday Apr 7 2026 (dow = 2)
    const daysAgo = Math.floor(minsAgo / 1440);
    const dow = ((2 - daysAgo) % 7 + 7) % 7;
    return DAYS[dow];
  }
  if (minsAgo < 14 * 1440) return 'Last Week';
  return 'Last Month';
}

function buildCanvas() {
  let currentBucket = null;
  let isFirst = true;
  let entries = '';
  CT_ACTIVITY_LOG.forEach(e => {
    const bucket = ct2LogBucket(e.minsAgo);
    if (bucket !== currentBucket) {
      currentBucket = bucket;
      if (!isFirst) entries += `<div class="ct2-log-sep"></div>`;
      entries += `<div class="ct2-log-divider"><span class="ct2-log-divider__label">${bucket}</span></div>`;
      isFirst = false;
    }
    entries += buildLogEntry(e);
  });

  return `<div class="ct2-canvas" data-ct2-canvas>
  <div class="ct2-canvas__log-wrap">
    <div class="ct2-log-card">
      <div class="ct2-log-head">
        <span class="ct2-log-head__title">Activity</span>
      </div>
      <div class="ct2-log-feed" data-ct2-log-feed>
        ${entries}
      </div>
    </div>
  </div>
</div>`;
}

// ─── Condition Library ────────────────────────────────────────────────────────

const CT_TYPE_LABELS = {
  document_upload: 'Document upload',
  order_service:   'Order service',
  task:            'Task',
};

const CT_ROLE_LABELS = {
  borrower: 'Borrower',
  internal: 'Internal',
  both:     'Both',
};

function buildLibraryRows(query) {
  const q = (query || '').toLowerCase().trim();
  const filtered = q
    ? CT_CONDITIONS.filter(c => c.name.toLowerCase().includes(q) ||
        (CT_TYPE_LABELS[c.conditionType] || '').toLowerCase().includes(q) ||
        (CT_ROLE_LABELS[c.roleType] || '').toLowerCase().includes(q) ||
        (c.products || []).some(p => {
          const prod = CT_PRODUCTS.find(x => x.id === p.id);
          return prod?.label.toLowerCase().includes(q);
        }))
    : CT_CONDITIONS;

  if (!filtered.length) {
    return `<div class="ct2-lib__empty">No conditions match "<strong>${query}</strong>"</div>`;
  }

  return filtered.map(c => {
    const typeLabel = CT_TYPE_LABELS[c.conditionType] || c.conditionType || '—';
    const roleLabel = CT_ROLE_LABELS[c.roleType] || c.roleType || '—';
    const prodTags = (c.products || []).map(p => {
      const prod = CT_PRODUCTS.find(x => x.id === p.id);
      const stage = getStageLabel(p.dueBefore);
      return `<span class="ct2-lib__prod-tag">${prod?.label || p.id}<span class="ct2-lib__prod-stage">${stage}</span></span>`;
    }).join('');

    const triggerPills = (c.products || []).map(p => {
      const prod = CT_PRODUCTS.find(x => x.id === p.id);
      const isTriggered = p.type === 'triggered' && p.rules && p.rules.length;
      const pillClass = isTriggered ? 'ct2-lib__trig-pill--conditional' : 'ct2-lib__trig-pill--always';
      const pillLabel = isTriggered ? 'Rules match' : 'Always';
      if (isTriggered) {
        const ruleSummary = p.rules.map(r => {
          const attrLabel = (CT_RULE_ATTRIBUTES.find(a => a.value === r.attr) || {}).label || r.attr;
          const opLabel = r.op === 'is' ? '=' : r.op === 'is_not' ? '≠' : r.op;
          return `${attrLabel} ${opLabel} ${r.val}`;
        }).join(' & ');
        return `<span class="ct2-lib__trig-pill-wrap"><span class="ct2-lib__trig-pill ${pillClass}">${pillLabel}<span class="ct2-lib__trig-pill-prod">· ${prod?.label || p.id}</span></span><div class="ct2-lib__trig-tooltip">${ruleSummary}</div></span>`;
      }
      return `<span class="ct2-lib__trig-pill ${pillClass}">${pillLabel}<span class="ct2-lib__trig-pill-prod">· ${prod?.label || p.id}</span></span>`;
    }).join('');

    const typeIcon = c.conditionType === 'document_upload'
      ? `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 1.5A.5.5 0 0 1 2.5 1h5l2.5 2.5V10.5a.5.5 0 0 1-.5.5h-7a.5.5 0 0 1-.5-.5v-9Z" stroke="currentColor" stroke-width="1"/><path d="M7.5 1v2.5H10" stroke="currentColor" stroke-width="1"/></svg>`
      : `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4.5" stroke="currentColor" stroke-width="1"/><path d="M6 3.5v2.75L7.5 8" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`;

    return `<div class="ct2-lib__row" data-ct2-lib-cid="${c.id}">
      <div class="ct2-lib__col ct2-lib__col--name">
        <span class="ct2-lib__name">${c.name}</span>
      </div>
      <div class="ct2-lib__col ct2-lib__col--type">
        <span class="ct2-lib__type-badge ct2-lib__type-badge--${c.conditionType}">${typeIcon}${typeLabel}</span>
      </div>
      <div class="ct2-lib__col ct2-lib__col--role">
        <span class="ct2-lib__role-badge ct2-lib__role-badge--${c.roleType}">${roleLabel}</span>
      </div>
      <div class="ct2-lib__col ct2-lib__col--products">
        <div class="ct2-lib__prod-list">${prodTags}</div>
      </div>
      <div class="ct2-lib__col ct2-lib__col--trigger">
        <div class="ct2-lib__trig-list">${triggerPills}</div>
      </div>
    </div>`;
  }).join('');
}

function buildLibrary() {
  const searchIcon = `<svg width="100%" height="100%" viewBox="0 0 13.2005 13.2005" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6005 12.6005L9.13585 9.13585M9.13585 9.13585C10.0736 8.19814 10.6004 6.92632 10.6004 5.60019C10.6004 4.27406 10.0736 3.00224 9.13585 2.06452C8.19814 1.1268 6.92632 0.6 5.60019 0.6C4.27406 0.6 3.00224 1.1268 2.06452 2.06452C1.1268 3.00224 0.6 4.27406 0.6 5.60019C0.6 6.92632 1.1268 8.19814 2.06452 9.13585C3.00224 10.0736 4.27406 10.6004 5.60019 10.6004C6.92632 10.6004 8.19814 10.0736 9.13585 9.13585Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `<div class="ct2-canvas" data-ct2-canvas>
  <div class="ct2-lib-wrap">
    <div class="ct2-lib-card">
      <div class="ct2-lib-head">
        <span class="ct2-lib-head__title">Condition Library</span>
        <div class="search-bar__input">
          <div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector">${searchIcon}</div></div></div>
          <input type="text" class="search-bar__field" placeholder="Search by name, type, role or product…" data-ct2-lib-search spellcheck="false" autocomplete="off">
        </div>
      </div>
      <div class="ct2-lib-table-head">
        <span class="ct2-lib__col ct2-lib__col--name">Name</span>
        <span class="ct2-lib__col ct2-lib__col--type">Type</span>
        <span class="ct2-lib__col ct2-lib__col--role">Assigned to</span>
        <span class="ct2-lib__col ct2-lib__col--products">Products &amp; stage</span>
        <span class="ct2-lib__col ct2-lib__col--trigger">Trigger</span>
      </div>
      <div class="ct2-lib-rows" data-ct2-lib-rows>
        ${buildLibraryRows('')}
      </div>
    </div>
  </div>
</div>`;
}

function bindLibrary(root) {
  const searchInput = root.querySelector('[data-ct2-lib-search]');
  const rowsContainer = root.querySelector('[data-ct2-lib-rows]');
  if (!searchInput || !rowsContainer) return;

  searchInput.addEventListener('input', () => {
    rowsContainer.innerHTML = buildLibraryRows(searchInput.value);
  });

  // Click a row → open that condition in its first product's context
  rowsContainer.addEventListener('click', e => {
    const row = e.target.closest('[data-ct2-lib-cid]');
    if (!row) return;
    const condId = row.getAttribute('data-ct2-lib-cid');
    const cond = CT_CONDITIONS.find(c => c.id === condId);
    if (!cond || !cond.products?.length) return;
    const firstProd = cond.products[0].id;
    enterSplitView(condId, firstProd, root);
  });
}

// ─── Product Stage View ───────────────────────────────────────────────────────

function buildProductStageView(productId, selectedCondId) {
  const product = CT_PRODUCTS.find(p => p.id === productId);
  if (!product) return '';

  // Collect conditions per stage for this product
  const byStage = {};
  CT_STAGES_V2.forEach(s => { byStage[s.id] = []; });
  CT_CONDITIONS.forEach(c => {
    const prodConfig = (c.products || []).find(p => p.id === productId);
    if (prodConfig && byStage[prodConfig.dueBefore]) {
      byStage[prodConfig.dueBefore].push(c);
    }
  });

  const cols = CT_STAGES_V2.map((stage, i) => {
    const conds = byStage[stage.id] || [];
    const isLast = i === CT_STAGES_V2.length - 1;
    const items = conds.map(c => {
      const isActive = c.id === selectedCondId;
      return `<button type="button" class="ct2-psv-item${isActive ? ' ct2-psv-item--active' : ''}" data-ct2-cid="${c.id}">
        <span class="ct2-psv-item__dot ct2-psv-item__dot--${getConditionIconType(c)}"></span>
        <span class="ct2-psv-item__name">${c.name}</span>
      </button>`;
    }).join('');

    return `<div class="ct2-psv-col${isLast ? ' ct2-psv-col--last' : ''}">
      <div class="ct2-psv-col__head">
        <span class="ct2-psv-col__label">${stage.label}</span>
        <div class="ct2-psv-col__tl">
          <div class="ct2-psv-dot"></div>
          ${!isLast ? '<div class="ct2-psv-line"></div>' : ''}
        </div>
      </div>
      <div class="ct2-psv-col__body">
        ${conds.length ? `<div class="ct2-psv-card">${items}</div>` : ''}
        <button type="button" class="ct2-psv-add"
          data-ct2-psv-add-stage="${stage.id}"
          data-ct2-psv-add-prod="${productId}">Add Condition</button>
      </div>
    </div>`;
  }).join('');

  return `<div class="ct2-prod-stage-view" data-ct2-prod-stage-view data-ct2-prod-id="${productId}">
  <div class="ct2-prod-stage-view__inner">
    <div class="ct2-psv-title">${product.label}</div>
    <div class="ct2-psv-track">${cols}</div>
  </div>
</div>`;
}

// ─── Vertical Stage View (left panel of horizontal split) ────────────────────

function buildVerticalStageView(productId, selectedCondId) {
  const product = CT_PRODUCTS.find(p => p.id === productId);
  if (!product) return '';

  const byStage = {};
  CT_STAGES_V2.forEach(s => { byStage[s.id] = []; });
  CT_CONDITIONS.forEach(c => {
    const prodConfig = (c.products || []).find(p => p.id === productId);
    if (prodConfig) {
      const sStage = sidebarStageFor(prodConfig.dueBefore);
      if (byStage[sStage]) byStage[sStage].push(c);
    }
  });

  const stages = CT_STAGES_V2.map((stage, i) => {
    const conds = byStage[stage.id] || [];
    const isLast = i === CT_STAGES_V2.length - 1;
    const items = conds.map(c => {
      const isActive = c.id === selectedCondId;
      return `<button type="button" class="ct2-vsv-item${isActive ? ' ct2-vsv-item--active' : ''}" data-ct2-cid="${c.id}" draggable="true">
        <span class="ct2-vsv-item__drag-handle" aria-hidden="true"><svg width="10" height="14" viewBox="0 0 10 14" fill="none"><circle cx="3" cy="2.5" r="1.25" fill="currentColor"/><circle cx="7" cy="2.5" r="1.25" fill="currentColor"/><circle cx="3" cy="7" r="1.25" fill="currentColor"/><circle cx="7" cy="7" r="1.25" fill="currentColor"/><circle cx="3" cy="11.5" r="1.25" fill="currentColor"/><circle cx="7" cy="11.5" r="1.25" fill="currentColor"/></svg></span>
        <span class="ct2-vsv-item__name">${c.name}</span>
      </button>`;
    }).join('');

    return `<div class="ct2-vsv-stage${isLast ? ' ct2-vsv-stage--last' : ''}">
      <div class="ct2-vsv-stage__rail">
        <div class="ct2-vsv-stage__dot"></div>
        ${!isLast ? '<div class="ct2-vsv-stage__line"></div>' : ''}
      </div>
      <div class="ct2-vsv-stage__content">
        <button type="button" class="ct2-vsv-stage__header" data-ct2-stage-toggle aria-expanded="true">
          <span class="ct2-vsv-stage__label">${stage.label}</span>
          <span class="ct2-vsv-stage__chevron" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
        </button>
        <span class="ct2-vsv-stage__collapsed-count">${conds.length} condition${conds.length !== 1 ? 's' : ''}</span>
        <div class="ct2-vsv-stage__body-wrap">
          <div class="ct2-vsv-stage__body" data-ct2-stage-body data-ct2-stage-id="${stage.id}">
            ${items}
            <button type="button" class="ct2-vsv-add" data-ct2-psv-add-stage="${stage.id}" data-ct2-psv-add-prod="${productId}">+ Add</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  return `<div class="ct2-hsplit-left__header"><h2 class="ct2-hsplit-left__title">All conditions for ${product.label}</h2></div>
<div class="ct2-hsplit-left__scroll">
<div class="ct2-vsv" data-ct2-prod-stage-view data-ct2-prod-id="${productId}">${stages}</div>
</div>
<div class="ct2-hsplit-left__footer">
  <div class="search-bar__input">
    <div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector"><svg width="100%" height="100%" viewBox="0 0 13.2005 13.2005" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6005 12.6005L9.13585 9.13585M9.13585 9.13585C10.0736 8.19814 10.6004 6.92632 10.6004 5.60019C10.6004 4.27406 10.0736 3.00224 9.13585 2.06452C8.19814 1.1268 6.92632 0.6 5.60019 0.6C4.27406 0.6 3.00224 1.1268 2.06452 2.06452C1.1268 3.00224 0.6 4.27406 0.6 5.60019C0.6 6.92632 1.1268 8.19814 2.06452 9.13585C3.00224 10.0736 4.27406 10.6004 5.60019 10.6004C6.92632 10.6004 8.19814 10.0736 9.13585 9.13585Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div></div></div>
    <input type="text" class="search-bar__field" data-ct2-vsv-search placeholder="Search" spellcheck="false" autocomplete="off">
  </div>
</div>`;
}

function buildHSplitEmptyState() {
  return `<div class="ct2-hsplit-empty">
    <span class="ct2-hsplit-empty__label">Select a condition to edit</span>
  </div>`;
}

function refreshVerticalStageView(left, productId, selectedCondId) {
  if (!left) return;
  const scrollEl = left.querySelector('.ct2-hsplit-left__scroll');
  const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
  left.innerHTML = buildVerticalStageView(productId, selectedCondId);
  const nextScrollEl = left.querySelector('.ct2-hsplit-left__scroll');
  if (nextScrollEl) nextScrollEl.scrollTop = scrollTop;
  left.classList.toggle('ct2-hsplit-left--scrolled', scrollTop > 8);
}

// ─── Canvas track (kept for reference) ───────────────────────────────────────

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

function buildRoleTypeField(cond) {
  const current = cond.roleType && CT_ROLE_TYPES.some(r => r.id === cond.roleType)
    ? cond.roleType
    : 'borrower';
  const selectedRole = CT_ROLE_TYPES.find(r => r.id === current) || CT_ROLE_TYPES[0];
  const chevron = `<svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `<div class="ct2-detail__section">
    <div class="ct2-detail__label">Assigned to</div>
    <div class="ct2-docclass-dropdown" data-ct2-role-dropdown>
      <button type="button" class="ct2-docclass-trigger" data-ct2-role-trigger
        aria-label="Assigned to" aria-haspopup="listbox" aria-expanded="false">
        <span class="ct2-docclass-trigger__label" data-ct2-role-label>${selectedRole.label}</span>
        <span class="ct2-docclass-trigger__icon" aria-hidden="true">${chevron}</span>
      </button>
    </div>
  </div>`;
}

/** Center panel: name + condition type + product list */
function buildDetailCenter(cond, selectedProdId, opts = {}) {
  const showBackInHeader = opts.splitView !== true;
  const backBtn = showBackInHeader
    ? buildBtnPreviewHtml({ id: 's1', icons: ['chevron-left'] })
        .replace('<button class="btn btn--s1" tabindex="-1"', '<button class="btn btn--s1" tabindex="-1" data-ct2-back aria-label="Back to canvas"')
    : '';
  const allProds = cond.products || [];
  const currentProd = allProds.find(p => p.id === selectedProdId) || allProds[0];
  const currentProdId = currentProd?.id;
  const otherProds = allProds.filter(p => p.id !== currentProdId);
  const otherRows = otherProds.map(p => {
    const label = getProductLabel(p.id);
    const stageLabel = getStageLabel(p.dueBefore);
    const typeLabel = p.type === 'triggered' ? 'Rule matches' : 'Always';
    return `<div class="ct2-also-row" data-ct2-prod-row="${p.id}">
      <span class="ct2-also-row__label">${label}</span>
      <span class="ct2-also-row__meta">Before ${stageLabel} · ${typeLabel}</span>
    </div>`;
  }).join('');
  const selectedIds = allProds.map(p => p.id);

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

  ${buildRoleTypeField(cond)}

  ${otherProds.length > 0 ? `<div class="ct2-also-section" data-ct2-also-section>
    <button type="button" class="ct2-also-toggle" data-ct2-also-toggle aria-expanded="false">
      Also applied to ${otherProds.length} other product${otherProds.length !== 1 ? 's' : ''}
    </button>
    <div class="ct2-also-list" data-ct2-also-list hidden>
      ${otherRows}
    </div>
  </div>` : ''}

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
    const isDisabled = i === 0; // Application: not selectable (dueBefore must be ≥ Underwriting)
    const line = i > 0 ? '<div class="ct2-rst__line"></div>' : '';
    return `${line}<div class="ct2-rst__stop${isActive ? ' ct2-rst__stop--active' : ''}${isDisabled ? ' ct2-rst__stop--disabled' : ''}" data-ct2-rst-stop="${stage.id}">
      <button type="button" class="ct2-rst__dot-btn" data-ct2-right-stage="${stage.id}" aria-label="Due before ${stage.label}"${isDisabled ? ' disabled aria-disabled="true"' : ''}>
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
    <span class="ct2-right__header-label">When should this condition trigger?</span>
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

function buildDetail(cond, selectedProdId, detailOpts = {}) {
  const prodIds = (cond.products || []).map(p => p.id);
  if (!selectedProdId) {
    selectedProdId = (prodIds.includes(CT_SELECTED_PROD_VIEW) ? CT_SELECTED_PROD_VIEW : null)
      || prodIds[0]
      || null;
  }
  const selProd = (cond.products || []).find(p => p.id === selectedProdId) || null;

  return `<div class="ct2-detail-wrap" data-ct2-detail>
  <div class="ct2-white-card">
    <div class="ct2-detail-cols">
      ${buildDetailCenter(cond, selectedProdId, detailOpts)}
      ${buildDetailRight(selProd)}
    </div>
  </div>
</div>`;
}

// ─── Root HTML ────────────────────────────────────────────────────────────────

function buildConditionTemplateModalDialogHtml() {
  const xIcon = typeof iconSvg === 'function' ? iconSvg('x-mark') : '×';
  const firstProduct = CT_PRODUCTS[0];
  const defaultBody = firstProduct
    ? `<div class="ct2-hsplit-wrap" data-ct2-hsplit>
        <div class="ct2-hsplit-left" data-ct2-hsplit-left>${buildVerticalStageView(firstProduct.id, null)}</div>
        <div class="ct2-hsplit-divider" data-ct2-hsplit-divider role="separator" aria-orientation="vertical" aria-label="Resize stage list and detail"></div>
        <div class="ct2-hsplit-right" data-ct2-hsplit-right>${buildHSplitEmptyState()}</div>
      </div>`
    : buildLibrary();

  // Set initial selected state so sidebar highlights the first product
  if (firstProduct) CT_SELECTED_PROD_VIEW = firstProduct.id;

  return `<div class="ct2-root" data-ct2-root>
  ${buildSidebar(null)}
  <div class="ct2-main" data-ct2-main>
    <div class="ct2-main__body" data-ct2-main-body>
      ${defaultBody}
    </div>
    <div class="ct2-main__footer">
      <button type="button" class="ct2-footer__btn ct2-footer__btn--ghost" data-ct-cancel>Cancel</button>
      <button type="button" class="ct2-footer__btn ct2-footer__btn--primary" data-ct2-save>Save Changes</button>
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
  const prodIds = (cond.products || []).map(p => p.id);
  CT_SELECTED_PROD_ID = selectedProdId
    || (prodIds.includes(CT_SELECTED_PROD_VIEW) ? CT_SELECTED_PROD_VIEW : null)
    || prodIds[0]
    || null;
  CT_ORIGINAL_SNAPSHOT = stableStringify(cond);
  // Keep CT_SELECTED_PROD_VIEW so the back button returns to the right product
  refreshProductList(root);

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
  CT_SELECTED_PROD_VIEW = null;
  CT_ORIGINAL_SNAPSHOT = null;
  refreshProductList(root);
  document.querySelectorAll('.ct2-docclass-menu').forEach(m => m.remove());

  const body = root.querySelector('[data-ct2-main-body]');
  const existing = body.firstElementChild;

  const showLibrary = () => {
    body.innerHTML = buildLibrary();
    bindLibrary(root);
    bindCanvas(root);
    const el = body.firstElementChild;
    if (el) ct2In(el, false);
  };

  existing ? ct2OutBack(existing, showLibrary) : showLibrary();
}

function enterProductView(productId, root) {
  CT_SELECTED_PROD_VIEW = productId;
  CT_SELECTED_ID = null;
  refreshProductList(root);
  document.querySelectorAll('.ct2-docclass-menu').forEach(m => m.remove());

  const body = root.querySelector('[data-ct2-main-body]');
  const hsplit = body?.querySelector('[data-ct2-hsplit]');

  if (hsplit) {
    // Card stays — just refresh left nav and clear right panel
    const left = hsplit.querySelector('[data-ct2-hsplit-left]');
    refreshVerticalStageView(left, productId, null);
    const right = hsplit.querySelector('[data-ct2-hsplit-right]');
    if (right) { right.innerHTML = buildHSplitEmptyState(); ct2InFade(right.firstElementChild); }
    return;
  }

  // Fresh render
  const existing = body?.firstElementChild;
  const showView = () => {
    body.innerHTML = `<div class="ct2-hsplit-wrap" data-ct2-hsplit>
      <div class="ct2-hsplit-left" data-ct2-hsplit-left>${buildVerticalStageView(productId, null)}</div>
      <div class="ct2-hsplit-divider" data-ct2-hsplit-divider role="separator" aria-orientation="vertical" aria-label="Resize stage list and detail"></div>
      <div class="ct2-hsplit-right" data-ct2-hsplit-right>${buildHSplitEmptyState()}</div>
    </div>`;
    const el = body.firstElementChild;
    if (el) ct2InFade(el);
  };
  existing ? ct2Out(existing, showView) : showView();
}

function enterSplitView(condId, productId, root) {
  const cond = CT_CONDITIONS.find(c => c.id === condId);
  if (!cond) return;
  CT_SELECTED_ID = condId;
  CT_SELECTED_PROD_VIEW = productId;
  CT_SELECTED_PROD_ID = null;
  CT_ORIGINAL_SNAPSHOT = stableStringify(cond);
  refreshProductList(root);
  document.querySelectorAll('.ct2-docclass-menu').forEach(m => m.remove());

  const body = root.querySelector('[data-ct2-main-body]');
  const hsplit = body?.querySelector('[data-ct2-hsplit]');

  if (hsplit) {
    // Refresh left nav highlight
    const left = hsplit.querySelector('[data-ct2-hsplit-left]');
    refreshVerticalStageView(left, productId, condId);

    // Swap in editor on right — fade in
    const right = hsplit.querySelector('[data-ct2-hsplit-right]');
    if (right) {
      right.innerHTML = buildDetail(cond, null, { splitView: true });
      bindDetail(root);
      bindDetailRight(root);
      attachTooltips(right);
      ct2InFade(right.firstElementChild);
    }
    return;
  }

  // No card yet — create fresh
  const existing = body?.firstElementChild;
  const showSplit = () => {
    body.innerHTML = `<div class="ct2-hsplit-wrap" data-ct2-hsplit>
      <div class="ct2-hsplit-left" data-ct2-hsplit-left>${buildVerticalStageView(productId, condId)}</div>
      <div class="ct2-hsplit-divider" data-ct2-hsplit-divider role="separator" aria-orientation="vertical" aria-label="Resize stage list and detail"></div>
      <div class="ct2-hsplit-right" data-ct2-hsplit-right>${buildDetail(cond, null, { splitView: true })}</div>
    </div>`;
    bindDetail(root);
    bindDetailRight(root);
    attachTooltips(body);
    const right = body.querySelector('[data-ct2-hsplit-right]');
    if (right?.firstElementChild) ct2InFade(right.firstElementChild);
  };
  existing ? ct2Out(existing, showSplit) : showSplit();
}

function refreshProductList(root) {
  const list = root.querySelector('[data-ct2-prod-list]');
  if (list) list.innerHTML = buildProductList();
  // also update library link active state
  const libLink = root.querySelector('[data-ct2-library]');
  if (libLink) libLink.classList.toggle('ct2-library-link--active', CT_SELECTED_PROD_VIEW === null && CT_SELECTED_ID === null);
}

function refreshLibList(root) {
  refreshProductList(root);
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
}

// ─── Detail event binding ─────────────────────────────────────────────────────

function bindHSplitResize(root) {
  if (!root || root._ct2HsplitResizeBound) return;
  root._ct2HsplitResizeBound = true;

  const MIN_LEFT = 160;
  const MIN_RIGHT = 240;
  const DIVIDER_SLOP = 8;

  root.addEventListener('mousedown', e => {
    const handle = e.target.closest('.ct2-hsplit-divider');
    if (!handle || !root.contains(handle)) return;
    e.preventDefault();
    const wrap = handle.closest('[data-ct2-hsplit]');
    const left = wrap?.querySelector('[data-ct2-hsplit-left]');
    if (!wrap || !left) return;

    const startX = e.clientX;
    const startW = left.getBoundingClientRect().width;

    wrap.classList.add('ct2-hsplit-wrap--resizing');
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = ev => {
      const wrapW = wrap.getBoundingClientRect().width;
      const maxLeft = Math.max(MIN_LEFT, wrapW - MIN_RIGHT - DIVIDER_SLOP);
      let nw = startW + (ev.clientX - startX);
      nw = Math.min(maxLeft, Math.max(MIN_LEFT, nw));
      left.style.flex = `0 0 ${nw}px`;
      left.style.width = `${nw}px`;
    };

    const onUp = () => {
      wrap.classList.remove('ct2-hsplit-wrap--resizing');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

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
  const stageLabel = getStageLabel(prod.dueBefore);
  const typeLabel  = prod.type === 'triggered' ? 'Rule matches' : 'Always';
  const metaText   = `Before ${stageLabel} · ${typeLabel}`;
  const row = root.querySelector(`[data-ct2-prod-row="${prodId}"]`);
  const typeSpan = row?.querySelector('.ct2-prod-row__type');
  if (typeSpan) typeSpan.textContent = metaText;
  // Sync center trigger summary if this is the currently viewed prod
  if (prodId === CT_SELECTED_PROD_ID) {
    const summary = root.querySelector('[data-ct2-trigger-summary]');
    if (summary) {
      summary.querySelector('.ct2-trigger-summary__stage').textContent = `Before ${stageLabel}`;
      summary.querySelector('.ct2-trigger-summary__type').textContent = typeLabel;
    }
  }
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
      markDirty(root);
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
      markDirty(root);
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
      markDirty(root);
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
      markDirty(root);
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
    markDirty(root);
    reRenderRules(right, prod.rules);
  });
}

function bindDetail(root) {
  const detail = root.querySelector('[data-ct2-detail]');
  if (!detail) return;

  // Sync dirty state on any field change (fires after field-specific listeners update CT_CONDITIONS)
  detail.addEventListener('input', () => syncDirty(root));
  detail.addEventListener('change', () => syncDirty(root));

  // Back (center header in full detail, or left column in split view)
  root.querySelector('[data-ct2-back]')?.addEventListener('click', () => {
    if (CT_SELECTED_PROD_VIEW) enterProductView(CT_SELECTED_PROD_VIEW, root);
    else enterCanvas(root);
  });

  // Name field: pencil activates edit mode; typing swaps pencil → blue checkmark
  const nameField = detail.querySelector('[data-ct2-name-field]');
  const nameInput = detail.querySelector('[data-ct2-name-input]');
  const nameSizer = detail.querySelector('.ct2-name-sizer');

  const syncNameWidth = () => {
    if (!nameSizer || !nameInput) return;
    nameSizer.textContent = nameInput.value || nameInput.placeholder;
    nameInput.style.width = nameSizer.offsetWidth + 'px';
  };
  syncNameWidth();

  const checkBtnHtml = `<button type="button" class="btn btn--s1 ct2-name-field__confirm" tabindex="0" data-ct2-name-confirm aria-label="Confirm name"><div class="btn__icon-wrap"><div class="btn__icon-inner"><div class="btn__icon-vector"><svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip_checkmark_ct2)"><path d="M6.44546 14.017C6.73864 14.017 6.97045 13.8875 7.13409 13.6352L13.5773 3.48974C13.7 3.29202 13.7477 3.14202 13.7477 2.9852C13.7477 2.6102 13.5023 2.36475 13.1273 2.36475C12.8546 2.36475 12.7045 2.45338 12.5409 2.71247L6.41818 12.4693L3.24091 8.3102C3.07045 8.07156 2.9 7.97611 2.65455 7.97611C2.26591 7.97611 2 8.24202 2 8.61702C2 8.77384 2.06818 8.95111 2.19773 9.11472L5.73636 13.6215C5.94091 13.8875 6.15228 14.017 6.44546 14.017Z" fill="var(--accent-white-100,#fff)"></path></g><defs><clipPath id="clip_checkmark_ct2"><rect width="12" height="12.0341" fill="white" transform="translate(2 1.98297)"></rect></clipPath></defs></svg></div></div></div></button>`;

  const pencilBtnHtml = buildBtnPreviewHtml({ id: 's1', icons: ['pencil'] })
    .replace('<button class="btn btn--s1" tabindex="-1"', '<button class="btn btn--s1 ct2-name-field__edit" tabindex="0" data-ct2-name-edit aria-label="Edit name"');

  const confirmEdit = () => {
    nameField?.classList.remove('ct2-name-field--editing', 'ct2-name-field--dirty');
    // Restore pencil button
    const confirmBtn = nameField?.querySelector('[data-ct2-name-confirm]');
    if (confirmBtn) {
      confirmBtn.outerHTML = pencilBtnHtml;
      nameField.querySelector('[data-ct2-name-edit]')?.addEventListener('click', () => {
        nameField.classList.add('ct2-name-field--editing');
        nameInput?.focus(); nameInput?.select();
      });
    }
    // Sync left nav item name
    const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    if (cond) {
      const navItem = root.querySelector(`[data-ct2-cid="${cond.id}"] .ct2-vsv-item__name`);
      if (navItem) navItem.textContent = cond.name;
    }
  };

  detail.querySelector('[data-ct2-name-edit]')?.addEventListener('click', () => {
    nameField?.classList.add('ct2-name-field--editing');
    nameInput?.focus(); nameInput?.select();
  });

  nameInput?.addEventListener('blur', e => {
    // Only auto-exit if not dirty (no changes made)
    if (!nameField?.classList.contains('ct2-name-field--dirty')) {
      nameField?.classList.remove('ct2-name-field--editing');
    }
  });

  // Name input
  nameInput?.addEventListener('input', e => {
    const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    if (!cond) return;
    cond.name = e.target.value;
    syncNameWidth();

    // First change: swap pencil → DS checkmark button
    if (!nameField?.classList.contains('ct2-name-field--dirty')) {
      nameField?.classList.add('ct2-name-field--dirty');
      const editBtn = nameField?.querySelector('[data-ct2-name-edit]');
      if (editBtn) {
        editBtn.outerHTML = checkBtnHtml;
        nameField.querySelector('[data-ct2-name-confirm]')?.addEventListener('click', confirmEdit, { once: true });
      }
    }
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
    if (newType !== 'document_upload') {
      delete cond.docClass;
    } else {
      // Restore original docClass if switching back
      const snap = CT_ORIGINAL_SNAPSHOT ? JSON.parse(CT_ORIGINAL_SNAPSHOT) : null;
      if (snap?.docClass) cond.docClass = snap.docClass;
    }
    syncDirty(root);

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
      if (cond) { cond.docClass = val; markDirty(root); }
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

  // Applicable role — same trigger + body-fixed menu pattern as document class
  const roleDropdown = detail.querySelector('[data-ct2-role-dropdown]');
  if (roleDropdown) {
    const trigger = roleDropdown.querySelector('[data-ct2-role-trigger]');
    const label = roleDropdown.querySelector('[data-ct2-role-label]');

    const roleMenu = document.createElement('div');
    roleMenu.className = 'loans-dropdown ct2-docclass-menu';
    roleMenu.style.display = 'none';

    const buildRoleMenuItems = () => {
      roleMenu.innerHTML = '';
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      const selectedId = (cond?.roleType && CT_ROLE_TYPES.some(r => r.id === cond.roleType))
        ? cond.roleType
        : 'borrower';
      CT_ROLE_TYPES.forEach(r => {
        const item = document.createElement('div');
        item.className = 'loans-dropdown__item' + (r.id === selectedId ? ' loans-dropdown__item--active' : '');
        item.dataset.ct2RoleItem = r.id;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', r.id === selectedId ? 'true' : 'false');
        const lbl = document.createElement('span');
        lbl.className = 'loans-dropdown__item-label';
        lbl.textContent = r.label;
        item.appendChild(lbl);
        roleMenu.appendChild(item);
      });
    };
    buildRoleMenuItems();
    document.body.appendChild(roleMenu);

    const openRoleMenu = () => {
      buildRoleMenuItems();
      const r = trigger.getBoundingClientRect();
      const menuTop = r.bottom + 4;
      roleMenu.style.top = `${menuTop}px`;
      roleMenu.style.left = `${r.left}px`;
      roleMenu.style.width = `${r.width}px`;
      roleMenu.style.minWidth = `${r.width}px`;
      roleMenu.style.maxHeight = `${window.innerHeight - menuTop - 16}px`;
      roleMenu.style.display = 'flex';
      trigger.setAttribute('aria-expanded', 'true');
      requestAnimationFrame(() => roleMenu.classList.add('ct2-docclass-menu--open'));
      roleDropdown.classList.add('ct2-docclass-dropdown--open');
    };
    const closeRoleMenu = () => {
      roleMenu.classList.remove('ct2-docclass-menu--open');
      trigger.setAttribute('aria-expanded', 'false');
      roleMenu.addEventListener('transitionend', () => {
        if (!roleMenuOpen()) roleMenu.style.display = 'none';
      }, { once: true });
      roleDropdown.classList.remove('ct2-docclass-dropdown--open');
    };
    const roleMenuOpen = () => roleMenu.classList.contains('ct2-docclass-menu--open');

    trigger.addEventListener('click', e => {
      e.stopPropagation();
      roleMenuOpen() ? closeRoleMenu() : openRoleMenu();
    });

    roleMenu.addEventListener('click', e => {
      const item = e.target.closest('[data-ct2-role-item]');
      if (!item) return;
      const val = item.dataset.ct2RoleItem;
      const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
      if (cond) { cond.roleType = val; markDirty(root); }
      const found = CT_ROLE_TYPES.find(r => r.id === val);
      if (found && label) label.textContent = found.label;
      roleMenu.querySelectorAll('[data-ct2-role-item]').forEach(el => {
        const on = el.dataset.ct2RoleItem === val;
        el.classList.toggle('loans-dropdown__item--active', on);
        el.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      closeRoleMenu();
    });

    document.addEventListener('click', function onRoleOutside(e) {
      if (!roleDropdown.contains(e.target) && !roleMenu.contains(e.target)) {
        closeRoleMenu();
        if (!document.body.contains(roleDropdown)) {
          roleMenu.remove();
          document.removeEventListener('click', onRoleOutside);
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
        markDirty(root);
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

  // "Also in N other products" toggle
  detail.querySelector('[data-ct2-also-toggle]')?.addEventListener('click', e => {
    const list = detail.querySelector('[data-ct2-also-list]');
    if (!list) return;
    const open = !list.hidden;
    list.hidden = open;
    e.currentTarget.setAttribute('aria-expanded', String(!open));
    e.currentTarget.classList.toggle('ct2-also-toggle--open', !open);
  });

  // "Also in N products" row click → switch left sidebar to that product + open condition there
  detail.querySelector('[data-ct2-also-list]')?.addEventListener('click', e => {
    const row = e.target.closest('[data-ct2-prod-row]');
    if (row) enterSplitView(CT_SELECTED_ID, row.getAttribute('data-ct2-prod-row'), root);
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
      markDirty(root);
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
    // Entire log row click → open detail
    const logRow = e.target.closest('.ct2-log-entry[data-ct2-log-event]');
    if (logRow) {
      const condBtn = logRow.querySelector('[data-ct2-cid]');
      if (condBtn) { enterDetail(condBtn.getAttribute('data-ct2-cid'), root); return; }
    }

    // Filter tab click
    const filterBtn = e.target.closest('[data-ct2-log-filter]');
    if (filterBtn) {
      const filter = filterBtn.getAttribute('data-ct2-log-filter');
      canvas.querySelectorAll('[data-ct2-log-filter]').forEach(b =>
        b.classList.toggle('ct2-log-filter--active', b.getAttribute('data-ct2-log-filter') === filter)
      );
      canvas.querySelectorAll('[data-ct2-log-event]').forEach(entry => {
        const ev = entry.getAttribute('data-ct2-log-event');
        entry.style.display = (filter === 'all' || ev === filter) ? '' : 'none';
      });
    }
  });
}

// ─── Drag-and-drop helpers ────────────────────────────────────────────────────

let _ct2DragId = null;
let _ct2DropLine = null;
let _ct2DragFromHandle = false;

function _ct2RemoveDropLine() {
  if (_ct2DropLine && _ct2DropLine.parentNode) {
    _ct2DropLine.parentNode.removeChild(_ct2DropLine);
  }
  _ct2DropLine = null;
}

function _ct2ShowDropLine(refEl, position) {
  _ct2RemoveDropLine();
  _ct2DropLine = document.createElement('div');
  _ct2DropLine.className = 'ct2-vsv-drop-line';
  _ct2DropLine.setAttribute('aria-hidden', 'true');
  if (position === 'before') {
    refEl.parentNode.insertBefore(_ct2DropLine, refEl);
  } else if (position === 'after') {
    refEl.parentNode.insertBefore(_ct2DropLine, refEl.nextSibling);
  } else if (position === 'end') {
    const addBtn = refEl.querySelector('.ct2-vsv-add');
    if (addBtn) refEl.insertBefore(_ct2DropLine, addBtn);
    else refEl.appendChild(_ct2DropLine);
  }
}

// ─── Add-condition popover + library picker ───────────────────────────────────

function showAddPopover(anchorEl, stageId, prodId, root) {
  document.querySelectorAll('.ct2-add-popover').forEach(p => p.remove());

  // Keep the stage's "+ Add" button visible while popover is open
  const stageEl = anchorEl.closest('.ct2-vsv-stage');
  if (stageEl) stageEl.classList.add('ct2-vsv-stage--pop-open');

  const listIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="1.2" rx=".6" fill="currentColor"/><rect x="2" y="6.4" width="10" height="1.2" rx=".6" fill="currentColor"/><rect x="2" y="9.8" width="7" height="1.2" rx=".6" fill="currentColor"/></svg>`;
  const plusIcon = `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2.5v9M2.5 7h9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`;

  const pop = document.createElement('div');
  pop.className = 'ct2-add-popover';
  pop.innerHTML = `
    <button type="button" class="ct2-add-popover__opt" data-ct2-pop-existing>
      <span class="ct2-add-popover__opt-icon">${listIcon}</span>
      <span class="ct2-add-popover__opt-body">
        <span class="ct2-add-popover__opt-label">Add from library</span>
        <span class="ct2-add-popover__opt-hint">Browse &amp; select existing conditions</span>
      </span>
    </button>
    <button type="button" class="ct2-add-popover__opt" data-ct2-pop-new>
      <span class="ct2-add-popover__opt-icon">${plusIcon}</span>
      <span class="ct2-add-popover__opt-body">
        <span class="ct2-add-popover__opt-label">Create new</span>
        <span class="ct2-add-popover__opt-hint">Start from a blank condition</span>
      </span>
    </button>`;
  document.body.appendChild(pop);

  const rect = anchorEl.getBoundingClientRect();
  pop.style.top = `${rect.bottom + 6}px`;
  pop.style.left = `${rect.left}px`;

  requestAnimationFrame(() => {
    const pw = pop.offsetWidth;
    const ph = pop.offsetHeight;
    let left = rect.left;
    let top  = rect.bottom + 6;
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    if (top  + ph > window.innerHeight - 8) top = rect.top - ph - 6;
    pop.style.left = `${left}px`;
    pop.style.top  = `${top}px`;
    pop.classList.add('ct2-add-popover--open');
  });

  const closePopover = () => {
    pop.remove();
    document.removeEventListener('click', dismiss, true);
    if (stageEl) stageEl.classList.remove('ct2-vsv-stage--pop-open');
  };

  const dismiss = e => {
    if (!pop.contains(e.target)) closePopover();
  };

  pop.querySelector('[data-ct2-pop-existing]').addEventListener('click', () => {
    closePopover();
    showLibraryPicker(stageId, prodId, root);
  });

  pop.querySelector('[data-ct2-pop-new]').addEventListener('click', () => {
    closePopover();
    const id = `c${Date.now()}`;
    CT_CONDITIONS.push({
      id, name: 'New Condition', roleType: 'borrower', conditionType: 'document_upload',
      products: [{ id: prodId, dueBefore: stageId, type: 'always', rules: [] }],
    });
    markDirty(root);
    enterSplitView(id, prodId, root);
  });

  setTimeout(() => document.addEventListener('click', dismiss, true), 0);
}

function buildLibraryPickerHtml(stageId, prodId) {
  // Conditions already assigned to this product+stage
  const existingIds = new Set(
    CT_CONDITIONS
      .filter(c => (c.products || []).some(p => p.id === prodId && p.dueBefore === stageId))
      .map(c => c.id)
  );

  const stageLabel = getStageLabel(stageId);
  const searchIcon = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="5.5" cy="5.5" r="3.75" stroke="currentColor" stroke-width="1.2"/><path d="M8.75 8.75L11 11" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;

  const items = CT_CONDITIONS.map(c => {
    const disabled = existingIds.has(c.id);
    const typeLabel = CT_TYPE_LABELS[c.conditionType] || c.conditionType || '';
    return `<label class="ct2-lp-item${disabled ? ' ct2-lp-item--disabled' : ''}" data-ct2-lp-item="${c.id}">
      <input type="checkbox" class="ct2-lp-item__chk-native" data-ct2-lp-check="${c.id}" ${disabled ? 'disabled checked' : ''}>
      <span class="ct2-lp-item__chk" aria-hidden="true"></span>
      <span class="ct2-lp-item__name">${c.name}</span>
      ${disabled
        ? `<span class="ct2-lp-item__added-badge">Added</span>`
        : `<span class="ct2-lp-item__type">${typeLabel}</span>`}
    </label>`;
  }).join('');

  return `<div class="ct2-lib-picker" data-ct2-lib-picker data-ct2-lp-stage="${stageId}" data-ct2-lp-prod="${prodId}">
  <div class="ct2-lib-picker__head">
    <div class="ct2-lib-picker__head-left">
      <span class="ct2-lib-picker__title">Add from library</span>
      <span class="ct2-lib-picker__sub">Adding to ${stageLabel} stage</span>
    </div>
    <div class="ct2-lib-picker__search-pill">
      <span class="ct2-lib-picker__search-icon">${searchIcon}</span>
      <input type="text" class="ct2-lib-picker__search" placeholder="Search…" data-ct2-lp-search>
    </div>
  </div>
  <div class="ct2-lib-picker__list" data-ct2-lp-list>${items}</div>
  <div class="ct2-lib-picker__footer">
    <span class="ct2-lp-count" data-ct2-lp-count>0 selected</span>
    <button type="button" class="ct2-lib-picker__add-btn" data-ct2-lp-add disabled>Add to ${stageLabel} stage</button>
  </div>
</div>`;
}

function showLibraryPicker(stageId, prodId, root) {
  // Make sure we're in split view (hsplit layout exists)
  const body = root.querySelector('[data-ct2-main-body]');
  let hsplit  = body?.querySelector('[data-ct2-hsplit]');

  if (!hsplit) {
    // Need to create the hsplit layout first
    body.innerHTML = `<div class="ct2-hsplit-wrap" data-ct2-hsplit>
      <div class="ct2-hsplit-left" data-ct2-hsplit-left>${buildVerticalStageView(prodId, null)}</div>
      <div class="ct2-hsplit-divider" data-ct2-hsplit-divider role="separator" aria-orientation="vertical"></div>
      <div class="ct2-hsplit-right" data-ct2-hsplit-right></div>
    </div>`;
    hsplit = body.querySelector('[data-ct2-hsplit]');
  }

  const right = hsplit.querySelector('[data-ct2-hsplit-right]');
  if (!right) return;

  right.innerHTML = buildLibraryPickerHtml(stageId, prodId);
  const picker = right.firstElementChild;
  if (picker) ct2InFade(picker);

  bindLibraryPicker(right, stageId, prodId, root);
}

function bindLibraryPicker(container, stageId, prodId, root) {
  const picker   = container.querySelector('[data-ct2-lib-picker]');
  const list     = container.querySelector('[data-ct2-lp-list]');
  const searchEl = container.querySelector('[data-ct2-lp-search]');
  const countEl  = container.querySelector('[data-ct2-lp-count]');
  const addBtn   = container.querySelector('[data-ct2-lp-add]');
  if (!picker) return;

  const getSelected = () => [...picker.querySelectorAll('.ct2-lp-item__chk-native:not(:disabled):checked')];

  const updateCount = () => {
    const n = getSelected().length;
    countEl.textContent = n === 0 ? '0 selected' : `${n} condition${n !== 1 ? 's' : ''} selected`;
    addBtn.disabled = n === 0;
  };

  // Search filter
  searchEl?.addEventListener('input', () => {
    const q = searchEl.value.toLowerCase().trim();
    picker.querySelectorAll('[data-ct2-lp-item]').forEach(item => {
      const name = item.querySelector('.ct2-lp-item__name')?.textContent.toLowerCase() || '';
      item.style.display = (!q || name.includes(q)) ? '' : 'none';
    });
  });

  // The label wraps the native input so clicking anywhere on the row already
  // toggles it via browser default behaviour — just update the count after.
  list?.addEventListener('change', e => {
    if (e.target.closest('.ct2-lp-item__chk-native')) updateCount();
  });

  // Add selected to stage
  addBtn?.addEventListener('click', () => {
    const selected = getSelected();
    const addedIds = [];

    selected.forEach(chk => {
      const condId = chk.dataset.ct2LpCheck;
      const cond = CT_CONDITIONS.find(c => c.id === condId);
      if (!cond) return;
      const existing = (cond.products || []).find(p => p.id === prodId);
      if (existing) {
        existing.dueBefore = stageId;
      } else {
        cond.products = cond.products || [];
        cond.products.push({ id: prodId, dueBefore: stageId, type: 'always', rules: [] });
      }
      addedIds.push(condId);
    });

    // Open the first added condition in split view
    const firstId = addedIds[0];
    if (firstId) {
      markDirty(root);
      enterSplitView(firstId, prodId, root);
    } else {
      // Nothing added — return right panel to empty state
      const right = root.querySelector('[data-ct2-hsplit-right]');
      if (right) {
        right.innerHTML = buildHSplitEmptyState();
        if (right.firstElementChild) ct2InFade(right.firstElementChild);
      }
    }
  });
}

// ─── Root binding ─────────────────────────────────────────────────────────────

function bindConditionTemplates(root) {
  if (!root) return;
  bindLeftSearch(root);

  // Cancel — revert to snapshot and close footer
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-ct-cancel]');
    if (!btn) return;
    if (!CT_ORIGINAL_SNAPSHOT) return;
    const idx = CT_CONDITIONS.findIndex(c => c.id === CT_SELECTED_ID);
    if (idx !== -1) {
      CT_CONDITIONS[idx] = JSON.parse(CT_ORIGINAL_SNAPSHOT);
    }
    const main = root.querySelector('[data-ct2-main]');
    if (main) main.classList.remove('ct2-main--dirty');
    // Re-render detail to reflect reverted state
    const body = root.querySelector('[data-ct2-main-body]');
    const hsplit = body?.querySelector('[data-ct2-hsplit]');
    if (hsplit) {
      const right = hsplit.querySelector('[data-ct2-hsplit-right]');
      if (right) {
        const cond = CT_CONDITIONS[idx];
        right.innerHTML = buildDetail(cond, CT_SELECTED_PROD_ID, { splitView: true });
        bindDetail(root);
        bindDetailRight(root);
      }
    } else if (body?.querySelector('[data-ct2-detail]')) {
      const cond = CT_CONDITIONS[idx];
      body.innerHTML = buildDetail(cond, CT_SELECTED_PROD_ID);
      bindDetail(root);
    }
    e.stopPropagation();
  });

  // Save Changes
  root.addEventListener('click', e => {
    const btn = e.target.closest('[data-ct2-save]');
    if (!btn) return;
    const cond = CT_CONDITIONS.find(c => c.id === CT_SELECTED_ID);
    if (cond) CT_ORIGINAL_SNAPSHOT = stableStringify(cond);
    btn.classList.add('ct2-footer__btn--saved');
    btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5L5.5 10L11 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Saved`;

    // Refresh sidebar so condition appears in correct stage section
    const left = root.querySelector('[data-ct2-hsplit-left]');
    const prodId = CT_SELECTED_PROD_VIEW;
    if (left && prodId) {
      refreshVerticalStageView(left, prodId, CT_SELECTED_ID);
      // Scroll to moved item + flash
      requestAnimationFrame(() => {
        const movedItem = left.querySelector(`.ct2-vsv-item[data-ct2-cid="${CT_SELECTED_ID}"]`);
        if (movedItem) {
          movedItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          movedItem.classList.add('ct2-vsv-item--flash');
          movedItem.addEventListener('animationend', () => movedItem.classList.remove('ct2-vsv-item--flash'), { once: true });
        }
      });
    }

    setTimeout(() => {
      const main = root.querySelector('[data-ct2-main]');
      if (main) main.classList.remove('ct2-main--dirty');
      // Reset button state so next dirty cycle shows "Save Changes" correctly
      const saveBtn = root.querySelector('[data-ct2-save]');
      if (saveBtn) {
        saveBtn.classList.remove('ct2-footer__btn--saved');
        saveBtn.textContent = 'Save Changes';
      }
    }, 2200);
  });

  // Drag-and-drop for condition items in vertical stage view
  // Track whether the mousedown that initiated the drag was on the handle
  root.addEventListener('mousedown', e => {
    _ct2DragFromHandle = !!e.target.closest('.ct2-vsv-item__drag-handle');
  });

  root.addEventListener('dragstart', e => {
    const item = e.target.closest('.ct2-vsv-item[data-ct2-cid]');
    if (!item) return;
    // Only allow drag when grab started from the handle
    if (!_ct2DragFromHandle) {
      e.preventDefault();
      return;
    }
    _ct2DragId = item.getAttribute('data-ct2-cid');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', _ct2DragId);
    setTimeout(() => item.classList.add('ct2-vsv-item--dragging'), 0);
  });

  root.addEventListener('dragend', e => {
    const item = e.target.closest('.ct2-vsv-item');
    if (item) item.classList.remove('ct2-vsv-item--dragging');
    _ct2RemoveDropLine();
    _ct2DragId = null;
  });

  root.addEventListener('dragover', e => {
    if (!_ct2DragId) return;
    const left = root.querySelector('[data-ct2-hsplit-left]');
    if (!left || !left.contains(e.target)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const item = e.target.closest('.ct2-vsv-item[data-ct2-cid]');
    if (item && item.getAttribute('data-ct2-cid') !== _ct2DragId) {
      const rect = item.getBoundingClientRect();
      _ct2ShowDropLine(item, e.clientY < rect.top + rect.height / 2 ? 'before' : 'after');
      return;
    }
    const body = e.target.closest('[data-ct2-stage-body]');
    if (body) {
      _ct2ShowDropLine(body, 'end');
    }
  });

  root.addEventListener('dragleave', e => {
    const left = root.querySelector('[data-ct2-hsplit-left]');
    if (left && !left.contains(e.relatedTarget)) {
      _ct2RemoveDropLine();
    }
  });

  root.addEventListener('drop', e => {
    if (!_ct2DragId) return;
    const left = root.querySelector('[data-ct2-hsplit-left]');
    if (!left || !left.contains(e.target)) return;
    e.preventDefault();

    const productId = CT_SELECTED_PROD_VIEW;
    const cond = CT_CONDITIONS.find(c => c.id === _ct2DragId);
    if (!cond || !productId) return;

    const item = e.target.closest('.ct2-vsv-item[data-ct2-cid]');
    const body = e.target.closest('[data-ct2-stage-body]');

    let targetStageId = null;
    let targetCondId = null;
    let insertBefore = true;

    if (item && item.getAttribute('data-ct2-cid') !== _ct2DragId) {
      const stageBody = item.closest('[data-ct2-stage-body]');
      targetStageId = stageBody ? stageBody.getAttribute('data-ct2-stage-id') : null;
      targetCondId = item.getAttribute('data-ct2-cid');
      const rect = item.getBoundingClientRect();
      insertBefore = e.clientY < rect.top + rect.height / 2;
    } else if (body) {
      targetStageId = body.getAttribute('data-ct2-stage-id');
    }

    if (!targetStageId) {
      _ct2RemoveDropLine();
      _ct2DragId = null;
      return;
    }

    // Update condition's dueBefore for this product
    // targetStageId is the sidebar section — dueBefore = the stage AFTER it
    const newDueBefore = dueBeforeForSidebarStage(targetStageId);
    const prodConfig = (cond.products || []).find(p => p.id === productId);
    if (prodConfig) {
      prodConfig.dueBefore = newDueBefore;
    } else {
      cond.products = cond.products || [];
      cond.products.push({ id: productId, dueBefore: newDueBefore, type: 'always', rules: [] });
    }

    // Reorder CT_CONDITIONS array for correct visual ordering
    if (targetCondId) {
      const fromIdx = CT_CONDITIONS.findIndex(c => c.id === _ct2DragId);
      const toIdx = CT_CONDITIONS.findIndex(c => c.id === targetCondId);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        const [removed] = CT_CONDITIONS.splice(fromIdx, 1);
        const newToIdx = CT_CONDITIONS.findIndex(c => c.id === targetCondId);
        CT_CONDITIONS.splice(insertBefore ? newToIdx : newToIdx + 1, 0, removed);
      }
    }

    _ct2RemoveDropLine();
    _ct2DragId = null;
    markDirty(root);

    // Refresh left panel
    if (left) {
      refreshVerticalStageView(left, productId, CT_SELECTED_ID);
    }

    // If the dragged condition is currently open in the right panel, update its stage track live
    if (cond.id === CT_SELECTED_ID) {
      const right = root.querySelector('[data-ct2-hsplit-right]');
      const track = right?.querySelector('[data-ct2-rst-stop]')?.closest('.ct2-right-stage-track');
      if (track) {
        track.querySelectorAll('[data-ct2-rst-stop]').forEach(s =>
          s.classList.toggle('ct2-rst__stop--active', s.getAttribute('data-ct2-rst-stop') === newDueBefore)
        );
      }
    }
  });

  // Global click handler
  root.addEventListener('click', e => {
    // Stage header → collapse/expand
    const stageToggle = e.target.closest('[data-ct2-stage-toggle]');
    if (stageToggle) {
      const stage = stageToggle.closest('.ct2-vsv-stage');
      if (stage) {
        const collapsed = stage.classList.toggle('ct2-vsv-stage--collapsed');
        stageToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
      }
      return;
    }

    // Condition item in stage view → split view
    const condItem = e.target.closest('[data-ct2-cid]');
    if (condItem && condItem.closest('[data-ct2-prod-stage-view]')) {
      const stageView = condItem.closest('[data-ct2-prod-stage-view]');
      const productId = stageView.getAttribute('data-ct2-prod-id') || CT_SELECTED_PROD_VIEW;
      enterSplitView(condItem.getAttribute('data-ct2-cid'), productId, root);
      return;
    }

    // Product item in sidebar → show stage view
    const prodBtn = e.target.closest('[data-ct2-prod]');
    if (prodBtn && prodBtn.closest('.ct2-sidebar')) {
      enterProductView(prodBtn.getAttribute('data-ct2-prod'), root);
      return;
    }

    // See Conditions Library → condition library panel
    if (e.target.closest('[data-ct2-library]')) {
      enterCanvas(root);
      return;
    }

    // Stage view "+ Add" button → show quick-pick popover
    const psvAddBtn = e.target.closest('[data-ct2-psv-add-prod]');
    if (psvAddBtn) {
      e.stopPropagation();
      const stage = psvAddBtn.getAttribute('data-ct2-psv-add-stage');
      const prod  = psvAddBtn.getAttribute('data-ct2-psv-add-prod');
      showAddPopover(psvAddBtn, stage, prod, root);
    }
  });

  bindCanvas(root);
  bindHSplitResize(root);
  bindLeftScrollFade(root);
}

function bindLeftSearch(root) {
  root.addEventListener('input', e => {
    const input = e.target.closest('[data-ct2-vsv-search]');
    if (!input) return;
    const q = input.value.trim().toLowerCase();
    const left = input.closest('[data-ct2-hsplit-left]');
    if (!left) return;
    left.querySelectorAll('.ct2-vsv-item[data-ct2-cid]').forEach(item => {
      const name = item.querySelector('.ct2-vsv-item__name')?.textContent.toLowerCase() || '';
      item.style.display = (!q || name.includes(q)) ? '' : 'none';
    });
    // Show/hide empty stage groups
    left.querySelectorAll('.ct2-vsv-stage').forEach(stage => {
      const visible = [...stage.querySelectorAll('.ct2-vsv-item[data-ct2-cid]')].some(i => i.style.display !== 'none');
      stage.style.display = visible ? '' : 'none';
    });
  });
}

function bindLeftScrollFade(root) {
  if (!root) return;
  root.addEventListener('scroll', e => {
    const scroll = e.target.closest('.ct2-hsplit-left__scroll');
    if (!scroll) return;
    const left = scroll.closest('.ct2-hsplit-left');
    if (!left) return;
    left.classList.toggle('ct2-hsplit-left--scrolled', scroll.scrollTop > 8);
  }, true);
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
