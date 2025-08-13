'use client';

import { Button, Col, Row, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';
import { SubmitHandler } from 'react-hook-form';

import GoogleIcon from '../../../public/google.png';
import helloImage from '../../../public/hello.png';

import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import SVCarousel from '@/components/ui/SVCarousel';
import { useUserLoginMutation } from '@/redux/api/auth';
import { storeUserInfo } from '@/services/auth.service';
import { useUserInfo } from '@/hooks/useUserInfo';

type FormValues = {
  id: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [userLogin] = useUserLoginMutation();
  const { isAuthenticated, userInfo, isLoading, needsRoleSelection } =
    useUserInfo();

  useEffect(() => {
    if (!isLoading) {
      // Remove the !isAuthenticated redirect that's causing issues
      setTimeout(() => {
        if (userInfo?.role) {
          router.push(`/${userInfo.role.toLowerCase()}/dashboard`);
        }
      }, 500);
    }
  }, [isAuthenticated, needsRoleSelection, isLoading, userInfo?.role, router]);

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    try {
      const res = await userLogin(data).unwrap();
      if (res?.data?.accessToken) {
        storeUserInfo(res?.data?.accessToken);
        message.success('Login successful!');

        // Force immediate redirect
        const role = res?.data?.user?.role;
        if (role) {
          router.push(`/${role.toLowerCase()}/dashboard`);
        }
      }
    } catch (err: any) {
      message.error(err?.data?.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signIn('google', {
        redirect: false, // Let NextAuth handle the redirect
      });

      if (result?.error) {
        message.error(`Google login failed: ${result.error}`);
      }
    } catch {
      message.error('Google login failed');
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
                    type="text"
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
                >
                  Login
                </Button>

                <div
                  className="shadow-sm border rounded-md p-3 cursor-pointer flex items-center justify-center w-full hover:bg-gray-50 transition-colors"
                  onClick={handleGoogleLogin}
                  style={{ marginBottom: '20px' }}
                >
                  <Image
                    src={GoogleIcon}
                    width={20}
                    height={20}
                    alt="Google icon"
                    className="mr-5 text-lg"
                  />{' '}
                  Login with Google
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
