# Design system delivery folder

## `css/global.css`

The **generated** bundle used by `platform.html`. Do not edit it by hand.

- **Sources** (edit these): `tokens.css`, `icons.css`, `buttons.css`, `lender-portal.css` in the **repo root**.
- **Rebuild** from the repo root: `npm run build` or `sh scripts/build-css-bundle.sh`.
- **New stylesheet?** Add it to the end of `scripts/build-css-bundle.sh` and `scripts/build-css-bundle.js`, then rebuild.

The same bundle is also written to `dist/flow-design-system.css` for npm.

## `react/`

TypeScript React components that use the **same class names** as the CSS above. They do **not** embed styles.

1. In your app, import the global stylesheet **once** (e.g. `flow-design-system/styles.css` or a copy of `global.css`).
2. `cd design-system/react` → `npm install` → `npm run build` → publish or link `flow-design-system-react`.

The **platform** (`platform.js`) still shows HTML / React **snippets** in the side panel; the files here are what developers copy or install for production.
