'use client';

import { SegmentedValue } from 'antd/es/segmented';
import React, { useState, useEffect, useCallback, useMemo } from 'react';

import SVTransactionTabs from './components/SVTransactionTabs';
import SVPageHeading from '@/components/SVPageHeading';
import SVBreadCrumb from '@/components/ui/SVBreadCrumb';
import SVModal from '../ui/SVModal';
import SVPagination from '../ui/SVPagination';
import useDebounce from '@/hooks/useDebounce';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useGetTransactionsQuery } from '@/redux/api/transactions';
import { getQueryParams } from '@/utils/getQueryParams';
import { useTransactionColumns } from './hooks/useTransactionColumns';
import { useTransactionData } from './hooks/useTransactionData';

export default function Transactions({
  fromDashboard = false,
}: {
  fromDashboard?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(fromDashboard ? 5 : 10);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { userInfo } = useUserInfo();

  useEffect(() => {
    if (fromDashboard) setLimit(5);
  }, [fromDashboard]);

  const handlePageChange = useCallback(
    (page: number, pageSize: number) => {
      setPageNumber(page);
      if (!fromDashboard) setLimit(pageSize);
    },
    [fromDashboard]
  );

  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

  const query = useMemo(() => {
    const { query } = getQueryParams(
      pageNumber,
      limit,
      debouncedSearchTerm,
      activeTab,
      'transactions'
    );
    return query;
  }, [pageNumber, limit, debouncedSearchTerm, activeTab]);

  const { data: transactions, isLoading: transactionLoading } =
    useGetTransactionsQuery({ ...query });

  // Custom hooks for better separation of concerns
  const columns = useTransactionColumns({ fromDashboard, userInfo });
  const { breadcrumbItems, totalTransactions, shouldShowModal } =
    useTransactionData({
      transactions,
      selectedRecord,
    });

  return (
    <div>
      {!fromDashboard && (
        <>
          <SVBreadCrumb items={breadcrumbItems} />
          <SVPageHeading
            pageTitle="Transactions"
            pageSubTitle="See your active and inactive transactions and make changes"
            numberOfItems={`${totalTransactions} transactions`}
          />
        </>
      )}

      <SVTransactionTabs
        columns={columns}
        activeTab={activeTab}
        transactions={transactions}
        transactionsLoading={transactionLoading}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
        fromDashboard={fromDashboard}
      />

      {!fromDashboard && (
        <>
          <div className="mt-12">
            <SVPagination
              onPageChange={handlePageChange}
              defaultCurrent={1}
              total={totalTransactions}
            />
          </div>

          {shouldShowModal && (
            <SVModal
              width="800px"
              data={selectedRecord}
              setSelectedRecord={setSelectedRecord}
            />
          )}
        </>
      )}
    </div>
  );
}
