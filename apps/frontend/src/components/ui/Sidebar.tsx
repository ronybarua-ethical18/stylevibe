'use client';
import { Layout, Menu } from 'antd';
import { usePathname } from 'next/navigation';
import React from 'react';
import { MdOutlineAdminPanelSettings } from 'react-icons/md';

import { sidebarItems } from '@/constants/sidebarItems';
import { getUserInfo } from '@/services/auth.service';

const { Sider } = Layout;

export default function Sidebar(): React.ReactNode {
  const userInfo: any = getUserInfo();
  const role = userInfo?.role;
  const pathname = usePathname();
  const val = 5;
  const test = 5;

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      width={250}
      onBreakpoint={(broken) => {
        console.log(broken);
      }}
      onCollapse={(collapsed, type) => {
        console.log(collapsed, type);
      }}
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'sticky',
        backgroundColor: 'white',
        color: '#a1abba',
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 3,
      }}
    >
      <div
        style={{
          fontWeight: 600,
          fontSize: '30px',
          textAlign: 'center',
          margin: '2rem auto',
          color: '#6a9cff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <MdOutlineAdminPanelSettings
          style={{ marginRight: '10px', color: '#6a9cff' }}
        />
        {role}
      </div>
      <Menu
        style={{ background: 'white', color: '#151b20' }}
        theme="light"
        mode="inline"
        selectedKeys={[pathname]}
        items={sidebarItems(role)}
      />
    </Sider>
  );
}
