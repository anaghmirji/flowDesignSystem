import type { HTMLAttributes } from 'react';

export type LpStatusDot = 'green' | 'amber' | 'red';

export interface LpStatusPillProps extends HTMLAttributes<HTMLDivElement> {
  dot: LpStatusDot;
  label: string;
  /** Adds `lp-status--clickable` (use with menu / keyboard handlers). */
  clickable?: boolean;
}

/** Static status pill — same markup as Status page (without dropdown). */
export function LpStatusPill({ dot, label, clickable = false, className = '', ...rest }: LpStatusPillProps) {
  const cn = `lp-status${clickable ? ' lp-status--clickable' : ''}${className ? ` ${className}` : ''}`.trim();
  return (
    <div className={cn} {...rest}>
      <div className={`lp-status__dot lp-status__dot--${dot}`} />
      <span className="lp-status__label">{label}</span>
    </div>
  );
}
