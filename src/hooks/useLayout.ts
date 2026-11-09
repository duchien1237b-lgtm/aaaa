import { useOutletContext } from 'react-router-dom';
import type { Transaction } from '../types';

export interface LayoutContextValue {
  /** Mở form thêm giao dịch; truyền giao dịch để chuyển sang chế độ sửa. */
  openForm: (editing?: Transaction) => void;
}

export function useLayout(): LayoutContextValue {
  return useOutletContext<LayoutContextValue>();
}
