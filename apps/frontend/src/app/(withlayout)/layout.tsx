'use client'

import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Layout } from 'antd'
import React from 'react'
import { isLoggedIn } from '@/services/auth.service'

// Dynamically import Sidebar and Contents with loading fallbacks
const Sidebar = dynamic(() => import('@/components/ui/Sidebar'), {
  ssr: false,
  loading: () => <div>Loading Sidebar...</div>,
})

const Contents = dynamic(() => import('@/components/ui/Contents'), {
  ssr: false,
  loading: () => <div>Loading Content...</div>,
})

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const userLoggedIn = isLoggedIn()

  // Redirect to login page if the user is not logged in
  if (!userLoggedIn) {
    if (typeof window !== 'undefined') {
      router.push('/login')
    }
    return null // Avoid rendering layout if redirecting
  }

  const AntdLayout = Layout as any;

  return (
    <AntdLayout>
      <Sidebar />
      <Contents>{children}</Contents>
    </AntdLayout>
  )
}
