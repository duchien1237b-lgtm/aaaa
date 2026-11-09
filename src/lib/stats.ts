import type { CategoryId, Transaction } from '../types';
import { monthKey } from './date';

export interface Summary {
  income: number;
  expense: number;
  balance: number;
  count: number;
  /** Phần trăm thu nhập còn lại sau chi tiêu; null nếu chưa có thu nhập. */
  savingsRate: number | null;
}

export function summarize(list: readonly Transaction[]): Summary {
  let income = 0;
  let expense = 0;
  for (const t of list) {
    if (t.type === 'income') income += t.amount;
    else expense += t.amount;
  }
  return {
    income,
    expense,
    balance: income - expense,
    count: list.length,
    savingsRate: income > 0 ? Math.round(((income - expense) / income) * 100) : null,
  };
}

export interface CategoryTotal {
  category: CategoryId;
  total: number;
  /** 0 đến 100 */
  share: number;
}

export function expenseByCategory(list: readonly Transaction[]): CategoryTotal[] {
  const totals = new Map<CategoryId, number>();
  let sum = 0;
  for (const t of list) {
    if (t.type !== 'expense') continue;
    totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
    sum += t.amount;
  }
  return [...totals.entries()]
    .map(([category, total]) => ({ category, total, share: sum > 0 ? (total / sum) * 100 : 0 }))
    .sort((a, b) => b.total - a.total);
}

/** Các tháng có giao dịch, mới nhất trước. Ví dụ ["2026-11", "2026-10"]. */
export function listMonths(list: readonly Transaction[]): string[] {
  return [...new Set(list.map((t) => monthKey(t.date)))].sort().reverse();
}
