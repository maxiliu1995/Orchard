import { customRender, screen, waitFor } from '@/test/test-utils';
import { PodList } from '../PodList';

const mockPods = [
  { id: '1', location: 'New York', status: 'available', price: 50 },
  { id: '2', location: 'LA', status: 'available', price: 75 }
];

describe('PodList', () => {
  it('should render available pods', async () => {
    customRender(<PodList pods={mockPods} />);
    
    // Wait for pods to render
    await waitFor(() => {
      const pods = screen.getAllByTestId('pod-item');
      expect(pods).toHaveLength(2);
    });
  });

  it('should filter pods by location', () => {
    // Test location filtering
  });
}); 