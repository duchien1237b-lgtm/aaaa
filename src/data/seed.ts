import type { Transaction } from '../types';
import { isTransaction } from '../lib/guards';
import rawSeed from './data.json';

/** Dữ liệu mẫu ban đầu (data.json), đã lọc qua bộ kiểm tra kiểu lúc chạy. */
export function getSeedTransactions(): Transaction[] {
  return (rawSeed as unknown[]).filter(isTransaction);
}
