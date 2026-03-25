import type { ButtonHTMLAttributes } from 'react';
import { DsIcon } from './DsIcon.js';

type GetIconSrc = (iconName: string) => string;

type Base = {
  getIconSrc: GetIconSrc;
  className?: string;
} & Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'disabled' | 'onClick'>;

export type DsButtonProps =
  | (Base & {
      variant: 's1';
      icon: string;
      'aria-label'?: string;
    })
  | (Base & { variant: 's2'; icons: [string, string] })
  | (Base & { variant: 's3'; icons: [string, string, string] })
  | (Base & {
      variant: 'label';
      label: string;
      leadIcon?: string;
    })
  | (Base & {
      variant: 'label-trail';
      label: string;
      leadIcon?: string;
      trailIcon?: string;
    });

function iconWrap(getIconSrc: GetIconSrc, name: string, key: number) {
  return (
    <div key={key} className="btn__icon-wrap">
      <div className="btn__icon-inner">
        <div className="btn__icon-vector">
          <DsIcon name={name} src={getIconSrc(name)} />
        </div>
      </div>
    </div>
  );
}

function iconSlot(getIconSrc: GetIconSrc, name: string, key: number) {
  return (
    <div key={key} className={`btn__icon-slot btn__icon-slot--${name}`}>
      <div className="btn__icon-vector">
        <DsIcon name={name} src={getIconSrc(name)} />
      </div>
    </div>
  );
}

/** `.btn` variants from `buttons.css`. Use global CSS import once in the app root. */
export function DsButton(props: DsButtonProps) {
  const { getIconSrc, className = '', type = 'button', disabled, onClick } = props;
  const extra = className ? ` ${className}` : '';

  if (props.variant === 's1') {
    const aria = props['aria-label'] ?? props.icon;
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={`btn btn--s1${extra}`.trim()}
        aria-label={aria}
      >
        {iconWrap(getIconSrc, props.icon, 0)}
      </button>
    );
  }

  if (props.variant === 's2') {
    return (
      <button type={type} disabled={disabled} onClick={onClick} className={`btn btn--s2${extra}`.trim()}>
        <div className="btn__icon-group">{props.icons.map((n, i) => iconWrap(getIconSrc, n, i))}</div>
      </button>
    );
  }

  if (props.variant === 's3') {
    return (
      <button type={type} disabled={disabled} onClick={onClick} className={`btn btn--s3${extra}`.trim()}>
        <div className="btn__icon-group">{props.icons.map((n, i) => iconWrap(getIconSrc, n, i))}</div>
      </button>
    );
  }

  if (props.variant === 'label') {
    const lead = props.leadIcon ?? 'magnifying-glass';
    return (
      <button type={type} disabled={disabled} onClick={onClick} className={`btn btn--label${extra}`.trim()}>
        {iconSlot(getIconSrc, lead, 0)}
        <span className="btn__label">{props.label}</span>
      </button>
    );
  }

  const lead = props.leadIcon ?? 'magnifying-glass';
  const trail = props.trailIcon ?? 'chevron-down';
  return (
    <button type={type} disabled={disabled} onClick={onClick} className={`btn btn--label-trail${extra}`.trim()}>
      {iconSlot(getIconSrc, lead, 0)}
      <span className="btn__label">{props.label}</span>
      {iconSlot(getIconSrc, trail, 1)}
    </button>
  );
}
