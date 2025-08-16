interface UserInfo {
  role?: string;
  provider?: string;
  [key: string]: any;
}

export class NavigationService {
  static getDashboardPath(role: string): string {
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

    // Has role - redirect from auth pages to dashboard
    if (user.role && user.role !== 'guest') {
      if (['/login', '/signup', '/select-role'].includes(currentPath)) {
        return this.getDashboardPath(user.role);
      }

      // If not on their role's pages, redirect to dashboard
      const rolePrefix = `/${user.role.toLowerCase()}`;
      if (!currentPath.startsWith(rolePrefix) && currentPath !== '/') {
        return this.getDashboardPath(user.role);
      }
    }

    return null;
  }
}
