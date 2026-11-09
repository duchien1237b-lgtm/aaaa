import type { CategoryId, IconName, PaymentMethod, TransactionType } from '../types';

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  kind: TransactionType;
  icon: IconName;
  /** Màu đậm: dùng cho biểu tượng và thanh biểu đồ. */
  color: string;
  /** Màu nền nhạt cho ô biểu tượng. */
  tint: string;
}

export const CATEGORIES: readonly CategoryMeta[] = [
  { id: 'food', label: 'Ăn uống', kind: 'expense', icon: 'utensils', color: '#B45309', tint: '#FEF3C7' },
  { id: 'transport', label: 'Di chuyển', kind: 'expense', icon: 'car', color: '#1D4ED8', tint: '#DBEAFE' },
  { id: 'shopping', label: 'Mua sắm', kind: 'expense', icon: 'bag', color: '#BE185D', tint: '#FCE7F3' },
  { id: 'bills', label: 'Hóa đơn và nhà ở', kind: 'expense', icon: 'receipt', color: '#6D28D9', tint: '#EDE9FE' },
  { id: 'health', label: 'Sức khỏe', kind: 'expense', icon: 'heart', color: '#BE123C', tint: '#FFE4E6' },
  { id: 'fun', label: 'Giải trí', kind: 'expense', icon: 'film', color: '#0E7490', tint: '#CFFAFE' },
  { id: 'education', label: 'Học tập', kind: 'expense', icon: 'book', color: '#4D7C0F', tint: '#ECFCCB' },
  { id: 'other', label: 'Khác', kind: 'expense', icon: 'dots', color: '#475569', tint: '#E2E8F0' },
  { id: 'salary', label: 'Lương', kind: 'income', icon: 'wallet', color: '#047857', tint: '#D1FAE5' },
  { id: 'freelance', label: 'Làm thêm', kind: 'income', icon: 'laptop', color: '#0F766E', tint: '#CCFBF1' },
  { id: 'gift', label: 'Quà tặng', kind: 'income', icon: 'gift', color: '#A16207', tint: '#FEF9C3' },
];

export const CATEGORY_IDS: readonly string[] = CATEGORIES.map((c) => c.id);

export const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.id, c])) as Record<
  CategoryId,
  CategoryMeta
>;

export function categoriesFor(kind: TransactionType): CategoryMeta[] {
  return CATEGORIES.filter((c) => c.kind === kind);
}

export const PAYMENT_METHODS: readonly { id: PaymentMethod; label: string }[] = [
  { id: 'cash', label: 'Tiền mặt' },
  { id: 'bank', label: 'Chuyển khoản' },
  { id: 'ewallet', label: 'Ví điện tử' },
  { id: 'card', label: 'Thẻ' },
];

export const METHOD_IDS: readonly string[] = PAYMENT_METHODS.map((m) => m.id);

export const METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: 'Tiền mặt',
  bank: 'Chuyển khoản',
  ewallet: 'Ví điện tử',
  card: 'Thẻ',
};
