export * from './mapService';

export const mapService = {
  async geocodeAddress(address: string) {
    // Mock implementation for tests
    return {
      latitude: 51.5074,
      longitude: -0.1278
    };
  },

  async calculateDistance(origin: { lat: number; lng: number }, destination: { lat: number; lng: number }) {
    // Mock implementation for tests
    return 1000; // meters
  }
}; 