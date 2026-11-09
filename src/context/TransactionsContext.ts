import { createContext } from 'react';
import type { Transaction, TransactionDraft } from '../types';

export interface TransactionsContextValue {
  transactions: Transaction[];
  add: (draft: TransactionDraft) => void;
  update: (transaction: Transaction) => void;
  remove: (id: string) => void;
  reset: () => void;
}

export const TransactionsContext = createContext<TransactionsContextValue | null>(null);
