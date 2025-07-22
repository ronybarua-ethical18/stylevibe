import { Button } from 'antd';
import React from 'react';
import { BsFillBellFill } from 'react-icons/bs';

import { useConnectStripeAccountMutation } from '@/redux/api/stripe';

function StripeAccountConnection() {
  const [connectStripeAccount, { isLoading }] =
    useConnectStripeAccountMutation();

  const handleConnectStripeAccount = async () => {
    try {
      const response = await connectStripeAccount({}).unwrap();
      console.log('connect response', response);
      window.location.href = response?.data?.url;
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex justify-between items-center p-5 rounded-md bg-gray-50 border-blue-400 border-2">
      <div className="flex items-center gap-4">
        <BsFillBellFill className="text-3xl text-blue-600" />
        <div>
          <h1 className="text-xl font-medium mb-2">
            Stripe Account Connection
          </h1>
          <p className="text-base text-gray-500">
            Connect your Stripe account to enable payments and manage your
            earnings.
          </p>
        </div>
      </div>
      {isLoading ? (
        <Button
          type="primary"
          className="!bg-blue-500 !hover:bg-blue-700 !h-10"
          disabled
        >
          Loading...
        </Button>
      ) : (
        <Button
          type="primary"
          className="!bg-blue-500 !hover:bg-blue-700 !h-10"
          onClick={handleConnectStripeAccount}
        >
          Connect Stripe
        </Button>
      )}
    </div>
  );
}

export default StripeAccountConnection;
