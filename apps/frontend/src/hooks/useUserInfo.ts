import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { authKey } from '@/constants/authKey';
import {
  getUserInfo,
  isLoggedIn,
  storeUserInfo,
} from '@/services/auth.service';
import {
  removeUserInfo,
  getFromLocalStorage,
} from '@/utils/handleLocalStorage';

interface LoggedUser {
  accessToken?: string;
  role?: string;
  provider?: string;
  [key: string]: any; // Allow additional properties for credential users
}

interface ExtendedSession {
  loggedUser?: LoggedUser;
}

export const useUserInfo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle OAuth token storage when session is available
  useEffect(() => {
    if (
      (session as ExtendedSession)?.loggedUser?.accessToken &&
      status === 'authenticated'
    ) {
      storeUserInfo((session as ExtendedSession).loggedUser!.accessToken!);
    }
  }, [session, status]);

  const userInfo = (): LoggedUser | null => {
    // For OAuth users, get info from session.loggedUser
    if ((session as ExtendedSession)?.loggedUser) {
      return (session as ExtendedSession).loggedUser || null;
    }

    // For credential users, get info from localStorage
    const credentialUserInfo = getUserInfo();

    if (credentialUserInfo) {
      return {
        ...credentialUserInfo,
        provider: 'credentials',
      };
    }

    return null;
  };

  const isCredentialAuth = () => {
    return isLoggedIn() && !session;
  };

  const isOAuthAuth = () => {
    return !!(session as ExtendedSession)?.loggedUser?.accessToken;
  };

  const isAuthenticated = () => {
    return isCredentialAuth() || isOAuthAuth();
  };

  const getAccessToken = () => {
    if (isOAuthAuth()) {
      return (session as ExtendedSession)?.loggedUser?.accessToken;
    }
    return getFromLocalStorage(authKey) || null;
  };

  const signOut = async () => {
    removeUserInfo(authKey);

    if (session) {
      await nextAuthSignOut({ redirect: false });
    }

    router.push('/login');
  };

  const loggedUser = userInfo();
  return {
    userInfo: loggedUser,
    isLoading: status === 'loading',
    isAuthenticated: isAuthenticated(),
    isOAuthUser: loggedUser?.provider === 'google',
    hasRole: !!loggedUser?.role,
    needsRoleSelection:
      loggedUser?.provider === 'google' && loggedUser?.role === 'guest',
    isCredentialAuth: isCredentialAuth(),
    isOAuthAuth: isOAuthAuth(),
    accessToken: getAccessToken(),
    user: session?.user,
    provider: loggedUser?.provider,
    signOut,
    status,
    session,
  };
};
