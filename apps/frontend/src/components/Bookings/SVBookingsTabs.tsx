import React from 'react'
import { SegmentedValue } from 'antd/es/segmented'
import SharedTabs from '../ui/SVSharedTabs'

const SVBookingsTabs = ({
  columns,
  bookings,
  activeTab,
  setActiveTab,
  setSearchTerm,
  bookingsLoading,
}: {
  columns: any
  bookings:any
  activeTab: any
  setActiveTab: any
  setSearchTerm: any
  bookingsLoading: any
}) => {
  const items = [
    {
      value: '1',
      label: 'All',
      chipTitle: '',
      chipValue: bookings?.meta?.total || 0,
    },
    {
      value: '2',
      label: 'Booked',
      chipTitle: 'active',
      chipValue: bookings?.meta?.totalBooked || 0,
      activeColor: '#0661ff',
    },
    {
      value: '3',
      label: 'Completed',
      chipTitle: 'pending',
      chipValue: bookings?.meta?.totalCompleted || 0,
      activeColor: '#eda006',
    },
    {
      value: '4',
      label: 'Cancelled',
      chipTitle: 'cancelled',
      chipValue: bookings?.meta?.totalCancelled || 0,
      activeColor: '#ff5c33',
    },
  ]

  const handleTabChange = (value: SegmentedValue) => {
    setActiveTab(value)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
  }

  return (
    <SharedTabs
      items={items}
      columns={columns}
      data={bookings?.data || bookings || []}
      isLoading={bookingsLoading}
      totalPages={5}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSearch={handleSearch}
    />
  )
}

export default SVBookingsTabs
