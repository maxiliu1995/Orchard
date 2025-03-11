import { render, screen } from '@testing-library/react';
import { ErrorHandler } from '../ErrorHandler';

describe('ErrorHandler', () => {
  it('renders error message', () => {
    render(<ErrorHandler error={new Error('Test error')} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
}); 