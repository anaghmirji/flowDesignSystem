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
    { name: 'magnifying-glass', relations: { usedBy: [{ name: 'Buttons', pageId: 'buttons' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.2005 13.2005" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6005 12.6005L9.13585 9.13585M9.13585 9.13585C10.0736 8.19814 10.6004 6.92632 10.6004 5.60019C10.6004 4.27406 10.0736 3.00224 9.13585 2.06452C8.19814 1.1268 6.92632 0.6 5.60019 0.6C4.27406 0.6 3.00224 1.1268 2.06452 2.06452C1.1268 3.00224 0.6 4.27406 0.6 5.60019C0.6 6.92632 1.1268 8.19814 2.06452 9.13585C3.00224 10.0736 4.27406 10.6004 5.60019 10.6004C6.92632 10.6004 8.19814 10.0736 9.13585 9.13585Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'plus',
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.2 13.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 0.6V12.6M12.6 6.6H0.6" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'funnel',
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.2 13.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.6 0.600002C8.43667 0.600002 10.2367 0.754669 11.9887 1.052C12.344 1.112 12.6 1.42267 12.6 1.78267V2.47867C12.6 2.67565 12.5612 2.87071 12.4858 3.0527C12.4104 3.23469 12.3 3.40005 12.1607 3.53934L8.53933 7.16067C8.40005 7.29996 8.28956 7.46532 8.21418 7.64731C8.1388 7.8293 8.1 8.02435 8.1 8.22134V10.1727C8.10005 10.4513 8.02249 10.7245 7.87601 10.9615C7.72952 11.1985 7.51991 11.3901 7.27067 11.5147L5.1 12.6V8.22134C5.1 8.02435 5.0612 7.8293 4.98582 7.64731C4.91044 7.46532 4.79995 7.29996 4.66067 7.16067L1.03933 3.53934C0.900046 3.40005 0.789557 3.23469 0.714176 3.0527C0.638796 2.87071 0.599998 2.67565 0.6 2.47867V1.78267C0.6 1.42267 0.856 1.112 1.21133 1.052C2.99171 0.750571 4.79428 0.599372 6.6 0.600002Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'archive-box',
      svg: '<svg width="100%" height="100%" viewBox="0 0 14.2 12.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.6 3.1L12.1833 10.188C12.1609 10.57 11.9933 10.929 11.7148 11.1915C11.4363 11.454 11.068 11.6001 10.6853 11.6H3.51467C3.13198 11.6001 2.7637 11.454 2.48522 11.1915C2.20674 10.929 2.03912 10.57 2.01667 10.188L1.6 3.1M5.76667 5.6H8.43333M1.35 3.1H12.85C13.264 3.1 13.6 2.764 13.6 2.35V1.35C13.6 0.936 13.264 0.6 12.85 0.6H1.35C0.936 0.6 0.6 0.936 0.6 1.35V2.35C0.6 2.764 0.936 3.1 1.35 3.1Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'bell',
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.155 14.147" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.64033 10.7432C9.98536 10.5839 11.3069 10.2665 12.5775 9.79751C11.5015 8.60553 10.9069 7.05612 10.9092 5.45028V4.90886C10.9092 3.76012 10.4529 2.65842 9.64061 1.84614C8.82832 1.03385 7.72663 0.577513 6.57788 0.577513C5.42914 0.577513 4.32744 1.03385 3.51516 1.84614C2.70287 2.65842 2.24653 3.76012 2.24653 4.90886V5.45028C2.24871 7.05622 1.65385 8.60564 0.577522 9.79751C1.82856 10.2595 3.14745 10.5808 4.51544 10.7432M8.64033 10.7432C7.27017 10.9057 5.8856 10.9057 4.51544 10.7432M8.64033 10.7432C8.74435 11.0679 8.77022 11.4127 8.71583 11.7493C8.66143 12.0859 8.52831 12.405 8.3273 12.6804C8.12629 12.9559 7.86307 13.18 7.55907 13.3345C7.25507 13.489 6.91889 13.5695 6.57788 13.5695C6.23688 13.5695 5.90069 13.489 5.59669 13.3345C5.2927 13.18 5.02948 12.9559 4.82847 12.6804C4.62746 12.405 4.49433 12.0859 4.43994 11.7493C4.38554 11.4127 4.41141 11.0679 4.51544 10.7432" stroke="var(--stroke-0,#333)" stroke-width="1.15503" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'star',
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.4094 12.8483" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.35761 0.832549C6.38581 0.76377 6.43382 0.704933 6.49556 0.663522C6.55729 0.622112 6.62994 0.6 6.70428 0.6C6.77861 0.6 6.85127 0.622112 6.913 0.663522C6.97473 0.704933 7.02275 0.76377 7.05094 0.832549L8.46761 4.23988C8.49413 4.30364 8.53772 4.35885 8.59359 4.39942C8.64946 4.44 8.71544 4.46438 8.78428 4.46988L12.4629 4.76455C12.7956 4.79122 12.9303 5.20655 12.6769 5.42322L9.87428 7.82455C9.82191 7.86934 9.78289 7.92769 9.76149 7.99319C9.74009 8.05869 9.73713 8.12881 9.75294 8.19588L10.6096 11.7859C10.6268 11.8579 10.6223 11.9334 10.5966 12.0029C10.571 12.0723 10.5253 12.1326 10.4654 12.1762C10.4054 12.2197 10.334 12.2445 10.26 12.2474C10.186 12.2503 10.1128 12.2312 10.0496 12.1926L6.89961 10.2692C6.84079 10.2333 6.7732 10.2143 6.70428 10.2143C6.63535 10.2143 6.56776 10.2333 6.50894 10.2692L3.35894 12.1932C3.29578 12.2319 3.22258 12.251 3.14858 12.248C3.07458 12.2451 3.00311 12.2203 2.94319 12.1768C2.88327 12.1333 2.83758 12.073 2.81191 12.0035C2.78624 11.9341 2.78172 11.8586 2.79894 11.7865L3.65561 8.19588C3.6715 8.12882 3.66858 8.05867 3.64717 7.99315C3.62576 7.92764 3.5867 7.8693 3.53428 7.82455L0.731609 5.42322C0.675171 5.37511 0.634281 5.31133 0.614116 5.23996C0.593951 5.16859 0.59542 5.09285 0.618335 5.02232C0.641251 4.95178 0.684583 4.88964 0.742843 4.84375C0.801104 4.79787 0.871672 4.7703 0.945609 4.76455L4.62428 4.46988C4.69311 4.46438 4.75909 4.44 4.81496 4.39942C4.87083 4.35885 4.91442 4.30364 4.94094 4.23988L6.35761 0.832549Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'star-filled',
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.2103 12.6493" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.79714 0.5385C6.09581 -0.1795 7.11448 -0.1795 7.41314 0.5385L8.80114 3.87583L12.4038 4.16517C13.1798 4.22717 13.4945 5.19517 12.9031 5.70183L10.1585 8.05317L10.9965 11.5685C11.1771 12.3258 10.3538 12.9238 9.68981 12.5185L6.60514 10.6345L3.52048 12.5185C2.85648 12.9238 2.03314 12.3252 2.21381 11.5685L3.05181 8.05317L0.307145 5.70183C-0.284188 5.19517 0.0304782 4.22717 0.806478 4.16517L4.40914 3.87583L5.79714 0.5385Z" fill="var(--fill-0,#333)"/></svg>' },
    { name: 'chevron-down', relations: { usedBy: [{ name: 'Buttons', pageId: 'buttons' }] },
      svg: '<svg width="100%" height="100%" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--stroke-0,#333)" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'document',
      svg: '<svg width="100%" height="100%" viewBox="0 0 12.2 14.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.6 10.6V12.85C8.6 13.264 8.264 13.6 7.85 13.6H1.35C1.15109 13.6 0.960322 13.521 0.81967 13.3803C0.679018 13.2397 0.6 13.0489 0.6 12.85V4.35C0.6 3.936 0.936 3.6 1.35 3.6H2.6C2.93505 3.59977 3.26954 3.62742 3.6 3.68267M8.6 10.6H10.85C11.264 10.6 11.6 10.264 11.6 9.85V6.6C11.6 3.62667 9.438 1.15933 6.6 0.682668C6.26954 0.627424 5.93505 0.599773 5.6 0.600001H4.35C3.936 0.600001 3.6 0.936001 3.6 1.35V3.68267M8.6 10.6H4.35C4.15109 10.6 3.96032 10.521 3.81967 10.3803C3.67902 10.2397 3.6 10.0489 3.6 9.85V3.68267M11.6 8.1V6.85C11.6 6.25326 11.3629 5.68097 10.941 5.25901C10.519 4.83705 9.94674 4.6 9.35 4.6H8.35C8.15109 4.6 7.96032 4.52098 7.81967 4.38033C7.67902 4.23968 7.6 4.04891 7.6 3.85V2.85C7.6 2.55453 7.5418 2.26195 7.42873 1.98896C7.31566 1.71598 7.14992 1.46794 6.94099 1.25901C6.73206 1.05008 6.48402 0.884345 6.21104 0.771272C5.93806 0.658199 5.64547 0.600001 5.35 0.600001H4.6" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'forward',
      svg: '<svg width="100%" height="100%" viewBox="0 0 13.9388 8.11708" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.6 1.35232C0.6 0.776319 1.222 0.414985 1.722 0.700985L6.46067 3.40832C6.57554 3.4739 6.67102 3.56869 6.73743 3.68308C6.80385 3.79746 6.83883 3.92738 6.83883 4.05965C6.83883 4.19192 6.80385 4.32184 6.73743 4.43623C6.67102 4.55062 6.57554 4.64541 6.46067 4.71099L1.722 7.41832C1.60793 7.48348 1.47875 7.51753 1.34738 7.51707C1.21602 7.51661 1.08707 7.48166 0.973464 7.41571C0.859852 7.34975 0.765557 7.25512 0.700015 7.14127C0.634473 7.02742 0.599984 6.89835 0.6 6.76699V1.35232ZM7.1 1.35232C7.1 0.776319 7.722 0.414985 8.222 0.700985L12.9607 3.40832C13.0755 3.4739 13.171 3.56869 13.2374 3.68308C13.3038 3.79746 13.3388 3.92738 13.3388 4.05965C13.3388 4.19192 13.3038 4.32184 13.2374 4.43623C13.171 4.55062 13.0755 4.64541 12.9607 4.71099L8.222 7.41832C8.10793 7.48348 7.97875 7.51753 7.84738 7.51707C7.71602 7.51661 7.58707 7.48166 7.47346 7.41571C7.35985 7.34975 7.26556 7.25512 7.20002 7.14127C7.13447 7.02742 7.09998 6.89835 7.1 6.76699V1.35232Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'clipboard-document-list',
      svg: '<svg width="100%" height="100%" viewBox="0 0 12.2 14.2" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.1 7.1H6.6M4.1 9.1H6.6M4.1 11.1H6.6M8.6 11.6H10.1C10.4978 11.6 10.8794 11.442 11.1607 11.1607C11.442 10.8794 11.6 10.4978 11.6 10.1V3.172C11.6 2.41533 11.0367 1.77333 10.2827 1.71067C10.0333 1.68999 9.78375 1.67221 9.534 1.65733M9.534 1.65733C9.57824 1.80072 9.60005 1.94994 9.6 2.1C9.6 2.23261 9.54732 2.35979 9.45355 2.45355C9.35979 2.54732 9.23261 2.6 9.1 2.6H6.1C5.824 2.6 5.6 2.376 5.6 2.1C5.6 1.946 5.62333 1.79733 5.66667 1.65733M9.534 1.65733C9.34533 1.04533 8.77467 0.6 8.1 0.6H7.1C6.77949 0.600075 6.46743 0.702763 6.20951 0.893026C5.95158 1.08329 5.76135 1.35113 5.66667 1.65733M5.66667 1.65733C5.416 1.67267 5.16667 1.69067 4.91733 1.71067C4.16333 1.77333 3.6 2.41533 3.6 3.172V4.6M3.6 4.6H1.35C0.936 4.6 0.6 4.936 0.6 5.35V12.85C0.6 13.264 0.936 13.6 1.35 13.6H7.85C8.264 13.6 8.6 13.264 8.6 12.85V5.35C8.6 4.936 8.264 4.6 7.85 4.6H3.6ZM2.6 7.1H2.60533V7.10533H2.6V7.1ZM2.6 9.1H2.60533V9.10533H2.6V9.1ZM2.6 11.1H2.60533V11.1053H2.6V11.1Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
    { name: 'banknotes',
      svg: '<svg width="100%" height="100%" viewBox="0 0 14 11.9281" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.5 10C4.05707 9.9971 7.59867 10.4681 11.0313 11.4007C11.516 11.5327 12 11.1727 12 10.67V10M1.5 0.5V1C1.5 1.13261 1.44732 1.25979 1.35355 1.35355C1.25979 1.44732 1.13261 1.5 1 1.5H0.5M0.5 1.5V1.25C0.5 0.836 0.836 0.5 1.25 0.5H12.5M0.5 1.5V7.5M12.5 0.5V1C12.5 1.276 12.724 1.5 13 1.5H13.5M12.5 0.5H12.75C13.164 0.5 13.5 0.836 13.5 1.25V7.75C13.5 8.164 13.164 8.5 12.75 8.5H12.5M0.5 7.5V7.75C0.5 7.94891 0.579018 8.13968 0.71967 8.28033C0.860322 8.42098 1.05109 8.5 1.25 8.5H1.5M0.5 7.5H1C1.13261 7.5 1.25979 7.55268 1.35355 7.64645C1.44732 7.74022 1.5 7.86739 1.5 8V8.5M12.5 8.5V8C12.5 7.86739 12.5527 7.74022 12.6464 7.64645C12.7402 7.55268 12.8674 7.5 13 7.5H13.5M12.5 8.5H1.5M9 4.5C9 5.03043 8.78929 5.53914 8.41421 5.91421C8.03914 6.28929 7.53043 6.5 7 6.5C6.46957 6.5 5.96086 6.28929 5.58579 5.91421C5.21071 5.53914 5 5.03043 5 4.5C5 3.96957 5.21071 3.46086 5.58579 3.08579C5.96086 2.71071 6.46957 2.5 7 2.5C7.53043 2.5 8.03914 2.71071 8.41421 3.08579C8.78929 3.46086 9 3.96957 9 4.5ZM11 4.5H11.0053V4.50533H11V4.5ZM3 4.5H3.00533V4.50533H3V4.5Z" stroke="var(--stroke-0,#333)" stroke-linecap="round" stroke-linejoin="round"/></svg>' },
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

      // ── Profile (346:4038) — star icon + circular avatar pill button ──────────
      profile: {
        title: 'Profile',
        subtitle: 'Source: Figma › Lender Exploration · node 346-4038 · click a variant for code',
        figmaFile: 'PYHG9Pu8YLs4ACMPljBiSG',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=346-4038',
        // star-filled in gold — same SVG as design system star-filled, colour via --fill-0 override
        avatarUrl: 'https://www.figma.com/api/mcp/asset/c7282667-898c-4558-b46c-a85b2bb9995f',
        variants: [
          {
            id: 'profile-default',
            label: 'Default',
          },
        ],
      },
      sidebarItem: {
        title: 'Sidebar Item',
        subtitle: 'Source: Figma › Lender Exploration · node 6-92 · icon scales 20→24px on hover',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=6-92',
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
      sidebar: {
        title: 'Sidebar',
        subtitle: 'Source: Figma › Lender Exploration · node 362-2876 · 77px navigation panel',
        figmaUrl: 'https://www.figma.com/design/PYHG9Pu8YLs4ACMPljBiSG/Lender-Exploration?node-id=362-2876',
        avatarUrl: 'https://www.figma.com/api/mcp/asset/c7282667-898c-4558-b46c-a85b2bb9995f',
        relations: {
          uses: [{ name: 'Sidebar Item', pageId: 'lender-sidebar-item' }],
        },
        items: [
          { label: 'Loans',    iconName: 'banknotes',               active: true  },
          { label: 'Worklist', iconName: 'clipboard-document-list', active: false },
        ],
      },
    },
  },
};
