import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';
import { BlogController } from './blog.controller';
import { BlogValidation } from './blog.validation';
import { createRouter } from '../../utils/typedRouter';

const router = createRouter();

router.post(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  validateRequest(BlogValidation.createBlogZodSchema),
  BlogController.createBlog
);
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SUPER_ADMIN),
  BlogController.getAllBlogs
);

export const BlogRoutes = router;
