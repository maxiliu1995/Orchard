import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DateTimeRangePicker } from '@/components/ui/DateTimeRangePicker';
import { showToast } from '@/utils/toast';

jest.mock('@/utils/toast');

describe('DateTimeRangePicker', () => {
  const mockOnSelect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all form elements', () => {
    render(<DateTimeRangePicker onSelect={mockOnSelect} />);

    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/time/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/duration/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check availability/i })).toBeInTheDocument();
  });

  it('validates past dates', async () => {
    render(<DateTimeRangePicker onSelect={mockOnSelect} />);

    const dateInput = screen.getByLabelText(/date/i);
    const timeInput = screen.getByLabelText(/time/i);
    const submitButton = screen.getByRole('button', { name: /check availability/i });

    fireEvent.change(dateInput, { target: { value: '2020-01-01' } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith('error', 'Start time must be in the future');
    });
  });

  it('validates maximum duration', async () => {
    render(<DateTimeRangePicker onSelect={mockOnSelect} maxHours={4} />);

    const dateInput = screen.getByLabelText(/date/i);
    const timeInput = screen.getByLabelText(/time/i);
    const durationSelect = screen.getByLabelText(/duration/i);
    const submitButton = screen.getByRole('button', { name: /check availability/i });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });
    fireEvent.change(durationSelect, { target: { value: '5' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(showToast).toHaveBeenCalledWith('error', 'Maximum booking duration is 4 hours');
    });
  });

  it('calls onSelect with valid dates', async () => {
    render(<DateTimeRangePicker onSelect={mockOnSelect} />);

    const dateInput = screen.getByLabelText(/date/i);
    const timeInput = screen.getByLabelText(/time/i);
    const durationSelect = screen.getByLabelText(/duration/i);
    const submitButton = screen.getByRole('button', { name: /check availability/i });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    fireEvent.change(dateInput, { target: { value: tomorrow.toISOString().split('T')[0] } });
    fireEvent.change(timeInput, { target: { value: '10:00' } });
    fireEvent.change(durationSelect, { target: { value: '2' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSelect).toHaveBeenCalled();
    });
  });
}); 