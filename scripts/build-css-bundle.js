#!/usr/bin/env node
/**
 * Bundles CSS into:
 *   design-system/css/global.css
 *   dist/flow-design-system.css
 *
 * Order (append new files here when you add stylesheets):
 *   tokens.css → icons.css → buttons.css → lender-portal.css
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const parts = ['tokens.css', 'icons.css', 'buttons.css', 'lender-portal.css'].map((f) =>
  fs.readFileSync(path.join(root, f), 'utf8')
);

const body =
  `/* Global design-system stylesheet (generated — do not edit by hand)
 * Paths: design-system/css/global.css · dist/flow-design-system.css
 * Order: tokens.css → icons.css → buttons.css → lender-portal.css
 */

` + parts.join('\n\n/* ========== next file ========== */\n\n');

const outputs = [
  path.join(root, 'design-system', 'css', 'global.css'),
  path.join(root, 'dist', 'flow-design-system.css'),
];

outputs.forEach((outFile) => {
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, body, 'utf8');
  console.log('Wrote', path.relative(root, outFile), `(${Math.round(fs.statSync(outFile).size / 1024)} KB)`);
});
