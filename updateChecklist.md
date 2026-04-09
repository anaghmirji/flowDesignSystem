# Update Checklist

Every time a component is added or changed, go through every item below without skipping.

---

## 1. Styles — global.css
- [ ] Styles added or updated correctly
- [ ] All transitions use `var(--ease-smooth)` or `var(--ease-spring)` — never raw `0.1s ease`
- [ ] Icon colour uses `--stroke-0` (outline icons) or `--fill-0` (filled icons) — never hardcoded hex
- [ ] CSS variable `--stroke-0` or `--fill-0` is set on the correct container element in CSS

### AI Panel (switcher + column chrome) — single source of truth
- [ ] **All** `.ai-panel__*` shared rules live in `design-system/css/global.css` (switcher row, tabs, body, masks, stage footer, scroll fade, stub content for DS previews)
- [ ] **Do not** duplicate those rules in `prototype.css` — prototype only keeps `.proto-ai-panel` shell + `z-index` stacking + loan-specific `.ai-cond__*` conditions UI
- [ ] `prototype.html` loads `global.css` before `prototype.css` so tokens and AI panel styles apply

## 2. Right Panel — platform.js (CSS snippet)
- [ ] CSS snippet inside `XTabs()` matches `global.css` exactly — copy it line for line
- [ ] Includes ALL rules: base, hover, children, modifiers (e.g. `:first-child`, `.open`, `svg` sub-rules)
- [ ] Icon colour shown using `--stroke-0: var(--accent-black-X)` — not hardcoded

## 3. Right Panel — platform.js (HTML snippet)
- [ ] HTML snippet shows correct markup with all required classes
- [ ] Reflects the actual output of `buildXHtml()` — keep in sync

## 4. Right Panel — platform.js (SVG tab)
- [ ] SVG tab exists if the component uses any icon
- [ ] Shows the raw SVG with `stroke="var(--stroke-0,#333)"` or `fill="var(--fill-0,#333)"`
- [ ] Includes a comment showing how to set `--stroke-0` / `--fill-0` on the container

## 5. Right Panel — platform.js (React snippet)
- [ ] React snippet shows correct props and usage
- [ ] Import path is `flow-design-system/react`
- [ ] CSS import is `flow-design-system/styles.css`

## 6. Right Panel — platform.js (Live preview)
- [ ] `buildXHtml(v)` renders correctly for every variant
- [ ] Preview is passed to `openPanel({ preview: ... })`

### Nav page must exist in `PAGE_RENDERERS` (easy to miss)
- [ ] Every `system.js` nav item `id` (e.g. `lender-ai-panel-switcher`) has a matching key in `platform.js` → `PAGE_RENDERERS` and a `render…Page()` function
- [ ] If the renderer is missing, `init()` skips that page entirely — the main column stays **blank**
- [ ] `bind…Rows()` for that page is called from `init()` so table rows open the right panel

## 7. Right Panel — platform.js (Interactions)
- [ ] `onPreviewMount` wires up all hover, click, toggle behaviour
- [ ] Every interactive state (open/close, selected, toggle) is handled

## 8. Right Panel — platform.js (Relations)
- [ ] `relations: comp.relations || null` is passed to `openPanel()` ← EASY TO MISS
- [ ] Relations show correctly in the right panel when a variant is clicked
- [ ] Clicking a relation chip navigates to the correct page

## 9. System — system.js (Variants)
- [ ] Every design state has a variant (default, hover, selected, open, favourited, etc.)
- [ ] Each variant has a unique `id` and descriptive `label`

## 10. System — system.js (Relations)
- [ ] `relations.uses` lists every icon and component this component depends on
- [ ] `relations.usedBy` lists every component that uses this one
- [ ] Page IDs in relations match actual nav `data-page` values

## 11. System — system.js (Metadata)
- [ ] `cssFile: 'global.css'` is present
- [ ] `figmaUrl` points to the correct Figma node
- [ ] `figmaFile` key is correct if used

## 12. System — system.js (Icons)
- [ ] Any new icon is added to `SYSTEM.icons` array
- [ ] Optional: keep a matching file under `design-system/icons/{name}.svg` for Figma paste / source of truth (e.g. `eye-open`, `pencil` for View/Edit)
- [ ] SVG uses `stroke="var(--stroke-0,#333)"` or `fill="var(--fill-0,#333)"`
- [ ] Icon name is kebab-case and consistent with usage in `iconSvg('name')`

## 13. React Component (design-system/react/src/)
- [ ] Component file exists and is in sync with CSS and HTML
- [ ] Props match what the HTML/CSS expects
- [ ] Exported from `index.ts` if newly added

## 14. Verify in browser (`npm run serve` → default **http://localhost:8080**)
- [ ] All variants render correctly visually
- [ ] Clicking a variant opens the right panel
- [ ] Relations section appears in the right panel
- [ ] All tabs (HTML, CSS, SVG, React) show correct content
- [ ] Interactive behaviour works (hover, click, toggle, open/close)
- [ ] No console errors
- [ ] **Lender Portal → AI Panel Switcher** shows a filled table (not empty) — requires `PAGE_RENDERERS['lender-ai-panel-switcher']` + `bindAiPanelSwitcherRows()`

## 15. Prototype — reuse, never duplicate

**Rule: The prototype NEVER re-implements anything already in the design system.**

- [ ] Any component that exists in platform.js is used by calling its existing `buildXHtml()` function directly — never by copying its HTML structure
- [ ] Any icon is rendered via `iconSvg('name')` from platform.js — never via a hand-written inline SVG
- [ ] Any button is rendered via `buildBtnPreviewHtml(variant)` — never by hand-writing `btn__icon-wrap` HTML
- [ ] Any design system CSS class (`.btn`, `.assignees`, `.profile`, `.sidebar-nav`, etc.) is used as-is — never re-styled or overridden in prototype.css unless it's a layout-only context override
- [ ] Before writing any new HTML in prototype.js, ask: does `platform.js` already have a `buildXHtml()` for this? If yes, call it.

---

## 16. Prototype — Animations (ANIMATION_STYLE.md)

All JS-driven animations in the prototype MUST follow the animation vocabulary defined in `ANIMATION_STYLE.md`. Run through these checks for every animation added or changed:

### Easing curves — only use these four
- [ ] **Fluid exit** uses `cubic-bezier(0.4, 0, 1, 0.8)` — for elements leaving / collapsing / fading out
- [ ] **Fluid enter** uses `cubic-bezier(0.16, 1, 0.3, 1)` — for elements appearing / expanding / sliding in
- [ ] **Spring** uses `cubic-bezier(0.34, 1.48, 0.64, 1)` — for elastic moments (toggle thumb, trigger reactions)
- [ ] **Slow hold** uses `cubic-bezier(0.12, 0, 0.36, 0)` — first keyframe of amoeba split only
- [ ] No stray curves (e.g. `0.55, 0, 1, 0.45` or `0.34, 1.56, 0.64, 1`) — they must match exactly

### Timing
- [ ] Micro animations (icon, dot): 160–240ms
- [ ] Component animations (dropdown open): 320–520ms
- [ ] Mode switches: 380–480ms
- [ ] Exit / collapse / close: 160–240ms (always faster than entrance)

### WAAPI best practices
- [ ] Multi-keyframe animations use `element.animate()` with per-keyframe easing
- [ ] Top-level easing is `'linear'` when per-keyframe easing is used
- [ ] `fill: 'none'` — never `fill: 'forwards'`
- [ ] `onfinish` sets final inline style, then clears it (no stale transforms)
- [ ] Interruptible animations read current position from `getComputedStyle()` before cancelling

### Pattern-specific checks

**Overview mode dropdown (View / Edit + future modes):**
- [ ] Edit bar uses `.proto-mode-dropdown` (`data-mode-dropdown`), trigger (`data-mode-trigger`), menu (`data-mode-menu`); borrower **Individual/Entity** still uses `.proto-toggle` only
- [ ] `PROTO_PAGE_MODES` in `prototype.js` (View / Edit only; menu `left:0` under trigger like status dropdown)
- [ ] Default: `.proto-main` has `data-view-mode`; trigger shows **View** + `eye-open` + chevron
- [ ] `bindEditMode()`: `applyMainMode`, `syncModeDropdownUI`, `exitViewMode`; click-outside + Escape close menu; tooltip “Enable editing” switches to Edit
- [ ] `bindFormInteractions()` — WAAPI pill animation for `[data-toggle]` **only** (no page-mode branch)

**View mode field animation:**
- [ ] `.proto-field__value` has CSS transitions on: `padding-left`, `border-color`, `border-radius`, `background`
- [ ] `padding-left` and `border-radius` use spring curve `(0.34, 1.4, 0.64, 1)` at 0.42s
- [ ] `border-color` and `background` use `(0.4, 0, 0.2, 1)` at 0.35s
- [ ] `[data-view-mode]` rule uses `border-color: transparent` — not `border: none` (so border fades, doesn't snap)
- [ ] `[data-view-mode]` sets `padding-left: 0`, `border-radius: 0`, `background: transparent`

**Status dropdown (amoeba split):**
- [ ] `mountLpStatusDropdown()` in platform.js handles open/close
- [ ] `transform-origin` set dynamically to `${trigger.offsetWidth / 2}px top`
- [ ] Open: starts at `scaleX(0.44) scaleY(0.02) translateY(-4px)` with `borderRadius: 100px`
- [ ] Open: ends at `scaleX(1) scaleY(1) translateY(0)` with `borderRadius: 16px`
- [ ] Close: reverse of open — collapses back to sliver and translates up
- [ ] Trigger split animation: `scaleX(0.86) scaleY(1.14)` at 18% with fluid-exit easing
- [ ] Trigger merge animation: `scaleX(1.08) scaleY(0.88)` at 35% with spring easing
- [ ] Menu gap is `top: calc(100% + 4px)` — open anim compensates with `translateY(-4px)`

**Stage forward button (slide-through icon swap):**
- [ ] Icon exit: `translateX(0) scale(1) → translateX(60%) scale(0.7) → translateX(130%) scale(0.55)` — 220ms fluid-exit
- [ ] Icon enter: `translateX(-130%) scale(0.55) → translateX(-40%) scale(0.75) → translateX(0) scale(1)` — 380ms fluid-enter
- [ ] Inline style frozen between exit/enter (`transform` + `opacity` set before `requestAnimationFrame`)
- [ ] `stageAnimating` guard prevents double-click interruption
- [ ] Label exit: `translateY(-8px)` fade out — 180ms fluid-exit
- [ ] Label enter: `translateY(8px) → translateY(-2px) → translateY(0)` — 340ms fluid-enter
- [ ] Stage width change uses `translateX(-delta)` — no `width` animation, no `scaleX`
- [ ] Right edge (button) stays perfectly stationary during width transition
- [ ] Width expand: 320ms fluid-enter; width contract: 220ms fluid-exit
- [ ] `STAGES` array: `['Application', 'Underwriting', 'Closing', 'Funded', 'Post-close']`
- [ ] `.lp-stage__label` has `display: inline-block` in global.css (required for transforms)

---

## 17. Prototype — Structure (prototype.js)

### HTML builders
- [ ] `buildApp()` → `buildSidebarHtml()` + `buildTopBar()` + `buildBody()`
- [ ] `buildBody()` → `buildLoansPanelHtml()` + `buildBorrowerHeader()` + `buildLoanStatsHtml()` + Edit bar + `buildFormHtml()`
- [ ] `buildBorrowerHeader()` uses `buildProfileHtml()`, `buildBtnPreviewHtml()`, `buildAssigneesHtml()`, `buildLpStatusStageInteractiveHtml()` from platform.js
- [ ] `buildTopBar()` uses `buildBtnPreviewHtml()` for action buttons
- [ ] `buildFormHtml()` sections use `buildBtnPreviewHtml({ id: 's1', icons: ['chevron-down'] })` for chevrons

### Edit bar / Mode dropdown
- [ ] Edit bar contains: `.proto-edit-bar__title` ("Overview") + `.proto-edit-bar__right` with `buildProtoModeDropdownHtml('view')` output
- [ ] `.proto-main` opens with `data-view-mode` (read-only default)
- [ ] Edit bar has `padding: 0 16px 0` (no bottom padding)

### Form sections
- [ ] Borrower Information: Identity (with Individual/Entity toggle), Entity Details (hidden by default), Contact, Financial Profile
- [ ] Properties: sidebar with items + detail pane (Location, Property Details, Valuation, Investment Details)
- [ ] Loan Terms: Core Terms, Calculated Metrics, Rate & Structure, Timeline
- [ ] Internal Notes: view span + textarea + footer

### Interaction bindings (DOMContentLoaded)
- [ ] `bindInteractions()` — sidebar items, tabs, tab close
- [ ] `bindResizeHandle()` — AI panel drag resize
- [ ] `bindAiPanelSwitcher()` — AI tab pill + ghost-icon animation; `renderAiPanelBody()` fills body for **every** tab (not only Conditions)
- [ ] `syncAiPanelBodyToActiveLoan()` — end of `applyMainLoanDetail()` so Summary/meta update when the selected loan changes
- [ ] `bindBorrowerHeader()` — profile star, assignees dropdown, stage forward button, status dropdown
- [ ] `bindEditMode()` — mode dropdown, view-mode tooltip, field commit/sync, `applyMainMode` / `exitViewMode`
- [ ] `bindFormInteractions()` — Individual/Entity `proto-toggle` only; click-to-edit fields, keyboard shortcuts
- [ ] Init order: `initTogglePills()` → … → `bindEditMode()` before `bindFormInteractions()` (unchanged)
- [ ] `bindPropertyTabs()` — property sidebar selection, set primary, remove, add
- [ ] `bindSectionCollapse()` — accordion expand/collapse
- [ ] `bindInfoTooltips()` — info button popovers (feeders & eaters)
- [ ] `bindProtoFormIndex()` — floating section index pill + scroll targets
- [ ] Scroll listener for edit bar fade effect
- [ ] `mountLoansPanelInteractive()` on the loans panel

---

## 18. Prototype — Styles (prototype.css)

### Layout hierarchy
- [ ] `#app` → `.proto-content` → `.proto-topbar` + `.proto-body`
- [ ] `.proto-body` → `.proto-card` → `.loans-panel` + `.proto-main` + `.proto-resize-handle` + `.proto-ai-panel`
- [ ] `.proto-main` → `.proto-borrower-header` + `.proto-loan-stats` + `.proto-edit-bar` + `.proto-main__scroll-host` → (`.proto-main__scroll` → `.proto-form-wrap`) + (`.proto-form-index` absolute, sibling of scroll)
- [ ] `.proto-ai-panel` stacks above `.proto-main` (`z-index` higher than main column) so the switcher is not covered by the form index / main column

### Scrolling
- [ ] `.proto-main__scroll-host` wraps scroll + index; `flex: 1; min-height: 0; position: relative`
- [ ] `.proto-main__scroll` has `scrollbar-width: none` + `::-webkit-scrollbar { display: none }`
- [ ] `.proto-main__scroll::before` gradient fade — opacity controlled by `.proto-edit-bar--scrolled` (selector may use `~ .proto-main__scroll-host .proto-main__scroll::before`)
- [ ] `.proto-prop-sidebar` has hidden scrollbar
- [ ] `.proto-topbar__tabs` has hidden scrollbar

### Field values
- [ ] `.proto-field__value` base: white bg, 0.5px border, 10px radius, `padding: 8px 12px`
- [ ] `.proto-field__value` transitions: `padding-left`, `border-color`, `border-radius`, `background`
- [ ] `[data-view-mode]` override: transparent border/bg, 0 radius, 0 left padding
- [ ] `.proto-field--readonly` values: fafafa bg, 808080 colour, ebebeb border

### Mode dropdown (edit bar)
- [ ] Styles: `.proto-mode-dropdown`, `__trigger`, `__menu`, `__option`, `__soon` — pill trigger matches gray track + 100px radius; menu matches card shadow / radius used elsewhere in the prototype

---

## 19. Git
- [ ] Working on a feature branch (not directly on main)
- [ ] Commit message is descriptive (`feat:`, `fix:`, `refactor:`)
- [ ] Merged to main and pushed only after browser verification passes

---

## 20. AI Panel Switcher — design-system page (`lender-ai-panel-switcher`)
- [ ] `system.js` → `products.lenderPortal.aiPanelSwitcher` has `title`, `subtitle`, `figmaUrl`, `tabs[]`, `variants[]` (include one `live: true` for interactive row)
- [ ] `platform.js` → `buildAiPanelSwitcherHtml(activeTabId)` uses `SYSTEM.products.lenderPortal.aiPanelSwitcher.tabs` + `iconSvg()`
- [ ] `renderLenderAiPanelSwitcherPage()` builds `.ds-table` rows with `data-ai-panel-switcher-variant`
- [ ] `bindAiPanelSwitcherRows()` + `mountAiPanelSwitcherInteractive()` for live tab animation (same easing vocabulary as `switchAiTab` in `prototype.js`)
- [ ] Code panel **CSS** tab points at `global.css` — do not paste a full duplicate stylesheet string in `aiPanelSwitcherTabs()`
- [ ] `PAGE_RENDERERS['lender-ai-panel-switcher']` and `bindAiPanelSwitcherRows()` in `init()` — both required or the nav page is empty

---

## Notes
- `--stroke-0` controls stroke colour on outline SVG icons
- `--fill-0` controls fill colour on filled SVG icons
- `relations` must be passed to `openPanel()` AND defined in `system.js` — both are required
- All CSS transitions: `var(--ease-smooth)` for standard, `var(--ease-spring)` for interactive/toggle
- All JS animations: follow `ANIMATION_STYLE.md` — four easing curves only, exits faster than entrances
- **Prototype overview mode** uses `.proto-mode-dropdown` on the edit bar; borrower **Individual/Entity** still uses `.proto-toggle`. Do not reintroduce `.proto-mode-toggle`.
- Branch first → make changes → verify in browser → commit → merge to main → push
- **AI panel UI**: one source in `design-system/css/global.css`; **prototype** adds shell + conditions cards only; **platform** registers the DS doc page via `PAGE_RENDERERS`
