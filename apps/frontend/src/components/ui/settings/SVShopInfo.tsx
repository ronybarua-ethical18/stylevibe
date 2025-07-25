import { Divider } from 'antd';
import React from 'react';
import { GoLocation } from 'react-icons/go';
import { IoLockClosedOutline } from 'react-icons/io5';
import { PiTimerLight } from 'react-icons/pi';

import SVImageGallery from '../SVImageGallery';

import SVShopModal from './SVShopModal';

function SVShopInfo({ shopData }: any) {
  const images = [
    {
      original: 'https://picsum.photos/id/1018/1000/600/',
      thumbnail: 'https://picsum.photos/id/1018/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1015/1000/600/',
      thumbnail: 'https://picsum.photos/id/1015/250/150/',
    },
    {
      original: 'https://picsum.photos/id/1019/1000/600/',
      thumbnail: 'https://picsum.photos/id/1019/250/150/',
    },
  ];
  return (
    <>
      {shopData?.shop ? (
        <div className="h-full">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-normal">Shop Information</h1>

            <SVShopModal edit={true} shopData={shopData} />
          </div>
          <div
            className="bg-white rounded-md p-5"
            style={{ border: '1px solid #eee' }}
          >
            <div className="flex space-x-5 items-center w-full">
              <SVImageGallery imageList={shopData?.shop?.gallery || images} />
            </div>
            <Divider />
            <div>
              <h1 className="text-xl font-normal">
                {shopData?.shop?.shopName}
              </h1>
              <p className="font-light mb-5 text-base">
                {shopData?.shop?.shopDescription}
              </p>
              <div>
                <div className="flex items-center">
                  <GoLocation className="text-xl mr-3 text-blue-600" />

                  <h1 className="text-base font-light my-1">
                    {shopData?.shop?.location ||
                      'Jamuna Future Park, Kuril road, Dhaka'}
                  </h1>
                </div>
                <div className="flex items-center my-2">
                  <PiTimerLight className="text-xl mr-3 text-blue-600" />

                  <h1 className="text-base font-light my-0">
                    {(shopData?.shop?.serviceTime?.openingHour || '9:00 AM') +
                      '-' +
                      (shopData?.shop?.serviceTime?.closingHour || '7:00 PM')}
                  </h1>
                </div>
                <div className="flex items-center">
                  <IoLockClosedOutline className="text-xl mr-3 text-blue-600" />

                  <h1 className="text-base font-light mt-1 mb-0">
                    {shopData
                      ? shopData?.shop?.serviceTime?.offDays
                          ?.map(
                            (day: string) =>
                              day.charAt(0) + day.slice(1).toLowerCase()
                          )
                          .join(', ')
                      : 'Friday, Saturday'}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[780px] border mt-12 grid place-items-center border-dashed rounded-md">
          <div>
            <SVShopModal edit={false} />
            <h1 className="text-xl text-gray-500 font-light text-center">
              No shop created yet. <br /> Click plus icon to add a new shop.
            </h1>
          </div>
        </div>
      )}
    </>
  );
}

export default SVShopInfo;
