'use client';

import { SegmentedValue } from 'antd/es/segmented';
import React, { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { message } from 'antd';

import SVServiceTabs from './components/SVServiceTabs';
import SVPageHeading from '@/components/SVPageHeading';
import SVBreadCrumb from '@/components/ui/SVBreadCrumb';
import SVModal from '../ui/SVModal';
import SVPagination from '../ui/SVPagination';
import useDebounce from '@/hooks/useDebounce';
import {
  useGetServicesQuery,
  useDeleteServiceMutation,
} from '@/redux/api/services';
import { showModal } from '@/redux/slices/globalSlice';
import { getQueryParams } from '@/utils/getQueryParams';
import { useUserInfo } from '@/hooks/useUserInfo';
import { useServiceColumns } from './hooks/useServiceColumns';
import { useServiceData } from './hooks/useServiceData';

export default function Services() {
  const [activeTab, setActiveTab] = useState<SegmentedValue>('1');
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const { userInfo } = useUserInfo();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handlePageChange = useCallback((page: number, pageSize: number) => {
    setPageNumber(page);
    setLimit(pageSize);
  }, []);

  const debouncedSearchTerm = useDebounce({ value: searchTerm, delay: 500 });

  const query = useMemo(() => {
    const { query } = getQueryParams(
      pageNumber,
      limit,
      debouncedSearchTerm,
      activeTab
    );
    return query;
  }, [pageNumber, limit, debouncedSearchTerm, activeTab]);

  const { data: services, isLoading: servicesLoading } = useGetServicesQuery({
    ...query,
  });
  const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

  const handleDelete = useCallback(
    async (serviceId: any) => {
      try {
        await deleteService(serviceId).unwrap();
        messageApi.success('Service deleted successfully');
      } catch {
        messageApi.error('Failed to delete service');
      }
    },
    [deleteService, messageApi]
  );

  const handleEditClick = useCallback(
    (record: any) => {
      setSelectedRecord(record);
      dispatch(showModal(true));
    },
    [dispatch]
  );

  // Custom hooks for better separation of concerns
  const columns = useServiceColumns({
    userInfo,
    handleEditClick,
    handleDelete,
    isDeleting,
  });
  const { breadcrumbItems, totalServices, shouldShowModal } = useServiceData({
    services,
    selectedRecord,
  });

  return (
    <>
      {contextHolder}
      <SVBreadCrumb items={breadcrumbItems} />
      <SVPageHeading
        pageTitle="Services"
        pageSubTitle="See your active and inactive services and make changes"
        numberOfItems={`${totalServices} services`}
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
          total={totalServices}
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
  );
}
