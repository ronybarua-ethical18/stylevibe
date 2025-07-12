'use client'

import React from 'react'
import { Layout } from 'antd'
import SVBreadCrumb from './SVBreadCrumb'
import SVTopbar from './SVTopbar'

const { Content } = Layout

export default function Contents({ children }: { children: React.ReactNode }) {
  return (
    <Content
      style={{
        minHeight: '100vh',
        padding: '100px 30px 30px 30px',
        color: 'black',
        background: '#f6f5fb',
      }}
    >
      <SVTopbar />

      <div>{children}</div>
    </Content>
  )
}
