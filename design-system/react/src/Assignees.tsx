import { useState } from 'react';

export interface Assignee {
  /** Unique identifier for this assignee. */
  id: string;
  /** Display name — used as img alt text. */
  name: string;
  /** URL of the circular avatar photo. Omit to show initials instead. */
  avatarUrl?: string;
  /** Initials to show when no avatarUrl is provided (e.g. "AM"). */
  initials?: string;
}

export interface AssigneesProps {
  /**
   * List of people assigned to this file/loan.
   * Pass an empty array to show the unassigned state (circular user-plus icon).
   */
  assignees: Assignee[];
  /** Max avatars to show before showing +N count bubble. Defaults to 3. */
  maxVisible?: number;
  /** Whether the dropdown is currently open. */
  open?: boolean;
  /** Called when the user clicks the pill to toggle open/closed. */
  onToggle?: () => void;
  className?: string;
}

// Inline SVGs — kept here to avoid an extra icon dependency
const chevronSvg = `<svg viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 0.5L5.5 5.5L0.5 0.5" stroke="var(--stroke-0,#808080)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const userPlusSvg = `<svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.5 3.5V5.5M10.5 5.5V7.5M10.5 5.5H12.5M10.5 5.5H8.5M7 2.75C7 3.34674 6.76295 3.91903 6.34099 4.34099C5.91903 4.76295 5.34674 5 4.75 5C4.15326 5 3.58097 4.76295 3.15901 4.34099C2.73705 3.91903 2.5 3.34674 2.5 2.75C2.5 2.15326 2.73705 1.58097 3.15901 1.15901C3.58097 0.737053 4.15326 0.5 4.75 0.5C5.34674 0.5 5.91903 0.737053 6.34099 1.15901C6.76295 1.58097 7 2.15326 7 2.75ZM0.5 11.3233V11.25C0.5 10.1228 0.947767 9.04183 1.7448 8.2448C2.54183 7.44777 3.62283 7 4.75 7C5.87717 7 6.95817 7.44777 7.7552 8.2448C8.55223 9.04183 9 10.1228 9 11.25V11.3227C7.71699 12.0954 6.24707 12.5025 4.74933 12.5C3.19533 12.5 1.74133 12.07 0.5 11.3227V11.3233Z" stroke="var(--stroke-0,#333)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

/**
 * Assignees pill — stacked circular avatars + chevron-down toggle.
 * Supports photo avatars, initials-only avatars, and unassigned (empty) state.
 *
 * Figma: Lender Exploration · node 390:2745 (photo), 553:2540 (initials), 545:2607 (unassigned)
 * CSS:   .assignees, .assignees__avatars, .assignees__avatar,
 *        .assignees__avatar--initials, .assignees__initials,
 *        .assignees__count, .assignees__chevron,
 *        .assignees--unassigned, .assignees__unassigned-avatar, .assignees__unassigned-icon
 *        (design-system/css/global.css)
 *
 * @example — photo avatars
 * <Assignees
 *   assignees={[
 *     { id: '1', name: 'Sarah K.', avatarUrl: '/avatars/sarah.jpg' },
 *     { id: '2', name: 'James L.', avatarUrl: '/avatars/james.jpg' },
 *   ]}
 *   open={open}
 *   onToggle={() => setOpen(o => !o)}
 * />
 *
 * @example — initials only
 * <Assignees
 *   assignees={[
 *     { id: '1', name: 'Alex M.', initials: 'AM' },
 *     { id: '2', name: 'Tom K.',  initials: 'TK' },
 *   ]}
 * />
 *
 * @example — unassigned
 * <Assignees assignees={[]} onToggle={openAssignModal} />
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
    if (onToggle) { onToggle(); } else { setInternalOpen(o => !o); }
  }

  // ── Unassigned state ──────────────────────────────────────────────────────
  if (assignees.length === 0) {
    return (
      <button
        className={`assignees assignees--unassigned${className ? ` ${className}` : ''}`}
        type="button"
        onClick={handleClick}
        style={{ '--stroke-0': 'var(--accent-black-60,#666)' } as React.CSSProperties}
      >
        <span className="assignees__unassigned-avatar">
          <span
            className="assignees__unassigned-icon"
            dangerouslySetInnerHTML={{ __html: userPlusSvg }}
          />
        </span>
      </button>
    );
  }

  // ── Assigned state (photos or initials) ───────────────────────────────────
  const visible  = assignees.slice(0, maxVisible);
  const overflow = assignees.length - maxVisible;
  const cn = `assignees${isOpen ? ' open' : ''}${className ? ` ${className}` : ''}`;

  return (
    <button className={cn} type="button" onClick={handleClick}>
      <span className="assignees__avatars">
        {visible.map((a, i) => (
          <span
            key={a.id}
            className={`assignees__avatar${!a.avatarUrl ? ' assignees__avatar--initials' : ''}`}
            style={{ zIndex: maxVisible - i }}
          >
            {a.avatarUrl
              ? <img src={a.avatarUrl} alt={a.name} />
              : <span className="assignees__initials">{a.initials ?? a.name.slice(0, 2).toUpperCase()}</span>
            }
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
