// =============================================================================
// SYSTEM.js — Single source of truth for the design system
//
// HOW TO ADD THINGS:
//   New token        → add to tokenGroups[]
//   New icon         → add to icons[]
//   New btn variant  → add to components.buttons.variants[]
//   New section      → add to nav[], add a renderer in platform.js
//                      (zero changes needed in platform.html)
// =============================================================================

window.SYSTEM = {

  // ── Meta ────────────────────────────────────────────────────────────────────
  // Reserved for future use (release notes, exports, etc.)
  meta: {},

  // ── Navigation ──────────────────────────────────────────────────────────────
  // Each item's `id` must match a renderer in platform.js renderPage(id).
  nav: [
    {
      section: 'Foundations',
      items: [
        {
          id: 'tokens',
          label: 'Tokens',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="9" y="2" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="2" y="9" width="5" height="5" rx="1.5" fill="currentColor"/><rect x="9" y="9" width="5" height="5" rx="1.5" fill="currentColor"/></svg>',
        },
        {
          id: 'icons',
          label: 'Icons',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><path d="M3 5h10M3 8h7M3 11h5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
      ],
    },
    {
      section: 'Components',
      items: [
        {
          id: 'buttons',
          label: 'Buttons',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="5" width="13" height="6" rx="3" stroke="currentColor" stroke-width="1.25"/></svg>',
        },
        {
          id: 'dropdown-item',
          label: 'Dropdown Item',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="10" rx="2" stroke="currentColor" stroke-width="1.25"/><path d="M5 8h6M5 11h4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
      ],
    },
    {
      section: 'Lender Portal',
      // collapsible: true  → section header gets a toggle chevron
      // collapsed: false   → starts open (change to true to start collapsed)
      collapsible: true,
      collapsed: false,
      items: [
        {
          id: 'lender-loans',
          label: 'Loans',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="4" width="12" height="9" rx="1.5" stroke="currentColor" stroke-width="1.25"/><path d="M5 4V3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1" stroke="currentColor" stroke-width="1.25"/><path d="M5 8h6M5 11h3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
        {
          id: 'lender-status',
          label: 'Status',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="5" width="13" height="6" rx="3" stroke="currentColor" stroke-width="1.25"/><circle cx="5.5" cy="8" r="1.5" fill="currentColor"/></svg>',
        },
        {
          id: 'lender-stage',
          label: 'Stage',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="5" width="9" height="6" rx="1.5" stroke="currentColor" stroke-width="1.25"/><circle cx="13" cy="8" r="2.5" stroke="currentColor" stroke-width="1.25"/></svg>',
        },
        {
          id: 'lender-status-stage',
          label: 'Status Stage',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><circle cx="4.5" cy="8" r="2.5" stroke="currentColor" stroke-width="1.25"/><circle cx="11.5" cy="8" r="2.5" stroke="currentColor" stroke-width="1.25"/><path d="M7 8h2" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
      ],
    },
  ],

  // ── Design Tokens ───────────────────────────────────────────────────────────
  // id     → CSS custom property (--{id})
  // figma  → exact Figma token path (Accent/Group/Value)
  // hex    → resolved hex value
  // border → true for near-white swatches that need a visible edge
  tokenGroups: [
    {
      label: 'White',
      tokens: [
        { id: 'accent-white-100', figma: 'Accent/White/100', hex: '#ffffff', border: true },
      ],
    },
    {
      label: 'Black',
      tokens: [
        { id: 'accent-black-2',   figma: 'Accent/Black/2',   hex: '#fafafa' },
        { id: 'accent-black-4',   figma: 'Accent/Black/4',   hex: '#f5f5f5' },
        { id: 'accent-black-8',   figma: 'Accent/Black/8',   hex: '#ebebeb' },
        { id: 'accent-black-10',  figma: 'Accent/Black/10',  hex: '#e6e6e6' },
        { id: 'accent-black-12',  figma: 'Accent/Black/12',  hex: '#e0e0e0' },
        { id: 'accent-black-20',  figma: 'Accent/Black/20',  hex: '#cccccc' },
        { id: 'accent-black-30',  figma: 'Accent/Black/30',  hex: '#b2b2b2' },
        { id: 'accent-black-40',  figma: 'Accent/Black/40',  hex: '#999999' },
        { id: 'accent-black-50',  figma: 'Accent/Black/50',  hex: '#808080' },
        { id: 'accent-black-60',  figma: 'Accent/Black/60',  hex: '#666666' },
        { id: 'accent-black-70',  figma: 'Accent/Black/70',  hex: '#4d4d4d' },
        { id: 'accent-black-80',  figma: 'Accent/Black/80',  hex: '#333333' },
        { id: 'accent-black-90',  figma: 'Accent/Black/90',  hex: '#1a1a1a' },
        { id: 'accent-black-100', figma: 'Accent/Black/100', hex: '#000000' },
      ],
    },
    {
      label: 'Blue',
      tokens: [
        { id: 'accent-blue-2',   figma: 'Accent/Blue/2',   hex: '#fafdff' },
        { id: 'accent-blue-4',   figma: 'Accent/Blue/4',   hex: '#f5faff' },
        { id: 'accent-blue-8',   figma: 'Accent/Blue/8',   hex: '#ebf5ff' },
        { id: 'accent-blue-10',  figma: 'Accent/Blue/10',  hex: '#e6f3ff' },
        { id: 'accent-blue-12',  figma: 'Accent/Blue/12',  hex: '#e0f0ff' },
        { id: 'accent-blue-20',  figma: 'Accent/Blue/20',  hex: '#cce7ff' },
        { id: 'accent-blue-30',  figma: 'Accent/Blue/30',  hex: '#b2dcff' },
        { id: 'accent-blue-40',  figma: 'Accent/Blue/40',  hex: '#99d0ff' },
        { id: 'accent-blue-50',  figma: 'Accent/Blue/50',  hex: '#80c4ff' },
        { id: 'accent-blue-60',  figma: 'Accent/Blue/60',  hex: '#66b8ff' },
        { id: 'accent-blue-70',  figma: 'Accent/Blue/70',  hex: '#4dacff' },
        { id: 'accent-blue-80',  figma: 'Accent/Blue/80',  hex: '#33a0ff' },
        { id: 'accent-blue-90',  figma: 'Accent/Blue/90',  hex: '#1a94ff' },
        { id: 'accent-blue-100', figma: 'Accent/Blue/100', hex: '#0088ff' },
      ],
    },
    {
      label: 'Red',
      tokens: [
        { id: 'accent-red-2',   figma: 'Accent/Red/2',   hex: '#fffafa' },
        { id: 'accent-red-4',   figma: 'Accent/Red/4',   hex: '#fff5f5' },
        { id: 'accent-red-8',   figma: 'Accent/Red/8',   hex: '#ffebeb' },
        { id: 'accent-red-10',  figma: 'Accent/Red/10',  hex: '#ffe6e6' },
        { id: 'accent-red-12',  figma: 'Accent/Red/12',  hex: '#ffe0e0' },
        { id: 'accent-red-20',  figma: 'Accent/Red/20',  hex: '#ffcccc' },
        { id: 'accent-red-30',  figma: 'Accent/Red/30',  hex: '#ffb2b2' },
        { id: 'accent-red-40',  figma: 'Accent/Red/40',  hex: '#ff9999' },
        { id: 'accent-red-50',  figma: 'Accent/Red/50',  hex: '#ff8080' },
        { id: 'accent-red-60',  figma: 'Accent/Red/60',  hex: '#ff6666' },
        { id: 'accent-red-70',  figma: 'Accent/Red/70',  hex: '#ff4d4d' },
        { id: 'accent-red-80',  figma: 'Accent/Red/80',  hex: '#ff6b6f' },
        { id: 'accent-red-90',  figma: 'Accent/Red/90',  hex: '#ff3b3d' },
        { id: 'accent-red-100', figma: 'Accent/Red/100', hex: '#ff383c' },
      ],
    },
    {
      label: 'Green',
      tokens: [
        { id: 'accent-green-2',   figma: 'Accent/Green/2',   hex: '#fbfefc' },
        { id: 'accent-green-4',   figma: 'Accent/Green/4',   hex: '#f7fdf8' },
        { id: 'accent-green-8',   figma: 'Accent/Green/8',   hex: '#effbf2' },
        { id: 'accent-green-10',  figma: 'Accent/Green/10',  hex: '#ebf9ee' },
        { id: 'accent-green-12',  figma: 'Accent/Green/12',  hex: '#e7f8eb' },
        { id: 'accent-green-20',  figma: 'Accent/Green/20',  hex: '#d6f4de' },
        { id: 'accent-green-30',  figma: 'Accent/Green/30',  hex: '#c2eecd' },
        { id: 'accent-green-40',  figma: 'Accent/Green/40',  hex: '#aee9bd' },
        { id: 'accent-green-50',  figma: 'Accent/Green/50',  hex: '#9ae3ac' },
        { id: 'accent-green-60',  figma: 'Accent/Green/60',  hex: '#85dd9b' },
        { id: 'accent-green-70',  figma: 'Accent/Green/70',  hex: '#71d88b' },
        { id: 'accent-green-80',  figma: 'Accent/Green/80',  hex: '#5dd27a' },
        { id: 'accent-green-90',  figma: 'Accent/Green/90',  hex: '#48cd6a' },
        { id: 'accent-green-100', figma: 'Accent/Green/100', hex: '#34c759' },
      ],
    },
    {
      label: 'Surface',
      tokens: [
        { id: 'accent-bg-0', figma: 'Background/0', hex: '#f3f3f4' },
        { id: 'accent-bg-1', figma: 'Background/1', hex: '#fcfcfd', border: true },
      ],
    },
  ],

  // ── Icons ───────────────────────────────────────────────────────────────────
  // name → CSS class suffix (.icon--{name})
  // url  → asset URL — update here when Figma URLs expire or swap for permanent CDN
  // relations → which components use this icon (drives the panel relationship graph)
  icons: [
    { name: 'magnifying-glass', url: 'https://www.figma.com/api/mcp/asset/f045137b-b137-40bd-880c-a3a91eb0e21e', relations: { usedBy: [{ name: 'Buttons', pageId: 'buttons' }] } },
    { name: 'plus',             url: 'https://www.figma.com/api/mcp/asset/4e72142f-d38c-4500-aa40-01789fd58f20' },
    { name: 'funnel',           url: 'https://www.figma.com/api/mcp/asset/06797cb5-0d3a-4ec0-9ad1-e3b1994d9019' },
    { name: 'archive-box',      url: 'https://www.figma.com/api/mcp/asset/e9809b81-3c1a-4ebf-b264-0c6256540ad2' },
    { name: 'bell',             url: 'https://www.figma.com/api/mcp/asset/8dcb73a6-6bc1-4798-b40f-d542f6dc895c' },
    { name: 'star',             url: 'https://www.figma.com/api/mcp/asset/09e16b87-16ca-493c-8ce9-5f5deca7fff1' },
    { name: 'star-filled',      url: 'https://www.figma.com/api/mcp/asset/da614944-ab0b-4b01-b01f-2d82a3f9ab7c' },
    { name: 'chevron-down',     url: 'https://www.figma.com/api/mcp/asset/4f938ef1-b3c1-4476-8158-82aac98b8f3b', relations: { usedBy: [{ name: 'Buttons', pageId: 'buttons' }] } },
    { name: 'document',         url: 'https://www.figma.com/api/mcp/asset/6fa10314-32e6-4f60-bca5-6eae971e14b8' },
    { name: 'forward',          url: 'https://www.figma.com/api/mcp/asset/1aa219a5-664c-4728-b464-a964fd23461a' },
  ],

  // ── Components ──────────────────────────────────────────────────────────────
  // Each component: title, subtitle, cssFile, variants[]
  // Variant fields are read by buildBtnPreviewHtml() in platform.js to render
  // the live row preview — no HTML needed here, just data.
  components: {
    buttons: {
      title: 'Button / Primary',
      subtitle: 'Source: Figma › Button/Primary · click a variant for code',
      cssFile: 'buttons.css',
      // relations → shown in the panel's relationship graph for every button variant
      relations: {
        uses: [{ name: 'Icons', pageId: 'icons' }],
      },
      variants: [
        {
          id: 's1',
          label: 'Symbol 1',
          // icons[] → array of icon names used in icon-wrap slots
          icons: ['magnifying-glass'],
        },
        {
          id: 's2',
          label: 'Symbol 2',
          icons: ['magnifying-glass', 'magnifying-glass'],
        },
        {
          id: 's3',
          label: 'Symbol 3',
          icons: ['magnifying-glass', 'magnifying-glass', 'magnifying-glass'],
        },
        {
          id: 'label',
          label: 'Symbol + Text',
          leadIcon: 'magnifying-glass',
        },
        {
          id: 'label-trail',
          label: 'Symbol + Text + Symbol',
          leadIcon: 'magnifying-glass',
          trailIcon: 'chevron-down',
        },
      ],
    },

    // ── Dropdown Item ──────────────────────────────────────────────────────────
    // Global, reusable list row — used inside any dropdown across all products.
    // Lender Portal's Loans Dropdown is built from this component.
    dropdownItem: {
      title: 'Dropdown Item',
      subtitle: 'Global · used inside any dropdown · click a variant for code',
      cssFile: 'lender-portal.css',
      // relations → shown in the panel's relationship graph for every dropdown-item variant
      relations: {
        usedBy: [{ name: 'Loans Dropdown', pageId: 'lender-loans' }],
      },
      variants: [
        { id: 'dropdown-item-default',  label: 'Default',  state: 'default'  },
        { id: 'dropdown-item-hover',    label: 'Hover',    state: 'hover'    },
        { id: 'dropdown-item-selected', label: 'Selected', state: 'selected' },
      ],
    },
  },

  // ── Products — file-specific components ─────────────────────────────────────
  // Each product maps to a Figma file. Components live under their product key.
  // To add a new product: add a nav item above + a new key here + a renderer in platform.js.
  products: {
    lenderPortal: {
      // Source: https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration
      loans: {
        title: 'Loans',
        subtitle: 'Source: Figma › Lender Exploration · click a variant for code',
        figmaFile: 'PYHG9Pu8YLs4ACMPljBiSG',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=270-1898',
        variants: [
          {
            id: 'loans-pill',
            label: 'Loans Pill',
            // Figma node: 270:1898
            // Icon asset — update when Figma URL expires
            iconUrl: 'https://www.figma.com/api/mcp/asset/6e60fa0d-6803-499e-9ee0-b4384be2058f',
            defaultText: 'My Loans',
            defaultCount: 52,
          },
          {
            id: 'loans-dropdown',
            label: 'Loans Dropdown',
            // Figma node: 114:301 — opens when Loans Pill is clicked
            relations: {
              uses: [{ name: 'Dropdown Item', pageId: 'dropdown-item' }],
            },
            items: [
              { label: 'My Loans',         count: 52,  active: true  },
              { label: 'All Loans',         count: 101, active: false },
              { label: 'Unassigned Loans',  count: 49,  active: false },
            ],
          },
        ],
      },
      // ── Status (438:3508) — left pill: dot + label ──────────────────────────
      status: {
        title: 'Status',
        subtitle: 'Source: Figma › Lender Exploration · node 438-3508 · click a variant for code',
        figmaFile: 'PYHG9Pu8YLs4ACMPljBiSG',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=438-3508',
        // Menu under the pill uses the global .loans-dropdown / .loans-dropdown__item pattern
        relations: {
          uses: [{ name: 'Dropdown Item', pageId: 'dropdown-item' }],
        },
        statusMenuItems: [
          { id: 'active',     label: 'Active',     dot: 'green' },
          { id: 'on-hold',    label: 'On Hold',    dot: 'amber' },
          { id: 'withdrawn',  label: 'Withdrawn',  dot: 'red' },
          { id: 'cancelled',  label: 'Cancelled',  dot: 'red' },
          { id: 'denied',     label: 'Denied',     dot: 'red' },
        ],
        variants: [
          {
            id: 'lp-status-active',
            label: 'Active',
            dot: 'green',
            statusLabel: 'Active',
          },
        ],
      },

      // ── Stage (438:3509) — right pill: label + forward button circle ─────────
      stage: {
        title: 'Stage',
        subtitle: 'Source: Figma › Lender Exploration · node 438-3509 · click a variant for code',
        figmaFile: 'PYHG9Pu8YLs4ACMPljBiSG',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=438-3509',
        // Forward icon from node 438:3545 — update if Figma URL expires
        forwardIconUrl: 'https://www.figma.com/api/mcp/asset/e7d9e909-e8dc-46d3-b0cf-3e1a89705ccd',
        variants: [
          {
            id: 'lp-stage-underwriting',
            label: 'Underwriting',
            stageLabel: 'Underwriting',
          },
        ],
      },

      // ── Status Stage (438:3545) — composite: Status + Stage with 2px gap ────
      statusStage: {
        title: 'Status Stage',
        subtitle: 'Source: Figma › Lender Exploration · node 438-3545 · click a variant for code',
        figmaFile: 'PYHG9Pu8YLs4ACMPljBiSG',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=438-3545',
        relations: {
          uses: [
            { name: 'Status', pageId: 'lender-status' },
            { name: 'Stage', pageId: 'lender-stage' },
            { name: 'Dropdown Item', pageId: 'dropdown-item' },
          ],
        },
        variants: [
          {
            id: 'lp-status-stage-v1',
            label: 'Active · Underwriting',
            status: { dot: 'green', label: 'Active' },
            stage:  { label: 'Underwriting' },
          },
        ],
      },
    },
  },
};
