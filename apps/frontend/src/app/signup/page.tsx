'use client';
import {
  LockOutlined,
  MailOutlined,
  UserOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { Button, Col, Row, Select, message } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SubmitHandler } from 'react-hook-form';
import { useState } from 'react';

import helloImage from '../../../public/hello.png';

import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import SVCarousel from '@/components/ui/SVCarousel';
import { useUserSignupMutation } from '@/redux/api/auth';

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  password: string;
  confirmPassword: string;
};

const SignupPage = () => {
  const [userSignup, { isLoading }] = useUserSignupMutation();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState<string>('');

  const onSubmit: SubmitHandler<FormValues> = async (data: FormValues) => {
    try {
      // Validate passwords match
      if (data.password !== data.confirmPassword) {
        messageApi.error('Passwords do not match');
        return;
      }

      // Validate role is selected
      if (!role) {
        messageApi.error('Please select a user type');
        return;
      }

      // Prepare signup data
      const signupData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: role,
        password: data.password,
      };

      const response = await userSignup(signupData).unwrap();

      if (response) {
        messageApi.success(
          'Account created successfully! Please check your email for verification.'
        );
        // Redirect to login page after successful signup
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Signup error:', err);

      // Handle validation errors gracefully
      if (err?.data?.errorMessages && Array.isArray(err.data.errorMessages)) {
        const errorMessages = err.data.errorMessages
          .map((error: any) => error.message)
          .join(', ');
        messageApi.error(errorMessages);
      } else {
        const errorMessage =
          err?.data?.message || 'Signup failed. Please try again.';
        messageApi.error(errorMessage);
      }
    }
  };

  return (
    <>
      {contextHolder}
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
          style={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
        >
          <div style={{ width: '70%', margin: 'auto' }}>
            <div style={{ marginBottom: '50px' }}>
              <div className="flex items-center">
                <h1
                  style={{
                    margin: '10px 10px 10px 0px',
                    fontSize: '35px',
                  }}
                >
                  Welcome to{' '}
                  <span style={{ color: '#407aff' }}>Style Vibe </span>
                </h1>
                <Image
                  src={helloImage}
                  width={50}
                  height={50}
                  alt="welcome message"
                />
              </div>

              <h2
                style={{ color: '#b6bfce', fontWeight: 400, fontSize: '18px' }}
              >
                Enter your information to create your account
              </h2>
            </div>
            <div>
              <Form submitHandler={onSubmit}>
                <Row gutter={[16, 16]}>
                  <Col sm={12}>
                    <h4 style={{ marginBottom: '10px' }}>First name</h4>
                    <FormInput
                      name="firstName"
                      type="text"
                      prefix={<UserOutlined />}
                      size="large"
                      placeholder="Enter first name"
                    />
                  </Col>
                  <Col sm={12}>
                    <h4 style={{ marginBottom: '10px' }}>Last name</h4>
                    <FormInput
                      name="lastName"
                      type="text"
                      size="large"
                      prefix={<UserOutlined />}
                      placeholder="Enter last name"
                    />
                  </Col>

                  <Col sm={12}>
                    <h4 style={{ marginBottom: '10px' }}>Email</h4>
                    <FormInput
                      name="email"
                      type="email"
                      prefix={<MailOutlined />}
                      size="large"
                      placeholder="Enter your email"
                    />
                  </Col>
                  <Col sm={12}>
                    <h4 style={{ marginBottom: '10px' }}>Phone</h4>
                    <FormInput
                      name="phone"
                      type="tel"
                      size="large"
                      prefix={<PhoneOutlined />}
                      placeholder="Enter phone number"
                    />
                  </Col>
                  <Col sm={24}>
                    <h4 style={{ marginBottom: '10px' }}>User type</h4>
                    <Select
                      showSearch
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Search to Select"
                      optionFilterProp="children"
                      value={role}
                      onChange={(value) => setRole(value)}
                      filterOption={(input, option) =>
                        (option?.label ?? '').includes(input)
                      }
                      filterSort={(optionA, optionB) =>
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      options={[
                        {
                          value: 'customer',
                          label: 'Customer',
                        },
                        {
                          value: 'seller',
                          label: 'Seller',
                        },
                      ]}
                    />
                  </Col>
                  <Col sm={12}>
                    <h4 style={{ marginBottom: '10px' }}>Password</h4>
                    <FormInput
                      name="password"
                      type="password"
                      size="large"
                      prefix={<LockOutlined />}
                      placeholder="Enter password"
                    />
                  </Col>
                  <Col sm={12}>
                    <h4 style={{ marginBottom: '10px' }}>Confirm password</h4>
                    <FormInput
                      name="confirmPassword"
                      type="password"
                      size="large"
                      prefix={<LockOutlined />}
                      placeholder="Confirm password"
                    />
                  </Col>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ width: '100%', margin: '20px 0px' }}
                    size="large"
                    loading={isLoading}
                  >
                    {isLoading ? 'Creating Account...' : 'Sign up'}
                  </Button>
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <h5 style={{ fontWeight: 400 }}>
                      Already have an account? <Link href="/login">Login</Link>
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
    </>
  );
};

export default SignupPage;
