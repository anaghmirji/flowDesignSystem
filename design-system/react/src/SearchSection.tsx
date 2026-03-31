import type { InputHTMLAttributes } from 'react';
import { SearchBarInput } from './SearchBarInput.js';

export interface SearchSectionProps
  extends Pick<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'onFocus' | 'onBlur'> {
  /** SVG img src for the magnifying-glass icon. */
  magnifyIconSrc: string;
  /** SVG img src for the funnel (filter) icon. */
  funnelIconSrc: string;
  /** SVG img src for the archive-box icon. */
  archiveIconSrc: string;
  placeholder?: string;
  onFilter?: () => void;
  onArchive?: () => void;
  className?: string;
}

function IconWrap({ src }: { src: string }) {
  return (
    <div className="btn__icon-wrap">
      <div className="btn__icon-inner">
        <div className="btn__icon-vector">
          <img src={src} alt="" />
        </div>
      </div>
    </div>
  );
}

/**
 * Sticky bottom search section — `.search-section` from `global.css`.
 * Wraps a `SearchBarInput` pill plus Filter and Archive action buttons.
 */
export function SearchSection({
  magnifyIconSrc,
  funnelIconSrc,
  archiveIconSrc,
  placeholder = 'Search',
  onFilter,
  onArchive,
  className = '',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
}: SearchSectionProps) {
  return (
    <div className={`search-section${className ? ` ${className}` : ''}`}>
      <div className="search-section__row">
        <SearchBarInput
          magnifyIconSrc={magnifyIconSrc}
          placeholder={placeholder}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <button className="btn btn--secondary" aria-label="Filter and archive" type="button">
          <IconWrap src={funnelIconSrc} />
          <IconWrap src={archiveIconSrc} />
        </button>
      </div>
    </div>
  );
}
