/* eslint-disable @typescript-eslint/no-this-alias */
import bcrypt from 'bcryptjs';
import { Schema, model } from 'mongoose';

import config from '../../config';

import { IUser, IUserModel } from './user.interface';

const UserSchema = new Schema<IUser, IUserModel>(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    role: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: String,
      required: false, // Changed to false for OAuth users
      unique: true,
      sparse: true, // Allow multiple null values
    },
    address: {
      type: String,
    },
    bio: {
      type: String,
    },
    password: {
      type: String,
      required: false, // Changed to false for OAuth users
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
    },
    // New OAuth fields
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    providerId: {
      type: String,
      sparse: true,
    },
    isOAuthUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.statics.isEmailTaken = async function (
  email: string
): Promise<IUser | null> {
  return await this.findOne({ email: email });
};

UserSchema.statics.isPasswordMatched = async function (
  givenPassword: string,
  savedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(givenPassword, savedPassword);
};

UserSchema.pre('save', async function (next) {
  // hashing user password
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user: any = this; // Added type assertion

  // Skip password hashing for OAuth users or if password is not provided
  if (!user.password || user.isOAuthUser) {
    return next();
  }

  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds)
  );

  next();
});

export const UserModel = model<IUser, IUserModel>('user', UserSchema);
