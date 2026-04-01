# Animation Style Guide

## Core Philosophy

Animations should feel **physical and alive** — as if UI elements have mass, inertia, and a material quality. Nothing should start or stop abruptly. Every motion should tell a story about where something came from and where it's going.

---

## Easing Vocabulary

We use three easing curves. Always pick from this set.

### 1. Fluid Exit — `cubic-bezier(0.4, 0, 1, 0.8)`
For elements leaving the screen or collapsing. Starts slow, accelerates away. Feels like something being pulled.
```css
/* Use for: sliding out, collapsing, fading away */
easing: cubic-bezier(0.4, 0, 1, 0.8)
duration: 160–240ms
```

### 2. Fluid Enter — `cubic-bezier(0.16, 1, 0.3, 1)`
For elements entering or expanding. Fast start, long smooth deceleration — like something gliding into place. No harsh stop.
```css
/* Use for: sliding in, expanding, appearing */
easing: cubic-bezier(0.16, 1, 0.3, 1)
duration: 280–400ms
```

### 3. Spring — `cubic-bezier(0.34, 1.48, 0.64, 1)`
For elements that need to feel elastic or alive. Overshoots slightly past the target, then settles. Use sparingly for moments that need personality.
```css
/* Use for: mode toggle thumb, trigger reactions, confirmations */
easing: cubic-bezier(0.34, 1.48, 0.64, 1)
duration: 320–520ms
```

### 4. Slow Hold — `cubic-bezier(0.12, 0, 0.36, 0)`
Extremely slow at the start, then accelerates. Creates a brief "hesitation" before motion begins — used only as the first keyframe of a multi-stage WAAPI animation where you want an element to linger in its initial shape before transforming. Never use as a standalone transition.
```css
/* Use for: first keyframe of amoeba split (dropdown open) only */
easing: cubic-bezier(0.12, 0, 0.36, 0)
duration: n/a — segment-level only
```

> **Never use `ease`, `ease-in-out`, or `linear` as a final easing.** Linear is only used as the top-level easing on multi-keyframe WAAPI animations where per-keyframe easing is set explicitly.

---

## Timing Rules

| Motion type           | Duration     |
|-----------------------|-------------|
| Micro (icon, dot)     | 160–240ms   |
| Component (dropdown)  | 320–520ms   |
| Mode switch           | 380–480ms   |
| Exit (collapse/close) | 160–240ms   |

Exits are always faster than entrances. An element leaving should get out of the way quickly. An element arriving should take its time to settle.

---

## Animation Patterns

### Slide-Through (icon swap, conveyor)
Used on the stage forward button. The old element exits toward the direction of travel; the new one enters from the opposite side.

```
Exit:  translateX(0) scale(1) → translateX(130%) scale(0.7)   [220ms, fluid-exit]
Enter: translateX(-130%) scale(0.7) → slight overshoot → translateX(0) scale(1)  [380ms, fluid-enter]
```

Key detail: the entering element overshoots slightly (`translateX(4%) scale(1.1)` at ~65%) before settling. This gives it organic weight.

### Text Swap (label change)
Used on the stage label. Old text slips upward and fades; new text rises from below.

```
Exit:  translateY(0) opacity:1 → translateY(-8px) opacity:0   [180ms, fluid-exit]
Enter: translateY(8px) opacity:0 → slight overshoot → translateY(0) opacity:1  [340ms, fluid-enter]
```

### Amoeba Split (dropdown open)
Used on the status dropdown. The dropdown appears to be the same material as the trigger, physically splitting off.

```
Start:  scaleX(0.44) scaleY(0.02) borderRadius:100px  [pill shape, connected to trigger]
Mid:    scaleX(0.72) scaleY(0.28) borderRadius:80px   [growing blob]
End:    scaleX(1) scaleY(1) borderRadius:16px         [settled card]
```

Critical rules:
- `transform-origin` must be set to the **horizontal center of the trigger**, not the dropdown's own center (measure `trigger.offsetWidth / 2` in JS)
- The trigger itself animates a complementary stretch (`scaleY(1.14)`) at the moment of split, reinforcing that material is leaving it
- Border-radius morphs from `100px` (pill) to `16px` (card) — this is the most important cue that reads as "same material, new shape"

### Sliding Pill (mode toggle)
Used on the Edit/View toggle. A white thumb physically moves between options rather than the active class dissolving between them.

```
Thumb uses WAAPI:
  translateX(fromX) scaleX(1) → mid-point scaleX(1.18) → translateX(toX) scaleX(1)
  [440ms, cubic-bezier(0.34, 1.52, 0.64, 1)]
```

Key detail: the thumb stretches horizontally (scaleX overshoot) at the midpoint of travel — like a liquid blob deforming under velocity — then snaps to final size.

---

## Multi-Keyframe Animations (WAAPI)

Use the Web Animations API (`element.animate()`) when:
- The animation has **3+ keyframes** with different easing per segment
- The animation needs to be **interrupted cleanly** mid-play
- The animation uses **dynamic values** (positions measured at runtime)

Template:
```js
const anim = el.animate([
  { transform: '...', offset: 0,    easing: 'cubic-bezier(0.4, 0, 1, 0.8)'   },
  { transform: '...', offset: 0.6,  easing: 'cubic-bezier(0.16, 1, 0.3, 1)'  },
  { transform: '...', offset: 1                                                },
], { duration: 400, easing: 'linear', fill: 'none' });

anim.onfinish = () => {
  el.style.transform = ''; // always clean up inline styles on finish
};
```

Always use `fill: 'none'` and set the final state via inline style in `onfinish`. Never rely on `fill: 'forwards'` for persistent state — it causes compositing issues.

For interruptible animations, read the current position before cancelling:
```js
const mat   = new DOMMatrix(getComputedStyle(el).transform);
const fromX = mat.m41; // current translateX
el.style.transform = `translateX(${fromX}px)`; // freeze here
anim.cancel(); // safe to cancel now — inline style holds position
```

---

## What Not To Do

- **No `opacity: 0 → 1` alone.** Always pair with a transform (translate, scale). Pure fades feel flat.
- **No symmetric easing.** Exits and entrances should use different curves.
- **No bounce on destructive actions.** Spring easing is for playful/additive moments only. Deleting, erroring, or collapsing should use fluid-exit only.
- **No simultaneous unrelated animations.** If two things animate at once, they should be causally linked (e.g. trigger contracts *because* dropdown is splitting from it).
