import { SegmentedValue } from 'antd/es/segmented';
import React from 'react';

import SharedTabs from '../ui/SVSharedTabs';

const SVCustomerTabs = ({
  columns,
  customers,
  activeTab,
  setActiveTab,
  setSearchTerm,
  customersLoading,
}: {
  columns: any;
  customers: any;
  activeTab: any;
  setActiveTab: any;
  setSearchTerm: any;
  customersLoading: any;
}) => {
  const items = [
    {
      value: '1',
      label: 'All',
      chipTitle: '',
      chipValue: customers?.meta?.total || 0,
    },
    {
      value: '2',
      label: 'Booked',
      chipTitle: 'active',
      chipValue: customers?.meta?.totalBooked || 0,
      activeColor: '#0661ff',
    },
    {
      value: '3',
      label: 'Completed',
      chipTitle: 'pending',
      chipValue: customers?.meta?.totalCompleted || 0,
      activeColor: '#eda006',
    },
    {
      value: '4',
      label: 'Cancelled',
      chipTitle: 'cancelled',
      chipValue: customers?.meta?.totalCancelled || 0,
      activeColor: '#ff5c33',
    },
  ];

  const handleTabChange = (value: SegmentedValue) => {
    setActiveTab(value);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <SharedTabs
      items={items}
      columns={columns}
      data={customers?.data || customers || []}
      isLoading={customersLoading}
      totalPages={5}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSearch={handleSearch}
    />
  );
};

export default SVCustomerTabs;
