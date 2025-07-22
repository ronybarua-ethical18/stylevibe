'use client';
import { ConfigProvider } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';

import { store } from '@/redux/store';
import { customTheme } from '@/config/antdCustomTheme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={customTheme}>
      <Provider store={store}>{children}</Provider>
    </ConfigProvider>
  );
}
