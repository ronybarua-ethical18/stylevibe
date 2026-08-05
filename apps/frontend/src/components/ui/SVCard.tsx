import { Rate, Skeleton } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import SVBookingConfirmationModal from './SVBookingConfirmationModal';
import SVSignupConfirmationModal from './SVSignupConfirmationModal';

import { useUserInfo } from '@/hooks/useUserInfo';

interface ICard {
  images: { img: string }[];
  name: string;
  category?: string;
  subCategory: string;
  price: number;
  description: string;
  shop: {
    shopName: string;
  };
  _id: any;
}

export default function SVCard({
  service,
  loading,
}: {
  service: ICard;
  loading: boolean;
}): JSX.Element {
  const { hasRole, userInfo } = useUserInfo();
  const isCustomer = userInfo?.role === 'customer';

  return (
    <div className="group h-full flex flex-col bg-white border border-gray-200 rounded-2xl p-4 pb-6 transition duration-200 hover:-translate-y-1 hover:shadow-custom-shadow">
      {loading ? (
        <>
          <Skeleton.Image active className="!w-full !h-[170px] !rounded-xl" />
          <Skeleton active paragraph={{ rows: 3 }} className="!w-full mt-4" />
        </>
      ) : (
        <>
          <Link
            href={`/product-details/${service?._id}`}
            className="relative block w-full h-[170px] rounded-xl overflow-hidden mb-4"
          >
            {service?.images?.[0]?.img && (
              <Image
                src={service.images[0].img}
                fill
                className="object-cover object-center transition-transform duration-300 group-hover:scale-105"
                alt={service?.name || ''}
              />
            )}
          </Link>
          <span className="text-2xs font-semibold uppercase tracking-[0.16em] text-customPrimary-500 mx-2">
            {service?.category || service?.subCategory}
          </span>
          <Link href={`/product-details/${service?._id}`}>
            <h3 className="text-lg font-semibold text-gray-800 tracking-tight leading-snug mt-2 mb-0.5 mx-2 transition hover:text-customPrimary-700">
              {service?.name}
            </h3>
          </Link>
          <p className="text-[13.5px] text-gray-500 m-0 mb-3.5 mx-2">
            {service?.shop?.shopName}
          </p>
          <div className="flex items-center gap-2 mx-2 text-[13px] text-gray-500 tabular-nums">
            <Rate
              allowHalf
              disabled
              defaultValue={4.5}
              style={{ fontSize: 13, color: '#6a5ac2' }}
            />
            <span>(134)</span>
          </div>
          <div className="flex items-center justify-between mt-auto pt-4 mx-2 border-t border-gray-100">
            <span className="text-xl font-semibold text-gray-800 tracking-tight tabular-nums whitespace-nowrap mr-2">
              ${service?.price}
              <span className="text-xs font-normal text-gray-500"> from</span>
            </span>
            <div className="w-32">
              {hasRole && isCustomer ? (
                <SVBookingConfirmationModal width="65%" service={service} />
              ) : !hasRole ? (
                <SVSignupConfirmationModal width={400} />
              ) : (
                <Link
                  href={`/product-details/${service?._id}`}
                  className="block text-center text-sm font-medium text-customPrimary-800 border border-customPrimary-800 rounded-full py-1.5 transition hover:bg-customPrimary-50"
                >
                  Preview
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
