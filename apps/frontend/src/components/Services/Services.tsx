'use client';

import { SegmentedValue } from 'antd/es/segmented';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';
import { IoEyeOutline } from 'react-icons/io5';
import { LiaEdit } from 'react-icons/lia';
import { useDispatch } from 'react-redux';

import SVStatusChip from '../SVStatusChip';
import SVConfirmationModal from '../ui/SVConfirmationModal';
import SVModal from '../ui/SVModal';
import SVPagination from '../ui/SVPagination';

import SVServiceTabs from './components/SVServiceTabs';

import SVPageHeading from '@/components/SVPageHeading';
import SVBreadCrumb from '@/components/ui/SVBreadCrumb';
import useDebounce from '@/hooks/useDebounce';
import {
  useDeleteServiceMutation,
  useGetServicesQuery,
} from '@/redux/api/services';
import { showModal } from '@/redux/slices/globalSlice';
import { getUserInfo } from '@/services/auth.service';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';
import { getQueryParams } from '@/utils/getQueryParams';
import { transformingText } from '@/utils/transformingText';

export default function Services() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const userDetails: any = getUserInfo();

  const router = useRouter();
  const dispatch = useDispatch();

  const handlePageChange = (page: number, pageSize: number) => {
    setPageNumber(page);
    setLimit(pageSize);
  };

  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
  const { query } = getQueryParams(
    pageNumber,
    limit,
    debouncedSearchTerm,
    activeTab
  );

  const { data: services, isLoading: servicesLoading } = useGetServicesQuery({
    ...query,
  });

  const handleDelete = async (serviceId: any) => {
    try {
      await deleteService(serviceId).unwrap();
      console.log('Service deleted successfully');
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleEditClick = useCallback(
    (record: any) => {
      setSelectedRecord(record);
      dispatch(showModal(true));
    },
    [dispatch]
  );

  const columns = [
    {
      title: 'Service name',
      dataIndex: 'name',
      render: (name: string, record: any) => (
        <span
          className="cursor-pointer"
          onClick={() =>
            router.push(`/${userDetails?.role}/services/${record?._id}`)
          }
        >
          {name}
        </span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
    },
    {
      title: 'Subcategory',
      dataIndex: 'subCategory',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      render: (price: number) => `$${price?.toFixed(2)}`,
    },
    {
      title: 'Shop name',
      render: (record: any) => record?.shop?.shopName,
    },
    {
      title: 'Availability',
      dataIndex: 'availability',
      render: (availability: boolean) => (availability ? 'Available' : 'N/A'),
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
              onClick={() =>
                router.push(`/${userDetails?.role}/services/${record?._id}`)
              }
            />
            <LiaEdit
              className="mr-2 text-xl cursor-pointer"
              onClick={() => handleEditClick(record)}
            />
            <SVConfirmationModal
              buttonTitle={isDeleting ? 'Processing...' : 'Confirm'}
              item={record}
              func={() => handleDelete(record._id)}
              isLoading={isDeleting}
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div>
      <SVBreadCrumb items={getBreadcrumbItems('services')} />
      <SVPageHeading
        pageTitle="Services"
        pageSubTitle="See your active and inactive services and make changes"
        numberOfItems={`${services?.meta?.total || 0} services`}
        modalTitle="Create service"
        buttonTitle="Create service"
        width="800px"
      />
      <SVServiceTabs
        columns={columns}
        activeTab={activeTab}
        services={services}
        servicesLoading={servicesLoading}
        setActiveTab={setActiveTab}
        setSearchTerm={setSearchTerm}
      />

      <div className="mt-12">
        <SVPagination
          onPageChange={handlePageChange}
          defaultCurrent={1}
          total={services?.meta?.total}
        />
      </div>
      {selectedRecord && (
        <div className="visibility: hidden">
          <SVModal
            width="800px"
            data={selectedRecord}
            setSelectedRecord={setSelectedRecord}
          />
        </div>
      )}
    </div>
  );
}
