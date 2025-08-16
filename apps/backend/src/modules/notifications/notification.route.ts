import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import auth from '../../middlewares/auth';
import { NotificationController } from './notification.controller';
import { createRouter } from '../../utils/typedRouter';

const router = createRouter();

router.use(
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN)
);

router.get('/', NotificationController.getNotifications);
router.patch('/:id/read', NotificationController.markAsRead);
router.patch('/mark-all-read', NotificationController.markAllAsRead);

export const NotificationRoutes = router;
