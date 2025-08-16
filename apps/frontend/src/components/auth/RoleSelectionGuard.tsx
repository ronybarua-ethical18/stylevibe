'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useUserInfo } from '@/hooks/useUserInfo';
import { NavigationService } from '@/services/navigation.service';
import SuccessLoader from '../ui/SuccessLoader';

interface RoleSelectionGuardProps {
  children: React.ReactNode;
}

export const RoleSelectionGuard = ({ children }: RoleSelectionGuardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading, userInfo } = useUserInfo();

  // Add client-side only state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isLoading && isClient) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (NavigationService.shouldRedirectToRoleSelection(userInfo)) {
        router.push('/select-role');
      } else if (userInfo?.role) {
        // Only redirect to dashboard if user is not already on a valid page for their role
        const currentRole = userInfo.role.toLowerCase();
        const isValidRolePage = pathname.startsWith(`/${currentRole}/`);

        if (!isValidRolePage) {
          router.push(`/${currentRole}/dashboard`);
        }
      }
    }
  }, [isAuthenticated, isLoading, userInfo, router, isClient, pathname]);

  // During SSR and initial client render, show a consistent loading state
  if (!isClient || isLoading) {
    return <SuccessLoader title="" message="Please wait..." />;
  }

  // Don't render children if user is not authenticated or needs role selection
  if (
    !isAuthenticated ||
    NavigationService.shouldRedirectToRoleSelection(userInfo)
  ) {
    return null;
  }

  return <>{children}</>;
};
