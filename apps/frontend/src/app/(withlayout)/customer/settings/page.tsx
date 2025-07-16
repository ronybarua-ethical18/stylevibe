import dynamic from 'next/dynamic'
import React from 'react'

const SVSettings = dynamic(() => import('@/components/ui/settings/SVSettings'), { 
  ssr: false // Disable server-side rendering if the component should only load on the client side
})

export default function SettingPage() {
  return (
    <div>
      <SVSettings />
    </div>
  )
}
