import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { CustomerController } from './customer.controller';
import { createRouter } from '../../utils/typedRouter';

const router = createRouter();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.SUPER_ADMIN),
  CustomerController.getAllCustomers
);

export const CustomerRoutes = router;
