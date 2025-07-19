import React from 'react'
import { Modal, Result, Typography, List, Button } from 'antd'
import { CheckCircleFilled, RightCircleOutlined } from '@ant-design/icons'

const { Paragraph, Text } = Typography

const SVStripeSuccessfulConnectionModal = ({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: () => void
}) => {
  return (
    <>
      <Modal
        visible={visible}
        onCancel={onClose}
        footer={null}
        width={800}
        centered
        style={{ padding: 0 }}
      >
        <Result
          icon={<CheckCircleFilled style={{ color: '#52c41a' }} />}
          title="Stripe Account Successfully Connected!"
          subTitle="You're all set to start accepting payments"
          extra={[
            <Button type="primary" key="console" onClick={onClose} size="large">
              Got it, thanks!
            </Button>,
          ]}
        >
          <div
            className="desc"
            style={{
              background: '#f7f7f7',
              padding: '24px',
              borderRadius: '8px',
            }}
          >
            <Paragraph>
              <Text strong style={{ fontSize: 16 }}>
                Here what has been set up for you:
              </Text>
            </Paragraph>
            <List
              size="small"
              dataSource={[
                'Your account is fully verified',
                'Payment methods are enabled and ready to use',
                'Webhook endpoints are configured for real-time updates',
                'Your dashboard is set up for easy management',
              ]}
              renderItem={item => (
                <List.Item>
                  <RightCircleOutlined
                    style={{ color: '#1890ff', marginRight: 8 }}
                  />
                  {item}
                </List.Item>
              )}
            />
          </div>
          <Paragraph style={{ marginTop: 24 }}>
            <Text>
              Need to make changes or have questions? Visit your{' '}
              <a
                href="https://dashboard.stripe.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Stripe dashboard
              </a>{' '}
              or contact our support team.
            </Text>
          </Paragraph>
        </Result>
      </Modal>
    </>
  )
}

export default SVStripeSuccessfulConnectionModal
