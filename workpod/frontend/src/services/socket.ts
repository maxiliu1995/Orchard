import { Socket } from 'socket.io-client';

export const SocketService = {
  joinPodRoom(socket: Socket, podId: string) {
    socket.emit('join-pod', podId);
  },

  leavePodRoom(socket: Socket, podId: string) {
    socket.emit('leave-pod', podId);
  },

  joinBookingRoom(socket: Socket, bookingId: string) {
    socket.emit('join-booking', bookingId);
  },

  leaveBookingRoom(socket: Socket, bookingId: string) {
    socket.emit('leave-booking', bookingId);
  },

  emitPodAction(socket: Socket, podId: string, action: string, data?: any) {
    socket.emit('pod:action', { podId, action, data });
  },

  emitBookingUpdate(socket: Socket, bookingId: string, status: string) {
    socket.emit('booking:update', { bookingId, status });
  },
}; 