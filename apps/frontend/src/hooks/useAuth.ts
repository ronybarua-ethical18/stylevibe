import { useState, useCallback } from 'react';
import { signIn } from 'next-auth/react';
import { useUserLoginMutation } from '@/redux/api/auth';
import { storeUserInfo } from '@/services/auth.service';

interface AuthState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  isLoadingCredentials: boolean;
  isLoadingGoogle: boolean;
  error: string | null;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [userLogin] = useUserLoginMutation();
  const [authState, setAuthState] = useState<AuthState>({
    status: 'idle',
    isLoadingCredentials: false,
    isLoadingGoogle: false,
    error: null,
  });

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      setAuthState({
        status: 'submitting',
        isLoadingCredentials: true,
        isLoadingGoogle: false,
        error: null,
      });

      try {
        const result = await userLogin(credentials).unwrap();
        if (result?.data?.accessToken) {
          storeUserInfo(result.data.accessToken);

          // Dispatch custom event to notify localStorage change
          window.dispatchEvent(
            new CustomEvent('auth:tokenStored', {
              detail: { token: result.data.accessToken },
            })
          );

          setAuthState({
            status: 'success',
            isLoadingCredentials: false,
            isLoadingGoogle: false,
            error: null,
          });
        }
      } catch (error: any) {
        setAuthState({
          status: 'error',
          isLoadingCredentials: false,
          isLoadingGoogle: false,
          error: error?.data?.message || 'Login failed',
        });
      }
    },
    [userLogin]
  );

  const googleLogin = useCallback(async () => {
    setAuthState({
      status: 'submitting',
      isLoadingCredentials: false,
      isLoadingGoogle: true,
      error: null,
    });

    try {
      const result = await signIn('google', { redirect: false });

      if (result?.error) {
        setAuthState({
          status: 'error',
          isLoadingCredentials: false,
          isLoadingGoogle: false,
          error: `Google login failed: ${result.error}`,
        });
      } else if (result?.ok) {
        setAuthState({
          status: 'success',
          isLoadingCredentials: false,
          isLoadingGoogle: false,
          error: null,
        });
      }
    } catch (error: any) {
      setAuthState({
        status: 'error',
        isLoadingCredentials: false,
        isLoadingGoogle: false,
        error: `Google login failed: ${error?.message}`,
      });
    }
  }, []);

  return { authState, login, googleLogin };
};
