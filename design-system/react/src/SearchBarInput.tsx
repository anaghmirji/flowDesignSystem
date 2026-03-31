import type { InputHTMLAttributes } from 'react';

export interface SearchBarInputProps
  extends Pick<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'onFocus' | 'onBlur'> {
  /** SVG string for the magnifying-glass icon (pass via getIconSrc('magnifying-glass')). */
  magnifyIconSrc: string;
  placeholder?: string;
  /** Visual state for static/server rendering. Defaults to 'default'. */
  state?: 'default' | 'focused' | 'filled';
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

/** Standalone search input pill — `.search-bar__input` from `global.css`. */
export function SearchBarInput({
  magnifyIconSrc,
  placeholder = 'Search',
  state = 'default',
  className = '',
  value,
  defaultValue,
  onChange,
  onFocus,
  onBlur,
}: SearchBarInputProps) {
  const stateClass = state !== 'default' ? ` search-bar__input--${state}` : '';
  const wrapClass  = `search-bar__input${stateClass}${className ? ` ${className}` : ''}`;

  return (
    <div className={wrapClass}>
      <IconWrap src={magnifyIconSrc} />
      <input
        className="search-bar__field"
        type="text"
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
