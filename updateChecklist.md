# Update Checklist

Every time a component is added or changed, go through every item below without skipping.

---

## 1. Styles — global.css
- [ ] Styles added or updated correctly
- [ ] All transitions use `var(--ease-smooth)` or `var(--ease-spring)` — never raw `0.1s ease`
- [ ] Icon colour uses `--stroke-0` (outline icons) or `--fill-0` (filled icons) — never hardcoded hex
- [ ] CSS variable `--stroke-0` or `--fill-0` is set on the correct container element in CSS

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
- [ ] SVG uses `stroke="var(--stroke-0,#333)"` or `fill="var(--fill-0,#333)"`
- [ ] Icon name is kebab-case and consistent with usage in `iconSvg('name')`

## 13. React Component (design-system/react/src/)
- [ ] Component file exists and is in sync with CSS and HTML
- [ ] Props match what the HTML/CSS expects
- [ ] Exported from `index.ts` if newly added

## 14. Verify in browser (localhost:3000)
- [ ] All variants render correctly visually
- [ ] Clicking a variant opens the right panel
- [ ] Relations section appears in the right panel
- [ ] All tabs (HTML, CSS, SVG, React) show correct content
- [ ] Interactive behaviour works (hover, click, toggle, open/close)
- [ ] No console errors

## 15. Git
- [ ] Working on a feature branch (not directly on main)
- [ ] Commit message is descriptive (`feat:`, `fix:`, `refactor:`)
- [ ] Merged to main and pushed only after browser verification passes

---

## Notes
- `--stroke-0` controls stroke colour on outline SVG icons
- `--fill-0` controls fill colour on filled SVG icons
- `relations` must be passed to `openPanel()` AND defined in `system.js` — both are required
- All transitions: `var(--ease-smooth)` for standard, `var(--ease-spring)` for interactive/toggle
- Branch first → make changes → verify in browser → commit → merge to main → push
