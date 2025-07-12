import React from 'react'
import { SegmentedValue } from 'antd/es/segmented'
import { useGetServicesQuery } from '@/redux/api/services'
import SharedTabs from '@/components/ui/SVSharedTabs'
import useDebounce from '@/hooks/useDebounce'

const SVServiceTabs = ({
  columns,
  services,
  activeTab,
  setActiveTab,
  setSearchTerm,
  servicesLoading,
}: {
  columns: any
  services:any
  activeTab: any
  setActiveTab: any
  setSearchTerm: any
  servicesLoading: any
}) => {
  const items = [
    {
      value: '1',
      label: 'All',
      chipTitle: '',
      chipValue: services?.meta?.total || 0,
    },
    {
      value: '2',
      label: 'Active',
      chipTitle: 'active',
      chipValue: services?.meta?.totalApproved || 0,
      activeColor: '#0661ff',
    },
    {
      value: '3',
      label: 'Pending',
      chipTitle: 'pending',
      chipValue: services?.meta?.totalPending || 0,
      activeColor: '#eda006',
    },
    {
      value: '4',
      label: 'Rejected',
      chipTitle: 'rejected',
      chipValue: services?.meta?.totalRejected || 0,
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
      data={services?.data || []}
      isLoading={servicesLoading}
      totalPages={5}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSearch={handleSearch}
    />
  )
}

export default SVServiceTabs
