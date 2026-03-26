import { useState } from 'react';

export interface Assignee {
  /** Unique identifier for this assignee. */
  id: string;
  /** Display name — used as img alt text. */
  name: string;
  /** URL of the circular avatar photo. */
  avatarUrl: string;
}

export interface AssigneesProps {
  /** List of people assigned to this file/loan. */
  assignees: Assignee[];
  /** Max avatars to show before showing +N count bubble. Defaults to 3. */
  maxVisible?: number;
  /** Whether the dropdown is currently open. */
  open?: boolean;
  /** Called when the user clicks the pill to toggle open/closed. */
  onToggle?: () => void;
  className?: string;
}

/**
 * Assignees pill — stacked circular avatars + chevron-down toggle.
 *
 * Figma: Lender Exploration · node 390:2745
 * CSS:   .assignees, .assignees__avatars, .assignees__avatar,
 *        .assignees__count, .assignees__chevron  (design-system/css/global.css)
 *
 * @example
 * <Assignees
 *   assignees={[
 *     { id: '1', name: 'Sarah K.', avatarUrl: '/avatars/sarah.jpg' },
 *     { id: '2', name: 'James L.', avatarUrl: '/avatars/james.jpg' },
 *   ]}
 *   open={open}
 *   onToggle={() => setOpen(o => !o)}
 * />
 */
export function Assignees({
  assignees,
  maxVisible = 3,
  open: openProp,
  onToggle,
  className = '',
}: AssigneesProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = openProp !== undefined ? openProp : internalOpen;

  function handleClick() {
    if (onToggle) {
      onToggle();
    } else {
      setInternalOpen(o => !o);
    }
  }

  const visible   = assignees.slice(0, maxVisible);
  const overflow  = assignees.length - maxVisible;

  // chevron SVG sized to match Figma: 7.5×3.75px path inside 12×12 container
  const chevronSvg = `<svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--accent-black-50,#808080)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  const cn = `assignees${isOpen ? ' open' : ''}${className ? ` ${className}` : ''}`;

  return (
    <button className={cn} type="button" onClick={handleClick}>
      <span className="assignees__avatars">
        {visible.map((a, i) => (
          <span
            key={a.id}
            className="assignees__avatar"
            style={{ zIndex: maxVisible - i }}
          >
            <img src={a.avatarUrl} alt={a.name} />
          </span>
        ))}
        {overflow > 0 && (
          <span className="assignees__count">+{overflow}</span>
        )}
      </span>
      <span
        className="assignees__chevron"
        dangerouslySetInnerHTML={{ __html: chevronSvg }}
      />
    </button>
  );
}
