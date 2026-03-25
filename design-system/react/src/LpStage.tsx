import type { ButtonHTMLAttributes } from 'react';
import { DsIcon } from './DsIcon.js';

export interface LpStageProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
  label: string;
  forwardIconUrl: string;
  onForward?: () => void;
  className?: string;
}

/** Stage pill with forward control from `lender-portal.css`. */
export function LpStage({ label, forwardIconUrl, onForward, className = '', type = 'button', disabled }: LpStageProps) {
  return (
    <div className={`lp-stage${className ? ` ${className}` : ''}`.trim()}>
      <span className="lp-stage__label">{label}</span>
      <button type={type} disabled={disabled} className="lp-stage__btn" onClick={onForward} aria-label="Forward">
        <div className="lp-stage__btn-inner">
          <DsIcon name="forward" src={forwardIconUrl} size={16} />
        </div>
      </button>
    </div>
  );
}
