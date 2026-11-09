import { useCallback, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import { makeId } from '../lib/id';
import { loadTransactions, saveTransactions } from '../lib/storage';
import { transactionsReducer } from '../state/transactionsReducer';
import type { Transaction, TransactionDraft } from '../types';
import { TransactionsContext } from './TransactionsContext';
import type { TransactionsContextValue } from './TransactionsContext';

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, dispatch] = useReducer(transactionsReducer, null, () => loadTransactions());

  // Mọi thay đổi đều được ghi lại vào localStorage.
  useEffect(() => {
    saveTransactions(transactions);
  }, [transactions]);

  const add = useCallback((draft: TransactionDraft) => {
    dispatch({ type: 'add', payload: { ...draft, id: makeId() } });
  }, []);

  const update = useCallback((transaction: Transaction) => {
    dispatch({ type: 'update', payload: transaction });
  }, []);

  const remove = useCallback((id: string) => {
    dispatch({ type: 'remove', id });
  }, []);

  const reset = useCallback(() => {
    dispatch({ type: 'reset' });
  }, []);

  const value = useMemo<TransactionsContextValue>(
    () => ({ transactions, add, update, remove, reset }),
    [transactions, add, update, remove, reset],
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}
