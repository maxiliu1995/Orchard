export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string;
  workPodId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  totalAmount: number;
  paymentIntentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookingCreateInput {
  podId: string;
  startTime: string;
  endTime: string;
}

export interface BookingResponse {
  booking: Booking;
  clientSecret: string;
} 