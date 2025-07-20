import { authKey } from '@/constants/authKey';
import {
  getFromLocalStorage,
  setToLocalStorage,
} from '@/utils/handleLocalStorage';
import { decodeToken } from '@/utils/jwt';

export const storeUserInfo = (accessToken: string) => {
  return setToLocalStorage(authKey, accessToken);
};

export const getUserInfo = () => {
  const authToken = getFromLocalStorage(authKey);

  if (authToken) {
    const decodeJWTToken = decodeToken(authToken);
    return decodeJWTToken;
  }
  return '';
};

export const isLoggedIn = () => {
  const authToken = getFromLocalStorage(authKey);
  return !!authToken;
};
