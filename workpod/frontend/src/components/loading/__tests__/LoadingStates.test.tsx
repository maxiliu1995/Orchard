import { render, screen } from '@testing-library/react';
import { LoadingSpinner, SkeletonLoader } from '../../ui/LoadingStates';

describe('LoadingStates', () => {
  it('renders loading spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('renders skeleton loader with correct count', () => {
    render(<SkeletonLoader count={3} />);
    expect(screen.getAllByTestId('skeleton-item')).toHaveLength(3);
  });
}); 