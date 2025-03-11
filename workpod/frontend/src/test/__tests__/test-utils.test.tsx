import { render, screen } from '../test-utils';
import { TestProviders } from '../providers';
import { useState, useEffect } from 'react';

describe('test-utils', () => {
  it('should render with providers', () => {
    const TestComponent = () => <div>Test</div>;
    
    render(<TestComponent />);
    
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('should handle async operations', async () => {
    const AsyncComponent = () => {
      const [text, setText] = useState('Loading');
      
      useEffect(() => {
        setTimeout(() => setText('Loaded'), 0);
      }, []);
      
      return <div>{text}</div>;
    };

    render(<AsyncComponent />);
    
    expect(screen.getByText('Loading')).toBeInTheDocument();
    await screen.findByText('Loaded');
  });
}); 