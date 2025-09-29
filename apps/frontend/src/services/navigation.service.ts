interface UserInfo {
  role?: string;
  provider?: string;
  [key: string]: any;
}

export class NavigationService {
  static getDashboardPath(role: string): string {
    // Customer should go to home page, others to their dashboard
    if (role.toLowerCase() === 'customer') {
      return '/';
    }
    return `/${role.toLowerCase()}/dashboard`;
  }

  static async navigateWithPrefetch(
    router: any,
    path: string,
    delay = 100
  ): Promise<void> {
    try {
      router.prefetch(path);
      setTimeout(() => router.push(path), delay);
    } catch {
      router.push(path);
    }
  }

  static shouldRedirectToRoleSelection(user: UserInfo | null): boolean {
    return !!(user?.provider === 'google' && user?.role === 'guest');
  }

  static getRedirectPath(
    user: UserInfo | null,
    currentPath: string
  ): string | null {
    // Not logged in
    if (!user) {
      return currentPath === '/login' ? null : '/login';
    }

    // Needs role selection
    if (this.shouldRedirectToRoleSelection(user)) {
      return currentPath === '/select-role' ? null : '/select-role';
    }

    // Has role - redirect from auth pages
    if (user.role && user.role !== 'guest') {
      if (['/login', '/signup', '/select-role'].includes(currentPath)) {
        return this.getDashboardPath(user.role);
      }

      // For customers, allow them to stay on home page and customer pages
      if (user.role.toLowerCase() === 'customer') {
        // Don't redirect if already on home page or customer pages
        if (currentPath === '/' || currentPath.startsWith('/customer')) {
          return null;
        }
        // Redirect to home page if on other role's pages
        if (
          currentPath.startsWith('/admin') ||
          currentPath.startsWith('/seller')
        ) {
          return '/';
        }
      } else {
        // For other roles, redirect to their dashboard if not on their pages
        const rolePrefix = `/${user.role.toLowerCase()}`;
        if (!currentPath.startsWith(rolePrefix) && currentPath !== '/') {
          return this.getDashboardPath(user.role);
        }
      }
    }

    return null;
  }
}
