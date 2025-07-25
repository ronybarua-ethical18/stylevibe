import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { FAQController } from './faq.controller';
import { router } from '../../utils/typedRouter';

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FAQController.createFAQ
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  FAQController.getAllFaqs
);

export const FAQRoutes = router;
