import { type Expense, type ExpenseRepository, type ExpenseInput } from '@/types/expense';
import { validateExpense } from './domain';
export const STORAGE_KEY = 'folio.expenses.v1';
export class LocalExpenseRepository implements ExpenseRepository {
  constructor(private readonly storage: Pick<Storage, 'getItem' | 'setItem'>) {}
  load(): Expense[] {
    const raw = this.storage.getItem(STORAGE_KEY);
    if (raw === null) return [];
    const data: unknown = JSON.parse(raw);
    if (!Array.isArray(data) || !data.every(isExpense) || new Set(data.map(e => e.id)).size !== data.length) throw new Error('Saved data is invalid. Export or restore a backup before continuing.');
    return data;
  }
  save(expenses: Expense[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }
}
function isExpense(value: unknown): value is Expense {
  if (!value || typeof value !== 'object') return false;
  const e = value as Record<string, unknown>;
  return typeof e.id === 'string' && e.id.length > 0 && typeof e.date === 'string' && typeof e.amount === 'number' && typeof e.category === 'string' && typeof e.description === 'string' && Object.keys(validateExpense(e as unknown as ExpenseInput)).length === 0;
}
