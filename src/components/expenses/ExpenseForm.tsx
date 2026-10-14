'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Plus } from 'lucide-react';
import { CATEGORIES, type Expense, type ExpenseInput, type Category } from '@/types/expense';
import { today, validateExpense } from '@/lib/expenses/domain';
interface Props {
  expense?: Expense;
  onClose: () => void;
  onSave: (input: ExpenseInput, id?: string) => boolean;
}
export function ExpenseForm({
  expense,
  onClose,
  onSave
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [input, setInput] = useState<ExpenseInput>(expense ?? {
    date: today(),
    amount: 0,
    category: 'Food',
    description: ''
  });
  const [amount, setAmount] = useState(expense ? String(expense.amount) : '');
  const [errors, setErrors] = useState<ReturnType<typeof validateExpense>>({});
  const [saveError, setSaveError] = useState('');
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => element?.close();
  }, []);
  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = {
      ...input,
      amount: Number(amount)
    };
    const next = validateExpense(value);
    setErrors(next);
    if (Object.keys(next).length) return;
    if (onSave(value, expense?.id)) onClose();else setSaveError('Unable to save. Check the storage message on the dashboard and try again.');
  }
  const field = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-3 focus:ring-emerald-100';
  return <dialog ref={dialog} onCancel={onClose} aria-labelledby="expense-title" className="m-auto w-[calc(100%_-_2rem)] max-w-lg rounded-2xl p-0 shadow-2xl backdrop:bg-slate-900/40"><form onSubmit={submit} noValidate className="p-6 sm:p-8"><div className="mb-7 flex items-start justify-between"><div><span className="mb-3 inline-flex rounded-xl bg-emerald-50 p-2 text-emerald-600"><Plus size={22} /></span><h2 id="expense-title" className="text-xl font-semibold">{expense ? 'Edit expense' : 'Add an expense'}</h2><p className="mt-1 text-sm text-slate-500">The little things add up. Keep track of them.</p></div><button type="button" onClick={onClose} aria-label="Close expense form" className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button></div><div className="space-y-5"><div><label htmlFor="description" className="mb-2 block text-sm font-medium">Description</label><input id="description" autoFocus maxLength={140} placeholder="e.g. Weekly groceries" className={field} value={input.description} onChange={e => setInput({
            ...input,
            description: e.target.value
          })} aria-invalid={!!errors.description} aria-describedby={errors.description ? 'description-error' : undefined} />{errors.description && <p id="description-error" className="mt-1 text-xs text-red-600">{errors.description}</p>}</div><div className="grid grid-cols-1 gap-5 sm:grid-cols-2"><div><label htmlFor="amount" className="mb-2 block text-sm font-medium">Amount (USD)</label><input id="amount" type="number" min="0.01" step="0.01" placeholder="0.00" className={field} value={amount} onChange={e => setAmount(e.target.value)} aria-invalid={!!errors.amount} aria-describedby={errors.amount ? 'amount-error' : undefined} />{errors.amount && <p id="amount-error" className="mt-1 text-xs text-red-600">{errors.amount}</p>}</div><div><label htmlFor="date" className="mb-2 block text-sm font-medium">Date</label><input id="date" type="date" className={field} value={input.date} onChange={e => setInput({
              ...input,
              date: e.target.value
            })} aria-invalid={!!errors.date} aria-describedby={errors.date ? 'date-error' : undefined} />{errors.date && <p id="date-error" className="mt-1 text-xs text-red-600">{errors.date}</p>}</div></div><div><label htmlFor="category" className="mb-2 block text-sm font-medium">Category</label><select id="category" className={field} value={input.category} onChange={e => setInput({
            ...input,
            category: e.target.value as Category
          })}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></div>{saveError && <p role="alert" className="text-sm text-red-600">{saveError}</p>}</div><div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-5"><button type="button" onClick={onClose} className="button-secondary">Cancel</button><button type="submit" className="button-primary">{expense ? 'Save changes' : 'Add expense'}</button></div></form></dialog>;
}
