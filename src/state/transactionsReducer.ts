import { getSeedTransactions } from '../data/seed';
import type { Transaction } from '../types';

export type TransactionAction =
  | { type: 'add'; payload: Transaction }
  | { type: 'update'; payload: Transaction }
  | { type: 'remove'; id: string }
  | { type: 'reset' };

export function transactionsReducer(
  state: Transaction[],
  action: TransactionAction,
): Transaction[] {
  switch (action.type) {
    case 'add':
      return [action.payload, ...state];
    case 'update':
      return state.map((t) => (t.id === action.payload.id ? action.payload : t));
    case 'remove':
      return state.filter((t) => t.id !== action.id);
    case 'reset':
      return getSeedTransactions();
    default:
      return state;
  }
}
