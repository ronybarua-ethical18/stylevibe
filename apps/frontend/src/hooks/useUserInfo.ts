import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMemo, useEffect } from 'react';

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

export const useUserInfo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Handle OAuth token storage when session is available
  useEffect(() => {
    if (
      (session as any)?.loggedUser?.accessToken &&
      status === 'authenticated'
    ) {
      storeUserInfo((session as any).loggedUser.accessToken);
    }
  }, [session, status]);

  const userInfo = useMemo(() => {
    // For OAuth users, get info from session.loggedUser
    if ((session as any)?.loggedUser) {
      return (session as any).loggedUser;
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
  }, [session]);

  const isCredentialAuth = () => {
    return isLoggedIn() && !session;
  };

  const isOAuthAuth = () => {
    return !!(session as any)?.loggedUser?.accessToken;
  };

  const isAuthenticated = () => {
    return isCredentialAuth() || isOAuthAuth();
  };

  const getAccessToken = () => {
    if (isOAuthAuth()) {
      return (session as any)?.loggedUser?.accessToken;
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

  return {
    userInfo,
    isLoading: status === 'loading',
    isAuthenticated: isAuthenticated(),
    isOAuthUser: userInfo?.provider === 'google',
    hasRole: !!userInfo?.role,
    needsRoleSelection:
      userInfo?.provider === 'google' && userInfo?.role === 'guest',
    isCredentialAuth: isCredentialAuth(),
    isOAuthAuth: isOAuthAuth(),
    accessToken: getAccessToken(),
    user: session?.user,
    provider: userInfo?.provider,
    signOut,
    status,
    session,
  };
};
