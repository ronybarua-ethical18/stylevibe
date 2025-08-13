'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { useUserInfo } from '@/hooks/useUserInfo';

interface RoleSelectionGuardProps {
  children: React.ReactNode;
}

export const RoleSelectionGuard = ({ children }: RoleSelectionGuardProps) => {
  const router = useRouter();
  const { isAuthenticated, needsRoleSelection, isLoading, userInfo } =
    useUserInfo();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (needsRoleSelection) {
        router.push('/select-role');
      } else if (userInfo?.role) {
        router.push(`/${userInfo.role.toLowerCase()}/dashboard`);
      }
    }
  }, [isAuthenticated, needsRoleSelection, isLoading, userInfo, router]);

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  // Don't render children if user is not authenticated or needs role selection
  if (!isAuthenticated || needsRoleSelection) {
    return null;
  }

  return <>{children}</>;
};
