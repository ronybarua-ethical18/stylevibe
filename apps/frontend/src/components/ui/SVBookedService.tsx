import { Rate } from 'antd';
import Image from 'next/image';
import React from 'react';
import { FaStore } from 'react-icons/fa';

export default function SVBookedService({ service }: any) {
  return (
    <div className="relative rounded-xl mt-4">
      <div className="mt-1 flex w-full items-center">
        <div className="relative w-[120px] h-[120px] mr-4">
          <Image
            src={service?.images[0]?.img}
            fill
            alt="Bride"
            style={{
              objectFit: 'cover',
              borderRadius: '10px',
            }}
          />
        </div>
        <div className="flex justify-between w-full items-center">
          <div>
            <div className="flex items-center">
              <FaStore className="text-base mr-2 text-customPrimary-800" />
              <h3 className="font-thin ">{service?.shop?.shopName}</h3>
            </div>
            <div>
              <h3 className="font-medium text-base m-0">{service?.name}</h3>
              <p className="font-thin">{service?.subCategory}</p>
            </div>
            <div className="flex items-center">
              <Rate
                allowHalf
                defaultValue={2.5}
                style={{
                  fontSize: 14,
                  marginRight: '10px',
                  color: '#4d3ca3',
                }}
              />
              <h4 className="text-gray-600 font-extralight">134 reviews</h4>
            </div>
          </div>
          <h2 className="text-xl text-customPrimary-800 font-medium m-0">
            ${service?.price}
          </h2>
        </div>
      </div>
    </div>
  );
}
