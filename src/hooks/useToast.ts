import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';
import type { ToastContextValue } from '../context/ToastContext';

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (ctx === null) throw new Error('useToast phải được dùng bên trong ToastProvider');
  return ctx;
}
