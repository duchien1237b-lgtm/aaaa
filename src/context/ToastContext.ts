import { createContext } from 'react';
import type { ToastKind } from '../types';

export interface ToastContextValue {
  notify: (kind: ToastKind, message: string) => void;
  dismiss: (id: number) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);
