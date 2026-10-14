import { Wallet, CalendarDays, TrendingUp, Layers, ArrowUpRight } from 'lucide-react';
import { currency, summarize } from '@/lib/expenses/domain';
import type { Expense } from '@/types/expense';
export function SummaryCards({
  expenses
}: {
  expenses: Expense[];
}) {
  const s = summarize(expenses);
  const cards = [{
    label: 'Total spending',
    value: currency(s.total),
    detail: s.count + ' expenses tracked',
    icon: Wallet
  }, {
    label: 'This month',
    value: currency(s.monthly),
    detail: 'Your current month spending',
    icon: CalendarDays
  }, {
    label: 'Average expense',
    value: currency(s.average),
    detail: 'Across all your transactions',
    icon: TrendingUp
  }, {
    label: 'Top category',
    value: s.top?.category ?? 'No expenses',
    detail: s.top ? currency(s.top.amount) + ' spent in total' : 'Add an expense to get started',
    icon: Layers
  }];
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">{cards.map((c, i) => <article key={c.label} className={'rounded-2xl border p-5 ' + (i === 0 ? 'border-emerald-800 bg-emerald-900 text-white' : 'border-slate-200/80 bg-white')}><div className="flex items-center justify-between"><span className={'text-sm font-medium ' + (i === 0 ? 'text-emerald-100' : 'text-slate-500')}>{c.label}</span><c.icon size={18} className={i === 0 ? 'text-emerald-200' : 'text-slate-400'} /></div><p className="mt-5 text-[28px] font-semibold tracking-tight">{c.value}</p><div className={'mt-3 flex items-center gap-1.5 text-xs ' + (i === 0 ? 'text-emerald-200' : 'text-slate-500')}><ArrowUpRight size={14} />{c.detail}</div></article>)}</div>;
}
