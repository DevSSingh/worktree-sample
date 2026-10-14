export const CATEGORIES = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'] as const;
export type Category = (typeof CATEGORIES)[number];
export interface Expense {
  id: string;
  date: string;
  amount: number;
  category: Category;
  description: string;
}
export type ExpenseInput = Omit<Expense, 'id'>;
export interface ExpenseFilters {
  search: string;
  category: Category | '';
  start: string;
  end: string;
}
export interface ExpenseRepository {
  load(): Expense[];
  save(expenses: Expense[]): void;
}
