#!/bin/sh
# Bundle design-system CSS: dist/flow-design-system.css + root split files.
set -e
ROOT="$(CDPATH= cd -- "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
exec node scripts/build-css-bundle.js
