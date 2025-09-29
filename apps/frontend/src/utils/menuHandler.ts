'use client';

import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { clearLocalStorage } from './handleLocalStorage';
import { useUserInfo } from '@/hooks/useUserInfo';

export const useMenuHandler = () => {
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
        router.push(`/${userInfo?.role}/settings`);
        break;
      case 'settings':
        // Open settings modal/page
        router.push('/settings');
        break;
      case 'subscription':
        // Navigate to subscription page
        router.push('/subscription');
        break;
      case 'changelog':
        // Open changelog modal
        // Could implement a modal or redirect
        break;
      case 'team':
        // Navigate to team page
        router.push('/team');
        break;
      case 'invite-member':
        // Open invite member modal
        // Could implement a modal
        break;
      case 'support':
        // Open support chat/modal
        router.push('/support');
        break;
      case 'community':
        // Navigate to community page
        router.push('/community');
        break;
      default:
        break;
    }
  };

  return handleMenuClick;
};
