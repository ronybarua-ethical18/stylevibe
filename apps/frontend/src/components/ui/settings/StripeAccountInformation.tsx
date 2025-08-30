import { CloseOutlined, SafetyOutlined } from '@ant-design/icons';
import { Card, Typography, Button, Divider } from 'antd';
import React from 'react';
import { BiCreditCard } from 'react-icons/bi';
import { CiBank } from 'react-icons/ci';
import { CiFlag1 } from 'react-icons/ci';
import { HiOutlineCurrencyRupee } from 'react-icons/hi2';

const { Text } = Typography;

interface StripeAccountInformationProps {
  bankName: string;
  country: string;
  currency: string;
  amount: number;
  onDisconnect: () => void;
}

const StripeAccountInformation: React.FC<StripeAccountInformationProps> = ({
  bankName,
  country,
  currency,
  amount,
  onDisconnect,
}) => {
  return (
    <Card className="w-full !border-0 overflow-hidden !bg-gradient-to-r !from-white !via-gray-50 !to-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <BiCreditCard className="text-3xl text-gray-500" />
          <h1 className="text-xl m-0 font-normal">Account Information</h1>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined className="text-xl" />}
          onClick={onDisconnect}
          className="text-white hover:text-red-300"
          aria-label="Disconnect Stripe account"
        />
      </div>
      <Divider className="bg-white bg-opacity-20 my-4" />
      <div className="grid grid-cols-2 gap-8 w-1/2">
        <div className="flex items-center space-x-4">
          <CiBank className="text-3xl text-gray-500" />
          <div>
            <Text className="block text-white text-opacity-70 text-lg">
              Bank
            </Text>
            <Text className="text-white font-medium text-xl">{bankName}</Text>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <CiFlag1 className="text-3xl text-gray-500" />
          <div>
            <Text className="block text-white text-opacity-70 text-lg">
              Country
            </Text>
            <Text className="text-white font-medium text-xl">{country}</Text>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <HiOutlineCurrencyRupee className="text-3xl text-gray-500" />
          <div>
            <Text className="block text-white text-opacity-70 text-lg">
              Currency
            </Text>
            <Text className="text-white font-medium text-xl">
              {currency.toUpperCase()}
            </Text>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SafetyOutlined className="!text-2xl !text-gray-500" />
          <div>
            <Text className="block text-white text-opacity-70 text-lg">
              Available Balance
            </Text>
            <Text className="text-white font-medium text-xl">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
              }).format(amount)}
            </Text>
          </div>
        </div>
      </div>
      <Divider className="bg-white bg-opacity-20 my-4" />
      <div className="flex items-center justify-center space-x-3 text-white">
        <SafetyOutlined className="text-2xl" />
        <Text className="text-white text-lg">
          Your Stripe account is securely connected
        </Text>
      </div>
    </Card>
  );
};

export default StripeAccountInformation;
