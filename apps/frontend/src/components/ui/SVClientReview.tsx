import React from 'react';
import Slider from 'react-slick';

import SVSectionTitle from '../SVSectionTitle';

import { dummyClientReviews } from '@/utils/dummyServices';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import { Rate } from 'antd';

import ClientImage from '../../../public/cli.png';

export default function SVClientReview() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    // autoplaySpeed:2000,
    autoplay: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    prevArrow: <></>, // Use empty fragment to hide previous button
    nextArrow: <></>,
  };
  return (
    <div className="">
      <SVSectionTitle
        title1="What People Thinks"
        title2="About Us"
        subtitle="What our clients say about us"
      />
      <div className="w-2/4 m-auto bg-white">
        <Slider {...settings}>
          {dummyClientReviews.map((client) => (
            <div key={client.id} className="mb-14">
              <div className="m-5 p-6 shadow rounded-md">
                <div className="w-[80px] border rounded-md">
                  <Image src={ClientImage} alt="" />
                </div>
                <div className="flex items-center">
                  <h1 className="text-gray-600 text-base mr-5 mt-2">
                    John Alex
                  </h1>
                  <Rate
                    allowHalf
                    defaultValue={client.rating}
                    className="text-base text-customPrimary-800"
                  />
                </div>
                <p>{client.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
