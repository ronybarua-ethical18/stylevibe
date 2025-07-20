import React, { useState } from 'react';
import { Col, notification, Rate, Row, Modal } from 'antd';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import SVButton from '../SVButton';
import { useCreatePaymentIntentMutation } from '@/redux/api/stripe';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { useCreateBookingMutation } from '@/redux/api/bookings';

const stripePromise = loadStripe(
  'pk_test_51PnMRKBfR7AXQAHn19WtEzjkCGuPKG8BmMHFqZap098kURuMhn8wuXiEEL1tg8m0QU0bryWuH3iy8ztpR3Du6hrK00BmbdnBcg'
);

interface Service {
  _id: string;
  name: string;
  subCategory: string;
  seller: string;
  shop: string;
}

const PaymentForm = ({
  paymentIntentId,
  clientSecret,
  handleClose,
  serviceDate,
  serviceStartTime,
  processingFees,
  totalAmount,
  service,
}: {
  paymentIntentId: string | null;
  clientSecret: string | null;
  handleClose: () => void;
  serviceDate: string;
  serviceStartTime: string;
  processingFees: number;
  totalAmount: number;
  service: Service;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const stripe = useStripe();
  const elements = useElements();
  const [createBooking] = useCreateBookingMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe has not been initialized');
      }

      setIsProcessing(true);
      setErrorMessage('');

      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(
          submitError.message || 'An error occurred during submission.'
        );
      }

      const result = await stripe.confirmPayment({
        elements,
        clientSecret: clientSecret as string,
        redirect: 'if_required',
      });

      if (result.error) {
        throw new Error(result.error.message || 'Payment failed.');
      }

      const bookingData = {
        serviceDate,
        serviceStartTime,
        processingFees,
        totalAmount,
        serviceId: service._id,
        sellerId: service.seller,
        shop: service.shop,
        stripePaymentIntentId: paymentIntentId,
        paymentMethod: 'card',
      };

      const response = await createBooking(bookingData).unwrap();
      if (response) {
        setIsSuccess(true);
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'An unexpected error occurred');
      setIsSuccess(false);
    } finally {
      setIsProcessing(false);
      setIsModalVisible(true);
      handleClose();
    }
  };

  const copyToClipboard = () => {
    if (paymentIntentId) {
      navigator.clipboard.writeText(paymentIntentId);
      notification.success({
        message: 'Copied to clipboard',
        placement: 'top',
      });
    }
  };

  const modalContent = React.useMemo(
    () =>
      isSuccess ? (
        <>
          <CheckCircleOutlined
            style={{ fontSize: '64px', color: '#52c41a', marginBottom: '24px' }}
          />
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>
            Payment Successful!
          </h2>
          <p
            style={{
              fontSize: '18px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            Your payment was processed successfully. Thank you for your
            purchase!
          </p>
          <div
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              maxWidth: '400px',
            }}
            className="bg-gray-50"
          >
            <div>
              <p style={{ fontSize: '14px', color: '#888', margin: '0 0 4px' }}>
                Payment Intent ID
              </p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', margin: 0 }}>
                {paymentIntentId}
              </p>
            </div>
            <CopyOutlined
              style={{ fontSize: '20px', color: '#4d3ca3', cursor: 'pointer' }}
              onClick={copyToClipboard}
            />
          </div>
          <p
            style={{
              marginBottom: '24px',
              textAlign: 'center',
            }}
            className="text-center text-gray-500 font-light text-sm"
          >
            Visit your dashboard to manage your services or request a refund.
          </p>
          <div
            style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}
          >
            <Link href="/customer/dashboard">
              <SVButton
                title="Go to Dashboard"
                style={{
                  background: '#4d3ca3',
                  width: '200px',
                  height: '40px',
                  fontSize: '16px',
                }}
              />
            </Link>
            <SVButton
              title="Close"
              style={{
                background: '#ffffff',
                color: '#4d3ca3',
                border: '1px solid #4d3ca3',
                width: '200px',
                height: '40px',
                fontSize: '16px',
              }}
              onClick={() => setIsModalVisible(false)}
            />
          </div>
        </>
      ) : (
        <>
          <CloseCircleOutlined
            style={{ fontSize: '64px', color: '#ff4d4f', marginBottom: '24px' }}
          />
          <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>
            Payment Failed
          </h2>
          <p
            style={{
              fontSize: '18px',
              marginBottom: '24px',
              textAlign: 'center',
            }}
          >
            We are sorry, but something went wrong with your payment. Please try
            again later.
          </p>
          <p
            style={{
              fontSize: '16px',
              marginBottom: '24px',
              textAlign: 'center',
              color: '#ff4d4f',
            }}
          >
            Error: {errorMessage}
          </p>
          <SVButton
            title="Close"
            style={{
              background: '#4d3ca3',
              width: '200px',
              height: '40px',
              fontSize: '16px',
            }}
            onClick={() => setIsModalVisible(false)}
          />
        </>
      ),
    [isSuccess, paymentIntentId, errorMessage]
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <SVButton
          title={isProcessing ? 'Processing...' : 'Pay'}
          loading={isProcessing}
          disabled={isProcessing}
          style={{
            background: isProcessing ? '#a9a9a9' : '#4d3ca3',
            width: '100%',
            marginTop: '20px',
            cursor: isProcessing ? 'not-allowed' : 'pointer',
          }}
          htmlType="submit"
        />
      </form>
      <Modal
        title={null}
        open={isModalVisible}
        onOk={() => setIsModalVisible(false)}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={650}
        style={{
          padding: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
        }}
        centered
        destroyOnClose
      >
        {modalContent}
      </Modal>
    </>
  );
};

const PaymentWrapper = ({
  service,
  processingFees,
  totalAmount,
  handleClose,
  serviceDate,
  serviceStartTime,
}: {
  service: Service;
  processingFees: number;
  totalAmount: number;
  handleClose: () => void;
  serviceDate: string;
  serviceStartTime: string;
}) => {
  const [createPaymentIntent, { isLoading }] = useCreatePaymentIntentMutation();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentCreated, setIntentCreated] = useState<boolean>(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  const handlePaymentIntent = async () => {
    if (!clientSecret && !intentCreated) {
      try {
        const response = await createPaymentIntent({
          amount: totalAmount,
          currency: 'eur',
          seller: service.seller,
        }).unwrap();

        setPaymentIntentId(response.data.id);
        setClientSecret(response.data.client_secret);
        setIntentCreated(true);
      } catch (error: any) {
        notification.error({
          message: error.data.message,
        });
      }
    }
  };

  React.useEffect(() => {
    handlePaymentIntent();
  }, []);

  if (isLoading) {
    return <div>Creating payment intent...</div>;
  }

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <div className="my-15" style={{ width: '50%', margin: 'auto' }}>
        <Row gutter={40} className="flex items-center">
          <Col span={24}>
            <h2 className="text-2xl font-medium text-left  mt-5 mb-0">
              Payment Details
            </h2>
            <h5 className="mt-0 text-base font-extralight mb-8 text-left">
              Please review before making your payment
            </h5>
            <div
              className="flex justify-between w-full items-center text-left mb-5"
              style={{
                boxShadow:
                  'rgba(27, 31, 35, 0.04) 0px 1px 0px, rgba(255, 255, 255, 0.25) 0px 1px 0px inset',
              }}
            >
              <div>
                <div>
                  <h3 className="font-medium text-base m-0">{service?.name}</h3>
                  <p className="font-thin">{service?.subCategory}</p>
                </div>
                <div className="flex items-center">
                  <Rate
                    allowHalf
                    defaultValue={2.5}
                    style={{
                      fontSize: 14,
                      marginRight: '10px',
                      color: '#4d3ca3',
                    }}
                  />
                  <h4 className="text-gray-600 font-extralight">134 reviews</h4>
                </div>
              </div>
              <div className="text-right ">
                <h2 className="text-xl text-customPrimary-800 font-medium m-0">
                  ${totalAmount}
                </h2>
                <small className="text-gray-400">
                  including tax & processing fees
                </small>
              </div>
            </div>
            <PaymentForm
              paymentIntentId={paymentIntentId}
              clientSecret={clientSecret}
              handleClose={handleClose}
              serviceDate={serviceDate}
              serviceStartTime={serviceStartTime}
              processingFees={processingFees}
              totalAmount={totalAmount}
              service={service}
            />
          </Col>
        </Row>
      </div>
    </Elements>
  );
};

export default PaymentWrapper;
