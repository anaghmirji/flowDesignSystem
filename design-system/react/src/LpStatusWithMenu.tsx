import { useEffect, useRef, useState } from 'react';
import { LpStatusPill, type LpStatusDot } from './LpStatusPill.js';

export type { LpStatusDot };

export interface LpStatusOption {
  label: string;
  dot: LpStatusDot;
}

export const LP_STATUS_MENU_DEFAULT: LpStatusOption[] = [
  { label: 'Active', dot: 'green' },
  { label: 'On Hold', dot: 'amber' },
  { label: 'Withdrawn', dot: 'red' },
  { label: 'Cancelled', dot: 'red' },
  { label: 'Denied', dot: 'red' },
];

export interface LpStatusWithMenuProps {
  options?: LpStatusOption[];
  initialLabel?: string;
  initialDot?: LpStatusDot;
  className?: string;
}

/** Status pill with dropdown; aligns with platform preview + `lender-portal.css`. */
export function LpStatusWithMenu({
  options = LP_STATUS_MENU_DEFAULT,
  initialLabel = 'Active',
  initialDot = 'green',
  className = '',
}: LpStatusWithMenuProps) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState(initialLabel);
  const [dot, setDot] = useState<LpStatusDot>(initialDot);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDoc);
    return () => document.removeEventListener('click', onDoc);
  }, []);

  return (
    <div className={`lp-status-dropdown-wrap${className ? ` ${className}` : ''}`.trim()} ref={wrapRef}>
      <LpStatusPill
        dot={dot}
        label={label}
        clickable
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((o) => !o);
          }
        }}
      />
      {open && (
        <div
          className="loans-dropdown loans-dropdown--status-menu"
          style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, zIndex: 30 }}
          role="listbox"
        >
          {options.map((opt) => (
            <div
              key={opt.label}
              role="option"
              aria-selected={opt.label === label}
              className={`loans-dropdown__item${opt.label === label ? ' loans-dropdown__item--active' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setLabel(opt.label);
                setDot(opt.dot);
                setOpen(false);
              }}
            >
              <span className="loans-dropdown__item-label">{opt.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
