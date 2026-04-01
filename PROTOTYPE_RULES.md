# Prototype Rules
Read this BEFORE writing a single line of prototype code.

---

## 1. Never re-implement what already exists

Before writing any HTML, JS, or CSS — check platform.js first.

| If you need...              | Use this, don't rewrite it                        |
|-----------------------------|---------------------------------------------------|
| Sidebar                     | `buildSidebarHtml()`                              |
| Button (icon-only)          | `buildBtnPreviewHtml({ id: 's1', icons: ['x'] })` |
| Button (label)              | `buildBtnPreviewHtml({ id: 'label', leadIcon: 'x' })` |
| Assignees pill              | `buildAssigneesHtml(people)`                      |
| Assignees dropdown          | `buildAssigneesDropdownHtml(viewerRole)`          |
| People dropdown             | `buildPeopleDropdownHtml(variant, standalone)`    |
| Profile button              | reuse `.profile` CSS class                        |
| Status + Stage pill         | reuse `.lp-status-stage` CSS class                |
| Any icon SVG                | `iconSvg('icon-name')` — never hand-write SVG     |
| Sliding two-option control (segment picker) | `.proto-toggle` + pill + buttons — same markup/JS as Individual/Entity (borrower type) |
| Overview page mode (View / Edit / …)       | `.proto-mode-dropdown` in the edit bar — extend `PROTO_PAGE_MODES` in `prototype.js` for new modes |

If a `buildXHtml()` function exists in platform.js → call it. Full stop.

---

## 2. CSS classes — use, never copy

- Use existing global.css classes (`.btn`, `.assignees`, `.sidebar-nav`, `.profile`, `.lp-status`, `.lp-stage`) directly in prototype HTML
- `prototype.css` is for **layout and context overrides only** — not for redefining components
- Never copy a CSS block from global.css into prototype.css

---

## 3. Icons

- Always use `iconSvg('name')` from platform.js (reads `SYSTEM.icons` in `system.js`)
- Never write a raw `<svg>` inline in prototype.js unless the icon does not exist in `SYSTEM.icons`
- If an icon is missing: add it to `SYSTEM.icons` in `system.js`, optionally add `design-system/icons/{name}.svg` as the paste target for Figma **Copy as SVG**, then use `iconSvg('name')`
- Naming should match the design system when applicable (e.g. `eye-open`, `pencil` for View/Edit — not ad-hoc names unless the DS uses something else)

---

## 4. Figma → match exactly

- Get a screenshot + design context from Figma before building any new section
- Match spacing, radius, font size, colours using the existing token variables
- Never guess a value — read it from Figma

---

## 5. Building order

1. Get Figma screenshot
2. Check platform.js for existing `buildXHtml()` functions to reuse
3. Write only the net-new HTML/CSS that doesn't exist yet
4. Wire interactions
5. Verify in browser before moving on

---

## How to invoke
Tell Claude: **"follow PROTOTYPE_RULES"** at the start of any prototype session.
