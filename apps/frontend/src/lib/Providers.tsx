'use client';
import { ConfigProvider, App as AntApp } from 'antd';
import React from 'react';
import { Provider } from 'react-redux';

import { customTheme } from '@/config/antdCustomTheme';
import { store } from '@/redux/store';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={customTheme}>
      <Provider store={store}>
        <AntApp>{children}</AntApp>
      </Provider>
    </ConfigProvider>
  );
}
