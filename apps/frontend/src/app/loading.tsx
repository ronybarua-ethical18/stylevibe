'use client'
import React from 'react'
import { InfinitySpin } from 'react-loader-spinner'

export default function Loading() {
  return (
    <div style={{height:'100vh',  display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <InfinitySpin
        // visible={true}
        width="200"
        color="#4fa94d"
        // ariaLabel="infinity-spin-loading"
      />
    </div>
  )
}
