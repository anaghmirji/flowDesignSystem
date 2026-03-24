#!/bin/sh
# Usage: ./scripts/link-github-remote.sh https://github.com/USER/REPO.git
#    or: ./scripts/link-github-remote.sh git@github.com:USER/REPO.git
set -e
cd "$(dirname "$0")/.."
if [ -z "$1" ]; then
  echo "Usage: $0 <git-remote-url>"
  echo "Example: $0 https://github.com/you/design-system-platform.git"
  exit 1
fi
if git remote get-url origin >/dev/null 2>&1; then
  echo "Remote 'origin' exists. Updating URL..."
  git remote set-url origin "$1"
else
  git remote add origin "$1"
fi
echo "Remote origin is now: $(git remote get-url origin)"
echo "Next: git push -u origin main"
echo "(You may need to log in: GitHub token for HTTPS, or SSH key for SSH.)"
