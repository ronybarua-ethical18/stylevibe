import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useCallback, useState } from 'react';

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
  [key: string]: any;
}

interface ExtendedSession {
  loggedUser?: LoggedUser;
}

export const useUserInfo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [localStorageVersion, setLocalStorageVersion] = useState(0);

  const userInfo = useMemo((): LoggedUser | null => {
    // OAuth users
    if ((session as ExtendedSession)?.loggedUser) {
      return (session as ExtendedSession).loggedUser || null;
    }

    const credentialUserInfo = getUserInfo();
    return credentialUserInfo
      ? { ...credentialUserInfo, provider: 'credentials' }
      : null;
  }, [session, localStorageVersion]);

  // Authentication state
  const isCredentialAuth = useMemo(
    () => isLoggedIn() && !session,
    [session, localStorageVersion]
  );
  const isOAuthAuth = useMemo(
    () => !!(session as ExtendedSession)?.loggedUser?.accessToken,
    [session]
  );
  const isAuthenticated = useMemo(
    () => isCredentialAuth || isOAuthAuth,
    [isCredentialAuth, isOAuthAuth]
  );

  // Access token
  const accessToken = useMemo(() => {
    if (isOAuthAuth) {
      return (session as ExtendedSession)?.loggedUser?.accessToken;
    }
    return getFromLocalStorage(authKey) || null;
  }, [isOAuthAuth, session, localStorageVersion]);

  // Sign out function
  const signOut = useCallback(async () => {
    removeUserInfo(authKey);
    if (session) {
      await nextAuthSignOut({ redirect: false });
    }
    router.push('/login');
  }, [session, router]);

  // Store OAuth token when session is available
  useEffect(() => {
    const sessionUser = (session as ExtendedSession)?.loggedUser;
    if (sessionUser?.accessToken && status === 'authenticated') {
      storeUserInfo(sessionUser.accessToken);
    }
  }, [session, status]);

  // Listen for auth events and localStorage changes
  useEffect(() => {
    const handleStorageChange = () =>
      setLocalStorageVersion((prev) => prev + 1);

    window.addEventListener('auth:tokenStored', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('auth:tokenStored', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    userInfo,
    isLoading: status === 'loading',
    isAuthenticated,
    isOAuthUser: userInfo?.provider === 'google',
    hasRole: !!userInfo?.role,
    provider: userInfo?.provider,
    isCredentialAuth,
    isOAuthAuth,
    accessToken,
    user: session?.user,
    signOut,
    status,
    session,
  };
};
