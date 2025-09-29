'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import Service from '../Services/Service';
import SVNavMenus from './SVNavMenus';
import { useGetServiceQuery } from '@/redux/api/services';

export default function SVProductDetails() {
  const params = useParams();
  const { data: service, isLoading: serviceLoading } = useGetServiceQuery(
    params.id
  );

  return (
    <div className="">
      <SVNavMenus />
      <div className="w-3/4 m-auto">
        <Service service={service?.data} loading={serviceLoading} role={true} />
      </div>
    </div>
  );
}
