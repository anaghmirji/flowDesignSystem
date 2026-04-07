// =============================================================================
// SYSTEM.js — Single source of truth for the design system
//
// HOW TO ADD THINGS:
//   New token        → add to tokenGroups[]
//   New icon         → add to icons[]
//   New btn variant  → add to components.buttons.variants[]
//   New CSS file     → add to scripts/build-css-bundle.sh + build-css-bundle.js,
//                      then run `npm run build` so design-system/css/global.css updates
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
      section: 'Output',
      items: [
        {
          id: 'global-css',
          label: 'Global CSS',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><path d="M3 3h10v10H3V3z" stroke="currentColor" stroke-width="1.25"/><path d="M5 6h6M5 9h4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
      ],
    },
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
        {
          id: 'segment-picker',
          label: 'Segment Picker',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="5" width="13" height="6" rx="3" stroke="currentColor" stroke-width="1.25"/><rect x="2" y="5.5" width="6.5" height="5" rx="2.5" fill="currentColor" opacity=".2"/></svg>',
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
        {
          id: 'lender-profile',
          label: 'Profile',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="5.5" r="2.5" stroke="currentColor" stroke-width="1.25"/><path d="M3 13c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
        {
          id: 'lender-sidebar-item',
          label: 'Sidebar Item',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="5" height="12" rx="1" stroke="currentColor" stroke-width="1.25"/><rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.25"/><rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" stroke-width="1.25"/></svg>',
        },
        {
          id: 'lender-sidebar',
          label: 'Sidebar',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="4" height="12" rx="1" stroke="currentColor" stroke-width="1.25"/><path d="M8 5h5M8 8h4M8 11h3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
        {
          id: 'lender-assignees',
          label: 'Assignees',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><circle cx="5" cy="6" r="2.5" stroke="currentColor" stroke-width="1.25"/><circle cx="11" cy="6" r="2.5" stroke="currentColor" stroke-width="1.25"/><path d="M1 14c0-2.209 1.791-4 4-4s4 1.791 4 4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/><path d="M9 14c0-2.209 1.791-4 4-4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
        {
          id: 'lender-people-dropdown',
          label: 'People Dropdown',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" stroke-width="1.25"/><circle cx="5.5" cy="7" r="1.5" fill="currentColor" opacity=".6"/><circle cx="10.5" cy="7" r="1.5" fill="currentColor" opacity=".6"/><path d="M3 11h10" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
        {
          id: 'lender-role-picker',
          label: 'Role Picker',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="3" stroke="currentColor" stroke-width="1.25"/><path d="M5 8l2 2 4-4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
        },
        {
          id: 'lender-loan-list-item',
          label: 'Loan List Item',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="3" width="12" height="4" rx="1" stroke="currentColor" stroke-width="1.25"/><rect x="2" y="9" width="12" height="4" rx="1" stroke="currentColor" stroke-width="1.25"/></svg>',
        },
        {
          id: 'lender-loan-stage-group',
          label: 'Loan Stage Group',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="5" rx="2" stroke="currentColor" stroke-width="1.25"/><rect x="2" y="9" width="12" height="5" rx="2" stroke="currentColor" stroke-width="1.25"/><path d="M5 4.5h6M5 11.5h4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>',
        },
        {
          id: 'lender-search-bar',
          label: 'Search Bar',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="4" stroke="currentColor" stroke-width="1.25"/><path d="M10 10l3 3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
        {
          id: 'lender-search-section',
          label: 'Search Section',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><circle cx="6.5" cy="6.5" r="3.5" stroke="currentColor" stroke-width="1.25"/><path d="M9.5 9.5l3 3" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/><path d="M11 7h3M12 10h1" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
        {
          id: 'lender-loans-panel',
          label: 'Loans Panel',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="1.5" y="1.5" width="6" height="13" rx="1.5" stroke="currentColor" stroke-width="1.25"/><path d="M4.5 4.5h-1M4.5 7h-1M4.5 9.5h-1" stroke="currentColor" stroke-width="1" stroke-linecap="round"/><circle cx="11" cy="5" r="3" stroke="currentColor" stroke-width="1.25"/><path d="M13.5 7.5l1.5 1.5" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"/></svg>',
        },
      ],
    },
    {
      section: 'Prototype',
      items: [
        {
          id: 'prototype-lender-portal',
          label: 'Lender Portal',
          href: 'prototype.html',
          icon: '<svg class="nav-icon" viewBox="0 0 16 16" fill="none"><rect x="2" y="2" width="12" height="12" rx="2.5" stroke="currentColor" stroke-width="1.25"/><path d="M2 6h12" stroke="currentColor" stroke-width="1.25"/><circle cx="5" cy="4" r="0.75" fill="currentColor"/><circle cx="7.5" cy="4" r="0.75" fill="currentColor"/></svg>',
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
        { id: 'accent-black-16',  figma: 'Accent/Black/16',  hex: '#d6d6d6' },
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
    { name: 'magnifying-glass', relations: { usedBy: [{ name: 'Buttons', pageId: 'buttons' }, { name: 'Search Bar', pageId: 'lender-search-bar' }, { name: 'Search Section', pageId: 'lender-search-section' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.2005 13.2005" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6005 12.6005L9.13585 9.13585M9.13585 9.13585C10.0736 8.19814 10.6004 6.92632 10.6004 5.60019C10.6004 4.27406 10.0736 3.00224 9.13585 2.06452C8.19814 1.1268 6.92632 0.6 5.60019 0.6C4.27406 0.6 3.00224 1.1268 2.06452 2.06452C1.1268 3.00224 0.6 4.27406 0.6 5.60019C0.6 6.92632 1.1268 8.19814 2.06452 9.13585C3.00224 10.0736 4.27406 10.6004 5.60019 10.6004C6.92632 10.6004 8.19814 10.0736 9.13585 9.13585Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'plus', relations: { usedBy: [{ name: 'Button / Primary', pageId: 'buttons' }, { name: 'Loans Panel', pageId: 'lender-loans-panel' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.2 13.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 0.6V12.6M12.6 6.6H0.6" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'funnel', relations: { usedBy: [{ name: 'Button / Secondary', pageId: 'buttons-secondary' }, { name: 'Search Section', pageId: 'lender-search-section' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.2 13.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 0.600002C8.43667 0.600002 10.2367 0.754669 11.9887 1.052C12.344 1.112 12.6 1.42267 12.6 1.78267V2.47867C12.6 2.67565 12.5612 2.87071 12.4858 3.0527C12.4104 3.23469 12.3 3.40005 12.1607 3.53934L8.53933 7.16067C8.40005 7.29996 8.28956 7.46532 8.21418 7.64731C8.1388 7.8293 8.1 8.02435 8.1 8.22134V10.1727C8.10005 10.4513 8.02249 10.7245 7.87601 10.9615C7.72952 11.1985 7.51991 11.3901 7.27067 11.5147L5.1 12.6V8.22134C5.1 8.02435 5.0612 7.8293 4.98582 7.64731C4.91044 7.46532 4.79995 7.29996 4.66067 7.16067L1.03933 3.53934C0.900046 3.40005 0.789557 3.23469 0.714176 3.0527C0.638796 2.87071 0.599998 2.67565 0.6 2.47867V1.78267C0.6 1.42267 0.856 1.112 1.21133 1.052C2.99171 0.750571 4.79428 0.599372 6.6 0.600002Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'archive-box', relations: { usedBy: [{ name: 'Search Section', pageId: 'lender-search-section' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 14.2 12.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6 3.1L12.1833 10.188C12.1609 10.57 11.9933 10.929 11.7148 11.1915C11.4363 11.454 11.068 11.6001 10.6853 11.6H3.51467C3.13198 11.6001 2.7637 11.454 2.48522 11.1915C2.20674 10.929 2.03912 10.57 2.01667 10.188L1.6 3.1M5.76667 5.6H8.43333M1.35 3.1H12.85C13.264 3.1 13.6 2.764 13.6 2.35V1.35C13.6 0.936 13.264 0.6 12.85 0.6H1.35C0.936 0.6 0.6 0.936 0.6 1.35V2.35C0.6 2.764 0.936 3.1 1.35 3.1Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'bell',
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.155 14.147" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.64033 10.7432C9.98536 10.5839 11.3069 10.2665 12.5775 9.79751C11.5015 8.60553 10.9069 7.05612 10.9092 5.45028V4.90886C10.9092 3.76012 10.4529 2.65842 9.64061 1.84614C8.82832 1.03385 7.72663 0.577513 6.57788 0.577513C5.42914 0.577513 4.32744 1.03385 3.51516 1.84614C2.70287 2.65842 2.24653 3.76012 2.24653 4.90886V5.45028C2.24871 7.05622 1.65385 8.60564 0.577522 9.79751C1.82856 10.2595 3.14745 10.5808 4.51544 10.7432M8.64033 10.7432C7.27017 10.9057 5.8856 10.9057 4.51544 10.7432M8.64033 10.7432C8.74435 11.0679 8.77022 11.4127 8.71583 11.7493C8.66143 12.0859 8.52831 12.405 8.3273 12.6804C8.12629 12.9559 7.86307 13.18 7.55907 13.3345C7.25507 13.489 6.91889 13.5695 6.57788 13.5695C6.23688 13.5695 5.90069 13.489 5.59669 13.3345C5.2927 13.18 5.02948 12.9559 4.82847 12.6804C4.62746 12.405 4.49433 12.0859 4.43994 11.7493C4.38554 11.4127 4.41141 11.0679 4.51544 10.7432" stroke="var(--stroke-0,#333)" stroke-width="1.15503" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'star', relations: { usedBy: [{ name: 'Profile', pageId: 'lender-profile' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.4094 12.8483" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.35761 0.832549C6.38581 0.76377 6.43382 0.704933 6.49556 0.663522C6.55729 0.622112 6.62994 0.6 6.70428 0.6C6.77861 0.6 6.85127 0.622112 6.913 0.663522C6.97473 0.704933 7.02275 0.76377 7.05094 0.832549L8.46761 4.23988C8.49413 4.30364 8.53772 4.35885 8.59359 4.39942C8.64946 4.44 8.71544 4.46438 8.78428 4.46988L12.4629 4.76455C12.7956 4.79122 12.9303 5.20655 12.6769 5.42322L9.87428 7.82455C9.82191 7.86934 9.78289 7.92769 9.76149 7.99319C9.74009 8.05869 9.73713 8.12881 9.75294 8.19588L10.6096 11.7859C10.6268 11.8579 10.6223 11.9334 10.5966 12.0029C10.571 12.0723 10.5253 12.1326 10.4654 12.1762C10.4054 12.2197 10.334 12.2445 10.26 12.2474C10.186 12.2503 10.1128 12.2312 10.0496 12.1926L6.89961 10.2692C6.84079 10.2333 6.7732 10.2143 6.70428 10.2143C6.63535 10.2143 6.56776 10.2333 6.50894 10.2692L3.35894 12.1932C3.29578 12.2319 3.22258 12.251 3.14858 12.248C3.07458 12.2451 3.00311 12.2203 2.94319 12.1768C2.88327 12.1333 2.83758 12.073 2.81191 12.0035C2.78624 11.9341 2.78172 11.8586 2.79894 11.7865L3.65561 8.19588C3.6715 8.12882 3.66858 8.05867 3.64717 7.99315C3.62576 7.92764 3.5867 7.8693 3.53428 7.82455L0.731609 5.42322C0.675171 5.37511 0.634281 5.31133 0.614116 5.23996C0.593951 5.16859 0.59542 5.09285 0.618335 5.02232C0.641251 4.95178 0.684583 4.88964 0.742843 4.84375C0.801104 4.79787 0.871672 4.7703 0.945609 4.76455L4.62428 4.46988C4.69311 4.46438 4.75909 4.44 4.81496 4.39942C4.87083 4.35885 4.91442 4.30364 4.94094 4.23988L6.35761 0.832549Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'star-filled', relations: { usedBy: [{ name: 'Profile', pageId: 'lender-profile' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.2103 12.6493" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.79714 0.5385C6.09581 -0.1795 7.11448 -0.1795 7.41314 0.5385L8.80114 3.87583L12.4038 4.16517C13.1798 4.22717 13.4945 5.19517 12.9031 5.70183L10.1585 8.05317L10.9965 11.5685C11.1771 12.3258 10.3538 12.9238 9.68981 12.5185L6.60514 10.6345L3.52048 12.5185C2.85648 12.9238 2.03314 12.3252 2.21381 11.5685L3.05181 8.05317L0.307145 5.70183C-0.284188 5.19517 0.0304782 4.22717 0.806478 4.16517L4.40914 3.87583L5.79714 0.5385Z" fill="var(--fill-0,#333)"/></svg>' },
    { name: 'chevron-down', relations: { usedBy: [{ name: 'Buttons', pageId: 'buttons' }, { name: 'Loan Stage Group', pageId: 'lender-loan-stage-group' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'document',
      svg: '<svg width="100%" height="100%" viewBox="0 0 12.2 14.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.6 10.6V12.85C8.6 13.264 8.264 13.6 7.85 13.6H1.35C1.15109 13.6 0.960322 13.521 0.81967 13.3803C0.679018 13.2397 0.6 13.0489 0.6 12.85V4.35C0.6 3.936 0.936 3.6 1.35 3.6H2.6C2.93505 3.59977 3.26954 3.62742 3.6 3.68267M8.6 10.6H10.85C11.264 10.6 11.6 10.264 11.6 9.85V6.6C11.6 3.62667 9.438 1.15933 6.6 0.682668C6.26954 0.627424 5.93505 0.599773 5.6 0.600001H4.35C3.936 0.600001 3.6 0.936001 3.6 1.35V3.68267M8.6 10.6H4.35C4.15109 10.6 3.96032 10.521 3.81967 10.3803C3.67902 10.2397 3.6 10.0489 3.6 9.85V3.68267M11.6 8.1V6.85C11.6 6.25326 11.3629 5.68097 10.941 5.25901C10.519 4.83705 9.94674 4.6 9.35 4.6H8.35C8.15109 4.6 7.96032 4.52098 7.81967 4.38033C7.67902 4.23968 7.6 4.04891 7.6 3.85V2.85C7.6 2.55453 7.5418 2.26195 7.42873 1.98896C7.31566 1.71598 7.14992 1.46794 6.94099 1.25901C6.73206 1.05008 6.48402 0.884345 6.21104 0.771272C5.93806 0.658199 5.64547 0.600001 5.35 0.600001H4.6" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'forward', relations: { usedBy: [{ name: 'Stage', pageId: 'lender-stage' }, { name: 'Status Stage', pageId: 'lender-status-stage' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.9388 8.11708" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.6 1.35232C0.6 0.776319 1.222 0.414985 1.722 0.700985L6.46067 3.40832C6.57554 3.4739 6.67102 3.56869 6.73743 3.68308C6.80385 3.79746 6.83883 3.92738 6.83883 4.05965C6.83883 4.19192 6.80385 4.32184 6.73743 4.43623C6.67102 4.55062 6.57554 4.64541 6.46067 4.71099L1.722 7.41832C1.60793 7.48348 1.47875 7.51753 1.34738 7.51707C1.21602 7.51661 1.08707 7.48166 0.973464 7.41571C0.859852 7.34975 0.765557 7.25512 0.700015 7.14127C0.634473 7.02742 0.599984 6.89835 0.6 6.76699V1.35232ZM7.1 1.35232C7.1 0.776319 7.722 0.414985 8.222 0.700985L12.9607 3.40832C13.0755 3.4739 13.171 3.56869 13.2374 3.68308C13.3038 3.79746 13.3388 3.92738 13.3388 4.05965C13.3388 4.19192 13.3038 4.32184 13.2374 4.43623C13.171 4.55062 13.0755 4.64541 12.9607 4.71099L8.222 7.41832C8.10793 7.48348 7.97875 7.51753 7.84738 7.51707C7.71602 7.51661 7.58707 7.48166 7.47346 7.41571C7.35985 7.34975 7.26556 7.25512 7.20002 7.14127C7.13447 7.02742 7.09998 6.89835 7.1 6.76699V1.35232Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'clipboard-document-list', relations: { usedBy: [{ name: 'Sidebar Item', pageId: 'lender-sidebar-item' }, { name: 'Sidebar', pageId: 'lender-sidebar' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 12.2 14.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.1 7.1H6.6M4.1 9.1H6.6M4.1 11.1H6.6M8.6 11.6H10.1C10.4978 11.6 10.8794 11.442 11.1607 11.1607C11.442 10.8794 11.6 10.4978 11.6 10.1V3.172C11.6 2.41533 11.0367 1.77333 10.2827 1.71067C10.0333 1.68999 9.78375 1.67221 9.534 1.65733M9.534 1.65733C9.57824 1.80072 9.60005 1.94994 9.6 2.1C9.6 2.23261 9.54732 2.35979 9.45355 2.45355C9.35979 2.54732 9.23261 2.6 9.1 2.6H6.1C5.824 2.6 5.6 2.376 5.6 2.1C5.6 1.946 5.62333 1.79733 5.66667 1.65733M9.534 1.65733C9.34533 1.04533 8.77467 0.6 8.1 0.6H7.1C6.77949 0.600075 6.46743 0.702763 6.20951 0.893026C5.95158 1.08329 5.76135 1.35113 5.66667 1.65733M5.66667 1.65733C5.416 1.67267 5.16667 1.69067 4.91733 1.71067C4.16333 1.77333 3.6 2.41533 3.6 3.172V4.6M3.6 4.6H1.35C0.936 4.6 0.6 4.936 0.6 5.35V12.85C0.6 13.264 0.936 13.6 1.35 13.6H7.85C8.264 13.6 8.6 13.264 8.6 12.85V5.35C8.6 4.936 8.264 4.6 7.85 4.6H3.6ZM2.6 7.1H2.60533V7.10533H2.6V7.1ZM2.6 9.1H2.60533V9.10533H2.6V9.1ZM2.6 11.1H2.60533V11.1053H2.6V11.1Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'banknotes', relations: { usedBy: [{ name: 'Sidebar Item', pageId: 'lender-sidebar-item' }, { name: 'Sidebar', pageId: 'lender-sidebar' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 14 11.9281" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 10C4.05707 9.9971 7.59867 10.4681 11.0313 11.4007C11.516 11.5327 12 11.1727 12 10.67V10M1.5 0.5V1C1.5 1.13261 1.44732 1.25979 1.35355 1.35355C1.25979 1.44732 1.13261 1.5 1 1.5H0.5M0.5 1.5V1.25C0.5 0.836 0.836 0.5 1.25 0.5H12.5M0.5 1.5V7.5M12.5 0.5V1C12.5 1.276 12.724 1.5 13 1.5H13.5M12.5 0.5H12.75C13.164 0.5 13.5 0.836 13.5 1.25V7.75C13.5 8.164 13.164 8.5 12.75 8.5H12.5M0.5 7.5V7.75C0.5 7.94891 0.579018 8.13968 0.71967 8.28033C0.860322 8.42098 1.05109 8.5 1.25 8.5H1.5M0.5 7.5H1C1.13261 7.5 1.25979 7.55268 1.35355 7.64645C1.44732 7.74022 1.5 7.86739 1.5 8V8.5M12.5 8.5V8C12.5 7.86739 12.5527 7.74022 12.6464 7.64645C12.7402 7.55268 12.8674 7.5 13 7.5H13.5M12.5 8.5H1.5M9 4.5C9 5.03043 8.78929 5.53914 8.41421 5.91421C8.03914 6.28929 7.53043 6.5 7 6.5C6.46957 6.5 5.96086 6.28929 5.58579 5.91421C5.21071 5.53914 5 5.03043 5 4.5C5 3.96957 5.21071 3.46086 5.58579 3.08579C5.96086 2.71071 6.46957 2.5 7 2.5C7.53043 2.5 8.03914 2.71071 8.41421 3.08579C8.78929 3.46086 9 3.96957 9 4.5ZM11 4.5H11.0053V4.50533H11V4.5ZM3 4.5H3.00533V4.50533H3V4.5Z" stroke="var(--stroke-0,#333)" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'user', relations: { usedBy: [{ name: 'Loan List Item', pageId: 'lender-loan-list-item' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.75 2.75C8.75 3.34674 8.51295 3.91903 8.09099 4.34099C7.66903 4.76295 7.09674 5 6.5 5C5.90326 5 5.33097 4.76295 4.90901 4.34099C4.48705 3.91903 4.25 3.34674 4.25 2.75C4.25 2.15326 4.48705 1.58097 4.90901 1.15901C5.33097 0.737053 5.90326 0.5 6.5 0.5C7.09674 0.5 7.66903 0.737053 8.09099 1.15901C8.51295 1.58097 8.75 2.15326 8.75 2.75ZM2.25 11.3233V11.25C2.25 10.1228 2.697767 9.04183 3.4948 8.2448C4.29183 7.44777 5.37283 7 6.5 7C7.62717 7 8.70817 7.44777 9.5052 8.2448C10.3022 9.04183 10.75 10.1228 10.75 11.25V11.3227C9.46699 12.0954 7.99707 12.5025 6.49933 12.5C4.94533 12.5 3.49133 12.07 2.25 11.3227V11.3233Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'user-plus', relations: { usedBy: [{ name: 'Assignees', pageId: 'lender-assignees' }, { name: 'People Dropdown', pageId: 'lender-people-dropdown' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 3.5V5.5M10.5 5.5V7.5M10.5 5.5H12.5M10.5 5.5H8.5M7 2.75C7 3.34674 6.76295 3.91903 6.34099 4.34099C5.91903 4.76295 5.34674 5 4.75 5C4.15326 5 3.58097 4.76295 3.15901 4.34099C2.73705 3.91903 2.5 3.34674 2.5 2.75C2.5 2.15326 2.73705 1.58097 3.15901 1.15901C3.58097 0.737053 4.15326 0.5 4.75 0.5C5.34674 0.5 5.91903 0.737053 6.34099 1.15901C6.76295 1.58097 7 2.15326 7 2.75ZM0.5 11.3233V11.25C0.5 10.1228 0.947767 9.04183 1.7448 8.2448C2.54183 7.44777 3.62283 7 4.75 7C5.87717 7 6.95817 7.44777 7.7552 8.2448C8.55223 9.04183 9 10.1228 9 11.25V11.3227C7.71699 12.0954 6.24707 12.5025 4.74933 12.5C3.19533 12.5 1.74133 12.07 0.5 11.3227V11.3233Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'arrow-up',
      svg: '<svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 13V4M4.5 7.5L8 4L11.5 7.5" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'x-mark', relations: { usedBy: [{ name: 'Assignees', pageId: 'lender-assignees' }, { name: 'People Dropdown', pageId: 'lender-people-dropdown' }, { name: 'Button / Secondary', pageId: 'buttons' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 4L12 12M12 4L4 12" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'building-office-2',
      svg: '<svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 14H14.5M2.5 2V14M9.5 2V14M13.5 5V14M4.5 4.5H5M4.5 6.5H5M4.5 8.5H5M7 4.5H7.5M7 6.5H7.5M7 8.5H7.5M4.5 14V11.75C4.5 11.336 4.836 11 5.25 11H6.75C7.164 11 7.5 11.336 7.5 11.75V14M2 2H10M9.5 5H14M11.5 7.5H11.5053V7.50533H11.5V7.5ZM11.5 9.5H11.5053V9.50533H11.5V9.5ZM11.5 11.5H11.5053V11.5053H11.5V11.5Z" stroke="var(--stroke-0,#333)" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    // eye-open + pencil: match Current Design System › Icons (Figma node 1-72) naming; source SVGs in design-system/icons/. Paths from Heroicons 24/outline — re-paste from Figma if your file differs. stroke-width tuned for ~1.2px hairline when scaled into 16px slots alongside 13× viewBox icons.
    { name: 'eye-open',
      svg: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.03555 12.3224C1.96647 12.1151 1.9664 11.8907 2.03536 11.6834C3.42372 7.50972 7.36079 4.5 12.0008 4.5C16.6387 4.5 20.5742 7.50692 21.9643 11.6776C22.0334 11.8849 22.0335 12.1093 21.9645 12.3166C20.5761 16.4903 16.6391 19.5 11.9991 19.5C7.36119 19.5 3.42564 16.4931 2.03555 12.3224Z" stroke="var(--stroke-0,#333)" stroke-width="2.18" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="var(--stroke-0,#333)" stroke-width="2.18" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'pencil',
      svg: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.8617 4.48667L18.5492 2.79917C19.2814 2.06694 20.4686 2.06694 21.2008 2.79917C21.9331 3.53141 21.9331 4.71859 21.2008 5.45083L6.83218 19.8195C6.30351 20.3481 5.65144 20.7368 4.93489 20.9502L2.25 21.75L3.04978 19.0651C3.26323 18.3486 3.65185 17.6965 4.18052 17.1678L16.8617 4.48667ZM16.8617 4.48667L19.5 7.12499" stroke="var(--stroke-0,#333)" stroke-width="2.18" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'home',
      svg: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" stroke="var(--stroke-0,#333)" stroke-width="2.18" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    // bolt: Current Design System › Icons (Figma node 1-72) — https://www.figma.com/design/LeF2Rd3VnWhhzyXyVqTQsN/Current-Design-System?node-id=1-72
    { name: 'bolt',
      svg: '<svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.75 13.5 10.5 2.25 9 7.5h7.5l-6.75 11.25L12 13.5H3.75z" stroke="var(--stroke-0,#333)" stroke-width="2.18" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'chevron-right',
      svg: '<svg width="100%" height="100%" viewBox="4.5 2.5 7 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4l4 4-4 4" stroke="var(--stroke-0,#333)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'chevron-left',
      svg: '<svg width="100%" height="100%" viewBox="4.5 2.5 7 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 12L6 8l4-4" stroke="var(--stroke-0,#333)" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'chevron-up-down', svg: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 10L8 12.5L10.5 10M5.5 6L8 3.5L10.5 6" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
  ],

  // ── Components ──────────────────────────────────────────────────────────────
  // Each component: title, subtitle, cssFile, variants[]
  // Variant fields are read by buildBtnPreviewHtml() in platform.js to render
  // the live row preview — no HTML needed here, just data.
  components: {
    buttons: {
      title: 'Buttons',
      subtitle: 'Source: Figma › Button/Primary + Button/Secondary · click a variant for code',
      cssFile: 'global.css',
      figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=2-99',
      relations: {
        uses: [{ name: 'Icons', pageId: 'icons' }],
      },
      primaryVariants: [
        { id: 's1',          label: 'Primary — Symbol 1',              icons: ['magnifying-glass'] },
        { id: 's2',          label: 'Primary — Symbol 2',              icons: ['magnifying-glass', 'magnifying-glass'] },
        { id: 's3',          label: 'Primary — Symbol 3',              icons: ['magnifying-glass', 'magnifying-glass', 'magnifying-glass'] },
        { id: 'label',       label: 'Primary — Symbol + Text',         leadIcon: 'magnifying-glass' },
        { id: 'label-trail', label: 'Primary — Symbol + Text + Symbol',leadIcon: 'magnifying-glass', trailIcon: 'chevron-down' },
      ],
      secondaryVariants: [
        { id: 'secondary-s1', label: 'Secondary — Symbol 1', icons: ['funnel'] },
        { id: 'secondary-s2', label: 'Secondary — Symbol 2', icons: ['funnel', 'x-mark'] },
        { id: 'secondary-s3', label: 'Secondary — Symbol 3', icons: ['magnifying-glass', 'funnel', 'x-mark'] },
      ],
      // keep variants as combined list for search index
      get variants() { return [...this.primaryVariants, ...this.secondaryVariants]; },
    },

    // ── Dropdown Item ──────────────────────────────────────────────────────────
    // Global, reusable list row — used inside any dropdown across all products.
    // Lender Portal's Loans Dropdown is built from this component.
    dropdownItem: {
      title: 'Dropdown Item',
      subtitle: 'Global · used inside any dropdown · click a variant for code',
      cssFile: 'global.css',
      figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=114-301',
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

    // ── Segment Picker ─────────────────────────────────────────────────────────
    // Sliding-pill toggle for switching between Individual and Entity borrower views.
    // Uses WAAPI for pill glide + label enter/exit animations.
    segmentPicker: {
      title: 'Segment Picker',
      subtitle: 'Global · switches between Individual and Entity borrower views · click a variant for code',
      cssFile: 'global.css',
      figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=711-4120',
      variants: [
        { id: 'segment-picker-individual', label: 'Individual Active', activeVal: 'individual' },
        { id: 'segment-picker-entity',     label: 'Entity Active',     activeVal: 'entity'     },
        { id: 'segment-picker-hover',      label: 'Hover',             activeVal: 'individual', hoverVal: 'entity' },
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
        cssFile: 'global.css',
        relations: {
          uses: [{ name: 'Dropdown Item', pageId: 'dropdown-item' }, { name: 'Icons', pageId: 'icons' }],
          usedBy: [{ name: 'Loans Panel', pageId: 'lender-loans-panel' }],
        },
        variants: [
          {
            id: 'loans-pill',
            label: 'Loans Pill',
            // Figma node: 270:1898
            // Icon asset — update when Figma URL expires
            iconSvg: '<svg width="100%" height="100%" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 10L8 12.5L10.5 10M5.5 6L8 3.5L10.5 6" stroke="var(--stroke-0,#666)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
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
        cssFile: 'global.css',
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
        cssFile: 'global.css',
        relations: {
          uses: [{ name: 'forward icon', pageId: 'icons' }],
          usedBy: [{ name: 'Status Stage', pageId: 'lender-status-stage' }],
        },
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
        cssFile: 'global.css',
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

      // ── Profile (346:4038) — star icon + circular avatar pill button ──────────
      profile: {
        title: 'Profile',
        subtitle: 'Source: Figma › Lender Exploration · node 346-4038 · click a variant for code',
        figmaFile: 'PYHG9Pu8YLs4ACMPljBiSG',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=346-4038',
        cssFile: 'global.css',
        relations: {
          uses: [
            { name: 'star icon', pageId: 'icons' },
            { name: 'star-filled icon', pageId: 'icons' },
          ],
        },
        // Public headshot (not Figma MCP — those URLs only work inside MCP, not in the browser)
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
        variants: [
          { id: 'profile-favorited',   label: 'Favorited',   favorited: true  },
          { id: 'profile-unfavorited', label: 'Unfavorited', favorited: false },
        ],
      },
      sidebarItem: {
        title: 'Sidebar Item',
        subtitle: 'Source: Figma › Lender Exploration · node 6-92 · icon scales 20→24px on hover',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=6-92',
        cssFile: 'global.css',
        // Uses any design-system icon — clipboard-document-list shown as example
        iconName: 'clipboard-document-list',
        relations: {
          usedBy: [{ name: 'Sidebar', pageId: 'lender-sidebar' }],
        },
        variants: [
          { id: 'sidebar-item-default',  label: 'Default',  state: 'default'  },
          { id: 'sidebar-item-hover',    label: 'Hover',    state: 'hover'    },
          { id: 'sidebar-item-selected', label: 'Selected', state: 'selected' },
        ],
      },
      assignees: {
        title: 'Assignees',
        subtitle: 'Source: Figma › Lender Exploration · node 390-2745 · click a variant for code',
        figmaFile: 'PYHG9Pu8YLs4ACMPljBiSG',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=390-2745',
        cssFile: 'global.css',
        relations: {
          uses: [
            { name: 'chevron-down',    pageId: 'icon-chevron-down'    },
            { name: 'user-plus',       pageId: 'icon-user-plus'       },
            { name: 'magnifying-glass',pageId: 'icon-magnifying-glass'},
            { name: 'x-mark',         pageId: 'icon-x-mark'          },
          ],
        },
        // Avatar URLs — Unsplash headshots (same set as prototype borrower portraits)
        avatar1Url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
        avatar2Url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&h=256&q=80',
        avatar3Url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
        // Sample initials for no-photo variant (Figma node 553-2540)
        initials: ['AM', 'TK', 'KP'],
        // Names and roles for tooltip display on avatar hover
        names: ['Anagh Mirji', 'Tom Kim', 'Kate Park'],
        roles: ['Loan Officer', 'Processor', 'Underwriter'],
        variants: [
          { id: 'assignees-unassigned',    label: 'Unassigned',          count: 0 },
          { id: 'assignees-1',             label: '1 Assignee',          count: 1 },
          { id: 'assignees-1-hover',       label: '1 Assignee — Hover',  count: 1, forceHover: true },
          { id: 'assignees-2',             label: '2 Assignees',         count: 2 },
          { id: 'assignees-3',             label: '3 Assignees',         count: 3 },
          { id: 'assignees-overflow',      label: '4+ Assignees',        count: 4 },
          { id: 'assignees-initials-1',    label: '1 (Initials)',        count: 1, initials: true },
          { id: 'assignees-initials-2',    label: '2 (Initials)',        count: 2, initials: true },
          { id: 'assignees-initials-3',    label: '3 (Initials)',        count: 3, initials: true },
        ],
      },
      peopleDropdown: {
        title: 'People Dropdown',
        subtitle: 'Source: Figma › Lender Exploration · node 553-3849 · click a variant for code',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=553-3849',
        cssFile: 'global.css',
        relations: {
          uses: [
            { name: 'Role Picker',      pageId: 'lender-role-picker'   },
            { name: 'Assignees',        pageId: 'lender-assignees'     },
            { name: 'user-plus',        pageId: 'icon-user-plus'       },
            { name: 'magnifying-glass', pageId: 'icon-magnifying-glass'},
            { name: 'x-mark',          pageId: 'icon-x-mark'          },
          ],
        },
        variants: [
          { id: 'people-dropdown-loan-officer',        label: 'Loan Officer',             viewerRole: 'Loan Officer', searchOpen: false },
          { id: 'people-dropdown-loan-officer-search', label: 'Loan Officer — Search Open', viewerRole: 'Loan Officer', searchOpen: true  },
          { id: 'people-dropdown-underwriter',         label: 'Underwriter',              viewerRole: 'Underwriter',  searchOpen: false },
          { id: 'people-dropdown-processor',           label: 'Processor',                viewerRole: 'Processor',    searchOpen: false },
          { id: 'people-dropdown-closer',              label: 'Closer',                   viewerRole: 'Closer',       searchOpen: false },
        ],
      },
      rolePicker: {
        title: 'Role Picker',
        subtitle: 'Source: Figma › Lender Exploration · node 553-3003 · click a variant for code',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=553-3003',
        cssFile: 'global.css',
        roles: ['Loan Officer', 'Processor', 'Underwriter', 'Closer'],
        relations: {
          usedBy: [{ name: 'People Dropdown', pageId: 'lender-people-dropdown' }],
        },
        variants: [
          { id: 'role-loan-officer', label: 'Loan Officer', activeRole: 'Loan Officer', personName: 'Sarah' },
          { id: 'role-processor',    label: 'Processor',    activeRole: 'Processor',    personName: 'Sarah' },
          { id: 'role-underwriter',  label: 'Underwriter',  activeRole: 'Underwriter',  personName: 'Sarah' },
          { id: 'role-closer',       label: 'Closer',       activeRole: 'Closer',       personName: 'Sarah' },
        ],
      },
      sidebar: {
        title: 'Sidebar',
        subtitle: 'Source: Figma › Lender Exploration · node 362-2876 · 77px navigation panel',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=362-2876',
        cssFile: 'global.css',
        // Public headshot (not Figma MCP — those URLs only work inside MCP, not in the browser)
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80',
        relations: {
          uses: [{ name: 'Sidebar Item', pageId: 'lender-sidebar-item' }],
        },
        items: [
          { label: 'Loans',    iconName: 'banknotes',               active: true  },
          { label: 'Worklist', iconName: 'clipboard-document-list', active: false },
        ],
      },
      // ── Loan List Item (217-473) — individual loan row in the loans panel ────
      loanStageGroup: {
        title: 'Loan Stage Group',
        subtitle: 'Source: Figma › Lender Exploration · node 588-3106 · state: expanded, collapsed',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=588-3106',
        cssFile: 'global.css',
        sample: {
          stageName: 'Application',
          count: 4,
          loans: [
            { name: 'Laura Lee',     amount: '$370,000', loanType: 'Fix & Flip', time: '5 mins ago',   status: 'Active',  statusKey: 'active',  iconName: 'user' },
            { name: 'James Wilson',  amount: '$450,000', loanType: 'Fix & Flip', time: '10 mins ago',  status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Emily Davis',   amount: '$500,000', loanType: 'Fix & Flip', time: '15 mins ago',  status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Anna Martinez', amount: '$280,000', loanType: 'Fix & Flip', time: '2 hours ago',  status: 'On Hold', statusKey: 'on-hold', iconName: 'user' },
          ],
        },
        variants: [
          { id: 'loan-stage-group-expanded',  label: 'Expanded',  expanded: true  },
          { id: 'loan-stage-group-collapsed', label: 'Collapsed', expanded: false },
        ],
        relations: {
          uses:   [
            { name: 'Loan List Item',     pageId: 'lender-loan-list-item' },
            { name: 'chevron-down icon',  pageId: 'icons' },
          ],
          usedBy: [
            { name: 'Loans', pageId: 'lender-loans' },
            { name: 'Loans Panel', pageId: 'lender-loans-panel' },
          ],
        },
      },
      loanListItem: {
        title: 'Loan List Item',
        subtitle: 'Source: Figma › Lender Exploration · node 217-473 · state: default, hover, selected · type: Individual',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=217-473',
        cssFile: 'global.css',
        /** Must match `name` in SYSTEM.icons — same SVG as Icons › user */
        trailingIconName: 'user',
        relations: {
          uses:   [{ name: 'user icon', pageId: 'icons' }],
          usedBy: [
            { name: 'Loans', pageId: 'lender-loans' },
            { name: 'Loans Panel', pageId: 'lender-loans-panel' },
          ],
        },
        sample: {
          name: 'Michael Brown',
          amount: '$370,000',
          loanType: 'Fix & Flip',
          time: '30 mins ago',
          status: 'Active',
          statusKey: 'active',
        },
        variants: [
          { id: 'loan-list-item-default',  label: 'Default',  state: 'default'  },
          { id: 'loan-list-item-hover',    label: 'Hover',    state: 'hover'    },
          { id: 'loan-list-item-selected', label: 'Selected', state: 'selected' },
        ],
      },

      // ── Search Bar ─────────────────────────────────────────────────────────
      searchBar: {
        title: 'Search Bar',
        subtitle: 'Source: Figma › Lender Exploration · node 270-1958',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=270-1958',
        cssFile: 'global.css',
        relations: {
          uses: [{ name: 'magnifying-glass icon', pageId: 'icons' }],
        },
        variants: [
          { id: 'search-bar-default', label: 'Default', state: 'default', value: '' },
          { id: 'search-bar-focused', label: 'Focused', state: 'focused', value: '' },
          { id: 'search-bar-filled',  label: 'Filled',  state: 'filled',  value: 'Sarah Johnson' },
        ],
      },

      // ── Search Section ─────────────────────────────────────────────────────
      searchSection: {
        title: 'Search Section',
        subtitle: 'Source: Figma › Lender Exploration · node 270-1955',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=270-1955',
        cssFile: 'global.css',
        relations: {
          uses: [
            { name: 'Search Bar', pageId: 'lender-search-bar' },
            { name: 'Button / Secondary', pageId: 'buttons-secondary' },
            { name: 'Icons', pageId: 'icons' },
          ],
          usedBy: [
            { name: 'Loans Panel', pageId: 'lender-loans-panel' },
          ],
        },
        variants: [
          { id: 'search-section-default', label: 'Default' },
        ],
      },

      // ── Loans Panel ──────────────────────────────────────────────────────
      loansPanel: {
        title: 'Loans Panel',
        subtitle: 'Source: Figma › Lender Exploration · node 270-1895 · Composed sidebar panel',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=270-1895',
        cssFile: 'global.css',
        relations: {
          uses: [
            { name: 'Loans Pill',         pageId: 'lender-loans'            },
            { name: 'Button / Primary',   pageId: 'buttons'                 },
            { name: 'Loan Stage Group',   pageId: 'lender-loan-stage-group' },
            { name: 'Loan List Item',     pageId: 'lender-loan-list-item'   },
            { name: 'Search Section',     pageId: 'lender-search-section'   },
          ],
        },
        stageGroups: [
          { stageName: 'Application',  count: 4, expanded: true, loans: [
            { name: 'Laura Lee',     amount: '$372,500', loanType: 'Fix & Flip',     time: '3 mins ago',    status: 'Active',  statusKey: 'active',  iconName: 'user' },
            { name: 'James Wilson',  amount: '$418,000', loanType: 'DSCR Rental',    time: '18 mins ago',   status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Emily Davis',   amount: '$565,000', loanType: 'Construction',   time: '42 mins ago',   status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Anna Martinez', amount: '$292,500', loanType: 'Bridge',         time: '2 hours ago',   status: 'On Hold', statusKey: 'on-hold', iconName: 'user' },
          ]},
          { stageName: 'Underwriting', count: 4, expanded: true, loans: [
            { name: 'Michael Chen',   amount: '$518,750', loanType: 'Bridge',         time: '24 mins ago',   status: 'Active',  statusKey: 'active',  iconName: 'user', selected: true },
            { name: 'Sarah Parker',   amount: '$305,000', loanType: 'Fix & Flip',     time: '1 hr ago',      status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Robert Torres',  amount: '$712,000', loanType: 'Rental 5+',      time: '3 hours ago',   status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Jessica Kim',    amount: '$238,900', loanType: 'Fix & Flip',     time: '6 hours ago',   status: 'On Hold', statusKey: 'on-hold', iconName: 'user' },
          ]},
          { stageName: 'Closing',      count: 4, expanded: true, loans: [
            { name: 'David Brown',    amount: '$445,200', loanType: 'Bridge',         time: '20 hours ago',  status: 'Active',  statusKey: 'active',  iconName: 'user' },
            { name: 'Rachel Green',   amount: '$593,000', loanType: 'Fix & Flip',     time: '1 day ago',     status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Mark Johnson',   amount: '$401,500', loanType: 'Bridge',         time: '2 days ago',    status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Lisa Wong',      amount: '$287,000', loanType: 'Rental',         time: '2 days ago',    status: 'On Hold', statusKey: 'on-hold', iconName: 'user' },
          ]},
          { stageName: 'Funded',       count: 4, expanded: true, loans: [
            { name: 'Tom Harris',     amount: '$625,000', loanType: 'Bridge',           time: '4 days ago',    status: 'Active',  statusKey: 'active',  iconName: 'user' },
            { name: 'Amy Scott',      amount: '$352,400', loanType: 'Fix & Flip',       time: '5 days ago',    status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Chris Lee',      amount: '$499,950', loanType: 'DSCR Rental',      time: '6 days ago',    status: 'Active',  statusKey: 'active',  iconName: 'building-office-2' },
            { name: 'Mia Turner',     amount: '$318,000', loanType: 'Bridge',           time: '8 days ago',    status: 'On Hold', statusKey: 'on-hold', iconName: 'user' },
          ]},
        ],
        variants: [
          { id: 'loans-panel-default', label: 'Default' },
        ],
      },
    },
  },
};
