'use client';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Result, Spin, message } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useVerifyEmailMutation } from '@/redux/api/auth';

const VerifyEmailPage = () => {
  const [verifyEmail] = useVerifyEmailMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messageApi, contextHolder] = message.useMessage();
  const [verificationStatus, setVerificationStatus] = useState<
    'pending' | 'success' | 'error'
  >('pending');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setVerificationStatus('error');
      setErrorMessage('Verification token is missing');
      return;
    }

    const verifyUserEmail = async () => {
      try {
        await verifyEmail(token).unwrap();
        setVerificationStatus('success');
        messageApi.success('Email verified successfully!');

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } catch (err: any) {
        setVerificationStatus('error');

        if (err?.data?.errorMessages && Array.isArray(err.data.errorMessages)) {
          const errorMessages = err.data.errorMessages
            .map((error: any) => error.message)
            .join(', ');
          setErrorMessage(errorMessages);
        } else {
          const errorMessage =
            err?.data?.message ||
            'Email verification failed. Please try again.';
          setErrorMessage(errorMessage);
        }

        messageApi.error('Email verification failed');
      }
    };

    verifyUserEmail();
  }, [searchParams, verifyEmail, messageApi, router]);

  if (verificationStatus === 'pending') {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: '20px',
        }}
      >
        <Spin size="large" />
        <h2>Verifying your email...</h2>
        <p>Please wait while we verify your email address.</p>
      </div>
    );
  }

  if (verificationStatus === 'success') {
    return (
      <>
        {contextHolder}
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
          title="Email Verified Successfully!"
          subTitle="Your email has been verified. You can now log in to your account."
          extra={[
            <Button
              type="primary"
              key="login"
              onClick={() => router.push('/login')}
              size="large"
            >
              Go to Login
            </Button>,
          ]}
        />
      </>
    );
  }

  if (verificationStatus === 'error') {
    return (
      <>
        {contextHolder}
        <Result
          status="error"
          icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
          title="Email Verification Failed"
          subTitle={
            errorMessage || 'Something went wrong during email verification.'
          }
          extra={[
            <Button
              key="retry"
              onClick={() => window.location.reload()}
              size="large"
            >
              Try Again
            </Button>,
            <Button
              type="primary"
              key="login"
              onClick={() => router.push('/login')}
              size="large"
            >
              Go to Login
            </Button>,
          ]}
        />
      </>
    );
  }

  return null;
};

export default VerifyEmailPage;
