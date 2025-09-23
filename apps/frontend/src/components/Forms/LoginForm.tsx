'use client';

import { Button, Col, Row, Image } from 'antd';
import Link from 'next/link';
import { SubmitHandler } from 'react-hook-form';

import GoogleIcon from '../../../public/google.png';
import helloImage from '../../../public/hello.png';

import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import SVCarousel from '@/components/ui/SVCarousel';

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  onGoogleLogin: () => void;
  isLoadingCredentials: boolean;
  isLoadingGoogle: boolean;
}

interface FormValues {
  email: string;
  password: string;
}

const LoginForm = ({ onSubmit, onGoogleLogin, isLoadingCredentials, isLoadingGoogle }: LoginFormProps) => {
  const handleSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
  };

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
                src={helloImage.src}
                width={50}
                height={50}
                alt="welcome message"
                preview={false}
              />
            </div>

            <h2 style={{ color: '#b6bfce', fontWeight: 400, fontSize: '18px' }}>
              Enter your information to login your account
            </h2>
          </div>

          <div>
            <Form submitHandler={handleSubmit}>
              <Row gutter={[16, 16]}>
                <Col sm={24}>
                  <h4 style={{ marginBottom: '10px' }}>Email</h4>
                  <FormInput
                    name="email"
                    type="email"
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
                  loading={isLoadingCredentials}
                  disabled={isLoadingCredentials || isLoadingGoogle}
                >
                  {isLoadingCredentials ? 'Logging in...' : 'Login'}
                </Button>

                <div
                  className="shadow-sm border rounded-md p-3 cursor-pointer flex items-center justify-center w-full hover:bg-gray-50 transition-colors"
                  onClick={onGoogleLogin}
                  style={{
                    marginBottom: '20px',
                    opacity: isLoadingGoogle ? 0.6 : 1,
                    pointerEvents: isLoadingGoogle ? 'none' : 'auto',
                  }}
                >
                  <div style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                    <Image
                      src={GoogleIcon.src}
                      width={20}
                      height={20}
                      alt="Google icon"
                      preview={false}
                    />
                  </div>
                  {isLoadingGoogle ? 'Signing in...' : 'Login with Google'}
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

export default LoginForm;
