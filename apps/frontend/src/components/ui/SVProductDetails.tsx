'use client';
import { useParams } from 'next/navigation';
import React from 'react';
import { FaUser } from 'react-icons/fa';

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
      <div className="bg-[#eee] py-4">
        <div className="flex justify-between items-center bg-[#eee] w-3/4 m-auto">
          <SVNavMenus />
          <div className="flex justify-end items-center">
            <div className="mr-5 rounded-3xl py-2 px-4 border border-customPrimary-800 text-customPrimary-800 flex items-center">
              <FaUser className="text-customPrimary-800 mr-2" />
              Login
            </div>
            <h1>
              <strong className="text-customPrimary-800 text-3xl font-semibold">
                Style
              </strong>
              <span className="text-customPrimary-800 text-3xl font-thin">
                Vibe
              </span>
            </h1>
          </div>
        </div>
      </div>
      <div className="w-3/4 m-auto">
        <Service service={service?.data} loading={serviceLoading} role={true} />
      </div>
    </div>
  );
}
