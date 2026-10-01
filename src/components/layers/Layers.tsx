/**
 * The three product layers of a Match Page. Each has its own colour,
 * number and description so data, machine output and human judgement are
 * never visually blended.
 */
import type { ReactNode } from 'react';
import type { Coverage } from '../../types/football';
import { cx } from '../../utils';
import { Icon, type IconName } from '../ui/Icon';

export type LayerId = 'data' | 'ai' | 'expert';

export const LAYERS: Record<LayerId, { n: string; label: string; short: string; icon: IconName; what: string }> = {
  data: { n: '01', label: 'Data', short: 'Data', icon: 'database', what: 'Facts from match and event data. No interpretation.' },
  ai: { n: '02', label: 'AI Summary', short: 'AI', icon: 'spark', what: 'Machine synthesis of the data layer. Generated, never hand-edited.' },
  expert: {
    n: '03',
    label: 'Vision X1 Expert Opinion',
    short: 'Expert',
    icon: 'shield',
    what: 'A named analyst’s judgement and Vision X1 View. Published before kickoff, then locked.',
  },
};

export function LayerTag({ layer, size = 'md', label }: { layer: LayerId; size?: 'sm' | 'md'; label?: string }) {
  const l = LAYERS[layer];
  return (
    <span className={cx('layer-tag', `layer-tag--${layer}`, size === 'sm' && 'layer-tag--sm')}>
      <span className="layer-tag__n">{l.n}</span>
      {label ?? (size === 'sm' ? l.short : l.label)}
    </span>
  );
}

/** Compact availability indicator for match lists. */
export function CoveragePills({ coverage }: { coverage: Coverage }) {
  return (
    <span className="coverage" aria-label="Published layers">
      {(Object.keys(LAYERS) as LayerId[]).map((id) => (
        <span key={id} className={cx('coverage__pill', `coverage__pill--${id}`, !coverage[id] && 'is-off')} title={`${LAYERS[id].label}: ${coverage[id] ? 'published' : 'not published'}`}>
          {LAYERS[id].short}
        </span>
      ))}
    </span>
  );
}

export function LayerSection({
  layer,
  id,
  meta,
  children,
}: {
  layer: LayerId;
  id?: string;
  meta?: ReactNode;
  children: ReactNode;
}) {
  const l = LAYERS[layer];
  return (
    <section id={id} className={cx('layer', `layer--${layer}`)}>
      <header className="layer__head">
        <span className="layer__num">{l.n}</span>
        <div className="layer__titles">
          <h2 className="layer__title">
            <Icon name={l.icon} size={18} /> {l.label}
          </h2>
          <p className="layer__what">{l.what}</p>
        </div>
        {meta && <div className="layer__meta">{meta}</div>}
      </header>
      <div className="layer__body">{children}</div>
    </section>
  );
}
