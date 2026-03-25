export interface LoansDropdownItem {
  label: string;
  count: number;
}

export interface LoansDropdownProps {
  items: LoansDropdownItem[];
  activeIndex?: number;
  onSelect?: (index: number) => void;
  className?: string;
}

/** Loan filter list from `lender-portal.css`. */
export function LoansDropdown({ items, activeIndex = 0, onSelect, className = '' }: LoansDropdownProps) {
  return (
    <div className={`loans-dropdown${className ? ` ${className}` : ''}`.trim()}>
      {items.map((item, i) => (
        <div
          key={`${item.label}-${i}`}
          className={`loans-dropdown__item${i === activeIndex ? ' loans-dropdown__item--active' : ''}`}
          onClick={() => onSelect?.(i)}
          role="option"
          aria-selected={i === activeIndex}
        >
          <span className="loans-dropdown__item-label">{item.label}</span>
          <span className="loans-dropdown__item-count">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
