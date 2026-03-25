import type { ButtonHTMLAttributes } from 'react';

export interface BorrowerProfileProps
  extends Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'onClick' | 'type'> {
  /** URL for the star-filled icon (uses .icon--star-filled CSS class for positioning). */
  iconSrc: string;
  /** URL for the circular avatar image. */
  avatarSrc: string;
  /** Alt text for the avatar — defaults to empty (decorative). */
  avatarAlt?: string;
}

/**
 * BorrowerProfile pill button — star-filled icon + circular avatar photo.
 *
 * Figma: Lender Exploration · node 346:4038
 * CSS:   .profile, .profile__avatar  (design-system/css/global.css)
 *
 * @example
 * <BorrowerProfile iconSrc={starFilledUrl} avatarSrc={photoUrl} onClick={openMenu} />
 */
export function BorrowerProfile({
  iconSrc,
  avatarSrc,
  avatarAlt = '',
  onClick,
  type = 'button',
  className = '',
}: BorrowerProfileProps) {
  const cn = `profile${className ? ` ${className}` : ''}`.trim();
  return (
    <button className={cn} type={type} onClick={onClick}>
      <span className="icon icon--star-filled">
        <span className="icon__vector">
          <img src={iconSrc} alt="" />
        </span>
      </span>
      <span className="profile__avatar">
        <img src={avatarSrc} alt={avatarAlt} />
      </span>
    </button>
  );
}
