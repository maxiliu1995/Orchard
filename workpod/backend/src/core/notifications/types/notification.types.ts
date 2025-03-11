export interface NotificationData {
  userId: string;
  podId: string;
  type: string;
  startTime?: Date;
  endTime?: Date;
  message?: string;
}

export interface NotificationResponse {
  success: boolean;
  messageId: string;
}
