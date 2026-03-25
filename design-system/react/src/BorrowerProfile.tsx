import { useState, useRef } from 'react';

export interface BorrowerProfileProps {
  /** Inline SVG string for the star icon (from design system icons). */
  starFilledSvg: string;
  /** Inline SVG string for the star outline icon. */
  starOutlineSvg: string;
  /** URL for the circular avatar image. */
  avatarSrc: string;
  /** Alt text for the avatar — defaults to empty (decorative). */
  avatarAlt?: string;
  /** Whether the profile is currently favourited. */
  isFavorited?: boolean;
  /** Called when the user toggles the favourite star. */
  onFavoriteToggle?: (next: boolean) => void;
  className?: string;
}

/**
 * BorrowerProfile pill button — toggleable star icon + circular avatar.
 *
 * Figma: Lender Exploration · node 346:4038 (favorited) + 342:3401 (unfavorited)
 * CSS:   .profile, .profile__star, .profile__avatar  (design-system/css/global.css)
 *
 * @example
 * <BorrowerProfile
 *   starFilledSvg={ICONS['star-filled']}
 *   starOutlineSvg={ICONS['star']}
 *   avatarSrc={photoUrl}
 *   isFavorited={fav}
 *   onFavoriteToggle={setFav}
 * />
 */
export function BorrowerProfile({
  starFilledSvg,
  starOutlineSvg,
  avatarSrc,
  avatarAlt = '',
  isFavorited = false,
  onFavoriteToggle,
  className = '',
}: BorrowerProfileProps) {
  const [fav, setFav] = useState(isFavorited);
  const starRef = useRef<HTMLSpanElement>(null);

  function handleClick() {
    const next = !fav;
    setFav(next);
    onFavoriteToggle?.(next);
    // trigger pop animation
    const el = starRef.current;
    if (el) {
      el.classList.remove('star-pop');
      void el.offsetWidth; // force reflow
      el.classList.add('star-pop');
    }
  }

  const cn = `profile${className ? ` ${className}` : ''}`;

  return (
    <button className={cn} type="button" onClick={handleClick}>
      <span
        ref={starRef}
        className="profile__star icon"
        style={fav ? { '--fill-0': '#FFCC00' } as React.CSSProperties : undefined}
        dangerouslySetInnerHTML={{ __html: fav ? starFilledSvg : starOutlineSvg }}
      />
      <span className="profile__avatar">
        <img src={avatarSrc} alt={avatarAlt} />
      </span>
    </button>
  );
}
