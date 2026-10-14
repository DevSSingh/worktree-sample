'use client';

import { useEffect, useState, useCallback } from 'react';
import type { Expense, ExpenseInput, ExpenseRepository } from '@/types/expense';
import { LocalExpenseRepository } from './storage';
import { validateExpense } from './domain';
export function useExpenses(repository?: ExpenseRepository) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [store, setStore] = useState<ExpenseRepository>();
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      try {
        const selected = repository ?? new LocalExpenseRepository(window.localStorage);
        setExpenses(selected.load());
        setStore(selected);
      } catch {
        setError('Your saved expenses could not be loaded. Check browser storage and reload. Existing data has been preserved.');
      } finally {
        setReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, [repository]);
  const replace = useCallback((next: Expense[]) => {
    if (!store) {
      setError('Storage is unavailable. Reload to try again.');
      return false;
    }
    try {
      store.save(next);
      setExpenses(next);
      setError('');
      return true;
    } catch {
      setError('Changes could not be saved. Your expenses were not changed. Free browser storage and try again.');
      return false;
    }
  }, [store]);
  const save = (input: ExpenseInput, id?: string) => {
    if (Object.keys(validateExpense(input)).length) return false;
    const expense = {
      ...input,
      description: input.description.trim(),
      id: id ?? crypto.randomUUID()
    };
    return replace(id ? expenses.map(e => e.id === id ? expense : e) : [...expenses, expense]);
  };
  const remove = (id: string) => replace(expenses.filter(e => e.id !== id));
  return {
    expenses,
    ready,
    error,
    save,
    remove,
    replace,
    available: !!store
  };
}
