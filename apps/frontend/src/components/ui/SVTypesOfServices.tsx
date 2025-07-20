/* eslint-disable react/jsx-no-undef */
import React, { useState } from 'react';
import SVSectionTitle from '../SVSectionTitle';
import SVCard from './SVCard';
import { Col, Row } from 'antd';
import { dummyServices, serviceCategories } from '@/utils/dummyServices';
import Image from 'next/image';
import HairImage from '../../../public/hair1.png';
import Makeup from '../../../public/makeup1.png';
import Skin from '../../../public/skin1.png';

export default function SVTypesOfServices() {
  const [active, setActive] = useState(2);
  return (
    <div className="mt-20">
      <SVSectionTitle title1="CATEGORIES OF" title2="SERVICES" />
      <div className="w-2/4 m-auto flex justify-center">
        {serviceCategories.map(
          (category: { id: number; name: string; img: any }) => {
            return (
              <div
                onClick={(e) => setActive(category.id)}
                className={`flex items-center cursor-pointer py-8 px-4 shadow-simple-shadow w-2/4  ${
                  category.id === active ? 'bg-customPrimary-800' : ''
                } mb-16 ${
                  category.id !== active
                    ? 'hover:bg-gray-200 transition-all duration-500'
                    : ''
                }`}
                key={category.id}
              >
                <div className="mr-4">
                  <Image
                    src={
                      category.id === active
                        ? active === 1
                          ? HairImage
                          : active === 2
                            ? Makeup
                            : active === 3
                              ? Skin
                              : category.img
                        : category.img
                    }
                    objectFit="contain"
                    objectPosition="center"
                    width={60}
                    height={60}
                    alt=""
                  />
                </div>
                <div>
                  <h3
                    className={`text-lg font-normal ${
                      category.id === active
                        ? 'text-gray-200'
                        : ' text-gray-700'
                    }`}
                  >
                    {category.name.toUpperCase()}
                  </h3>
                  <h4
                    className={`${
                      category.id === active
                        ? 'text-gray-200'
                        : ' text-gray-700'
                    } text-sm`}
                  >
                    TREATMENT
                  </h4>
                </div>
              </div>
            );
          }
        )}
      </div>
      <div className="w-3/4 m-auto">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {dummyServices.map((service: any, index) => (
            <Col
              xs={24}
              sm={12}
              md={6}
              lg={6}
              xl={6}
              key={service._id || index}
              className="mb-8"
            >
              <SVCard service={service} loading={false} />
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}
