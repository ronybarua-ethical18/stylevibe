import upload from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import uploadFile from './upload.controller';
import { uploadFileZodSchema } from './upload.validation';
import { createRouter } from '../../utils/typedRouter';

const router = createRouter();

router.post(
  '/',
  //   auth(
  //     ENUM_USER_ROLE.SELLER,
  //     ENUM_USER_ROLE.CUSTOMER,
  //     ENUM_USER_ROLE.ADMIN,
  //     ENUM_USER_ROLE.SUPER_ADMIN,
  //   ),
  validateRequest(uploadFileZodSchema.uploadFileSchema),
  upload.single('img'),
  uploadFile
);

export const uploadRoute = router;
