#!/usr/bin/env node
/**
 * Reads design-system/css/global.css, writes dist/flow-design-system.css,
 * and splits on section markers into tokens.css, icons.css, buttons.css,
 * lender-portal.css at the repo root (npm package exports).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const GLOBAL = path.join(ROOT, 'design-system', 'css', 'global.css');
const MARKER = '/* ========== next file ========== */';
const SPLIT_NAMES = ['tokens.css', 'icons.css', 'buttons.css', 'lender-portal.css'];

function main() {
  if (!fs.existsSync(GLOBAL)) {
    console.error('build-css-bundle: missing', GLOBAL);
    process.exit(1);
  }

  const raw = fs.readFileSync(GLOBAL, 'utf8');
  const parts = raw.split(MARKER).map((chunk) => chunk.trim() + '\n');

  if (parts.length !== SPLIT_NAMES.length) {
    console.error(
      `build-css-bundle: expected ${SPLIT_NAMES.length} sections (split by marker), got ${parts.length}. Update SPLIT_NAMES or global.css markers.`
    );
    process.exit(1);
  }

  for (let i = 0; i < SPLIT_NAMES.length; i++) {
    fs.writeFileSync(path.join(ROOT, SPLIT_NAMES[i]), parts[i]);
  }

  const distDir = path.join(ROOT, 'dist');
  fs.mkdirSync(distDir, { recursive: true });
  fs.copyFileSync(GLOBAL, path.join(distDir, 'flow-design-system.css'));

  console.log('build-css-bundle: wrote dist/flow-design-system.css and', SPLIT_NAMES.join(', '));
}

main();
