import { getSeedTransactions } from '../data/seed';
import type { Transaction } from '../types';
import { isTransaction } from './guards';

const STORAGE_KEY = 'so-chi-tieu:transactions:v1';

/**
 * Đọc giao dịch từ localStorage. Lần đầu (hoặc dữ liệu hỏng) thì dùng dữ liệu mẫu.
 * Một mảng rỗng đã lưu là hợp lệ: người dùng chủ động xóa hết thì không nạp lại mẫu.
 */
export function loadTransactions(): Transaction[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter(isTransaction);
    }
  } catch {
    // localStorage bị chặn hoặc JSON hỏng: rơi về dữ liệu mẫu bên dưới.
  }
  return getSeedTransactions();
}

export function saveTransactions(transactions: Transaction[]): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {
    // Hết dung lượng hoặc chế độ riêng tư: ứng dụng vẫn chạy, chỉ không nhớ lại được.
  }
}
