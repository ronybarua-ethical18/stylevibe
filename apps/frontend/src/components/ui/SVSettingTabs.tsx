'use client';

import React from 'react';
import { Segmented, Spin } from 'antd';
import type { SegmentedValue } from 'antd/es/segmented';
import { CiUser } from 'react-icons/ci';
import { CiCreditCard2 } from 'react-icons/ci';
import SVShopInfo from './settings/SVShopInfo';
import SVPersonalInfo from './settings/SVPersonalInfo';
import StripeAccountConnection from './settings/StripeAccountConnection';
import StripeAccountInformation from './settings/StripeAccountInformation';

const SVSettingTabs = ({ userProfile }: any) => {
  const [activeTab, setActiveTab] = React.useState<SegmentedValue>('1');

  const items = [
    {
      value: '1',
      label: 'Profile',
      chipTitle: '',
      icon: <CiUser />,
    },
    {
      value: '2',
      label: 'Stripe Account',
      chipTitle: 'pending',
      icon: <CiCreditCard2 />,
    },
  ];

  const handleTabChange = (value: SegmentedValue) => {
    setActiveTab(value);
  };

  console.log('user profile', userProfile);
  const renderContent = () => {
    return (
      <div className="p-5 h-full bg-white">
        {activeTab === '1' ? (
          <>
            <div className="grid grid-cols-2 gap-10">
              <SVPersonalInfo userProfile={userProfile} />
              <SVShopInfo shopData={userProfile} />
            </div>
          </>
        ) : (
          <div className="w-full">
            {userProfile?.stripeAccountDetails ? (
              <StripeAccountInformation
                bankName={
                  userProfile.stripeAccountDetails.bankName ||
                  'STRIPE TEST BANK'
                }
                country={
                  userProfile.stripeAccountDetails.country || 'United States'
                }
                currency={userProfile.stripeAccountDetails.currency || 'usd'}
                amount={userProfile.stripeAccountDetails.balance}
                onDisconnect={() => {
                  // Implement disconnect logic here
                  console.log('Disconnecting Stripe account');
                }}
              />
            ) : (
              <StripeAccountConnection />
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <div className="py-3 px-3 rounded-md bg-white flex justify-between">
        <Segmented
          options={items.map((item) => ({
            value: item.value,
            label: (
              <div className="flex items-center px-1 py-2">
                {/* <SVTabChip title={item.chipTitle} value={item.chipValue} /> */}
                <div
                  className={`${activeTab === item.value ? 'text-blue-500 text-lg' : 'inherit'}`}
                >
                  {item.icon}
                </div>
                <span
                  style={{
                    marginLeft: 8,
                    fontWeight: activeTab === item.value ? 400 : 400,
                  }}
                  className={`${activeTab === item.value ? 'text-blue-500' : 'inherit'} text-sm`}
                >
                  {item.label}
                </span>
              </div>
            ),
          }))}
          value={activeTab}
          onChange={handleTabChange}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        {userProfile ? (
          renderContent()
        ) : (
          <div className="h-[600px] bg-white flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SVSettingTabs;
