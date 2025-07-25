import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { ShopTimeSlotsController } from './shop_timeslots.controller';
import { ShopTimeSlotsValidation } from './shop_timeslots.validation';
import { router } from '../../utils/typedRouter';

router.post(
  '/',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(ShopTimeSlotsValidation.createShopTimeSlotsZodSchema),
  ShopTimeSlotsController.createShopTimeSlots
);
router.get(
  '/:shopId',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.CUSTOMER),
  ShopTimeSlotsController.getSingleShopTimeSlots
);

export const ShopTimeSlotRoutes = router;
