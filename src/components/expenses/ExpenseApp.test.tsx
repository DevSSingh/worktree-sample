import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ExpenseApp } from './ExpenseApp';
import { STORAGE_KEY } from '@/lib/expenses/storage';
import { downloadCsv } from '@/lib/expenses/csv';
import { demoExpenses } from '@/lib/expenses/demo';
jest.mock('@/lib/expenses/csv', () => ({
  downloadCsv: jest.fn()
}));
beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});
test('loads sample data, navigates, edits, deletes and exports filtered data', async () => {
  render(<ExpenseApp />);
  expect(screen.getByText('Loading expenses')).toBeInTheDocument();
  await waitFor(() => expect(screen.getByText(/Try sample data/)).toBeInTheDocument());
  fireEvent.click(screen.getByText(/Try sample data/));
  expect(screen.getByText('Sample expenses added. You can edit or delete them.')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Dismiss notification'));
  fireEvent.click(screen.getByRole('button', {
    name: 'Insights'
  }));
  expect(screen.getByText('Small details. Big insights.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {
    name: 'Expenses'
  }));
  fireEvent.change(screen.getByLabelText('Search expenses'), {
    target: {
      value: 'groceries'
    }
  });
  fireEvent.click(screen.getByRole('button', {
    name: 'Export CSV'
  }));
  expect(downloadCsv).toHaveBeenCalledWith(expect.arrayContaining([expect.objectContaining({
    description: 'Weekly groceries'
  })]));
  fireEvent.click(screen.getByLabelText('Edit Weekly groceries'));
  fireEvent.change(screen.getByLabelText('Description'), {
    target: {
      value: 'Fresh groceries'
    }
  });
  fireEvent.click(screen.getByRole('button', {
    name: 'Save changes'
  }));
  expect(screen.getByText('Expense updated.')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Clear filters'));
  fireEvent.click(screen.getByLabelText('Delete Fresh groceries'));
  fireEvent.click(screen.getByText('Delete expense'));
  expect(screen.getByText('Expense deleted.')).toBeInTheDocument();
  expect(screen.queryByText('Fresh groceries')).not.toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Open navigation'));
  fireEvent.click(screen.getByLabelText('Close navigation'));
  fireEvent.click(screen.getByRole('button', {
    name: 'Overview'
  }));
  expect(screen.getByText('Your money, at a glance.')).toBeInTheDocument();
});
test('adds an expense, cancels forms and handles failed CSV exports', async () => {
  Object.defineProperty(crypto, 'randomUUID', {
    value: () => 'x',
    configurable: true
  });
  render(<ExpenseApp />);
  await waitFor(() => expect(screen.getAllByRole('button', {
    name: 'Add expense',
    exact: true
  })[0]).toBeEnabled());
  fireEvent.click(screen.getAllByRole('button', {
    name: 'Add expense',
    exact: true
  })[0]);
  fireEvent.click(screen.getByText('Cancel'));
  fireEvent.click(screen.getAllByRole('button', {
    name: 'Add expense',
    exact: true
  })[1]);
  fireEvent.change(screen.getByLabelText('Description'), {
    target: {
      value: 'Test lunch'
    }
  });
  fireEvent.change(screen.getByLabelText('Amount (USD)'), {
    target: {
      value: '20'
    }
  });
  fireEvent.click(screen.getAllByRole('button', {
    name: 'Add expense',
    exact: true
  }).at(-1)!);
  expect(screen.getByText('Expense added.')).toBeInTheDocument();
  expect(localStorage.getItem(STORAGE_KEY)).toContain('Test lunch');
  jest.mocked(downloadCsv).mockImplementationOnce(() => {
    throw Error('export');
  });
  fireEvent.click(screen.getByRole('button', {
    name: 'Export CSV'
  }));
  expect(screen.getByText('Export failed. Please try again.')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Delete Test lunch'));
  fireEvent.click(screen.getByText('Cancel'));
  expect(screen.getByText('Test lunch')).toBeInTheDocument();
});
test('reports corrupt storage and disables writes', async () => {
  localStorage.setItem(STORAGE_KEY, '{');
  render(<ExpenseApp />);
  await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent('preserved'));
  expect(screen.getAllByRole('button', {
    name: 'Add expense',
    exact: true
  })[0]).toBeDisabled();
  expect(localStorage.getItem(STORAGE_KEY)).toBe('{');
});
test('expires feedback notifications', async () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoExpenses()));
  render(<ExpenseApp />);
  await waitFor(() => expect(screen.getByRole('button', {
    name: 'Export CSV'
  })).toBeEnabled());
  jest.useFakeTimers();
  fireEvent.click(screen.getByRole('button', {
    name: 'Export CSV'
  }));
  expect(screen.getByText('Your CSV export is ready.')).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(4500));
  expect(screen.queryByText('Your CSV export is ready.')).not.toBeInTheDocument();
  jest.useRealTimers();
});
test('reports storage failures for sample, save and deletion without losing expenses', async () => {
  const writeSpy = jest.spyOn(Storage.prototype, 'setItem');
  render(<ExpenseApp />);
  await waitFor(() => expect(screen.getByText(/Try sample data/)).toBeInTheDocument());
  writeSpy.mockImplementationOnce(() => {
    throw Error('full');
  });
  fireEvent.click(screen.getByText(/Try sample data/));
  expect(screen.getByRole('alert')).toHaveTextContent('could not be saved');
  fireEvent.click(screen.getByText(/Try sample data/));
  expect(screen.getByText('Weekly groceries')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Edit Weekly groceries'));
  writeSpy.mockImplementationOnce(() => {
    throw Error('full');
  });
  fireEvent.click(screen.getByText('Save changes'));
  expect(screen.getByText(/Unable to save/)).toBeInTheDocument();
  fireEvent.click(screen.getByText('Cancel'));
  fireEvent.click(screen.getByLabelText('Delete Weekly groceries'));
  writeSpy.mockImplementationOnce(() => {
    throw Error('full');
  });
  fireEvent.click(screen.getByText('Delete expense'));
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Weekly groceries')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Cancel'));
  writeSpy.mockRestore();
});
