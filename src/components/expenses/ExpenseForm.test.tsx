import { fireEvent, render, screen } from '@testing-library/react';
import { ExpenseForm } from './ExpenseForm';
const expense = {
  id: 'x',
  description: 'Lunch',
  amount: 12,
  category: 'Food' as const,
  date: '2026-01-01'
};
test('validates empty and malformed input then saves valid data', () => {
  const onSave = jest.fn(() => true);
  const onClose = jest.fn();
  render(<ExpenseForm onSave={onSave} onClose={onClose} />);
  fireEvent.click(screen.getByRole('button', {
    name: 'Add expense'
  }));
  expect(screen.getByText(/description between/)).toBeInTheDocument();
  expect(screen.getByText(/Enter an amount/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Description'), {
    target: {
      value: 'Dinner'
    }
  });
  fireEvent.change(screen.getByLabelText('Amount (USD)'), {
    target: {
      value: '24.50'
    }
  });
  fireEvent.change(screen.getByLabelText('Date'), {
    target: {
      value: '2026-01-02'
    }
  });
  fireEvent.change(screen.getByLabelText('Category'), {
    target: {
      value: 'Other'
    }
  });
  fireEvent.click(screen.getByRole('button', {
    name: 'Add expense'
  }));
  expect(onSave).toHaveBeenCalledWith({
    description: 'Dinner',
    amount: 24.5,
    date: '2026-01-02',
    category: 'Other'
  }, undefined);
  expect(onClose).toHaveBeenCalled();
});
test('edits an expense and shows failed storage error without closing', () => {
  const onSave = jest.fn(() => false);
  const onClose = jest.fn();
  render(<ExpenseForm expense={expense} onSave={onSave} onClose={onClose} />);
  fireEvent.click(screen.getByRole('button', {
    name: 'Save changes'
  }));
  expect(screen.getByRole('alert')).toHaveTextContent('Unable to save');
  expect(onClose).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole('button', {
    name: 'Cancel'
  }));
  expect(onClose).toHaveBeenCalled();
});
test('reports invalid date and supports close and escape', () => {
  const onClose = jest.fn();
  render(<ExpenseForm onSave={() => true} onClose={onClose} />);
  fireEvent.change(screen.getByLabelText('Date'), {
    target: {
      value: ''
    }
  });
  fireEvent.click(screen.getByRole('button', {
    name: 'Add expense'
  }));
  expect(screen.getByText('Choose a valid date.')).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText('Close expense form'));
  fireEvent(screen.getByRole('dialog'), new Event('cancel', {
    bubbles: true
  }));
  expect(onClose).toHaveBeenCalledTimes(2);
});
