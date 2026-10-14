import { LocalExpenseRepository, STORAGE_KEY } from './storage';
import { demoExpenses } from './demo';
describe('local expense repository', () => {
  beforeEach(() => localStorage.clear());
  test('loads empty and persists expenses', () => {
    const repo = new LocalExpenseRepository(localStorage);
    expect(repo.load()).toEqual([]);
    const expenses = demoExpenses(new Date(2026, 0, 1));
    repo.save(expenses);
    expect(repo.load()).toEqual(expenses);
  });
  test.each(['{', '{}', '[null]', '[{}]', '[{"id":"x","amount":1}]'])('rejects malformed saved data %s', raw => {
    localStorage.setItem(STORAGE_KEY, raw);
    expect(() => new LocalExpenseRepository(localStorage).load()).toThrow();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(raw);
  });
  test('rejects duplicates and invalid amounts', () => {
    const expenses = demoExpenses();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([expenses[0], expenses[0]]));
    expect(() => new LocalExpenseRepository(localStorage).load()).toThrow();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{
      ...expenses[0],
      amount: -1
    }]));
    expect(() => new LocalExpenseRepository(localStorage).load()).toThrow();
  });
  test('propagates storage write errors', () => {
    const repo = new LocalExpenseRepository({
      getItem: () => null,
      setItem: () => {
        throw new Error('full');
      }
    });
    expect(() => repo.save([])).toThrow('full');
  });
});
