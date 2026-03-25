import React from 'react';

type SidebarItemState = 'default' | 'hover' | 'selected';

interface SidebarItemProps {
  /** Text label rendered below the icon */
  label: string;
  /** Inline SVG string — use ICONS['icon-name'] from the design system icons map */
  iconSvg: string;
  /** Visual state. 'hover' and 'selected' can also be driven by CSS (:hover / .sidebar-item--selected) */
  state?: SidebarItemState;
  onClick?: () => void;
  className?: string;
}

/**
 * SidebarItem — Lender Portal navigation item
 * Source: Figma › Lender Exploration · node 6:92
 *
 * States:
 *  - default:  no background, icon 20×20
 *  - hover:    accent-black-8 bg, icon grows to 24×24 (CSS transition)
 *  - selected: accent-black-12 bg, icon 20×20
 *
 * The hover scale is handled purely by CSS (.sidebar-item:hover .sidebar-item__icon).
 * Pass state="hover" or state="selected" only when you need to force a visual state.
 */
export function SidebarItem({
  label,
  iconSvg,
  state = 'default',
  onClick,
  className,
}: SidebarItemProps) {
  const stateClass = state !== 'default' ? ` sidebar-item--${state}` : '';

  return (
    <button
      className={`sidebar-item${stateClass}${className ? ' ' + className : ''}`}
      type="button"
      onClick={onClick}
    >
      <div className="sidebar-item__icon-wrap">
        <span
          className="sidebar-item__icon"
          dangerouslySetInnerHTML={{ __html: iconSvg }}
        />
      </div>
      <span className="sidebar-item__label">{label}</span>
    </button>
  );
}

export default SidebarItem;
