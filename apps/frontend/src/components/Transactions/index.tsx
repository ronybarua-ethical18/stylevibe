'use client'

import SVPageHeading from '@/components/SVPageHeading'
import SVBreadCrumb from '@/components/ui/SVBreadCrumb'
import React, { useState, useCallback } from 'react'
import SVPagination from '../ui/SVPagination'
import { SegmentedValue } from 'antd/es/segmented'
import useDebounce from '@/hooks/useDebounce'
import { getQueryParams } from '@/utils/getQueryParams'
import SVStatusChip from '../SVStatusChip'
import { transformingText } from '@/utils/transformingText'
import { IoEyeOutline } from 'react-icons/io5'
import SVModal from '../ui/SVModal'
import { useRouter } from 'next/navigation'
import { getUserInfo } from '@/services/auth.service'
import { getBreadcrumbItems } from '@/utils/getBreadcumItems'
import { useDispatch } from 'react-redux'
import { showModal } from '@/redux/slices/globalSlice'
import { LiaEdit } from 'react-icons/lia'
import SVTransactionTabs from './components/SVTransactionTabs'
import { useGetTransactionsQuery } from '@/redux/api/transactions'

export default function Transactions() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1')
  const [searchTerm, setSearchTerm] = useState('')
  const [pageNumber, setPageNumber] = useState(1)
  const [limit, setLimit] = useState(10)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const userDetails: any = getUserInfo()

  const router = useRouter()
  const dispatch = useDispatch()

  const handlePageChange = (page: number, pageSize: number) => {
    setPageNumber(page)
    setLimit(pageSize)
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

  console.log("transactions", transactions)

  const columns = [
    // {
    //   title: 'Transaction ID',
    //   render: function (data: any) {
    //     return <>{data?.transactionId || "SVTA2345-43242342"}</>
    //   },
    // },
    {
      title: 'Payment Intent ID',
      dataIndex: 'stripePaymentIntentId',
    },
    {
      title: 'Booking ID',
      render: function (data: any) {
        return <>{data?.booking?.bookingId || "SVBA2345-43242342"}</>
      }
    },
    {
      title: 'Service Name',
      render: function (data: any) {
        return <>{data?.service?.name || "SVBA2345-43242342"}</>
      }
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
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
    },
    {
      title: 'Payout Amount',
      dataIndex: 'sellerAmount',
    },
    {
      title: 'Application Fee',
      dataIndex: 'applicationFee',
    },
    {
      title: 'Processing Fee',
      dataIndex: 'stripeProcessingFee',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      align: 'center',
      render: (status: string) => (
        <SVStatusChip status={transformingText(status)} />
      ),
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
    },
  ]

  return (
    <div>
      <SVBreadCrumb items={getBreadcrumbItems('services')} />
      <SVPageHeading
        pageTitle="Transactions"
        pageSubTitle="See your active and inactive transactions and make changes"
        numberOfItems={`${transactions?.meta?.total || 0} transactions`}
      />
      <SVTransactionTabs
        columns={columns}
        activeTab={activeTab}
        transactions={transactions}
        transactionsLoading={transactionLoading}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
      />

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
    </div>
  )
}
