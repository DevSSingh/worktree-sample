import { act, renderHook, waitFor } from '@testing-library/react';
import { useExpenses } from './use-expenses';
import type { ExpenseRepository } from '@/types/expense';
const input = {
  description: 'Lunch',
  date: '2026-01-01',
  amount: 12,
  category: 'Food' as const
};
beforeAll(() => Object.defineProperty(globalThis.crypto, 'randomUUID', {
  value: () => 'new-id',
  configurable: true
}));
test('loads, adds, edits, deletes, and replaces through injected repository', async () => {
  const repo: ExpenseRepository = {
    load: () => [],
    save: jest.fn()
  };
  const {
    result
  } = renderHook(() => useExpenses(repo));
  await waitFor(() => expect(result.current.ready).toBe(true));
  act(() => {
    expect(result.current.save(input)).toBe(true);
  });
  expect(result.current.expenses[0]).toEqual({
    ...input,
    id: 'new-id'
  });
  act(() => {
    expect(result.current.save({
      ...input,
      amount: 15
    }, 'new-id')).toBe(true);
  });
  expect(result.current.expenses[0].amount).toBe(15);
  act(() => {
    expect(result.current.save({
      ...input,
      amount: 0
    })).toBe(false);
  });
  act(() => result.current.remove('new-id'));
  expect(result.current.expenses).toEqual([]);
  act(() => result.current.replace([{
    ...input,
    id: 'import'
  }]));
  expect(repo.save).toHaveBeenCalledTimes(4);
});
test('preserves state when saving fails', async () => {
  const repo: ExpenseRepository = {
    load: () => [{
      ...input,
      id: 'x'
    }],
    save: () => {
      throw Error('quota');
    }
  };
  const {
    result
  } = renderHook(() => useExpenses(repo));
  await waitFor(() => expect(result.current.ready).toBe(true));
  act(() => expect(result.current.remove('x')).toBe(false));
  expect(result.current.expenses).toHaveLength(1);
  expect(result.current.error).toContain('could not be saved');
});
test('reports unreadable storage and refuses writes', async () => {
  const repo: ExpenseRepository = {
    load: () => {
      throw Error('corrupt');
    },
    save: jest.fn()
  };
  const {
    result
  } = renderHook(() => useExpenses(repo));
  await waitFor(() => expect(result.current.ready).toBe(true));
  expect(result.current.error).toContain('preserved');
  act(() => expect(result.current.replace([])).toBe(false));
  expect(repo.save).not.toHaveBeenCalled();
});
test('uses browser storage by default', async () => {
  localStorage.clear();
  const {
    result
  } = renderHook(() => useExpenses());
  await waitFor(() => expect(result.current.available).toBe(true));
  act(() => result.current.save(input));
  expect(localStorage.getItem('folio.expenses.v1')).toContain('Lunch');
});
test('handles browsers that block localStorage access', async () => {
  const getter = jest.spyOn(window, 'localStorage', 'get').mockImplementation(() => {
    throw Error('blocked');
  });
  const {
    result
  } = renderHook(() => useExpenses());
  await waitFor(() => expect(result.current.ready).toBe(true));
  expect(result.current.available).toBe(false);
  expect(result.current.error).toContain('could not be loaded');
  getter.mockRestore();
});
