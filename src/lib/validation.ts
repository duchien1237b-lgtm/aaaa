import { CATEGORY_MAP } from '../data/categories';
import type { FormErrors, FormValues } from '../types';
import { validateEmail } from '../utils';

export const MAX_AMOUNT = 1_000_000_000;
export const MIN_DATE = '2000-01-01';
export const TITLE_MAX = 60;
export const NOTE_MAX = 120;
export const STEP_COUNT = 3;

/** Lấy các chữ số từ chuỗi người dùng gõ; chuỗi rỗng thành 0. */
export function parseAmount(raw: string): number {
  const digits = raw.replace(/\D/g, '');
  return digits ? Number(digits) : 0;
}

/** Kiểm tra riêng từng bước của form. Trả về object rỗng nếu hợp lệ. */
export function validateStep(step: number, values: FormValues, today: string): FormErrors {
  const errors: FormErrors = {};

  if (step === 0) {
    const amount = parseAmount(values.amount);
    if (values.amount.trim() === '') errors.amount = 'Nhập số tiền của giao dịch.';
    else if (amount <= 0) errors.amount = 'Số tiền phải lớn hơn 0.';
    else if (amount > MAX_AMOUNT) errors.amount = 'Số tiền tối đa là 1.000.000.000 ₫.';
  }

  if (step === 1) {
    const title = values.title.trim();
    if (title.length < 2) errors.title = 'Tên giao dịch cần ít nhất 2 ký tự.';
    else if (title.length > TITLE_MAX) errors.title = `Tên giao dịch tối đa ${TITLE_MAX} ký tự.`;

    if (values.category === '') errors.category = 'Chọn một danh mục.';
    else if (CATEGORY_MAP[values.category].kind !== values.type) {
      errors.category = 'Danh mục này không thuộc loại giao dịch đã chọn.';
    }

    if (values.date === '') errors.date = 'Chọn ngày giao dịch.';
    else if (values.date < MIN_DATE) errors.date = 'Ngày giao dịch không được trước năm 2000.';
    else if (values.date > today) errors.date = 'Ngày giao dịch không được ở tương lai.';

    if (values.note.length > NOTE_MAX) errors.note = `Ghi chú tối đa ${NOTE_MAX} ký tự.`;
  }

  if (step === 2) {
    const email = values.sharedWith.trim();
    if (email !== '' && !validateEmail(email)) {
      errors.sharedWith = 'Email chưa đúng định dạng, ví dụ ten@gmail.com.';
    }
  }

  return errors;
}

/** Bước đầu tiên còn lỗi, hoặc -1 nếu cả form hợp lệ. */
export function firstInvalidStep(values: FormValues, today: string): number {
  for (let step = 0; step < STEP_COUNT; step += 1) {
    if (Object.keys(validateStep(step, values, today)).length > 0) return step;
  }
  return -1;
}
