'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Layout } from 'antd';
import React, { useEffect, useState } from 'react';
import { isLoggedIn } from '@/services/auth.service';
import Sidebar from '@/components/ui/Sidebar';
import Contents from '@/components/ui/Contents';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    setIsClient(true);
    setUserLoggedIn(isLoggedIn());
  }, []);

  useEffect(() => {
    if (isClient && userLoggedIn === false) {
      router.push('/login');
    }
  }, [isClient, userLoggedIn, router]);

  if (!isClient || userLoggedIn === null) {
    // Optionally show a loading spinner here
    return null;
  }

  const AntdLayout = Layout as any;

  return (
    <AntdLayout>
      <Sidebar />
      <Contents>{children}</Contents>
    </AntdLayout>
  );
}
