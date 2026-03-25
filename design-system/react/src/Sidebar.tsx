import React from 'react';
import { SidebarItem } from './SidebarItem.js';

export interface SidebarNavItem {
  /** Unique key — used as React list key and for aria-current */
  id: string;
  /** Text label rendered below the icon */
  label: string;
  /** Inline SVG string — use ICONS['icon-name'] from the design system icons map */
  iconSvg: string;
  /** Whether this item is the currently active/selected route */
  active?: boolean;
  onClick?: () => void;
}

export interface SidebarProps {
  /** Navigation items rendered at the top of the sidebar */
  items: SidebarNavItem[];
  /** URL of the user avatar image shown at the bottom */
  avatarSrc: string;
  /** Alt text for the avatar — defaults to empty (decorative) */
  avatarAlt?: string;
  className?: string;
}

/**
 * Sidebar — Lender Portal navigation panel.
 * Source: Figma › Lender Exploration · node 362:2876
 *
 * 77px wide panel. Icon+label nav items stack vertically at the top;
 * a circular user avatar sits at the bottom. Each nav item delegates to
 * <SidebarItem> for default / hover / selected state handling.
 *
 * @example
 * <Sidebar
 *   items={[
 *     { id: 'loans',    label: 'Loans',    iconSvg: ICONS['banknotes'],               active: true, onClick: () => navigate('/loans') },
 *     { id: 'worklist', label: 'Worklist', iconSvg: ICONS['clipboard-document-list'],               onClick: () => navigate('/worklist') },
 *   ]}
 *   avatarSrc={userPhotoUrl}
 *   avatarAlt="Jane Doe"
 * />
 */
export function Sidebar({ items, avatarSrc, avatarAlt = '', className }: SidebarProps) {
  return (
    <nav
      className={`sidebar-nav${className ? ` ${className}` : ''}`}
      aria-label="Main navigation"
    >
      <div className="sidebar-nav__items">
        {items.map(({ id, label, iconSvg, active, onClick }) => (
          <SidebarItem
            key={id}
            label={label}
            iconSvg={iconSvg}
            state={active ? 'selected' : 'default'}
            onClick={onClick}
            aria-current={active ? 'page' : undefined}
          />
        ))}
      </div>

      <div className="sidebar-nav__avatar">
        <img src={avatarSrc} alt={avatarAlt} />
      </div>
    </nav>
  );
}

export default Sidebar;
