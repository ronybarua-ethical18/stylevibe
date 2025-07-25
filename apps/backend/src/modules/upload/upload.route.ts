import upload from '../../middlewares/upload';
import validateRequest from '../../middlewares/validateRequest';
import uploadFile from './upload.controller';
import { uploadFileZodSchema } from './upload.validation';
import { router } from '../../utils/typedRouter';

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
