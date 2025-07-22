import express from 'express';

// import auth from '../../middlewares/auth'
// import { ENUM_USER_ROLE } from '../../shared/enums/user.enum'
import validateRequest from '../../middlewares/validateRequest';
import upload from '../../middlewares/upload';

import uploadFile from './upload.controller';
import { uploadFileZodSchema } from './upload.validation';
const router = express.Router();

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
