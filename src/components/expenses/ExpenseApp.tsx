'use client';

import { useState, useEffect } from 'react';
import { LayoutDashboard, ArrowLeftRight, ChartNoAxesCombined, Wallet, Plus, Download, ArrowUpRight, ShieldCheck, Sparkles, CheckCircle2, X, Menu, ChevronRight } from 'lucide-react';
import { useExpenses } from '@/lib/expenses/use-expenses';
import { filterExpenses } from '@/lib/expenses/domain';
import { downloadCsv } from '@/lib/expenses/csv';
import { demoExpenses } from '@/lib/expenses/demo';
import type { Expense, ExpenseFilters } from '@/types/expense';
import { SummaryCards } from './SummaryCards';
import { SpendingCharts } from './SpendingCharts';
import { ExpenseList } from './ExpenseList';
import { ExpenseForm } from './ExpenseForm';
import { ConfirmDelete } from './ConfirmDelete';
type View = 'Overview' | 'Expenses' | 'Insights';
export function ExpenseApp() {
  const data = useExpenses();
  const [view, setView] = useState<View>('Overview');
  const [menu, setMenu] = useState(false);
  const [form, setForm] = useState<{
    expense?: Expense;
  } | null>(null);
  const [deleting, setDeleting] = useState<Expense | null>(null);
  const [notice, setNotice] = useState('');
  const [filters, setFilters] = useState<ExpenseFilters>({
    search: '',
    category: '',
    start: '',
    end: ''
  });
  const visible = filterExpenses(data.expenses, filters);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(''), 4500);
    return () => clearTimeout(timer);
  }, [notice]);
  function exportExpenses() {
    try {
      downloadCsv(visible);
      setNotice('Your CSV export is ready.');
    } catch {
      setNotice('Export failed. Please try again.');
    }
  }
  const nav = [{
    label: 'Overview' as const,
    icon: LayoutDashboard
  }, {
    label: 'Expenses' as const,
    icon: ArrowLeftRight
  }, {
    label: 'Insights' as const,
    icon: ChartNoAxesCombined
  }];
  return <div className="min-h-screen bg-[#f7f9fb] text-slate-800"><aside className={'fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-slate-200/70 bg-white px-5 py-7 transition-transform lg:translate-x-0 ' + (menu ? 'translate-x-0' : '-translate-x-full')}><a href="/" className="flex items-center gap-2.5 px-2 text-2xl font-bold tracking-tight"><span className="rounded-xl bg-emerald-700 p-2 text-white"><Wallet size={23} /></span>folio<span className="text-emerald-600">.</span></a><p className="mt-10 px-3 text-[10px] font-semibold tracking-[0.15em] text-slate-400 uppercase">Workspace</p><nav aria-label="Main navigation" className="mt-3 space-y-1.5">{nav.map(n => <button key={n.label} onClick={() => {
          setView(n.label);
          setMenu(false);
        }} aria-current={view === n.label ? 'page' : undefined} className={'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium ' + (view === n.label ? 'bg-emerald-50 text-emerald-800' : 'text-slate-500 hover:bg-slate-50')}><n.icon size={18} />{n.label}{view === n.label && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-600" />}</button>)}</nav><div className="mt-auto rounded-xl border border-emerald-100 bg-emerald-50/60 p-4"><ShieldCheck size={22} className="text-emerald-600" /><h3 className="mt-3 text-xs font-semibold">Your finances. Your space.</h3><p className="mt-2 text-[11px] leading-relaxed text-slate-500">Your expenses stay in this browser. Export a CSV to keep a backup.</p><div className="mt-3 flex items-center gap-1 text-[10px] font-medium text-emerald-700">Private by design <ArrowUpRight size={12} /></div></div><div className="mt-5 flex items-center gap-3 border-t border-slate-100 px-2 pt-5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">ME</span><div><p className="text-xs font-semibold">Personal workspace</p><p className="mt-0.5 text-[10px] text-slate-400">Make every dollar count</p></div></div></aside>{menu && <button aria-label="Close navigation" onClick={() => setMenu(false)} className="fixed inset-0 z-20 bg-slate-900/30 lg:hidden" />}<div className="lg:ml-60"><header className="flex h-20 items-center justify-between border-b border-slate-200/70 bg-white px-5 sm:px-8"><div className="flex items-center gap-3 text-xs text-slate-400"><button aria-label="Open navigation" onClick={() => setMenu(true)} className="rounded-lg p-1 text-slate-600 lg:hidden"><Menu size={22} /></button><span className="hidden sm:inline">Workspace</span><ChevronRight size={13} className="hidden sm:inline" /><span className="font-medium text-slate-700">{view}</span></div><span className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-[11px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Personal finance tracker</span></header><main className="mx-auto max-w-[1450px] space-y-6 px-5 py-8 sm:px-8"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center"><div><div className="mb-2 flex items-center gap-2 text-[11px] font-medium tracking-wide text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />A CLEARER PICTURE OF YOUR FINANCES</div><h1 className="text-3xl font-semibold tracking-tight">{view === 'Overview' ? 'Your money, at a glance.' : view === 'Expenses' ? 'Every expense, organized.' : 'Small details. Big insights.'}</h1><p className="mt-2 text-sm text-slate-500">{view === 'Overview' ? 'Track your spending. Find your balance. Feel in control.' : view === 'Expenses' ? 'Keep track of where your money goes, one transaction at a time.' : 'Understand your habits and make room for what matters.'}</p></div><div className="flex shrink-0 gap-3"><button onClick={exportExpenses} disabled={!data.ready || !visible.length} className="button-secondary"><Download size={16} />Export CSV</button><button onClick={() => setForm({})} disabled={!data.ready || !data.available} className="button-primary"><Plus size={17} />Add expense</button></div></div>{data.error && <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{data.error}</div>}{!data.ready ? <div role="status" className="grid animate-pulse gap-4 sm:grid-cols-4">{[0, 1, 2, 3].map(i => <div key={i} className="h-36 rounded-2xl bg-slate-200" />)}<span className="sr-only">Loading expenses</span></div> : <>{view !== 'Expenses' && <SummaryCards expenses={data.expenses} />} {!data.expenses.length && data.available && <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 sm:flex-row sm:items-center"><div className="flex gap-3"><Sparkles size={21} className="mt-1 shrink-0 text-emerald-600" /><div><h2 className="text-sm font-semibold">A fresh start for your finances</h2><p className="mt-1 text-xs text-slate-500">Add your first expense, or explore the dashboard with sample data.</p></div></div><button className="button-secondary shrink-0" onClick={() => {
              if (data.replace(demoExpenses())) setNotice('Sample expenses added. You can edit or delete them.');
            }}>Try sample data <ArrowUpRight size={14} /></button></div>}{view !== 'Expenses' && <SpendingCharts expenses={data.expenses} />} {view !== 'Insights' && <ExpenseList expenses={visible} filters={filters} onFilters={setFilters} onEdit={expense => setForm({
            expense
          })} onDelete={setDeleting} canAdd={data.available} onAdd={() => setForm({})} />} {view === 'Insights' && <div className="panel"><h2 className="font-semibold">Make your spending work for you</h2><p className="mt-2 text-sm leading-relaxed text-slate-500">Use your category breakdown to identify your biggest expenses. Compare the last six months to spot changes in your spending. All insights are calculated from your saved expenses.</p></div>}</>}<footer className="flex flex-wrap justify-between gap-2 pb-2 text-[10px] text-slate-400"><span>Made for a little more financial peace of mind.</span><span>All amounts in USD · Stored locally in your browser</span></footer></main></div>{form && <ExpenseForm expense={form.expense} onClose={() => setForm(null)} onSave={(input, id) => {
      const success = data.save(input, id);
      if (success) setNotice(id ? 'Expense updated.' : 'Expense added.');
      return success;
    }} />}{deleting && <ConfirmDelete error={data.error} expense={deleting} onClose={() => setDeleting(null)} onConfirm={() => {
      if (data.remove(deleting.id)) {
        setDeleting(null);
        setNotice('Expense deleted.');
      }
    }} />} {notice && <div role="status" className="fixed right-4 bottom-5 z-50 flex max-w-[calc(100%_-_2rem)] items-center gap-3 rounded-xl border border-emerald-100 bg-white px-5 py-4 text-sm shadow-lg"><CheckCircle2 size={19} className="shrink-0 text-emerald-600" />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')} className="ml-2 text-slate-400"><X size={16} /></button></div>}</div>;
}
