#!/bin/sh
# Writes the bundled global stylesheet to TWO places (same bytes):
#   1) design-system/css/global.css  — canonical path for humans + platform
#   2) dist/flow-design-system.css   — npm package export
#
# Source order (if you add a new .css layer, append it here and in build-css-bundle.js):
#   tokens.css → icons.css → buttons.css → lender-portal.css
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DS_OUT="$ROOT/design-system/css/global.css"
DIST_OUT="$ROOT/dist/flow-design-system.css"
mkdir -p "$ROOT/design-system/css" "$ROOT/dist"

write_bundle() {
  OUT="$1"
  {
    printf '%s\n' \
      '/* Global design-system stylesheet (generated — do not edit by hand)' \
      ' * Paths: design-system/css/global.css · dist/flow-design-system.css' \
      ' * Order: tokens.css → icons.css → buttons.css → lender-portal.css' \
      ' * Regenerate: npm run build  OR  sh scripts/build-css-bundle.sh' \
      ' */' \
      ''
    cat "$ROOT/tokens.css"
    printf '\n\n/* ========== next file ========== */\n\n'
    cat "$ROOT/icons.css"
    printf '\n\n/* ========== next file ========== */\n\n'
    cat "$ROOT/buttons.css"
    printf '\n\n/* ========== next file ========== */\n\n'
    cat "$ROOT/lender-portal.css"
  } > "$OUT"
  echo "Wrote $(basename "$(dirname "$OUT")")/$(basename "$OUT") ($(wc -c < "$OUT" | tr -d ' ') bytes)"
}

write_bundle "$DS_OUT"
write_bundle "$DIST_OUT"
