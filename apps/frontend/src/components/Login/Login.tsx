'use client';

import { message, Spin } from 'antd';
import { useEffect } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useAuth } from '@/hooks/useAuth';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import SuccessLoader from '../ui/SuccessLoader';
import LoginForm from '../Forms/LoginForm';

const LoginPage = () => {
  const { authState, login, googleLogin } = useAuth();
  const { userInfo, isLoading } = useUserInfo();
  const [messageApi, contextHolder] = message.useMessage();

  // Simple redirect hook
  useAuthRedirect(userInfo, isLoading);

  // Error handling
  useEffect(() => {
    if (authState.status === 'error') {
      messageApi.error(authState.error);
    }
  }, [authState.status, authState.error, messageApi]);

  const handleSubmit = async (data: { email: string; password: string }) => {
    await login(data);
  };

  // Loading state
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // Only show success loader if we don't have userInfo yet
  // This prevents blocking the redirect logic
  if (authState.status === 'success' && !userInfo) {
    return (
      <SuccessLoader
        title="Login Successful!"
        message="Redirecting..."
      />
    );
  }

  return (
    <>
      {contextHolder}
      <LoginForm
        onSubmit={handleSubmit}
        onGoogleLogin={googleLogin}
        isLoadingCredentials={authState.isLoadingCredentials}
        isLoadingGoogle={authState.isLoadingGoogle}
      />
    </>
  );
};

export default LoginPage;
