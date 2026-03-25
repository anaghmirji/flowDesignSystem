import type { HTMLAttributes } from 'react';

export interface LoansPillProps extends Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'onClick'> {
  label?: string;
  count?: number;
  /** Sort (or other) icon URL from your assets */
  iconSrc: string;
}

/** Loans header pill from `lender-portal.css`. */
export function LoansPill({ label = 'My Loans', count = 0, iconSrc, onClick, className = '' }: LoansPillProps) {
  return (
    <div className={`loans-pill${className ? ` ${className}` : ''}`.trim()} onClick={onClick} role="button" tabIndex={0}>
      <span className="loans-pill__label">{label}</span>
      <div className="loans-pill__badge">
        <span className="loans-pill__count">{count}</span>
        <div className="loans-pill__icon">
          <img src={iconSrc} alt="" />
        </div>
      </div>
    </div>
  );
}
