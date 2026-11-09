import { CATEGORIES, CATEGORY_MAP } from '../data/categories';
import type { CategoryId, Transaction, TransactionType } from '../types';
import { monthKey } from './date';
import { normalizeText } from './text';

export type TypeFilter = 'all' | TransactionType;
export type CategoryFilter = 'all' | CategoryId;
export type SortKey = 'newest' | 'oldest' | 'highest' | 'lowest';

export function isCategoryFilter(value: string): value is CategoryFilter {
  return value === 'all' || CATEGORIES.some((c) => c.id === value);
}

export function isSortKey(value: string): value is SortKey {
  return value === 'newest' || value === 'oldest' || value === 'highest' || value === 'lowest';
}

/** Giữ các giao dịch thuộc tháng `period` ("all" = không giới hạn). */
export function filterByPeriod(list: readonly Transaction[], period: string): Transaction[] {
  return period === 'all' ? [...list] : list.filter((t) => monthKey(t.date) === period);
}

export interface FilterOptions {
  query: string;
  type: TypeFilter;
  category: CategoryFilter;
}

export function applyFilters(list: readonly Transaction[], options: FilterOptions): Transaction[] {
  const needle = normalizeText(options.query);
  return list.filter((t) => {
    if (options.type !== 'all' && t.type !== options.type) return false;
    if (options.category !== 'all' && t.category !== options.category) return false;
    if (needle === '') return true;
    const haystack = normalizeText(`${t.title} ${t.note} ${CATEGORY_MAP[t.category].label}`);
    return haystack.includes(needle);
  });
}

export function sortTransactions(list: readonly Transaction[], sort: SortKey): Transaction[] {
  const copy = [...list];
  switch (sort) {
    case 'oldest':
      return copy.sort((a, b) => a.date.localeCompare(b.date));
    case 'highest':
      return copy.sort((a, b) => b.amount - a.amount);
    case 'lowest':
      return copy.sort((a, b) => a.amount - b.amount);
    case 'newest':
    default:
      return copy.sort((a, b) => b.date.localeCompare(a.date));
  }
}
