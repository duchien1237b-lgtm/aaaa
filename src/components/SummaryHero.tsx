import type { Summary } from '../lib/stats';
import type { IconName } from '../types';
import { formatCurrency } from '../utils';
import { Icon } from './Icon';

interface SummaryHeroProps {
  summary: Summary;
  periodLabel: string;
}

interface Stat {
  label: string;
  value: string;
  hint?: string;
  icon: IconName;
  iconClass: string;
}

/** Các dòng kẻ mờ gợi trang sổ kế toán. */
const LEDGER_LINES =
  'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(167, 243, 208, 0.09) 31px, rgba(167, 243, 208, 0.09) 32px)';

export function SummaryHero({ summary, periodLabel }: SummaryHeroProps) {
  const { income, expense, balance, count, savingsRate } = summary;
  const total = income + expense;
  const incomeShare = total > 0 ? Math.round((income / total) * 100) : 0;
  const expenseShare = total > 0 ? 100 - incomeShare : 0;

  const stats: Stat[] = [
    {
      label: 'Thu nhập',
      value: formatCurrency(income),
      icon: 'trend-up',
      iconClass: 'bg-brand-400/20 text-brand-300',
    },
    {
      label: 'Chi tiêu',
      value: formatCurrency(expense),
      icon: 'trend-down',
      iconClass: 'bg-rose-300/20 text-rose-200',
    },
    {
      label: 'Tỉ lệ còn lại',
      value: savingsRate === null ? 'Chưa có thu nhập' : `${savingsRate}%`,
      hint: `${count} giao dịch`,
      icon: 'wallet',
      iconClass: 'bg-white/10 text-brand-200',
    },
  ];

  return (
    <section
      aria-labelledby="balance-label"
      className="relative overflow-hidden rounded-3xl bg-brand-900 p-5 text-white tablet:p-8"
      style={{ backgroundImage: LEDGER_LINES }}
    >
      {/* Đồng xu lớn làm điểm nhấn, cắt một phần ngoài khung */}
      <svg
        viewBox="0 0 200 200"
        aria-hidden="true"
        focusable="false"
        className="pointer-events-none absolute -right-14 -top-14 h-56 w-56 text-brand-600 tablet:-right-10 tablet:-top-10 tablet:h-72 tablet:w-72"
      >
        <circle cx="100" cy="100" r="96" fill="currentColor" opacity="0.5" />
        <circle cx="100" cy="100" r="74" fill="none" stroke="#a7f3d0" strokeOpacity="0.45" strokeWidth="3" />
        <path
          d="M100 52v96M76 76h36a16 16 0 0 1 0 32H76"
          fill="none"
          stroke="#a7f3d0"
          strokeOpacity="0.45"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </svg>

      <div className="relative">
        <p id="balance-label" className="text-base text-brand-200">
          Số dư {periodLabel}
        </p>
        <p className="mt-1 break-words font-display text-5xl font-semibold tabular-nums tracking-tight tablet:text-6xl desktop:text-7xl">
          {formatCurrency(balance)}
        </p>

        <div
          role="img"
          aria-label={`Thu nhập chiếm ${incomeShare}%, chi tiêu chiếm ${expenseShare}% tổng dòng tiền`}
          className="mt-6 flex h-3 overflow-hidden rounded-full bg-white/15"
        >
          <div className="h-full bg-brand-400" style={{ width: `${incomeShare}%` }} />
          <div className="h-full bg-rose-300" style={{ width: `${expenseShare}%` }} />
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 tablet:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="flex items-center gap-2 text-sm text-brand-200">
                <span className={`grid h-7 w-7 place-items-center rounded-lg ${stat.iconClass}`}>
                  <Icon name={stat.icon} className="h-4 w-4" />
                </span>
                {stat.label}
              </dt>
              <dd className="mt-1.5 font-display text-xl font-semibold tabular-nums">{stat.value}</dd>
              {stat.hint && <dd className="text-sm text-brand-200">{stat.hint}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
