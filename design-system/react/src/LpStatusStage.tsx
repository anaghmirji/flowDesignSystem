import type { ButtonHTMLAttributes } from 'react';
import type { LpStatusDot } from './LpStatusPill.js';
import { LpStatusPill } from './LpStatusPill.js';
import { LpStatusWithMenu } from './LpStatusWithMenu.js';
import { LpStage } from './LpStage.js';

export interface LpStatusStageProps extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled'> {
  status: { dot: LpStatusDot; label: string };
  stage: { label: string };
  forwardIconUrl: string;
  onForward?: () => void;
  className?: string;
  /**
   * When true (default), left side is `LpStatusWithMenu` — same as Status page.
   * When false, left side is a static `LpStatusPill` only.
   */
  statusInteractive?: boolean;
}

/** Status + Stage row: composes the same Status and Stage pieces as the individual pages. */
export function LpStatusStage({
  status,
  stage,
  forwardIconUrl,
  onForward,
  className = '',
  type,
  disabled,
  statusInteractive = true,
}: LpStatusStageProps) {
  return (
    <div className={`lp-status-stage${className ? ` ${className}` : ''}`.trim()}>
      {statusInteractive ? (
        <LpStatusWithMenu initialLabel={status.label} initialDot={status.dot} />
      ) : (
        <LpStatusPill dot={status.dot} label={status.label} />
      )}
      <LpStage label={stage.label} forwardIconUrl={forwardIconUrl} onForward={onForward} type={type} disabled={disabled} />
    </div>
  );
}
