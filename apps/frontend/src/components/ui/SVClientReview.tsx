import React from 'react'
import SVSectionTitle from '../SVSectionTitle'
import Slider from 'react-slick'
import { dummyClientReviews } from '@/utils/dummyServices'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'
import ClientImage from '../../../public/cli.png'
import { Rate } from 'antd'

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
  }
  return (
    <div className="">
      <SVSectionTitle title1="WHAT PEOPLE THINKS " title2="ABOUT US" />
      <div className="w-2/4 m-auto bg-white">
        <Slider {...settings}>
          {dummyClientReviews.map((client, index) => (
            <div key={client.id} className="mb-14">
              <div className="shadow-review-card m-5  p-6 rounded-review-card">
                <div className="w-[80px] border rounded-review-card">
                  <Image src={ClientImage} alt="" />
                </div>
                <div className="flex items-center">
                  <h1 className="text-gray-600 text-base mr-5">John Alex</h1>
                  <Rate
                    allowHalf
                    defaultValue={client.rating}
                    className="text-base "
                  />
                </div>
                <p>{client.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}
