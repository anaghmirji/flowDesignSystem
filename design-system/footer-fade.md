# Footer Fade Effect

A gradient fade that sits above a sticky footer, softening the hard edge between scrollable list content and the action bar below.

## How it works

The footer element uses a `::before` pseudo-element to render a transparent-to-white gradient that overlaps the bottom of the scroll area. No extra DOM nodes needed.

```css
.footer {
  position: relative;
  background: #fff;
}

.footer::before {
  content: '';
  position: absolute;
  top: -28px;       /* height of the fade */
  left: 0;
  right: 0;
  height: 28px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1));
  pointer-events: none;
}
```

## Usage notes

- **`position: relative`** on the footer is required so the pseudo-element is positioned against it.
- **`pointer-events: none`** prevents the gradient from blocking clicks on list items near the bottom.
- Adjust `top` / `height` together — they should be equal and negative (e.g. `-40px` / `40px` for a longer fade).
- If the parent has `overflow: hidden`, the pseudo-element will be clipped. Set `overflow: visible` on the scroll container and clip via a wrapper instead.
- Works for both light and dark modes — swap `rgba(255,255,255,…)` for your surface colour token.

## Dark mode variant

```css
.footer::before {
  background: linear-gradient(to bottom, rgba(18, 18, 18, 0), rgba(18, 18, 18, 1));
}
```

## Where it's used

- `ct2-lib-picker__footer` — the sticky "Add to stage" bar in the condition library picker.
