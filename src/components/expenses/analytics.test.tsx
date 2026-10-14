import { render, screen } from '@testing-library/react';
import { SummaryCards } from './SummaryCards';
import { SpendingCharts } from './SpendingCharts';
import { ConfirmDelete } from './ConfirmDelete';
import { demoExpenses } from '@/lib/expenses/demo';
import { fireEvent } from '@testing-library/react';
test('renders empty summaries and charts', () => {
  render(<><SummaryCards expenses={[]} /><SpendingCharts expenses={[]} /></>);
  expect(screen.getByText('No expenses')).toBeInTheDocument();
  expect(screen.getByText(/breakdown will appear/)).toBeInTheDocument();
  expect(screen.getAllByRole('img')).toHaveLength(7);
});
test('renders all categories and nonzero spending', () => {
  const expenses = demoExpenses();
  render(<><SummaryCards expenses={expenses} /><SpendingCharts expenses={expenses} /></>);
  expect(screen.getByText('16 expenses tracked')).toBeInTheDocument();
  expect(screen.getByText('Shopping')).toBeInTheDocument();
  expect(screen.getByRole('img', {
    name: /Spending by category/
  })).toHaveAttribute('style', expect.stringContaining('conic-gradient'));
});
test('confirms and cancels deletion', () => {
  const onClose = jest.fn(),
    onConfirm = jest.fn();
  render(<ConfirmDelete expense={demoExpenses()[0]} onClose={onClose} onConfirm={onConfirm} />);
  fireEvent.click(screen.getByText('Cancel'));
  fireEvent.click(screen.getByText('Delete expense'));
  fireEvent(screen.getByRole('dialog'), new Event('cancel', {
    bubbles: true
  }));
  expect(onClose).toHaveBeenCalledTimes(2);
  expect(onConfirm).toHaveBeenCalled();
});
test('shows storage errors in the confirmation dialog', () => {
  render(<ConfirmDelete expense={demoExpenses()[0]} error="Storage is full" onClose={() => {}} onConfirm={() => {}} />);
  expect(screen.getByRole('alert')).toHaveTextContent('Storage is full');
});
