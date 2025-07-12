import dynamic from 'next/dynamic'
import React from 'react'

const Bookings = dynamic(() => import('@/components/Bookings'), {
  ssr: false, 
})

export default function BookingsPage() {
  return <Bookings />
}
