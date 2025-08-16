import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import React from 'react';
import { clearLocalStorage } from '@/utils/handleLocalStorage';
import { useUserInfo } from '@/hooks/useUserInfo';
import ProfileDropmenu from './ProfileDropmenu';
import { NotificationBell } from '../NotificationBell';

export default function SVTopbar() {
  const router = useRouter();
  const { userInfo } = useUserInfo();

  const logOut = async () => {
    clearLocalStorage();
    // Sign out from NextAuth (this clears the session)
    await signOut({
      redirect: false, // Prevent automatic redirect so we can handle it manually
    });
    // Redirect to login page
    router.push('/login');
  };

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'sign-out':
        logOut();
        break;
      case 'view-profile':
        // Navigate to profile page
        break;
      case 'settings':
        // Open settings modal/page
        break;
      case 'subscription':
        // Navigate to subscription page
        break;
      case 'changelog':
        // Open changelog modal
        break;
      case 'team':
        // Navigate to team page
        break;
      case 'invite-member':
        // Open invite member modal
        break;
      case 'support':
        // Open support chat/modal
        break;
      case 'community':
        // Navigate to community page
        break;
      default:
        break;
    }
  };

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
        {/* <BellOutlined style={{ fontSize: '25px', marginRight: '10px' }} /> */}
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
