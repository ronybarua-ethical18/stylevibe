'use client';
import { Button, Col, Row, Select } from 'antd';
import { SubmitHandler } from 'react-hook-form';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import Image from 'next/image';
import Link from 'next/link';

import helloImage from '../../../public/hello.png';

import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import SVCarousel from '@/components/ui/SVCarousel';

type FormValues = {
  id: string;
  password: string;
};

const SignupPage = () => {
  // console.log(isLoggedIn());

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    try {
      console.log('data', data);
    } catch (err: any) {
      console.error(err.message);
    }
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
                    // prefix={<UserOutlined />}
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
                    // prefix={<UserOutlined />}
                    placeholder="Enter last name"
                  />
                </Col>

                <Col sm={12}>
                  <h4 style={{ marginBottom: '10px' }}>Email</h4>
                  <FormInput
                    name="email"
                    type="text"
                    prefix={<MailOutlined />}
                    size="large"
                    placeholder="Enter your email"
                  />
                </Col>
                <Col sm={12}>
                  <h4 style={{ marginBottom: '10px' }}>Phone</h4>
                  <FormInput
                    name="phone"
                    type="text"
                    size="large"
                    // prefix={<UserOutlined />}
                    placeholder="Enter phone"
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
                    name="password"
                    type="password"
                    size="large"
                    prefix={<LockOutlined />}
                    placeholder="Enter confirm password"
                  />
                </Col>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ width: '100%', margin: '20px 0px' }}
                  size="large"
                >
                  Sign up
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
  );
};

export default SignupPage;
