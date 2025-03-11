import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PodAvailability } from '../PodAvailability';
import { podService } from '@/services/pods/podService';
import { mockToast } from '@/test/mocks/toast';

// Mock the services
jest.mock('@/services/pods/podService', () => ({
  podService: {
    checkAvailability: jest.fn()
  }
}));

jest.mock('@/utils/toast', () => ({
  showToast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
    dismiss: jest.fn()
  }
}));

describe('PodAvailability', () => {
  const mockProps = {
    podId: 'test-pod-id',
    startTime: new Date('2024-02-01T10:00:00'),
    endTime: new Date('2024-02-01T12:00:00'),
    onAvailable: jest.fn(),
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    mockToast.success.mockReset();
    mockToast.error.mockReset();
    // Mock the query response
    (podService.checkAvailability as jest.Mock).mockResolvedValue({ 
      isAvailable: true 
    });
  });

  const renderWithQuery = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          cacheTime: 0
        },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders loading state initially', () => {
    renderWithQuery(<PodAvailability {...mockProps} />);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('shows available status when pod is available', async () => {
    (podService.checkAvailability as jest.Mock).mockResolvedValueOnce({ isAvailable: true });

    renderWithQuery(<PodAvailability {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Available')).toBeInTheDocument();
    });
  });

  it('shows not available status when pod is unavailable', async () => {
    (podService.checkAvailability as jest.Mock).mockResolvedValueOnce({ isAvailable: false });

    renderWithQuery(<PodAvailability {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Not Available')).toBeInTheDocument();
    });
  });

  it('calls onAvailable when checking available pod', async () => {
    (podService.checkAvailability as jest.Mock).mockResolvedValueOnce({ isAvailable: true });

    renderWithQuery(<PodAvailability {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByText('Continue Booking')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Continue Booking'));

    await waitFor(() => {
      expect(mockProps.onAvailable).toHaveBeenCalled();
    });
  });
}); 