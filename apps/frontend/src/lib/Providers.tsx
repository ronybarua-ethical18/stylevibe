'use client'
import { customTheme } from '@/config/antdCustomTheme'
import { store } from '@/redux/store'
import { ConfigProvider } from 'antd'
import React from 'react'
import { Provider } from 'react-redux'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider theme={customTheme}>
      <Provider store={store}>{children}</Provider>
    </ConfigProvider>
  )
}
