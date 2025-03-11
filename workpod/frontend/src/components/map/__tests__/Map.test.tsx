import { customRender, screen } from '@/test/test-utils';
import { Map } from '../Map';

describe('Map', () => {
  it('should render map with pod locations', () => {
    customRender(<Map pods={[
      { id: '1', location: { lat: 40.7128, lng: -74.0060 }, status: 'available' }
    ]} />);
    
    expect(screen.getByTestId('map')).toBeInTheDocument();
  });

  it('should handle pod selection', () => {
    // Test pod marker click
  });
}); 