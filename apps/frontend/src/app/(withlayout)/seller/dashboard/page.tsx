import SVBreadCrumb from '@/components/ui/SVBreadCrumb'
import React from 'react'

export default function SellerDashboard() {
  return (
    <div>
      <SVBreadCrumb
        items={[
          {
            label: `seller`,
            link: `/seller`,
          },
          {
            label: `dashboard`,
            link: `/seller/dashboard`,
          },
        ]}
      />
      This is seller dashboard
    </div>
  )
}
