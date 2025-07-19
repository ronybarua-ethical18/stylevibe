'use client'

import SVPageHeading from '@/components/SVPageHeading'
import SVBreadCrumb from '@/components/ui/SVBreadCrumb'
import React, { useState, useCallback, useEffect } from 'react'
import SVPagination from '../ui/SVPagination'
import { SegmentedValue } from 'antd/es/segmented'
import useDebounce from '@/hooks/useDebounce'
import { getQueryParams } from '@/utils/getQueryParams'
import SVStatusChip from '../SVStatusChip'
import { transformingText } from '@/utils/transformingText'
import { IoEyeOutline } from 'react-icons/io5'
import SVModal from '../ui/SVModal'
import { getBreadcrumbItems } from '@/utils/getBreadcumItems'
import { useDispatch } from 'react-redux'
import { showModal } from '@/redux/slices/globalSlice'
import SVTransactionTabs from './components/SVTransactionTabs'
import { useGetTransactionsQuery } from '@/redux/api/transactions'

export default function Transactions({ fromDashboard = false }: { fromDashboard?: boolean }) {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1')
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  // Set initial limit based on fromDashboard
  const [limit, setLimit] = useState(fromDashboard ? 5 : 10)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const dispatch = useDispatch()

  // Ensure limit is always 5 if fromDashboard is true
  useEffect(() => {
    if (fromDashboard) setLimit(5)
  }, [fromDashboard])

  const handlePageChange = (page: number, pageSize: number) => {
    setPageNumber(page)
    if (!fromDashboard) setLimit(pageSize)
  }

  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 })
  const { query } = getQueryParams(
    pageNumber,
    limit,
    debouncedSearchTerm,
    activeTab,
    'transactions'
  )

  const { data: transactions, isLoading: transactionLoading } = useGetTransactionsQuery({
    ...query,
  })

  const handleEditClick = useCallback((record: any) => {
    setSelectedRecord(record)
    dispatch(showModal(true))
  }, [dispatch])

  // Define all columns
  const allColumns = [
    // {
    //   title: 'Transaction ID',
    //   render: function (data: any) {
    //     return <>{data?.transactionId || "SVTA2345-43242342"}</>
    //   },
    // },
    {
      title: 'Payment Intent ID',
      dataIndex: 'stripePaymentIntentId',
      key: 'stripePaymentIntentId',
    },
    {
      title: 'Booking ID',
      render: function (data: any) {
        return <>{data?.booking?.bookingId || "SVBA2345-43242342"}</>
      },
      key: 'bookingId',
    },
    {
      title: 'Service Name',
      render: function (data: any) {
        return <>{data?.service?.name || "SVBA2345-43242342"}</>
      },
      key: 'serviceName',
    },
    // {
    //   title: 'Seller',
    //   render: function (data: any) {
    //     return <>{data?.seller?.email || "SVBA2345-43242342"}</>
    //   },
    // },
    {
      title: 'Customer',
      render: function (data: any) {
        return <>{data?.customer?.email || "N/A"}</>
      },
      key: 'customer',
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Payout Amount',
      dataIndex: 'sellerAmount',
      key: 'sellerAmount',
    },
    {
      title: 'Application Fee',
      dataIndex: 'applicationFee',
      key: 'applicationFee',
    },
    {
      title: 'Processing Fee',
      dataIndex: 'stripeProcessingFee',
      key: 'stripeProcessingFee',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => (
        <SVStatusChip status={transformingText(status)} />
      ),
      key: 'status',
    },
    {
      title: 'Action',
      align: 'right',
      render: (record: any) => (
        <div className="flex justify-end">
          <div className="flex align-baseline">
            <IoEyeOutline
              className="mr-2 text-xl cursor-pointer"
              // onClick={() => router.push(`/${userDetails?.role}/services/${record?._id}`)}
            />
          </div>
        </div>
      ),
      key: 'action',
    },
  ]

  // Filter columns based on fromDashboard
  const columns = fromDashboard
    ? allColumns.filter(
        col =>
          !['stripePaymentIntentId', 'applicationFee', 'stripeProcessingFee','paymentMethod', 'action'].includes(
            col.key as string
          )
      )
    : allColumns

  return (
    <div>
      {/* Only show these if not fromDashboard */}
      {!fromDashboard && (
        <>
          <SVBreadCrumb items={getBreadcrumbItems('services')} />
          <SVPageHeading
            pageTitle="Transactions"
            pageSubTitle="See your active and inactive transactions and make changes"
            numberOfItems={`${transactions?.meta?.total || 0} transactions`}
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

     {!fromDashboard && <>
      <div className="mt-12">
        <SVPagination
          onPageChange={handlePageChange}
          defaultCurrent={1}
          total={transactions?.meta?.total}
        />
      </div>
      {selectedRecord && (
        <div className='visibility: hidden'><SVModal
        width="800px"
        data={selectedRecord}
        setSelectedRecord={setSelectedRecord}
      /></div>
      )}
      </>}
    </div>
  )
}
