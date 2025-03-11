import { customRender, screen, fireEvent, waitFor } from '@/test/test-utils';
import { PodSearch } from '../PodSearch';
import { useSearchPodsQuery, useGetPodAvailabilityQuery } from '@/store/api/pods';

// Mock all RTK Query hooks
jest.mock('@/store/api/pods', () => ({
  useSearchPodsQuery: jest.fn(),
  useCreateBookingMutation: jest.fn().mockReturnValue([jest.fn(), {}]),
  useGetPodAvailabilityQuery: jest.fn().mockReturnValue({
    data: { available: true, nextAvailable: null },
    isLoading: false
  })
}));

describe('PodSearch', () => {
  beforeEach(() => {
    // Reset and setup mocks
    (useSearchPodsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false
    });
    
    // Reset availability mock
    (useGetPodAvailabilityQuery as jest.Mock).mockReturnValue({
      data: { available: true, nextAvailable: null },
      isLoading: false
    });
  });

  it('should filter pods by location', async () => {
    const mockPods = [
      { 
        id: '1', 
        location: 'New York', 
        status: 'available',
        name: 'Pod 1',
        hourlyRate: 50,
        address: '123 Main St'
      }
    ];
    
    (useSearchPodsQuery as jest.Mock).mockReturnValue({
      data: mockPods,
      isLoading: false
    });

    customRender(<PodSearch />);
    
    const searchInput = screen.getByTestId('location-search-input');
    fireEvent.change(searchInput, { target: { value: 'New York' } });
    
    await waitFor(() => {
      const filteredPods = screen.getAllByTestId('pod-item');
      expect(filteredPods).toHaveLength(1);
    });
  });

  it('should show no results message', async () => {
    (useSearchPodsQuery as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false
    });

    customRender(<PodSearch />);
    
    const searchInput = screen.getByTestId('location-search-input');
    fireEvent.change(searchInput, { target: { value: 'NonexistentLocation' } });
    
    await waitFor(() => {
      expect(screen.getByText('No pods found')).toBeInTheDocument();
    });
  });

  it('should check the actual rendered markup', () => {
    customRender(<PodSearch />);
    screen.debug();
  });
}); 