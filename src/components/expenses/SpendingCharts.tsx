import type { Expense } from '@/types/expense';
import { categoryTotals, currency, monthlySeries, sumExpenses } from '@/lib/expenses/domain';
import { categoryStyle } from './category-style';
export function SpendingCharts({
  expenses
}: {
  expenses: Expense[];
}) {
  const months = monthlySeries(expenses);
  const max = Math.max(...months.map(m => m.amount), 1);
  const categories = categoryTotals(expenses).filter(c => c.amount > 0);
  const total = sumExpenses(expenses);
  let stop = 0;
  const gradient = categories.map(c => {
    const start = stop;
    stop += c.amount / total * 100;
    return categoryStyle[c.category].color + ' ' + start + '% ' + stop + '%';
  }).join(',');
  return <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]"><section className="panel"><div className="flex flex-wrap items-start justify-between gap-2"><div><h2 className="font-semibold">Spending overview</h2><p className="mt-1 text-xs text-slate-500">A little perspective on your spending habits</p></div><span className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-500">Last 6 months</span></div><div className="mt-7 flex h-44 gap-3"><div className="flex flex-col justify-between pb-6 text-[10px] text-slate-400"><span>{currency(max)}</span><span>{currency(max / 2)}</span><span>$0</span></div><div className="relative flex flex-1 items-end justify-around gap-3 border-b border-slate-100 pb-6"><div className="pointer-events-none absolute inset-0 bottom-6 flex flex-col justify-between"><div className="border-t border-dashed border-slate-100" /><div className="border-t border-dashed border-slate-100" /><div /></div>{months.map((m, i) => <div key={m.key} className="relative flex h-full flex-1 flex-col items-center justify-end"><div role="img" aria-label={m.label + ': ' + currency(m.amount)} title={m.label + ': ' + currency(m.amount)} style={{
              height: Math.max(m.amount / max * 100, 2) + '%'
            }} className={'z-10 w-full max-w-12 rounded-t-md transition-all ' + (i === 5 ? 'bg-emerald-600' : 'bg-emerald-100 hover:bg-emerald-300')} /><span className="absolute -bottom-6 text-[11px] text-slate-500">{m.label}</span></div>)}</div></div><div className="mt-5 flex items-center gap-2 text-xs text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" />Monthly expenses<span className="ml-auto text-slate-400">All categories</span></div></section><section className="panel"><h2 className="font-semibold">Spending by category</h2><p className="mt-1 text-xs text-slate-500">Where your money goes</p><div className="mt-6 flex flex-col items-center gap-6 sm:flex-row"><div role="img" aria-label={'Spending by category. ' + categories.map(c => c.category + ': ' + currency(c.amount)).join(', ')} className="relative h-36 w-36 shrink-0 rounded-full" style={{
          background: gradient ? 'conic-gradient(' + gradient + ')' : '#e2e8f0'
        }}><div className="absolute inset-[18px] flex flex-col items-center justify-center rounded-full bg-white"><span className="text-[10px] text-slate-500">Total spending</span><span className="mt-1 text-sm font-semibold">{currency(total)}</span></div></div><ul className="w-full space-y-3">{categories.length ? categories.map(c => <li key={c.category} className="flex items-center gap-2 text-xs"><span className="h-2 w-2 shrink-0 rounded-full" style={{
              background: categoryStyle[c.category].color
            }} /><span className="text-slate-600">{c.category}</span><span className="ml-auto font-medium">{Math.round(c.amount / total * 100)}%</span></li>) : <li className="text-sm text-slate-500">Your category breakdown will appear here.</li>}</ul></div></section></div>;
}
