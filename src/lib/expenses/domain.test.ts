import { categoryTotals, currency, displayDate, filterExpenses, monthlySeries, summarize, sumExpenses, today, validDate, validateExpense } from './domain';
import type { Expense } from '@/types/expense';
const expenses: Expense[] = [{
  id: 'a',
  date: '2026-01-10',
  amount: 0.1,
  category: 'Food',
  description: 'Coffee'
}, {
  id: 'b',
  date: '2026-01-20',
  amount: 0.2,
  category: 'Food',
  description: 'Tea'
}, {
  id: 'c',
  date: '2025-12-15',
  amount: 20,
  category: 'Bills',
  description: 'Internet'
}];
const filters = {
  search: '',
  category: '' as const,
  start: '',
  end: ''
};
describe('expense domain', () => {
  test('validates dates including leap years and invalid rollover', () => {
    expect(validDate('2024-02-29')).toBe(true);
    expect(validDate('2025-02-29')).toBe(false);
    expect(validDate('bad')).toBe(false);
    expect(validDate('2026-13-01')).toBe(false);
    expect(validDate('2026-02-30')).toBe(false);
    expect(today(new Date(2026, 0, 2))).toBe('2026-01-02');
  });
  test('accepts valid input', () => expect(validateExpense(expenses[0])).toEqual({}));
  test.each([0, -1, NaN, Infinity, 1000000000, 1.001])('rejects invalid amount %s', amount => expect(validateExpense({
    ...expenses[0],
    amount
  })).toHaveProperty('amount'));
  test('rejects missing fields, excessive description and invalid category', () => {
    expect(validateExpense({
      ...expenses[0],
      date: '',
      description: ' ',
      category: 'Invalid' as Expense['category']
    })).toEqual(expect.objectContaining({
      date: expect.any(String),
      description: expect.any(String),
      category: expect.any(String)
    }));
    expect(validateExpense({
      ...expenses[0],
      description: 'x'.repeat(141)
    })).toHaveProperty('description');
  });
  test('filters category, inclusive date range and case-insensitive trimmed search', () => {
    expect(filterExpenses(expenses, {
      ...filters,
      category: 'Food',
      start: '2026-01-10',
      end: '2026-01-20',
      search: ' COF '
    })).toEqual([expenses[0]]);
    expect(filterExpenses(expenses, {
      ...filters,
      search: 'bills'
    })).toEqual([expenses[2]]);
    expect(filterExpenses(expenses, {
      ...filters,
      start: '2026-02-01',
      end: '2026-01-01'
    })).toEqual([]);
    expect(filterExpenses(expenses, filters).map(e => e.id)).toEqual(['b', 'a', 'c']);
    expect(filterExpenses([{
      ...expenses[0],
      id: 'z'
    }, expenses[0]], filters).map(e => e.id)).toEqual(['z', 'a']);
  });
  test('calculates money with integer cents and handles empty data', () => {
    expect(sumExpenses(expenses.slice(0, 2))).toBe(.3);
    expect(sumExpenses([])).toBe(0);
    expect(summarize(expenses, new Date(2026, 0, 25))).toEqual({
      total: 20.3,
      monthly: .3,
      count: 3,
      average: 20.3 / 3,
      top: {
        category: 'Bills',
        amount: 20
      }
    });
    expect(summarize([], new Date(2026, 0, 1))).toEqual({
      total: 0,
      monthly: 0,
      count: 0,
      average: 0,
      top: null
    });
    expect(categoryTotals(expenses)[0]).toEqual({
      category: 'Bills',
      amount: 20
    });
  });
  test('fills a six-month series across year boundaries', () => {
    const series = monthlySeries(expenses, new Date(2026, 0, 1));
    expect(series).toHaveLength(6);
    expect(series[0].key).toBe('2025-08');
    expect(series[4].amount).toBe(20);
    expect(series[5].amount).toBe(.3);
  });
  test('formats amounts and dates', () => {
    expect(currency(1234.5)).toBe('$1,234.50');
    expect(displayDate('2026-01-02')).toBe('Jan 2, 2026');
  });
});
