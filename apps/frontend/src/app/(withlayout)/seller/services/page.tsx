import { Metadata } from 'next'
import dynamic from 'next/dynamic'
import React from 'react'

const Services = dynamic(() => import('@/components/Services/Services'), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'Style Vibe | Seller | Services',
  description: 'This is the service page of seller',
}
export default function ServicePage() {
  return (
    <>
      <Services />
    </>
  )
}
