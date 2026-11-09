import { CATEGORY_MAP } from '../data/categories';
import type { CategoryTotal } from '../lib/stats';
import { formatCurrency } from '../utils';
import { Icon } from './Icon';

interface CategoryBreakdownProps {
  totals: CategoryTotal[];
}

export function CategoryBreakdown({ totals }: CategoryBreakdownProps) {
  if (totals.length === 0) return null;

  return (
    <section
      aria-labelledby="breakdown-heading"
      className="rounded-3xl border border-line bg-white p-5 shadow-card tablet:p-6"
    >
      <h2 id="breakdown-heading" className="text-xl font-semibold">
        Tiền đã chi vào đâu
      </h2>

      <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-4 tablet:grid-cols-2">
        {totals.slice(0, 6).map(({ category, total, share }) => {
          const meta = CATEGORY_MAP[category];
          return (
            <li key={category}>
              <div className="flex items-center justify-between gap-3">
                <span className="flex min-w-0 items-center gap-2.5">
                  <span
                    className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                    style={{ backgroundColor: meta.tint, color: meta.color }}
                  >
                    <Icon name={meta.icon} className="h-4 w-4" />
                  </span>
                  <span className="truncate text-sm font-medium">{meta.label}</span>
                </span>
                <span className="shrink-0 text-sm tabular-nums text-ink-soft">
                  {formatCurrency(total)}{' '}
                  <span className="text-ink-mute">({Math.round(share)}%)</span>
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-brand-50" aria-hidden="true">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(share, 2)}%`, backgroundColor: meta.color }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
