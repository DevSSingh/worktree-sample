import { Search, SlidersHorizontal, Pencil, Trash2, Receipt, ArrowDown } from 'lucide-react';
import { CATEGORIES, type Expense, type ExpenseFilters, type Category } from '@/types/expense';
import { currency, displayDate, sumExpenses } from '@/lib/expenses/domain';
import { categoryStyle } from './category-style';
interface Props {
  expenses: Expense[];
  filters: ExpenseFilters;
  onFilters: (filters: ExpenseFilters) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (expense: Expense) => void;
  onAdd: () => void;
  canAdd?: boolean;
}
export function ExpenseList({
  expenses,
  filters,
  onFilters,
  onEdit,
  onDelete,
  onAdd,
  canAdd = true
}: Props) {
  const field = 'rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none focus:border-emerald-500';
  const invalidRange = !!(filters.start && filters.end && filters.start > filters.end);
  return <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white"><div className="flex items-center justify-between px-5 pt-5 sm:px-6"><div><h2 className="font-semibold">Your expenses <span className="ml-2 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-500">{expenses.length}</span></h2><p className="mt-1 text-xs text-slate-500">Every transaction, all in one place.</p></div><SlidersHorizontal size={17} className="text-slate-400" /></div><div className="flex flex-wrap items-center gap-3 px-5 py-5 sm:px-6"><div className="relative min-w-48 flex-1"><Search size={16} className="absolute top-3 left-3 text-slate-400" /><input aria-label="Search expenses" className={field + ' w-full pl-9'} placeholder="Search expenses..." value={filters.search} onChange={e => onFilters({
          ...filters,
          search: e.target.value
        })} /></div><select aria-label="Filter category" className={field} value={filters.category} onChange={e => onFilters({
        ...filters,
        category: e.target.value as Category | ''
      })}><option value="">All categories</option>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select><div className="flex flex-wrap items-center gap-2"><input aria-label="Start date" type="date" className={field} value={filters.start} onChange={e => onFilters({
          ...filters,
          start: e.target.value
        })} /><span className="text-xs text-slate-400">to</span><input aria-label="End date" type="date" className={field} value={filters.end} onChange={e => onFilters({
          ...filters,
          end: e.target.value
        })} /></div>{(filters.search || filters.category || filters.start || filters.end) && <button className="text-xs font-medium text-emerald-700 hover:underline" onClick={() => onFilters({
        search: '',
        category: '',
        start: '',
        end: ''
      })}>Clear filters</button>}</div>{invalidRange && <p role="alert" className="px-6 pb-4 text-xs text-red-600">Start date must be before or equal to end date.</p>}<div className="overflow-x-auto"><table className="w-full min-w-[650px] text-left text-sm"><thead className="border-y border-slate-100 bg-slate-50/70 text-[11px] font-medium tracking-wide text-slate-500 uppercase"><tr><th className="px-6 py-3">Description</th><th className="px-4 py-3">Category</th><th className="px-4 py-3"><span className="flex items-center gap-1">Date <ArrowDown size={12} /></span></th><th className="px-4 py-3 text-right">Amount</th><th className="px-6 py-3 text-right">Actions</th></tr></thead><tbody>{expenses.map(e => {
            const style = categoryStyle[e.category];
            return <tr key={e.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60"><td className="px-6 py-4"><div className="flex items-center gap-3"><span className={'rounded-xl p-2.5 ' + style.className}><style.icon size={17} /></span><span className="max-w-64 truncate font-medium" title={e.description}>{e.description}</span></div></td><td className="px-4 py-4"><span className={'rounded-md px-2.5 py-1 text-[11px] font-medium ' + style.className}>{e.category}</span></td><td className="px-4 py-4 text-xs text-slate-500">{displayDate(e.date)}</td><td className="px-4 py-4 text-right font-semibold">{currency(e.amount)}</td><td className="px-6 py-4"><div className="flex justify-end gap-1"><button onClick={() => onEdit(e)} aria-label={'Edit ' + e.description} className="rounded-md p-2 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700"><Pencil size={15} /></button><button onClick={() => onDelete(e)} aria-label={'Delete ' + e.description} className="rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={15} /></button></div></td></tr>;
          })}</tbody></table></div>{!expenses.length && <div className="flex flex-col items-center px-6 py-12 text-center"><span className="mb-3 rounded-2xl bg-emerald-50 p-4 text-emerald-600"><Receipt size={28} /></span><h3 className="font-semibold">No expenses here yet</h3><p className="mt-2 text-sm text-slate-500">Add an expense or adjust your filters to see your transactions.</p><button disabled={!canAdd} onClick={onAdd} className="button-primary mt-5">Add expense</button></div>}<div className="flex justify-between border-t border-slate-100 px-6 py-4 text-xs text-slate-500"><span>Showing {expenses.length} expenses</span><span>Filtered total <strong className="ml-2 text-slate-800">{currency(sumExpenses(expenses))}</strong></span></div></section>;
}
