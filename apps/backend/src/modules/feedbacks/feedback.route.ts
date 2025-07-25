import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { FeedbackController } from './feedback.controller';
import { FeedbackValidation } from './feedback.validation';
import { router } from '@/utils/typedRouter';

router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(FeedbackValidation.createFeedbackZodSchema),
  FeedbackController.createFeedback
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FeedbackController.getAllFeedbacks
);

export const FeedbackRoutes = router;
