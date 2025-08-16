import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { NavigationService } from '@/services/navigation.service';

interface UserInfo {
  role?: string;
  provider?: string;
  [key: string]: any;
}

export const useAuthRedirect = (user: UserInfo | null, isLoading: boolean) => {
  const router = useRouter();
  const pathname = usePathname();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (isLoading || hasRedirected.current) return;

    const redirectPath = NavigationService.getRedirectPath(user, pathname);

    if (redirectPath) {
      hasRedirected.current = true;
      NavigationService.navigateWithPrefetch(router, redirectPath);

      // Reset after redirect to allow future redirects
      setTimeout(() => {
        hasRedirected.current = false;
      }, 1000);
    }
  }, [user, pathname, isLoading, router]);

  // Reset when user changes significantly
  useEffect(() => {
    hasRedirected.current = false;
  }, [user?.role, user?.userId]);
};
