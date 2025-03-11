export const mockPods = [
  {
    id: '1',
    location: 'New York',
    status: 'available',
    price: 50
  },
  {
    id: '2',
    location: 'Los Angeles',
    status: 'available',
    price: 75
  }
];

export const mockPodService = {
  getPods: jest.fn().mockResolvedValue(mockPods),
  searchPods: jest.fn().mockResolvedValue(mockPods)
};

jest.mock('@/services/pods/podService', () => ({
  podService: mockPodService
})); 