import { API_BASE_URL } from '@/lib/api/config';
import { debugLog } from '@/utils/debug';
import { BookingCreateInput, BookingResponse, Booking } from '@/types/booking';

class BookingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BookingError';
  }
}

export const bookingService = {
  async createBooking(input: BookingCreateInput): Promise<BookingResponse> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new BookingError('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/pods/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(input)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new BookingError(error.error || 'Failed to create booking');
      }

      const data = await response.json();
      debugLog('booking', 'Booking created successfully', data);
      return data;
    } catch (error) {
      debugLog('booking', 'Failed to create booking', error);
      throw error instanceof BookingError ? error : new BookingError('An unexpected error occurred');
    }
  },

  async getBookingStatus(bookingId: string): Promise<Booking> {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new BookingError('Not authenticated');

      const response = await fetch(`${API_BASE_URL}/api/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new BookingError('Failed to fetch booking status');
      }

      return await response.json();
    } catch (error) {
      debugLog('booking', 'Failed to fetch booking status', error);
      throw error instanceof BookingError ? error : new BookingError('An unexpected error occurred');
    }
  }
}; 