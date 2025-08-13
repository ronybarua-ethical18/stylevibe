import auth from '../../middlewares/auth';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { UserController } from './user.controller';
import { createRouter } from '../../utils/typedRouter';
const router = createRouter();

router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.getAllUsers
);

// Add route for updating user role (for OAuth users)
router.patch(
  '/update-role',
  auth(ENUM_USER_ROLE.CUSTOMER, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.GUEST),
  UserController.updateUserRole
);
router.get(
  '/:userId',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
    ENUM_USER_ROLE.SELLER
  ),
  UserController.getUser
);
router.patch(
  '/:userId',
  auth(
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
    ENUM_USER_ROLE.SELLER
  ),
  UserController.updateUser
);

router.delete(
  '/:userId',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  UserController.deleteUser
);

export const UserRoutes = router;
