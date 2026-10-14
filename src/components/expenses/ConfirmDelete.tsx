import { useEffect, useRef } from 'react';
import { Trash2 } from 'lucide-react';
import type { Expense } from '@/types/expense';
export function ConfirmDelete({
  expense,
  onClose,
  onConfirm,
  error
}: {
  error?: string;
  expense: Expense;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = ref.current;
    el?.showModal();
    return () => el?.close();
  }, []);
  return <dialog ref={ref} onCancel={onClose} aria-labelledby="delete-title" className="m-auto w-[calc(100%_-_2rem)] max-w-sm rounded-2xl p-6 shadow-2xl backdrop:bg-slate-900/40"><span className="inline-flex rounded-xl bg-red-50 p-3 text-red-600"><Trash2 size={22} /></span><h2 id="delete-title" className="mt-4 text-lg font-semibold">Delete this expense?</h2><p className="mt-2 text-sm text-slate-500">“{expense.description}” will be permanently removed.</p>{error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="button-secondary" autoFocus>Cancel</button><button onClick={onConfirm} className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700">Delete expense</button></div></dialog>;
}
