import { fireEvent, render, screen } from '@testing-library/react';
import { ExpenseList } from './ExpenseList';
const expense = {
  id: 'x',
  description: 'Lunch',
  amount: 12,
  category: 'Food' as const,
  date: '2026-01-01'
};
const filters = {
  search: '',
  category: '' as const,
  start: '',
  end: ''
};
test('renders expenses and invokes edit, delete and filters', () => {
  const onFilters = jest.fn(),
    onEdit = jest.fn(),
    onDelete = jest.fn();
  render(<ExpenseList expenses={[expense]} filters={filters} onFilters={onFilters} onEdit={onEdit} onDelete={onDelete} onAdd={() => {}} />);
  expect(screen.getByText('Lunch')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Edit Lunch'));
  expect(onEdit).toHaveBeenCalledWith(expense);
  fireEvent.click(screen.getByLabelText('Delete Lunch'));
  expect(onDelete).toHaveBeenCalledWith(expense);
  fireEvent.change(screen.getByLabelText('Search expenses'), {
    target: {
      value: 'foo'
    }
  });
  expect(onFilters).toHaveBeenLastCalledWith({
    ...filters,
    search: 'foo'
  });
  fireEvent.change(screen.getByLabelText('Filter category'), {
    target: {
      value: 'Bills'
    }
  });
  expect(onFilters).toHaveBeenLastCalledWith({
    ...filters,
    category: 'Bills'
  });
  fireEvent.change(screen.getByLabelText('Start date'), {
    target: {
      value: '2026-01-01'
    }
  });
  expect(onFilters).toHaveBeenLastCalledWith({
    ...filters,
    start: '2026-01-01'
  });
  fireEvent.change(screen.getByLabelText('End date'), {
    target: {
      value: '2026-02-01'
    }
  });
  expect(onFilters).toHaveBeenLastCalledWith({
    ...filters,
    end: '2026-02-01'
  });
});
test('renders empty state, invalid date range and clear filters', () => {
  const onFilters = jest.fn(),
    onAdd = jest.fn();
  render(<ExpenseList expenses={[]} filters={{
    ...filters,
    start: '2026-02-01',
    end: '2026-01-01'
  }} onFilters={onFilters} onEdit={() => {}} onDelete={() => {}} onAdd={onAdd} />);
  expect(screen.getByRole('alert')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Clear filters'));
  expect(onFilters).toHaveBeenCalledWith(filters);
  fireEvent.click(screen.getByText('Add expense'));
  expect(onAdd).toHaveBeenCalled();
});
