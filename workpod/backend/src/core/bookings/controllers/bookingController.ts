import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/bookingService';
import { AuthenticatedRequest } from '@/shared/types/express';

export class BookingController {
  private static instance: BookingController;
  
  private constructor(private bookingService: BookingService) {
    // Bind methods
    this.createBooking = this.createBooking.bind(this);
    this.listBookings = this.listBookings.bind(this);
    this.cancelBooking = this.cancelBooking.bind(this);
    this.unlockPod = this.unlockPod.bind(this);
  }
  
  public static getInstance(): BookingController {
    if (!BookingController.instance) {
      const bookingService = BookingService.getInstance();
      BookingController.instance = new BookingController(bookingService);
    }
    return BookingController.instance;
  }

  async listBookings(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const bookings = await this.bookingService.getUserBookings(req.user!.id);
      res.json(bookings);
    } catch (error) {
      console.error('List bookings failed', { error });
      next(error);
    }
  }

  async getBookingDetails(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await this.bookingService.getBookingById(req.params.id, req.user!.id);
      res.json(booking);
    } catch (error) {
      console.error('Get booking details failed', { error, bookingId: req.params.id });
      next(error);
    }
  }

  async createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      // Add type guard to ensure user exists
      if (!req.user) {
        throw new Error('User not authenticated');
      }

      const booking = await this.bookingService.createBooking({
        userId: req.user.id,
        podId: req.body.podId,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime)
      });

      res.status(201).json({
        booking,
        clientSecret: 'test_secret'
      });
    } catch (error) {
      console.error('Create booking failed', { error });
      next(error);
    }
  }

  async modifyBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await this.bookingService.updateBooking(
        req.params.id,
        req.user!.id,
        req.body
      );
      res.json(booking);
    } catch (error) {
      console.error('Modify booking failed', { error, bookingId: req.params.id });
      next(error);
    }
  }

  async cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const booking = await this.bookingService.cancelBooking(req.params.id, req.user!.id);
      res.json(booking);
    } catch (error) {
      console.error('Cancel booking failed', { error, bookingId: req.params.id });
      next(error);
    }
  }

  async unlockPod(req: AuthenticatedRequest, res: Response) {
    try {
      console.log('Unlock pod request:', { 
        params: req.params,
        id: req.params.id,
        userId: req.user?.id 
      });

      const success = await this.bookingService.unlockPod(
        req.params.id,
        req.user?.id as string
      );

      return res.json({ success });
    } catch (error) {
      console.error('Unlock pod failed', { error, bookingId: req.params.id });
      throw error;
    }
  }

  async getBookingStatus(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const status = await this.bookingService.getPodBookingStatus(req.params.podId);
      res.json(status);
    } catch (error) {
      console.error('Get booking status failed', { error, podId: req.params.podId });
      next(error);
    }
  }
}

export const bookingController = BookingController.getInstance(); 