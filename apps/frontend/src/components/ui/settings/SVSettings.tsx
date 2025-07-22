'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import SVBreadCrumb from '../SVBreadCrumb';
import SVSettingTabs from '../SVSettingTabs';
import SVStripeSuccessfulConnectionModal from '../SVStripeSuccessfulConnectionModal';

import { useGetUserProfileQuery } from '@/redux/api/users';
import { getUserInfo } from '@/services/auth.service';

function SVSettings() {
  const loggedUser: any = getUserInfo();
  const { data: userProfile } = useGetUserProfileQuery(loggedUser?.userId);

  const searchParams = useSearchParams();
  const router = useRouter();
  const success = searchParams.get('success');
  const [modalVisible, setModalVisible] = React.useState(false);

  useEffect(() => {
    if (success) {
      setModalVisible(true);

      // Remove the query parameter after 2 seconds
      const timer = setTimeout(() => {
        router.replace('/seller/settings');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, router]);

  return (
    <div>
      <SVBreadCrumb
        items={[
          {
            label: `seller`,
            link: `/seller`,
          },
          {
            label: `settings`,
            link: `/seller/settings`,
          },
        ]}
      />
      <div className="mb-6">
        <h1 className="font-semibold text-2xl mb-0 mt-5">Settings</h1>
        <h2 className="font-extralight text-base mt-0">
          Control your profile as your need
        </h2>
      </div>
      <div style={{ visibility: modalVisible ? 'visible' : 'hidden' }}>
        <SVStripeSuccessfulConnectionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      </div>
      <SVSettingTabs userProfile={userProfile?.data} />
    </div>
  );
}

export default SVSettings;
