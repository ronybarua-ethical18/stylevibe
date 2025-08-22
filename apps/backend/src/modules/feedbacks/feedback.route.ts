import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { FeedbackController } from './feedback.controller';
import { FeedbackValidation } from './feedback.validation';
import { createRouter } from '../../utils/typedRouter';

const router = createRouter();

// Create feedback - only customers can create feedback
router.post(
  '/',
  auth(ENUM_USER_ROLE.CUSTOMER),
  validateRequest(FeedbackValidation.createFeedbackZodSchema),
  FeedbackController.createFeedback
);

// Get all feedbacks - admin access
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FeedbackController.getAllFeedbacks
);

// Get feedbacks by service - public access for viewing service reviews
router.get('/service/:serviceId', FeedbackController.getFeedbacksByService);

// Get single feedback by ID - authenticated users
router.get(
  '/:feedbackId',
  auth(
    ENUM_USER_ROLE.CUSTOMER,
    ENUM_USER_ROLE.SELLER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN
  ),
  FeedbackController.getFeedbackById
);

export const FeedbackRoutes = router;
