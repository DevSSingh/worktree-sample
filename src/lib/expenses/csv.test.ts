import { downloadCsv, toCsv } from './csv';
import type { Expense } from '@/types/expense';
const expense: Expense = {
  id: 'a',
  date: '2026-01-01',
  amount: 2.5,
  category: 'Other',
  description: 'Comma, "quote"\nnewline'
};
test('exports headers, decimal amounts and escaped multiline descriptions', () => {
  expect(toCsv([expense])).toContain('"2026-01-01",2.50,"Other","Comma, ""quote""\nnewline"');
  expect(toCsv([])).toBe('\uFEFFDate,Amount (USD),Category,Description\r\n');
});
test.each(['=SUM(A1)', '+formula', '-formula', '@formula', '  =formula'])('neutralizes spreadsheet formula %s', description => {
  expect(toCsv([{
    ...expense,
    description
  }])).toContain(String.fromCharCode(34, 39) + description + String.fromCharCode(34));
});
test('downloads and revokes a CSV URL', () => {
  URL.createObjectURL = jest.fn(() => 'blob:test');
  URL.revokeObjectURL = jest.fn();
  const click = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
  downloadCsv([expense]);
  expect(click).toHaveBeenCalled();
  expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test');
  expect(document.querySelector('a')).toBeNull();
  click.mockRestore();
});
