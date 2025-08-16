'use client';

import { Button, Card, Col, Row, message } from 'antd';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { useUserInfo } from '@/hooks/useUserInfo';
import { useUpdateUserRoleMutation } from '@/redux/api/users';

const RoleSelectionPage = () => {
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const { update: updateSession } = useSession();
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [updateUserRole, { isLoading }] = useUpdateUserRoleMutation();

  // Add useMessage hook to replace static message functions
  const [messageApi, contextHolder] = message.useMessage();

  const handleRoleSubmit = async () => {
    if (!selectedRole) {
      messageApi.error('Please select a role');
      return;
    }

    try {
      // Use the predefined updateUserRole mutation
      const result = await updateUserRole({
        data: {
          role: selectedRole,
          userId: userInfo?.userId,
        },
      }).unwrap();
      messageApi.success('Role selected successfully!');

      // Update session with the new role data directly
      await updateSession({
        loggedUser: {
          ...userInfo,
          role: result.data.role,
        },
      });

      // Small delay to ensure session is updated
      setTimeout(() => {
        router.push(`/${selectedRole.toLowerCase()}/dashboard`);
      }, 500);
    } catch {
      messageApi.error('An error occurred');
    }
  };

  useEffect(() => {
    if (userInfo?.role && userInfo.role !== 'guest') {
      router.push(`/${userInfo.role.toLowerCase()}/dashboard`);
    }
  }, [userInfo?.role, router]);

  return (
    <>
      {contextHolder}
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
        }}
      >
        <Card style={{ width: 600, textAlign: 'center' }}>
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
              Welcome to <span style={{ color: '#407aff' }}>Style Vibe!</span>
            </h1>
            <p style={{ color: '#666', fontSize: '16px' }}>
              Please select your role to continue
            </p>
          </div>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card
                hoverable
                onClick={() => setSelectedRole('customer')}
                style={{
                  border:
                    selectedRole === 'customer'
                      ? '2px solid #407aff'
                      : '1px solid #d9d9d9',
                  cursor: 'pointer',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                    🛍️
                  </div>
                  <h3>Customer</h3>
                  <p style={{ color: '#666' }}>
                    Book services and appointments
                  </p>
                </div>
              </Card>
            </Col>

            <Col span={24}>
              <Card
                hoverable
                onClick={() => setSelectedRole('seller')}
                style={{
                  border:
                    selectedRole === 'seller'
                      ? '2px solid #407aff'
                      : '1px solid #d9d9d9',
                  cursor: 'pointer',
                }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '48px', marginBottom: '10px' }}>
                    💼
                  </div>
                  <h3>Service Provider</h3>
                  <p style={{ color: '#666' }}>
                    Offer services and manage bookings
                  </p>
                </div>
              </Card>
            </Col>
          </Row>

          <Button
            type="primary"
            size="large"
            loading={isLoading}
            onClick={handleRoleSubmit}
            style={{ width: '100%', marginTop: '20px' }}
            disabled={!selectedRole}
          >
            Continue to{' '}
            {selectedRole
              ? `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)} Dashboard`
              : 'Dashboard'}
          </Button>
        </Card>
      </div>
    </>
  );
};

export default RoleSelectionPage;
