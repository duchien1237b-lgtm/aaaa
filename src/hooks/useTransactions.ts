import { useContext } from 'react';
import { TransactionsContext } from '../context/TransactionsContext';
import type { TransactionsContextValue } from '../context/TransactionsContext';

export function useTransactions(): TransactionsContextValue {
  const ctx = useContext(TransactionsContext);
  if (ctx === null) throw new Error('useTransactions phải được dùng bên trong TransactionsProvider');
  return ctx;
}
