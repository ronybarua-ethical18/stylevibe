import { SegmentedValue } from 'antd/es/segmented';
import React from 'react';

import SharedTabs from '@/components/ui/SVSharedTabs';

const SVTransactionTabs = ({
  columns,
  transactions,
  activeTab,
  setActiveTab,
  setSearchTerm,
  transactionsLoading,
  fromDashboard,
}: {
  columns: any;
  transactions: any;
  activeTab: any;
  setActiveTab: any;
  setSearchTerm: any;
  transactionsLoading: any;
  fromDashboard: boolean;
}) => {
  const items = [
    {
      value: '1',
      label: 'All',
      chipTitle: '',
      chipValue: transactions?.meta?.total || 0,
    },
    {
      value: '2',
      label: 'Pending',
      chipTitle: 'pending',
      chipValue: transactions?.meta?.totalPending || 0,
      activeColor: '#eda006',
    },
    {
      value: '3',
      label: 'Completed',
      chipTitle: 'Completed',
      chipValue: transactions?.meta?.totalCompleted || 0,

      activeColor: '#0661ff',
    },
    {
      value: '4',
      label: 'Refunded',
      chipTitle: 'Refunded',
      chipValue: transactions?.meta?.totalRefunded || 0,
      activeColor: '#ff5c33',
    },
    // {
    //   value: '4',
    //   label: 'Failed',
    //   chipTitle: 'Failed',
    //   chipValue: services?.meta?.totalRejected || 0,
    //   activeColor: '#ff5c33',
    // },
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
      data={transactions?.data || []}
      isLoading={transactionsLoading}
      totalPages={5}
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onSearch={handleSearch}
      fromDashboard={fromDashboard}
    />
  );
};

export default SVTransactionTabs;
