# Design system platform

Internal static site: **tokens**, **icons**, **buttons**, **Lender Portal** components, with a right-hand code panel (HTML, CSS, React, Vue, Tailwind).

## What to open

| File | Use |
|------|-----|
| **`platform.html`** | Main design-system tool (nav, search, code panel) |
| **`button-library.html`** | Button-only showcase |
| **`index.html`** | Lender dashboard mock (separate from the platform) |

After hosting on GitHub Pages, share:  
`https://YOUR_USER.github.io/YOUR_REPO/platform.html`  
(There is no redirect from the site root; root serves `index.html`, which is the dashboard.)

## Run locally (Cursor / VS Code)

1. **Terminal → Run Task…** → **Serve design system (static)**  
2. Browser: [http://localhost:8080/platform.html](http://localhost:8080/platform.html)

Or in a terminal from this folder:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/platform.html`.

## GitHub: first-time setup (do this once)

### 1. Fix your name on commits (optional but recommended)

Use the email tied to your GitHub account (or GitHub’s private noreply):

```bash
cd "/Users/anaghmirji/Documents/Claude Code #1"
git config user.name "Your Name"
git config user.email "your-github-email@example.com"
```

### 2. Create an empty repository on GitHub

1. Log in at [github.com](https://github.com)  
2. Click **+** → **New repository**  
3. **Repository name:** e.g. `design-system-platform`  
4. Leave **empty** (no README, no .gitignore — you already have files locally)  
5. Click **Create repository**

### 3. Connect this folder and push

GitHub will show you commands. Use **HTTPS** or **SSH** (one of the blocks below).

**HTTPS** (replace `YOUR_USER` and `YOUR_REPO`):

```bash
cd "/Users/anaghmirji/Documents/Claude Code #1"
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

When prompted for password, use a **[Personal Access Token](https://github.com/settings/tokens)** (classic: enable `repo`), not your GitHub password.

**SSH** (if you already added an SSH key to GitHub):

```bash
cd "/Users/anaghmirji/Documents/Claude Code #1"
git remote add origin git@github.com:YOUR_USER/YOUR_REPO.git
git branch -M main
git push -u origin main
```

If `remote origin already exists`, use:

```bash
git remote set-url origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```

### 4. Turn on GitHub Pages (optional, for a shareable link)

1. On GitHub: repo → **Settings** → **Pages**  
2. **Build and deployment** → Source: **Deploy from a branch**  
3. Branch: **`main`**, folder: **`/ (root)`** → **Save**  
4. After a minute, the site is live. Share:  
   `https://YOUR_USER.github.io/YOUR_REPO/platform.html`

## Easier GUI option

Install **[GitHub Desktop](https://desktop.github.com/)**, sign in, **File → Add Local Repository** → choose this folder, then **Publish repository**.

## Project layout

- **`system.js`** — Data source (nav, tokens, icons, components, products)  
- **`platform.js`** — UI and code snippets  
- **`tokens.css`**, **`icons.css`**, **`buttons.css`**, **`lender-portal.css`** — Styles  

Figma asset URLs in `system.js` can expire; refresh or self-host icons for long-term stability.
