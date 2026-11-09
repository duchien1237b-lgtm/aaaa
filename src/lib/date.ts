function pad(n: number): string {
  return String(n).padStart(2, '0');
}

/** Ngày hôm nay (giờ địa phương) dạng YYYY-MM-DD. */
export function todayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Đọc YYYY-MM-DD thành Date theo giờ địa phương (tránh lệch múi giờ của new Date(iso)). */
export function parseISODate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function isValidISODate(iso: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return false;
  const d = parseISODate(iso);
  return (
    !Number.isNaN(d.getTime()) &&
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` === iso
  );
}

/** "03/11" */
export function formatShortDate(iso: string): string {
  const d = parseISODate(iso);
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

/** "Thứ Hai, 2 tháng 11, 2026" */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parseISODate(iso));
}

/** "2026-11" từ "2026-11-03" */
export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}

/** "Tháng 11/2026" từ "2026-11" */
export function formatMonthLabel(key: string): string {
  const [y, m] = key.split('-');
  return `Tháng ${Number(m)}/${y}`;
}
