# Update Checklist

Every time a component is added or changed, go through this list.

---

## Styles
- [ ] `design-system/css/global.css` — styles updated and correct

## Right Panel (platform.js)
- [ ] CSS snippet — matches global.css exactly
- [ ] HTML snippet — correct markup and classes
- [ ] React snippet — correct props and usage
- [ ] SVG tab — raw SVG shown if component uses an icon
- [ ] Live preview (`buildXHtml`) — visually reflects the change
- [ ] Interactive behaviour (`bindXRows` / `onPreviewMount`) — hover, click, toggle all wired up

## System (system.js)
- [ ] Variants — all states covered (e.g. default, hover, selected, favourited, unfavourited)
- [ ] Relations — `usedBy` and `uses` are accurate
- [ ] `cssFile` — points to `global.css`
- [ ] `figmaUrl` — correct Figma node ID
- [ ] Icons array — any new icons added with correct SVG and `--stroke-0` / `--fill-0` variables

## React Component (design-system/react/src/)
- [ ] Component file updated and in sync with CSS and HTML
- [ ] Exported from `index.ts` if newly added

---

## Notes
- `--stroke-0` controls stroke colour on outline SVG icons
- `--fill-0` controls fill colour on filled SVG icons
- All transitions should use `var(--ease-smooth)` or `var(--ease-spring)` — never raw `0.1s ease`
- Branch first, then make changes, then commit, then merge to main
