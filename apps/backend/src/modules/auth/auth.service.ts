import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';

import config from '../../config';
import ApiError from '../../errors/ApiError';
import { jwtHelpers } from '../../helpers/jwtHelpers';
import {
  FORGOT_PASSWORD_TEMPLATE,
  VERIFY_EMAIL_TEMPLATE,
} from '../../services/mail/constants';
import { sendMailWithToken } from '../../utils/auth.utils';
import { IUser } from '../user/user.interface';
import { UserModel } from '../user/user.model';

import {
  ILoginUser,
  ILoginUserResponse,
  IOAuthLoginResponse,
  IRefreshTokenResponse,
  ISignUpUserResponse,
} from './auth.interface';
import { ENUM_USER_ROLE } from '../../shared/enums/user.enum';

const signUpUser = async (
  payload: ILoginUser
): Promise<ISignUpUserResponse> => {
  const { email } = payload;

  const user = await UserModel.isEmailTaken(email);

  if (user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User already exist');
  }

  const newUser = await UserModel.create(payload);

  sendMailWithToken(
    newUser,
    'StyleVibe - Verify your e-mail',
    'verify-email',
    VERIFY_EMAIL_TEMPLATE
  );

  return newUser;
};

const loginUser = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { email, password } = payload;

  const user = (await UserModel.findOne({ email: email })) || null;

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }

  // Check if user is OAuth user trying to login with credentials
  if (user.isOAuthUser) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `This account was created with ${user.provider}. Please sign in with ${user.provider}.`
    );
  }

  if (!user.isVerified) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User is not verified yet');
  }

  const isPasswordMatched = await UserModel.isPasswordMatched(
    password,
    user.password!
  );

  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  const tokenPayload = {
    userId: user?._id,
    role: user?.role,
    firstName: user?.firstName,
    lastName: user?.lastName,
  };

  const accessToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.secret as string,
    Number(config.jwt.expires_in)
  );

  // create refresh token
  const refreshToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.refresh_secret as string,
    Number(config.jwt.refresh_expires_in)
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as string
    );

    const { userId } = verifiedToken;

    const user = await UserModel.findById({ _id: userId });
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
    }

    const newAccessToken = jwtHelpers.createToken(
      {
        id: user._id,
        role: user.role,
      },
      config.jwt.secret as string,
      Number(config.jwt.expires_in)
    );

    return {
      accessToken: newAccessToken,
    };
  } catch {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
};

const verifyEmail = async (token: string): Promise<void> => {
  const { userId } = jwtHelpers.verifyToken(token, config.jwt.secret as string);

  const user = await UserModel.findById({ _id: userId });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  await UserModel.findByIdAndUpdate(user._id, {
    isVerified: true,
  });
};

const forgotPassword = async (email: string): Promise<IUser> => {
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  sendMailWithToken(
    user,
    'StyleVibe - Password Reset',
    'reset-password',
    FORGOT_PASSWORD_TEMPLATE
  );

  return user;
};

const resetPassword = async (payload: {
  token: string;
  newPassword: string;
}): Promise<void> => {
  const { userId } = await jwtHelpers.verifyToken(
    payload.token,
    config.jwt.secret as string
  );
  const user = await UserModel.findById({ _id: userId });
  if (!user) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const hash = await bcrypt.hash(
    payload.newPassword,
    Number(config.bcrypt_salt_rounds)
  );
  await UserModel.findByIdAndUpdate(user._id, {
    password: hash,
  });
};

// New method for OAuth login/registration
const oauthLogin = async (payload: {
  email: string;
  firstName?: string;
  lastName?: string;
  provider: 'google';
  providerId: string;
  img?: string;
}): Promise<IOAuthLoginResponse> => {
  const { email, firstName, lastName, provider, providerId, img } = payload;

  // Check if user already exists
  let user = await UserModel.findOne({
    $or: [{ email: email }, { providerId: providerId, provider: provider }],
  });

  if (user) {
    // User exists, update their info if needed
    if (!user.isOAuthUser || user.provider !== provider) {
      user = await UserModel.findByIdAndUpdate(
        user._id,
        {
          provider: provider,
          providerId: providerId,
          isOAuthUser: true,
          isVerified: true, // OAuth users are automatically verified
          firstName: firstName || user.firstName,
          lastName: lastName || user.lastName,
          img: img || user.img,
        },
        { new: true }
      );
    }
  } else {
    // Create new OAuth user
    user = await UserModel.create({
      email,
      firstName,
      lastName,
      provider,
      providerId,
      isOAuthUser: true,
      isVerified: true,
      role: ENUM_USER_ROLE.GUEST, // Default role
      img,
      // No password needed for OAuth users
    });
  }

  if (!user) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to create/update user'
    );
  }

  // Generate tokens
  const tokenPayload = {
    userId: user._id,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
  };

  const accessToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.secret as string,
    Number(config.jwt.expires_in)
  );

  const refreshToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.refresh_secret as string,
    Number(config.jwt.refresh_expires_in)
  );

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      img: user.img,
      isOAuthUser: user.isOAuthUser,
      provider: user.provider,
    },
  };
};

export const AuthService = {
  loginUser,
  refreshToken,
  signUpUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  oauthLogin, // Add new method
};
