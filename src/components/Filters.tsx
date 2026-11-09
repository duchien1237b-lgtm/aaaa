import { CATEGORIES } from '../data/categories';
import { isCategoryFilter, isSortKey } from '../lib/filters';
import type { CategoryFilter, SortKey, TypeFilter } from '../lib/filters';
import { Icon } from './Icon';

interface FiltersProps {
  search: string;
  onSearch: (value: string) => void;
  type: TypeFilter;
  onType: (value: TypeFilter) => void;
  category: CategoryFilter;
  onCategory: (value: CategoryFilter) => void;
  sort: SortKey;
  onSort: (value: SortKey) => void;
}

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: 'all', label: 'Tất cả' },
  { value: 'expense', label: 'Chi tiêu' },
  { value: 'income', label: 'Thu nhập' },
];

export function Filters({
  search,
  onSearch,
  type,
  onType,
  category,
  onCategory,
  sort,
  onSort,
}: FiltersProps) {
  const visibleCategories = CATEGORIES.filter((c) => type === 'all' || c.kind === type);

  return (
    <div className="flex flex-col gap-3 desktop:flex-row desktop:items-center">
      <div className="relative desktop:flex-1">
        <label htmlFor="search" className="sr-only">
          Tìm giao dịch theo tên, danh mục hoặc ghi chú
        </label>
        <span className="pointer-events-none absolute inset-y-0 left-3.5 grid place-items-center text-ink-mute">
          <Icon name="search" className="h-5 w-5" />
        </span>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          placeholder="Tìm theo tên, danh mục hoặc ghi chú"
          autoComplete="off"
          className="field pl-11"
        />
      </div>

      <div role="group" aria-label="Loại giao dịch" className="flex flex-wrap gap-2">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className="chip"
            aria-pressed={type === option.value}
            onClick={() => onType(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 desktop:flex">
        <div>
          <label htmlFor="category-filter" className="sr-only">
            Lọc theo danh mục
          </label>
          <select
            id="category-filter"
            className="field"
            value={category}
            onChange={(event) => {
              const next = event.target.value;
              if (isCategoryFilter(next)) onCategory(next);
            }}
          >
            <option value="all">Mọi danh mục</option>
            {visibleCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sort" className="sr-only">
            Sắp xếp giao dịch
          </label>
          <select
            id="sort"
            className="field"
            value={sort}
            onChange={(event) => {
              const next = event.target.value;
              if (isSortKey(next)) onSort(next);
            }}
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="highest">Số tiền lớn nhất</option>
            <option value="lowest">Số tiền nhỏ nhất</option>
          </select>
        </div>
      </div>
    </div>
  );
}
