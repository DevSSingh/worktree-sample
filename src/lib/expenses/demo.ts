import type { Expense } from '@/types/expense';
import { today } from './domain';
export function demoExpenses(now = new Date()): Expense[] {
  const entries = [['Weekly groceries', 78.45, 'Food', 0, 1], ['Internet & utilities', 129, 'Bills', 0, 3], ['Coffee with friends', 12.5, 'Food', 0, 4], ['Weekend movie night', 32, 'Entertainment', 0, 5], ['Train pass', 64, 'Transportation', 0, 6], ['New running shoes', 119, 'Shopping', 0, 8], ['Lunch at the café', 24.8, 'Food', 0, 9], ['Household supplies', 42, 'Other', 0, 11], ['Dinner out', 86, 'Food', 1, 12], ['Electricity bill', 108, 'Bills', 1, 8], ['Museum tickets', 28, 'Entertainment', 2, 6], ['Grocery restock', 164, 'Food', 2, 9], ['Monthly commute', 94, 'Transportation', 3, 5], ['Winter wardrobe', 245, 'Shopping', 3, 9], ['Home essentials', 117, 'Other', 4, 7], ['Utilities', 136, 'Bills', 5, 8]] as const;
  return entries.map(([description, amount, category, offset, day], i) => ({
    id: 'demo-' + i,
    description,
    amount,
    category,
    date: today(new Date(now.getFullYear(), now.getMonth() - offset, Math.min(day, now.getDate())))
  }));
}
