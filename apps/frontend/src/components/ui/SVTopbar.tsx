import React from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import ProfileDropmenu from './ProfileDropmenu';
import { NotificationBell } from '../NotificationBell';
import { useMenuHandler } from '@/utils/menuHandler';

export default function SVTopbar() {
  const { userInfo } = useUserInfo();

  const handleMenuClick = useMenuHandler();

  return (
    <div
      style={{
        background: 'white',
        width: '100%',
        padding: '10px 25px',
        position: 'fixed',
        textAlign: 'right',
        display: 'flex',
        justifyContent: 'flex-end',
        top: 0,
        left: 0,
        zIndex: 2,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <NotificationBell />
        <ProfileDropmenu
          user={{
            name: userInfo?.name || 'User',
            email: userInfo?.email || 'user@example.com',
            img: userInfo?.img,
            isOnline: true,
            role: userInfo?.role,
          }}
          onMenuClick={handleMenuClick}
        />
      </div>
    </div>
  );
}
