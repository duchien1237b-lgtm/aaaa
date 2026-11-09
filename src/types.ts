export type TransactionType = 'expense' | 'income';

export type CategoryId =
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'health'
  | 'fun'
  | 'education'
  | 'other'
  | 'salary'
  | 'freelance'
  | 'gift';

export type PaymentMethod = 'cash' | 'bank' | 'ewallet' | 'card';

export type IconName =
  | 'utensils'
  | 'car'
  | 'bag'
  | 'receipt'
  | 'heart'
  | 'film'
  | 'book'
  | 'wallet'
  | 'laptop'
  | 'gift'
  | 'dots'
  | 'plus'
  | 'edit'
  | 'trash'
  | 'close'
  | 'check'
  | 'arrow-left'
  | 'arrow-right'
  | 'search'
  | 'calendar'
  | 'note'
  | 'mail'
  | 'card'
  | 'alert'
  | 'info'
  | 'trend-down'
  | 'trend-up';

export interface Transaction {
  id: string;
  title: string;
  /** Số tiền dương, đơn vị VND. Chiều thu/chi do `type` quyết định. */
  amount: number;
  type: TransactionType;
  category: CategoryId;
  /** Định dạng YYYY-MM-DD, giờ địa phương. */
  date: string;
  method: PaymentMethod;
  note: string;
  /** Email người cùng chi (không bắt buộc). */
  sharedWith?: string;
}

export type TransactionDraft = Omit<Transaction, 'id'>;

/** Giá trị thô của form nhiều bước (toàn bộ là chuỗi, trừ type/method/category). */
export interface FormValues {
  type: TransactionType;
  amount: string;
  title: string;
  category: CategoryId | '';
  date: string;
  method: PaymentMethod;
  note: string;
  sharedWith: string;
}

export type FormErrors = Partial<Record<keyof FormValues, string>>;

export type ToastKind = 'success' | 'error' | 'info';

export interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}
