'use client';
import { ConfigProvider } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';

import { customTheme } from '@/config/antdCustomTheme';
import { store } from '@/redux/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={customTheme}>
      <Provider store={store}>{children}</Provider>
    </ConfigProvider>
  );
}
