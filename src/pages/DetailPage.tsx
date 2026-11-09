import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Icon } from '../components/Icon';
import { TransactionCard } from '../components/TransactionCard';
import { CATEGORY_MAP, METHOD_LABEL } from '../data/categories';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLayout } from '../hooks/useLayout';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { formatLongDate } from '../lib/date';
import { formatCurrency, truncateText } from '../utils';
import { NotFoundPage } from './NotFoundPage';

export function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { transactions, remove } = useTransactions();
  const { openForm } = useLayout();
  const { notify } = useToast();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const tx = transactions.find((t) => t.id === id);

  useDocumentTitle(tx ? tx.title : 'Không tìm thấy giao dịch');

  if (!tx) {
    return (
      <NotFoundPage
        title="Không tìm thấy giao dịch này"
        message="Giao dịch có thể đã bị xóa hoặc đường dẫn chưa đúng."
      />
    );
  }

  const category = CATEGORY_MAP[tx.category];
  const isIncome = tx.type === 'income';
  const related = transactions
    .filter((t) => t.category === tx.category && t.id !== tx.id)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);

  const details: { label: string; value: string }[] = [
    { label: 'Loại giao dịch', value: isIncome ? 'Thu nhập' : 'Chi tiêu' },
    { label: 'Danh mục', value: category.label },
    { label: 'Ngày giao dịch', value: formatLongDate(tx.date) },
    { label: 'Cách thanh toán', value: METHOD_LABEL[tx.method] },
    { label: 'Ghi chú', value: tx.note === '' ? 'Không có ghi chú' : tx.note },
    { label: 'Chia sẻ với', value: tx.sharedWith ?? 'Không chia sẻ' },
  ];

  function confirmDelete() {
    if (!tx) return;
    const shortTitle = truncateText(tx.title, 32);
    setConfirmingDelete(false);
    navigate('/', { replace: true });
    remove(tx.id);
    notify('success', `Đã xóa giao dịch “${shortTitle}”`);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 tablet:px-6 tablet:py-10">
      <Link
        to="/"
        className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg pr-3 text-sm font-semibold text-brand-800 hover:underline"
      >
        <Icon name="arrow-left" className="h-4 w-4" strokeWidth={2.2} />
        Quay lại sổ chi tiêu
      </Link>

      <article className="mt-2 overflow-hidden rounded-3xl border border-line bg-white shadow-card">
        <header className="p-6 tablet:p-8" style={{ backgroundColor: category.tint }}>
          <span
            className="grid h-14 w-14 place-items-center rounded-2xl bg-white/70"
            style={{ color: category.color }}
          >
            <Icon name={category.icon} className="h-8 w-8" />
          </span>
          <h1 className="mt-4 break-words text-2xl font-semibold tablet:text-3xl">{tx.title}</h1>
          <p
            className={`mt-1 font-display text-4xl font-semibold tabular-nums tablet:text-5xl ${
              isIncome ? 'text-brand-800' : 'text-rose-800'
            }`}
          >
            <span className="sr-only">{isIncome ? 'Thu ' : 'Chi '}</span>
            {isIncome ? '+' : '−'}
            {formatCurrency(tx.amount)}
          </p>
        </header>

        <dl className="grid grid-cols-1 gap-x-8 gap-y-5 p-6 tablet:grid-cols-2 tablet:p-8">
          {details.map((item) => (
            <div key={item.label} className="min-w-0">
              <dt className="text-sm text-ink-mute">{item.label}</dt>
              <dd className="mt-0.5 break-words font-medium">{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-col gap-2 border-t border-line p-6 tablet:flex-row tablet:justify-end tablet:px-8">
          <button type="button" className="btn btn-secondary" onClick={() => openForm(tx)}>
            <Icon name="edit" className="h-4 w-4" />
            Sửa giao dịch
          </button>
          <button type="button" className="btn btn-danger" onClick={() => setConfirmingDelete(true)}>
            <Icon name="trash" className="h-4 w-4" />
            Xóa giao dịch
          </button>
        </div>
      </article>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-10">
          <h2 id="related-heading" className="text-xl font-semibold">
            Cùng danh mục {category.label.toLowerCase()}
          </h2>
          <ul className="mt-4 grid grid-cols-1 gap-3 tablet:grid-cols-2">
            {related.map((item) => (
              <TransactionCard key={item.id} tx={item} />
            ))}
          </ul>
        </section>
      )}

      <ConfirmDialog
        open={confirmingDelete}
        title="Xóa giao dịch này?"
        message={`“${truncateText(tx.title, 50)}” sẽ bị xóa khỏi sổ của bạn. Thao tác này không hoàn tác được.`}
        confirmLabel="Xóa giao dịch"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </div>
  );
}
