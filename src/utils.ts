/**
 * Bốn hàm tiện ích bắt buộc của đề bài.
 * Tên hàm và chữ ký giữ đúng theo đề; phần logic tự viết.
 */

/** Định dạng số tiền theo chuẩn Việt Nam, ví dụ 150000 -> "150.000 ₫". */
export function formatCurrency(amount: number, currency: string = 'VND'): string {
  try {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency }).format(amount);
  } catch {
    // Mã tiền tệ không hợp lệ: vẫn trả về chuỗi đọc được thay vì làm sập giao diện.
    return `${amount.toLocaleString('vi-VN')} ${currency}`;
  }
}

/** Cắt chuỗi dài hơn maxLength ký tự và thêm "..."; chuỗi ngắn hơn giữ nguyên. */
export function truncateText(text: string, maxLength: number): string {
  const limit = Math.max(0, Math.floor(maxLength));
  // Array.from đếm theo ký tự thật, không cắt đôi chữ có dấu hay emoji.
  const chars = Array.from(text);
  if (chars.length <= limit) return text;
  return `${chars.slice(0, limit).join('')}...`;
}

/** Kiểm tra email: có phần tên, dấu @, và tên miền có ít nhất một dấu chấm. */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

/**
 * Trì hoãn gọi hàm: chỉ chạy một lần sau `delay` ms kể từ lần gọi cuối.
 *
 * Ràng buộc `never[]` cho phép truyền hàm có bất kỳ danh sách tham số nào,
 * và vẫn giữ đúng yêu cầu "strict: true, không dùng kiểu any".
 */
export function debounce<T extends (...args: never[]) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout> | undefined;

  const debounced = (...args: Parameters<T>): void => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      fn(...args);
    }, delay);
  };

  return debounced as unknown as T;
}
