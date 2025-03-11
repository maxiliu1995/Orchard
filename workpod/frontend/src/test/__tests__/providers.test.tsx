import { render, screen } from '@testing-library/react';
import { TestProviders } from '../providers';

describe('TestProviders', () => {
  it('renders children', () => {
    render(<div>Test Content</div>, { wrapper: TestProviders });
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
}); 