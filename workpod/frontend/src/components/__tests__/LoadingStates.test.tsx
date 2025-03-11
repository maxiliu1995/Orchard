import { render, screen } from '@testing-library/react';
import { LoadingSpinner, SkeletonLoader } from '../ui/LoadingStates';

describe('Loading States', () => {
  it('should render loading spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should render skeleton loader with correct count', () => {
    render(<SkeletonLoader count={3} />);
    expect(screen.getAllByTestId('skeleton-item')).toHaveLength(3);
  });
}); 