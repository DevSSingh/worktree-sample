import type { Expense } from '@/types/expense';
function cell(value: string): string {
  const safe = /^[\s]*[=+@-]/.test(value) ? "'" + value : value;
  return '"' + safe.replace(/"/g, '""') + '"';
}
export function toCsv(expenses: Expense[]): string {
  return '\uFEFFDate,Amount (USD),Category,Description\r\n' + expenses.map(e => [cell(e.date), e.amount.toFixed(2), cell(e.category), cell(e.description)].join(',')).join('\r\n');
}
export function downloadCsv(expenses: Expense[]): void {
  const url = URL.createObjectURL(new Blob([toCsv(expenses)], {
    type: 'text/csv;charset=utf-8;'
  }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'folio-expenses.csv';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
