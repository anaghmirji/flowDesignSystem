import type { HTMLAttributes } from 'react';

export type DsDropdownItemState = 'default' | 'hover' | 'selected';

export interface DsDropdownItemProps extends Pick<HTMLAttributes<HTMLDivElement>, 'className' | 'onClick'> {
  label: string;
  count?: number;
  state?: DsDropdownItemState;
}

/** Single row — shared pattern for loans dropdown, status menu, etc. */
export function DsDropdownItem({ label, count, state = 'default', onClick, className = '' }: DsDropdownItemProps) {
  const mod =
    state === 'selected'
      ? ' loans-dropdown__item--selected'
      : state === 'hover'
        ? ' loans-dropdown__item--hover'
        : '';
  return (
    <div
      className={`loans-dropdown__item${mod}${className ? ` ${className}` : ''}`.trim()}
      onClick={onClick}
      role="row"
    >
      <span className="loans-dropdown__item-label">{label}</span>
      {count !== undefined && <span className="loans-dropdown__item-count">{count}</span>}
    </div>
  );
}
