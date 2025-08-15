'use client';

import { Layout } from 'antd';
import React from 'react';

import { RoleSelectionGuard } from '@/components/auth/RoleSelectionGuard';
import Contents from '@/components/ui/Contents';
import Sidebar from '@/components/ui/Sidebar';
import { NotificationProvider } from '@/contexts/NotificationContext';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const AntdLayout = Layout as any;

  return (
    <NotificationProvider>
      <RoleSelectionGuard>
        <AntdLayout>
          <Sidebar />
          <Contents>{children}</Contents>
        </AntdLayout>
      </RoleSelectionGuard>
    </NotificationProvider>
  );
}
