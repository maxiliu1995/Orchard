import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { authMiddleware } from '@/shared/middleware/auth';

const router = Router();

router.use(authMiddleware);

// Booking routes
router.post('/', bookingController.createBooking.bind(bookingController));
router.get('/', bookingController.listBookings.bind(bookingController));
router.get('/:id', bookingController.getBookingDetails.bind(bookingController));
router.patch('/:id', bookingController.modifyBooking.bind(bookingController));
router.delete('/:id', bookingController.cancelBooking.bind(bookingController));

// Pod access
router.post('/:id/unlock', bookingController.unlockPod.bind(bookingController));
router.get('/pod/:podId/status', bookingController.getBookingStatus.bind(bookingController));

export { router as bookingRouter }; 