export interface CreateBookingData {
  workPodId: string;
  userId: string;
  podId: string;
  startTime: Date;
  endTime: Date;
  totalAmount?: number;
  paymentIntentId?: string;
  accessCode?: string;
  status?: string;
}

export interface BookingResponse {
  id: string;
  status: string;
  totalAmount: number;
  paymentIntentId?: string;
  accessCode?: string;
} 