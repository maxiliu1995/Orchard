export class BookingService {
  private static instance: BookingService;
  
  public static getInstance(): BookingService {
    if (!BookingService.instance) {
      BookingService.instance = new BookingService();
    }
    return BookingService.instance;
  }
  
  // Add test methods
  async getUserBookings() { return []; }
  async createBooking() { return {}; }
  async cancelBooking() { return {}; }
  // ... other methods needed by tests
} 