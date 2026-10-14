import { CATEGORIES, type Category, type Expense, type ExpenseFilters, type ExpenseInput } from '@/types/expense';
export const today = (date = new Date()): string => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
export const currency = (amount: number) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(amount);
export const displayDate = (value: string) => new Date(value + 'T12:00:00').toLocaleDateString('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});
export function validDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value + 'T12:00:00');
  return !Number.isNaN(d.getTime()) && today(d) === value;
}
export function validateExpense(input: ExpenseInput): Partial<Record<keyof ExpenseInput, string>> {
  const errors: Partial<Record<keyof ExpenseInput, string>> = {};
  if (!validDate(input.date)) errors.date = 'Choose a valid date.';
  if (!Number.isFinite(input.amount) || input.amount <= 0 || input.amount > 999999999.99 || Math.abs(input.amount * 100 - Math.round(input.amount * 100)) > 0.00001) errors.amount = 'Enter an amount from $0.01 to $999,999,999.99 with at most two decimals.';
  if (!CATEGORIES.includes(input.category)) errors.category = 'Choose a category.';
  if (!input.description.trim() || input.description.trim().length > 140) errors.description = 'Enter a description between 1 and 140 characters.';
  return errors;
}
export function filterExpenses(expenses: Expense[], filters: ExpenseFilters): Expense[] {
  return expenses.filter(e => (!filters.category || e.category === filters.category) && (!filters.start || e.date >= filters.start) && (!filters.end || e.date <= filters.end) && (e.description + ' ' + e.category).toLowerCase().includes(filters.search.trim().toLowerCase())).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}
export const sumExpenses = (expenses: Expense[]) => expenses.reduce((total, e) => total + Math.round(e.amount * 100), 0) / 100;
export function categoryTotals(expenses: Expense[]): {
  category: Category;
  amount: number;
}[] {
  return CATEGORIES.map(category => ({
    category,
    amount: sumExpenses(expenses.filter(e => e.category === category))
  })).sort((a, b) => b.amount - a.amount);
}
export function monthlySeries(expenses: Expense[], now = new Date()) {
  return Array.from({
    length: 6
  }, (_, i) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = today(date).slice(0, 7);
    return {
      label: date.toLocaleDateString('en-US', {
        month: 'short'
      }),
      key,
      amount: sumExpenses(expenses.filter(e => e.date.startsWith(key)))
    };
  });
}
export function summarize(expenses: Expense[], now = new Date()) {
  const month = today(now).slice(0, 7);
  const monthly = expenses.filter(e => e.date.startsWith(month));
  const categories = categoryTotals(expenses);
  return {
    total: sumExpenses(expenses),
    monthly: sumExpenses(monthly),
    count: expenses.length,
    average: expenses.length ? sumExpenses(expenses) / expenses.length : 0,
    top: categories[0].amount ? categories[0] : null
  };
}
