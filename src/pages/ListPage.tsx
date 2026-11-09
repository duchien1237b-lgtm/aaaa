import { useMemo, useState } from 'react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { CategoryBreakdown } from '../components/CategoryBreakdown';
import { Filters } from '../components/Filters';
import { Icon } from '../components/Icon';
import { SummaryHero } from '../components/SummaryHero';
import { TransactionCard } from '../components/TransactionCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { useLayout } from '../hooks/useLayout';
import { useToast } from '../hooks/useToast';
import { useTransactions } from '../hooks/useTransactions';
import { formatMonthLabel } from '../lib/date';
import { applyFilters, filterByPeriod, sortTransactions } from '../lib/filters';
import type { CategoryFilter, SortKey, TypeFilter } from '../lib/filters';
import { expenseByCategory, listMonths, summarize } from '../lib/stats';
import { debounce } from '../utils';

export function ListPage() {
  useDocumentTitle('Sổ chi tiêu');

  const { transactions, reset } = useTransactions();
  const { openForm } = useLayout();
  const { notify } = useToast();

  const [period, setPeriod] = useState('all');
  const [searchInput, setSearchInput] = useState('');
  const [query, setQuery] = useState('');
  const [type, setType] = useState<TypeFilter>('all');
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [sort, setSort] = useState<SortKey>('newest');
  const [confirmingReset, setConfirmingReset] = useState(false);

  // Tìm kiếm có debounce 300ms: ô nhập cập nhật ngay, danh sách chỉ lọc sau khi ngừng gõ.
  const applyQuery = useMemo(() => debounce((value: string) => setQuery(value), 300), []);

  const months = useMemo(() => listMonths(transactions), [transactions]);
  // Nếu tháng đang chọn không còn giao dịch (do xóa), tự quay về "Tất cả".
  const activePeriod = period === 'all' || months.includes(period) ? period : 'all';

  const inPeriod = useMemo(
    () => filterByPeriod(transactions, activePeriod),
    [transactions, activePeriod],
  );
  const summary = useMemo(() => summarize(inPeriod), [inPeriod]);
  const breakdown = useMemo(() => expenseByCategory(inPeriod), [inPeriod]);

  const visible = useMemo(
    () => sortTransactions(applyFilters(inPeriod, { query, type, category }), sort),
    [inPeriod, query, type, category, sort],
  );

  const filtersActive = query !== '' || type !== 'all' || category !== 'all';
  const periodLabel = activePeriod === 'all' ? 'toàn bộ thời gian' : formatMonthLabel(activePeriod).toLowerCase();

  function handleSearch(value: string) {
    setSearchInput(value);
    applyQuery(value);
  }

  function handleType(next: TypeFilter) {
    setType(next);
    // Đổi loại thì bỏ danh mục đang lọc nếu nó không còn thuộc loại đó.
    setCategory('all');
  }

  function clearFilters() {
    setSearchInput('');
    setQuery('');
    setType('all');
    setCategory('all');
  }

  function confirmReset() {
    reset();
    setConfirmingReset(false);
    clearFilters();
    notify('info', 'Đã khôi phục dữ liệu mẫu');
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 tablet:px-6 tablet:py-8 desktop:px-8">
      <div className="flex flex-col gap-4 tablet:flex-row tablet:items-end tablet:justify-between">
        <h1 className="text-3xl font-semibold tablet:text-4xl">Sổ chi tiêu của bạn</h1>

        <div role="group" aria-label="Xem theo thời gian" className="flex flex-wrap gap-2">
          <button
            type="button"
            className="chip"
            aria-pressed={activePeriod === 'all'}
            onClick={() => setPeriod('all')}
          >
            Tất cả
          </button>
          {months.map((month) => (
            <button
              key={month}
              type="button"
              className="chip"
              aria-pressed={activePeriod === month}
              onClick={() => setPeriod(month)}
            >
              {formatMonthLabel(month)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-5">
        <SummaryHero summary={summary} periodLabel={periodLabel} />
        <CategoryBreakdown totals={breakdown} />
      </div>

      <section aria-labelledby="list-heading" className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <h2 id="list-heading" className="text-2xl font-semibold">
            Giao dịch
          </h2>
          <p aria-live="polite" className="text-sm text-ink-mute">
            Hiển thị {visible.length} trên {inPeriod.length} giao dịch
          </p>
        </div>

        <div className="mt-4">
          <Filters
            search={searchInput}
            onSearch={handleSearch}
            type={type}
            onType={handleType}
            category={category}
            onCategory={setCategory}
            sort={sort}
            onSort={setSort}
          />
        </div>

        {visible.length > 0 ? (
          <ul className="mt-5 grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3 desktop:gap-4">
            {visible.map((tx) => (
              <TransactionCard key={tx.id} tx={tx} />
            ))}
          </ul>
        ) : (
          <div className="mt-5 rounded-3xl border border-dashed border-edge bg-white px-6 py-12 text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-100 text-brand-800">
              <Icon name={filtersActive ? 'search' : 'wallet'} className="h-7 w-7" />
            </span>
            {filtersActive ? (
              <>
                <h3 className="mt-4 text-xl font-semibold">Không có giao dịch nào khớp</h3>
                <p className="mx-auto mt-1 max-w-sm text-ink-soft">
                  Thử bỏ bớt bộ lọc hoặc tìm bằng từ khóa khác.
                </p>
                <button type="button" className="btn btn-secondary mt-5" onClick={clearFilters}>
                  Xóa bộ lọc
                </button>
              </>
            ) : (
              <>
                <h3 className="mt-4 text-xl font-semibold">Sổ của bạn đang trống</h3>
                <p className="mx-auto mt-1 max-w-sm text-ink-soft">
                  Ghi khoản chi hoặc thu đầu tiên để bắt đầu theo dõi số dư.
                </p>
                <button type="button" className="btn btn-primary mt-5" onClick={() => openForm()}>
                  <Icon name="plus" className="h-5 w-5" strokeWidth={2.2} />
                  Thêm giao dịch đầu tiên
                </button>
              </>
            )}
          </div>
        )}
      </section>

      <div className="mt-10 border-t border-line pt-5 text-sm text-ink-mute">
        <p>
          Muốn xem lại dữ liệu ban đầu?{' '}
          <button
            type="button"
            onClick={() => setConfirmingReset(true)}
            className="font-medium text-brand-800 underline underline-offset-2 hover:text-brand-900"
          >
            Khôi phục dữ liệu mẫu
          </button>
        </p>
      </div>

      <ConfirmDialog
        open={confirmingReset}
        title="Khôi phục dữ liệu mẫu?"
        message="Mọi giao dịch bạn đã thêm hoặc sửa sẽ bị thay bằng 25 giao dịch mẫu ban đầu. Thao tác này không hoàn tác được."
        confirmLabel="Khôi phục"
        danger
        onConfirm={confirmReset}
        onCancel={() => setConfirmingReset(false)}
      />
    </div>
  );
}
