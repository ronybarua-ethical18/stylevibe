import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { BookingController } from './booking.controller';
import { BookingValidation } from './booking.validation';
import { createRouter } from '../../utils/typedRouter';

const router = createRouter();

router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(BookingValidation.createBookingZodSchema),
  BookingController.createBooking
);
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  BookingController.getAllBookings
);

router.get(
  '/:bookingId',
  auth(
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER
  ),
  BookingController.getBooking
);

router.patch(
  '/:bookingId',
  auth(ENUM_USER_ROLE.SELLER),
  BookingController.updateBooking
);
router.put(
  '/update-many',
  auth(ENUM_USER_ROLE.SELLER),
  BookingController.updateBookings
);

router.delete(
  '/:bookingId',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BookingController.deleteBooking
);

export const BookingRoutes = router;
