import { Rate, Skeleton } from 'antd';
import Image from 'next/image';
import React from 'react';
import { FaEye, FaRegEye, FaStore } from 'react-icons/fa';
import SVButton from '../SVButton';
import { getUserInfo } from '@/services/auth.service';
import SVSignupConfirmationModal from './SVSignupConfirmationModal';
import { IoEye } from 'react-icons/io5';
import Link from 'next/link';
import SVBookingConfirmationModal from './SVBookingConfirmationModal';

interface ICard {
  images: { img: string }[];
  name: string;
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
  const userInfo: any = getUserInfo();
  return (
    <div className="shadow-custom-shadow h-full flex flex-col relative mt-5 rounded-xl">
      <div className="p-4 mb-5 flex-1">
        <div className="relative w-full h-[200px]">
          {loading ? (
            <Skeleton.Image active className="!w-full !h-full" />
          ) : (
            <Image
              src={service?.images[0]?.img}
              fill
              objectFit="cover"
              objectPosition="center"
              alt=""
            />
          )}
        </div>
        <div className="mt-4">
          {loading ? (
            <Skeleton
              active
              paragraph={{ rows: 3 }}
              className="!w-full !h-[30px]"
            />
          ) : (
            <>
              <div className="flex items-center">
                <FaStore className="text-base mr-2 text-customPrimary-800" />
                <h3 className="font-thin">{service?.shop?.shopName}</h3>
              </div>
              <h3 className="font-medium text-base m-0">{service?.name}</h3>
              <p className="font-thin">{service?.subCategory}</p>
              <h2 className="text-xl text-customPrimary-800 font-medium mt-2">
                ${service?.price}
              </h2>
              <div className="flex items-center">
                <Rate
                  allowHalf
                  defaultValue={2.5}
                  style={{
                    fontSize: 20,
                    marginRight: '10px',
                    color: '#4d3ca3',
                  }}
                />
                <h4 className="text-gray-600 font-extralight">134 reviews</h4>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="w-full p-3 text-white flex-none cursor-pointer">
        {loading ? (
          <Skeleton.Button active block className="!w-full" />
        ) : (
          <>
            {userInfo?.role ? (
              <div className="flex space-x-4 justify-center">
                <div style={{ width: '80%' }}>
                  <SVBookingConfirmationModal width="65%" service={service} />
                </div>
                <Link
                  href={`/product-details/${service?._id}`}
                  className="text-black"
                >
                  <SVButton
                    icon={<FaRegEye className="text-lg" />}
                    type="text"
                    title="Preview"
                    style={{
                      // background: '#fff',
                      color: '#000',
                      borderRadius: '10px',
                    }}
                  />
                </Link>
              </div>
            ) : (
              <div className="flex space-x-4 justify-center">
                <div style={{ width: '80%' }}>
                  <SVSignupConfirmationModal width={400} />
                </div>
                <Link
                  href={`/product-details/${service?._id}`}
                  className="text-black"
                >
                  <SVButton
                    icon={<FaRegEye className="text-lg" />}
                    type="text"
                    title="Preview"
                    style={{
                      // background: '#fff',
                      color: '#000',
                      borderRadius: '10px',
                    }}
                  />
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
