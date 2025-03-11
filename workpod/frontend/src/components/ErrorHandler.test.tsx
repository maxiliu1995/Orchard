import { render, screen } from '../../test/test-utils';
import { ErrorHandler } from '../ErrorHandler';

describe('ErrorHandler', () => {
  it('should display error message', () => {
    render(<ErrorHandler error={{ message: 'Test error' }} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('should show retry button for recoverable errors', () => {
    const onRetry = jest.fn();
    render(
      <ErrorHandler 
        error={{ message: 'Network error', recoverable: true }} 
        onRetry={onRetry} 
      />
    );
    
    const retryButton = screen.getByRole('button', { name: /retry/i });
    retryButton.click();
    
    expect(onRetry).toHaveBeenCalled();
  });
}); 