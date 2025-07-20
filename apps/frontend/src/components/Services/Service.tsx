'use client';
import React from 'react';
import SVBreadCrumb from '../ui/SVBreadCrumb';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';
import { Col, Row } from 'antd';
import SVImageGallery from '../ui/SVImageGallery';
import SVRating from '../ui/SVRating';
import { CiShop } from 'react-icons/ci';
import { GoLocation } from 'react-icons/go';
import { PiTimerLight } from 'react-icons/pi';
import { IoLockClosedOutline } from 'react-icons/io5';
import SVButton from '../SVButton';
import RatingBar from '../ui/SVRatingBar';
import SVReviews from './components/SVReviews';
import Loading from '@/app/loading';

export default function Service({ service, loading, role }: any) {
  const ratings = [300, 100, 50, 35, 15];
  console.log(service);
  return (
    <div>
      {!service ? (
        <Loading />
      ) : (
        <div>
          {!role && (
            <SVBreadCrumb
              items={getBreadcrumbItems('services', service?.shop?.shopName)}
            />
          )}
          <div className="bg-white mt-5 p-8">
            <Row gutter={16}>
              <Col
                className="gutter-row"
                span={10}
                style={{ height: 'inherit' }}
              >
                <div>
                  <SVImageGallery imageList={service?.images} />
                </div>
              </Col>
              <Col className="gutter-row" span={14}>
                <div className="ml-5">
                  <div>
                    <h1 className="text-3xl mt-0">{service?.name}</h1>
                    <h3 className="text-base font-light">
                      {service?.category + ' / ' + service?.subCategory}
                    </h3>
                    <p className="text-lg font-thin mt-5">
                      {service?.description}
                    </p>
                  </div>
                  <div className="flex justify-between  items-center">
                    <div className="mt-8">
                      <div className="flex items-center">
                        <SVRating value={3.5} />
                        <h4 className="ml-5 text-[#6a9cff]">
                          4.5{' '}
                          <span className="text-gray-500 font-thin ml-2">
                            (153 reviews)
                          </span>
                        </h4>
                      </div>
                      <div>
                        <h1 className="text-3xl font-medium mb-1 text-[#6a9cff]">
                          ${service?.price + '.00'}
                        </h1>
                        <p className="font-thin">
                          0.15 % vat will be added extra
                        </p>
                      </div>
                    </div>
                    <div className="mt-8 bg-[#f6f5fb] rounded-md py-2 px-3 w-[300px]">
                      <div className="flex items-center">
                        <CiShop className="text-base mr-3" />

                        <h1 className="text-base font-normal my-0">
                          {service?.shop?.shopName}
                        </h1>
                      </div>
                      <div className="flex items-center">
                        <GoLocation className="text-sm mr-3" />

                        <h1 className="text-sm font-thin my-1">
                          {service?.shop?.location}
                        </h1>
                      </div>
                      <div className="flex items-center">
                        <PiTimerLight className="text-sm mr-3" />

                        <h1 className="text-sm font-thin my-0">
                          {service?.shop?.serviceTime?.openingHour +
                            '-' +
                            service?.shop?.serviceTime?.closingHour}
                        </h1>
                      </div>
                      <div className="flex items-center">
                        <IoLockClosedOutline className="text-sm mr-3" />

                        <h1 className="text-sm font-thin mt-1 mb-0">
                          {service?.shop?.serviceTime?.offDays
                            ?.map(
                              (day: string) =>
                                day.charAt(0) + day.slice(1).toLowerCase()
                            )
                            .join(', ')}
                        </h1>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <SVButton title="Book now" />
                  </div>
                </div>
              </Col>
            </Row>
            <div className="mt-12 w-full">
              <h1 className="text-2xl mb-5 font-medium">Reviews</h1>
              <div className="flex ">
                <div className="mr-14">
                  <h1 className="text-7xl">4.5</h1>
                  <SVRating value={4.5} />
                  <h2 className="text-base font-normal text-[#8895a5]">
                    125 reviews
                  </h2>
                </div>
                <div className="w-full flex-1">
                  <RatingBar ratings={ratings} />
                </div>
              </div>
            </div>
            <div className="mt-14">
              <SVReviews />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
