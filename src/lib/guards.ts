import { CATEGORY_IDS, METHOD_IDS } from '../data/categories';
import type { Transaction } from '../types';
import { isValidISODate } from './date';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Kiểm tra dữ liệu đọc từ localStorage/JSON có đúng hình dạng Transaction không. */
export function isTransaction(value: unknown): value is Transaction {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.amount === 'number' &&
    Number.isFinite(value.amount) &&
    value.amount > 0 &&
    (value.type === 'expense' || value.type === 'income') &&
    typeof value.category === 'string' &&
    CATEGORY_IDS.includes(value.category) &&
    typeof value.date === 'string' &&
    isValidISODate(value.date) &&
    typeof value.method === 'string' &&
    METHOD_IDS.includes(value.method) &&
    typeof value.note === 'string' &&
    (value.sharedWith === undefined || typeof value.sharedWith === 'string')
  );
}
