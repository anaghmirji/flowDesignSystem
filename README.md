# Design system platform

Internal static site: **tokens**, **icons**, **buttons**, **Lender Portal** components, with a right-hand code panel (HTML, CSS, React, Vue, Tailwind).

## What to open

| File | Use |
|------|-----|
| **`index.html`** | Main design-system tool (nav, search, code panel) |
| **`platform.html`** | Redirects to `index.html` (same as docs / old links) |
| **`prototype.html`** | Lender portal prototype (interactive mock) |
| **`button-library.html`** | Button-only showcase (if present) |

**CSS bundle:** run `npm run build` to generate `dist/flow-design-system.css` plus `tokens.css`, `icons.css`, `buttons.css`, and `lender-portal.css` at the repo root. The static pages load `design-system/css/global.css` directly; the `dist/` file is mainly for npm packaging.

After hosting on GitHub Pages, open:  
`https://YOUR_USER.github.io/YOUR_REPO/` or `.../index.html`  
(`platform.html` also works and forwards to `index.html`.)

## Run locally (Cursor / VS Code)

1. **Terminal → Run Task…** → **Serve design system (static)**  
2. Browser: [http://localhost:8080/index.html](http://localhost:8080/index.html)

Or in a terminal from this folder:

```bash
npm run serve
```

Then open [http://localhost:8080/index.html](http://localhost:8080/index.html) (design system) or [http://localhost:8080/prototype.html](http://localhost:8080/prototype.html) (lender prototype).  
`http://localhost:8080/platform.html` redirects to `index.html`.

If the browser shows **ERR_EMPTY_RESPONSE**, a stale server on 8080 is often the cause: stop any old `python3 -m http.server` (**Ctrl+C**), or run `lsof -i :8080` and `kill <PID>`, then `npm run serve` again. If `localhost` still misbehaves, try `http://127.0.0.1:8080/…` once.

## Comments (free real-time)

- Each item in the right-hand panel has a **Comments** block at the bottom.
- **Without setup:** notes are saved in **this browser** and update **live across tabs** on the same computer (via `localStorage` + `BroadcastChannel`).
- **Team-wide live sync (free):** use **[Firebase Spark](https://firebase.google.com/pricing)** ($0): create a project, enable **Firestore**, copy the web config into `firebase-config.js` (see `firebase-config.example.js`), and deploy the rules in `firestore.rules.example`. The UI shows a green **Live** badge when Firestore is connected. The first query may prompt you to create a **composite index** (link appears in the browser console).

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
   `https://YOUR_USER.github.io/YOUR_REPO/` or `.../index.html`

## Easier GUI option

Install **[GitHub Desktop](https://desktop.github.com/)**, sign in, **File → Add Local Repository** → choose this folder, then **Publish repository**.

## Project layout

- **`system.js`** — Data source (nav, tokens, icons, components, products)  
- **`platform.js`** — UI and code snippets  
- **`tokens.css`**, **`icons.css`**, **`buttons.css`**, **`lender-portal.css`** — Split styles (run `npm run build`; source of truth is `design-system/css/global.css`)  

Figma asset URLs in `system.js` can expire; refresh or self-host icons for long-term stability.
