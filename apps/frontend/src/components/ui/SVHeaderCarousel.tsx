'use client';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// You can either import images like this:
import imgTwo from '../../../public/h3.jpg';
import imgThree from '../../../public/h4.jpg';
import imgOne from '../../../public/h5.jpg';

// Or define an array of image paths:
// const imagePaths = ['/assets/h5.jpg', '/assets/h3.jpg', '/assets/h4.jpg'];

export default function SVHeaderCarousel() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <></>,
    nextArrow: <></>,
  };

  // If using imported images:
  const images = [imgOne, imgTwo, imgThree];

  // If using image paths:
  // const images = imagePaths;

  return (
    <Slider {...settings}>
      {images.map((img, index) => (
        <div key={index}>
          <Image
            src={img}
            style={{ width: '100%' }}
            layout="responsive"
            objectFit="contain"
            objectPosition="center center"
            alt={`Slide ${index + 1}`}
          />
        </div>
      ))}
    </Slider>
  );
}
