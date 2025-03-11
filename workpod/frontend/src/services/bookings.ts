import { BookingCreateInput, BookingResponse } from '@/types/booking';

export async function createBooking(input: BookingCreateInput): Promise<BookingResponse> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pods/book`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    throw new Error('Failed to create booking');
  }

  return response.json();
} 