'use client';

import { Button, Col, Row, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import GoogleIcon from '../../../public/google.png';
import helloImage from '../../../public/hello.png';

import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import SVCarousel from '@/components/ui/SVCarousel';
import { useUserLoginMutation } from '@/redux/api/auth';
import { storeUserInfo } from '@/services/auth.service';
import { useUserInfo } from '@/hooks/useUserInfo';
import SuccessLoader from '@/components/ui/SuccessLoader';

type FormValues = {
  email: string; // Fixed: was 'id' but form uses 'email'
  password: string;
};

type LoginState = 'idle' | 'submitting' | 'success' | 'redirecting';

const LoginPage = () => {
  const router = useRouter();
  const [userLogin] = useUserLoginMutation();
  const [loginState, setLoginState] = useState<LoginState>('idle');
  const { isAuthenticated, userInfo, isLoading, needsRoleSelection } =
    useUserInfo();

  // Helper function to handle successful login redirects
  const handleSuccessfulLogin = (userData: any) => {
    const role = userData?.role;
    if (role) {
      setLoginState('redirecting');

      // Industry standard: preload route + redirect with feedback
      const dashboardPath = `/${role.toLowerCase()}/dashboard`;
      router.prefetch(dashboardPath);

      // Small delay for better UX (industry standard: 200-500ms)
      setTimeout(() => {
        router.push(dashboardPath);
      }, 300);
    }
  };

  // Helper function to handle role selection redirect
  const handleRoleSelectionRedirect = () => {
    setLoginState('redirecting');
    router.prefetch('/select-role');
    setTimeout(() => {
      router.push('/select-role');
    }, 300);
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      setTimeout(() => {
        if (needsRoleSelection) {
          handleRoleSelectionRedirect();
        } else if (userInfo?.role) {
          handleSuccessfulLogin(userInfo);
        }
      }, 500);
    }
  }, [isAuthenticated, needsRoleSelection, isLoading, userInfo?.role]);

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      setLoginState('submitting');
      const res = await userLogin(data).unwrap();

      if (res?.data?.accessToken) {
        storeUserInfo(res?.data?.accessToken);
        setLoginState('success');
        message.success('Login successful!');

        // Use the helper function for consistent redirect handling
        handleSuccessfulLogin(res?.data?.user);
      }
    } catch (err: any) {
      setLoginState('idle');
      message.error(err?.data?.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoginState('submitting');

      const result = await signIn('google', {
        redirect: false,
      });

      if (result?.error) {
        setLoginState('idle');
        message.error(`Google login failed: ${result.error}`);
      } else if (result?.ok) {
        // Google login successful - NextAuth will handle the session
        // The useEffect above will handle the redirect logic
        setLoginState('success');
        message.success('Google login successful!');
      }
    } catch (error: any) {
      setLoginState('idle');
      message.error(`Google login failed: ${error?.message}`);
    }
  };

  // Show loading while checking authentication
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
        <div>Loading...</div>
      </div>
    );
  }

  // Show success state after login
  if (loginState === 'success') {
    return (
      <SuccessLoader
        title="Login Successful!"
        message="Preparing your dashboard..."
      />
    );
  }

  // Show redirecting state
  if (loginState === 'redirecting') {
    return (
      <SuccessLoader
        title="Redirecting..."
        message="Taking you to your dashboard..."
      />
    );
  }

  return (
    <Row
      justify="center"
      align="middle"
      style={{
        minHeight: '100vh',
      }}
    >
      <Col
        sm={12}
        md={12}
        lg={12}
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <div style={{ width: '60%', margin: 'auto' }}>
          <div style={{ marginBottom: '50px' }}>
            <div className="flex items-center">
              <h1
                style={{
                  margin: '10px 10px 10px 0px',
                  fontSize: '35px',
                }}
              >
                Welcome to <span style={{ color: '#407aff' }}>Style Vibe </span>
              </h1>
              <Image
                src={helloImage}
                width={50}
                height={50}
                alt="welcome message"
              />
            </div>

            <h2 style={{ color: '#b6bfce', fontWeight: 400, fontSize: '18px' }}>
              Enter your information to login your account
            </h2>
          </div>
          <div>
            <Form submitHandler={onSubmit}>
              <Row gutter={[16, 16]}>
                <Col sm={24}>
                  <h4 style={{ marginBottom: '10px' }}>Email</h4>
                  <FormInput
                    name="email"
                    type="email" // Changed to email type for better UX
                    size="large"
                    placeholder="Enter your email"
                  />
                </Col>
                <Col sm={24}>
                  <h4 style={{ marginBottom: '10px' }}>Password</h4>
                  <FormInput
                    name="password"
                    type="password"
                    size="large"
                    placeholder="Enter your password"
                  />
                </Col>

                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%', margin: '20px 0px 0px 0px' }}
                  size="large"
                  loading={loginState === 'submitting'}
                  disabled={loginState === 'submitting'}
                >
                  {loginState === 'submitting' ? 'Logging in...' : 'Login'}
                </Button>

                <div
                  className="shadow-sm border rounded-md p-3 cursor-pointer flex items-center justify-center w-full hover:bg-gray-50 transition-colors"
                  onClick={handleGoogleLogin}
                  style={{
                    marginBottom: '20px',
                    opacity: loginState === 'submitting' ? 0.6 : 1,
                    pointerEvents:
                      loginState === 'submitting' ? 'none' : 'auto',
                  }}
                >
                  <Image
                    src={GoogleIcon}
                    width={20}
                    height={20}
                    alt="Google icon"
                    className="mr-5 text-lg"
                  />
                  {loginState === 'submitting'
                    ? 'Signing in...'
                    : 'Login with Google'}
                </div>

                <div style={{ textAlign: 'center', width: '100%' }}>
                  <h5 style={{ fontWeight: 400 }}>
                    Don't have an account? <Link href="/signup">Sign up</Link>
                  </h5>
                </div>
              </Row>
            </Form>
          </div>
        </div>
      </Col>
      <Col
        sm={12}
        md={12}
        lg={12}
        style={{ minHeight: '100vh', background: '#e6f0ff' }}
      >
        <div style={{ textAlign: 'center' }}>
          <SVCarousel />
        </div>
      </Col>
    </Row>
  );
};

export default LoginPage;
