import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { SaloonServiceController } from './service.controller';
import { ServiceValidation } from './service.validation';
import { router } from '@/utils/typedRouter';

router.post(
  '/',
  auth(ENUM_USER_ROLE.SELLER),
  validateRequest(ServiceValidation.ServiceZodSchema),
  SaloonServiceController.createService
);

router.post(
  '/update-many',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  SaloonServiceController.updateManyServices
);

router.get(
  '/',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SaloonServiceController.getAllServices
);
router.get('/top', SaloonServiceController.getTopServices);

router.get(
  '/:serviceId',
  // auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SaloonServiceController.getService
);

router.patch(
  '/:serviceId',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SaloonServiceController.updateService
);

router.delete(
  '/:serviceId',
  auth(ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  SaloonServiceController.deleteService
);

export const SaloonServiceRoutes = router;
