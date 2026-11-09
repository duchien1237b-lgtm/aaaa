import { Link } from 'react-router-dom';
import { CATEGORY_MAP } from '../data/categories';
import { formatShortDate } from '../lib/date';
import type { Transaction } from '../types';
import { formatCurrency, truncateText } from '../utils';
import { Icon } from './Icon';

export function TransactionCard({ tx }: { tx: Transaction }) {
  const category = CATEGORY_MAP[tx.category];
  const isIncome = tx.type === 'income';

  return (
    <li>
      <Link
        to={`/item/${tx.id}`}
        className="flex h-full items-center gap-3.5 rounded-2xl border border-line bg-white p-3.5 shadow-card transition-colors hover:border-brand-600"
      >
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-xl"
          style={{ backgroundColor: category.tint, color: category.color }}
        >
          <Icon name={category.icon} className="h-6 w-6" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate font-medium text-ink">{tx.title}</span>
          <span className="block text-sm text-ink-soft">{category.label}</span>
          {tx.note !== '' && (
            <span className="mt-0.5 block text-sm text-ink-mute">{truncateText(tx.note, 42)}</span>
          )}
        </span>

        <span className="shrink-0 text-right">
          <span
            className={`block font-display text-lg font-semibold tabular-nums ${
              isIncome ? 'text-brand-700' : 'text-rose-700'
            }`}
          >
            <span className="sr-only">{isIncome ? 'Thu ' : 'Chi '}</span>
            {isIncome ? '+' : '−'}
            {formatCurrency(tx.amount)}
          </span>
          <span className="block text-sm text-ink-mute">{formatShortDate(tx.date)}</span>
        </span>
      </Link>
    </li>
  );
}
