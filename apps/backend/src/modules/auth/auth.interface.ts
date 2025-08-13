import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';

export type ILoginUser = {
  email: string;
  password: string;
};

export type ILoginUserResponse = {
  accessToken: string;
  refreshToken?: string;
};

export type IOAuthLoginResponse = {
  accessToken: string;
  refreshToken?: string;
  user: {
    _id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    role: string;
    img?: string;
    isOAuthUser: boolean;
    provider: string;
  };
};

export type ISignUpUserResponse = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
};

export type IRefreshTokenResponse = {
  accessToken: string;
};

export type IVerifiedLoginUser = {
  userId: string;
  role: ENUM_USER_ROLE;
};
