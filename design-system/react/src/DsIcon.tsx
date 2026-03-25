import type { CSSProperties } from 'react';

export interface DsIconProps {
  name: string;
  src: string;
  size?: number;
  className?: string;
  style?: CSSProperties;
}

/** Matches `icons.css` markup. Requires the global design-system stylesheet. */
export function DsIcon({ name, src, size = 16, className = '', style }: DsIconProps) {
  const cn = `icon icon--${name}${className ? ` ${className}` : ''}`.trim();
  return (
    <span className={cn} style={{ width: size, height: size, ...style }}>
      <span className="icon__vector">
        <img src={src} alt="" />
      </span>
    </span>
  );
}
