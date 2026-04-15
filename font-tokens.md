# Font Token System — Mandatory Usage Guide

> **Rule: Never hardcode font-size, font-weight, or line-height values in CSS. Always use the design system tokens below.**

This project uses a strict token-based typography system defined in `design-system/css/global.css` under `:root`. Every CSS property related to font sizing, weight, or line spacing **must** reference a CSS custom property — no raw `px`, no raw numbers, no exceptions.

---

## Font Sizes

Use `var(--font-size-*)` for every `font-size` declaration.

| Token | Value | When to use |
|---|---|---|
| `--font-size-2xs` | 9px | Micro labels, tight badges, footnotes |
| `--font-size-xs` | 10px | Secondary meta text, timestamps, helper text |
| `--font-size-xs2` | 10.5px | Edge-case labels between xs and sm |
| `--font-size-sm` | 11px | Secondary body, captions, sidebar meta |
| `--font-size-sm2` | 11.5px | Compact UI labels between sm and base |
| `--font-size-base` | 12px | **Primary body text — default for almost everything** |
| `--font-size-md` | 13px | Slightly emphasized body, form labels |
| `--font-size-lg` | 14px | Section titles, row emphasis, nav items |
| `--font-size-title` | 15px | Pill labels, sidebar titles, prominent labels |
| `--font-size-xl` | 16px | Headers, modal titles, panel headings |
| `--font-size-2xl` | 24px | Large display headings, hero text |

```css
/* Correct */
font-size: var(--font-size-base);
font-size: var(--font-size-lg);

/* Wrong — never do this */
font-size: 12px;
font-size: 14px;
```

---

## Font Weights

Use `var(--font-*)` for every `font-weight` declaration.

| Token | Value | Circular Std Cut | When to use |
|---|---|---|---|
| `--font-book` | 400 | Book | Default body text, inputs, descriptions |
| `--font-medium` | 500 | Medium | Labels, subtle emphasis, nav items |
| `--font-semibold` | 600 | Semibold | Strong emphasis, sub-headers, active states |
| `--font-bold` | 700 | Bold | Headers, CTAs, primary actions |

```css
/* Correct */
font-weight: var(--font-medium);
font-weight: var(--font-bold);

/* Wrong — never do this */
font-weight: 500;
font-weight: 700;
```

**Exception:** `font-weight` inside `@font-face` blocks must stay as raw numbers (CSS variables don't work in `@font-face`).

---

## Line Heights

Use `var(--leading-*)` for every `line-height` declaration.

| Token | Value | When to use |
|---|---|---|
| `--leading-collapse` | 0 | Icon buttons, visually collapsing line-height for layout |
| `--leading-none` | 1 | Single-line chips, badges, tags, pill text |
| `--leading-tight` | 1.2 | Headings, large display text |
| `--leading-snug` | 1.3 | Subheadings, compact lists, dense UI |
| `--leading-compact` | 1.35 | Tight body text, truncated single-line labels |
| `--leading-normal` | 1.4 | Standard body text — most common |
| `--leading-body` | 1.45 | Comfortable body, list items, descriptions |
| `--leading-prose` | 1.55 | Textareas, long-form content, multi-line inputs |
| `--leading-relaxed` | 1.6 | Descriptive text, help text, tooltips |
| `--leading-spacious` | 1.8 | Badges with vertical padding, open layouts |

```css
/* Correct */
line-height: var(--leading-normal);
line-height: var(--leading-tight);

/* Wrong — never do this */
line-height: 1.4;
line-height: 1.2;
```

**Exception:** Pixel-based `line-height` values (e.g. `line-height: 28px`) used for vertical centering in fixed-height containers are layout values, not typography — these stay as raw pixels.

---

## Quick Reference — Common Patterns

```css
/* Body text */
font-size: var(--font-size-base);
font-weight: var(--font-book);
line-height: var(--leading-normal);

/* Section heading */
font-size: var(--font-size-xl);
font-weight: var(--font-bold);
line-height: var(--leading-tight);

/* Secondary label */
font-size: var(--font-size-sm);
font-weight: var(--font-medium);
line-height: var(--leading-snug);

/* Textarea / long content */
font-size: var(--font-size-base);
font-weight: var(--font-book);
line-height: var(--leading-prose);

/* Badge / chip */
font-size: var(--font-size-xs);
font-weight: var(--font-medium);
line-height: var(--leading-none);
```

---

## Rules for AI Agents and Contributors

1. **Search before you write.** Before writing any `font-size`, `font-weight`, or `line-height`, find the matching token from the tables above.
2. **No new magic numbers.** If a design calls for a size not in the scale, use the nearest token. Do not introduce a new hardcoded value.
3. **Tokens live in `:root`.** They are defined in `design-system/css/global.css` and mirrored in `dist/flow-design-system.css`. Never redefine them locally.
4. **Every file, every rule.** This applies to `prototype.css`, `lender-portal.css`, `condition-templates.css`, and any new CSS file added to the project.
5. **Verify after writing.** After adding or editing CSS, grep for raw numeric `font-size`, `font-weight`, and `line-height` values. If you find any that aren't inside `@font-face` or pixel-based vertical centering, replace them.

```bash
# Audit commands — these should return zero results in clean code
grep -n 'font-size:\s*[0-9]' prototype.css
grep -n 'font-weight:\s*[0-9]' prototype.css
grep -n 'line-height:\s*[0-9]\.' prototype.css
```
