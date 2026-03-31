import type { ReactNode, InputHTMLAttributes } from 'react';
import { LoansPill } from './LoansPill.js';
import { DsButton } from './DsButton.js';
import { SearchSection } from './SearchSection.js';

export interface LoanStageGroupData {
  stageName: string;
  count: number;
  expanded: boolean;
  body?: ReactNode;
}

export interface LoansPanelProps
  extends Pick<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange'> {
  /** Getter that maps icon names to their asset URLs. */
  getIconSrc: (name: string) => string;
  /** Loans pill label. */
  pillLabel?: string;
  /** Loans pill count. */
  pillCount?: number;
  /** URL for the sort icon inside the pill badge. */
  pillIconSrc: string;
  /** Called when the pill is clicked (e.g. to open a dropdown). */
  onPillClick?: () => void;
  /** Called when the "+" add button is clicked. */
  onAddClick?: () => void;
  /** Stage group definitions rendered in the body. */
  stageGroups: LoanStageGroupData[];
  /** Called when a stage group header is toggled. */
  onStageToggle?: (stageName: string, expanded: boolean) => void;
  /** URL for the magnifying-glass icon. */
  magnifyIconSrc: string;
  /** URL for the funnel (filter) icon. */
  funnelIconSrc: string;
  /** URL for the archive-box icon. */
  archiveIconSrc: string;
  /** Chevron-down SVG URL for stage group headers. */
  chevronIconSrc: string;
  searchPlaceholder?: string;
  onFilter?: () => void;
  onArchive?: () => void;
  className?: string;
}

/**
 * Full sidebar loans panel — `.loans-panel` from `global.css`.
 *
 * Composes LoansPill, DsButton (add), scrollable stage groups,
 * and SearchSection into a flex-column layout with sticky header/footer.
 */
export function LoansPanel({
  getIconSrc,
  pillLabel = 'My Loans',
  pillCount = 0,
  pillIconSrc,
  onPillClick,
  onAddClick,
  stageGroups,
  onStageToggle,
  magnifyIconSrc,
  funnelIconSrc,
  archiveIconSrc,
  chevronIconSrc,
  searchPlaceholder = 'Search',
  onFilter,
  onArchive,
  className = '',
  value,
  defaultValue,
  onChange,
}: LoansPanelProps) {
  return (
    <div className={`loans-panel${className ? ` ${className}` : ''}`}>
      <div className="loans-panel__header">
        <LoansPill
          label={pillLabel}
          count={pillCount}
          iconSrc={pillIconSrc}
          onClick={onPillClick}
        />
        <DsButton
          variant="s1"
          icon="plus"
          getIconSrc={getIconSrc}
          aria-label="Add loan"
          onClick={onAddClick}
        />
      </div>

      <div className="loans-panel__body">
        {stageGroups.map((sg) => {
          const expandedClass = sg.expanded
            ? ' loan-stage-group--expanded'
            : ' loan-stage-group--collapsed';
          return (
            <div key={sg.stageName} className={`loan-stage-group${expandedClass}`}>
              <div
                className="loan-stage-group__header"
                role="button"
                tabIndex={0}
                onClick={() => onStageToggle?.(sg.stageName, !sg.expanded)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onStageToggle?.(sg.stageName, !sg.expanded);
                  }
                }}
              >
                <span className="loan-stage-group__name">{sg.stageName}</span>
                <div className="loan-stage-group__meta">
                  <span className="loan-stage-group__count">{sg.count}</span>
                  <span className="loan-stage-group__chevron">
                    <img src={chevronIconSrc} alt="" />
                  </span>
                </div>
              </div>
              {sg.expanded && sg.body && (
                <div className="loan-stage-group__body">{sg.body}</div>
              )}
            </div>
          );
        })}
      </div>

      <div className="loans-panel__footer">
        <SearchSection
          magnifyIconSrc={magnifyIconSrc}
          funnelIconSrc={funnelIconSrc}
          archiveIconSrc={archiveIconSrc}
          placeholder={searchPlaceholder}
          onFilter={onFilter}
          onArchive={onArchive}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
