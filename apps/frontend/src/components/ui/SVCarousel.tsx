'use client';
import Image from 'next/image';
import React from 'react';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import imgOne from '../../../public/1.png';
import imgTwo from '../../../public/2.png';
import imgThree from '../../../public/3.png';

export default function SVCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    // autoplaySpeed:2000,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    prevArrow: <></>, // Use empty fragment to hide previous button
    nextArrow: <></>,
  };

  return (
    <Slider {...settings}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          height: '100vh',
          margin: '50px',
          border: '1px solid black',
        }}
      >
        <Image
          src={imgOne}
          style={{
            maxWidth: '700px',
            margin: 'auto',
            objectFit: 'contain',
            objectPosition: 'center center',
          }}
          layout="responsive"
          alt=""
        />
        <div style={{ marginBottom: '70px' }}>
          <h1 className="text-3xl">Unleash Your Radiance</h1>
          <h4>Transformative Salon and Makeup Services for a Glamorous You!</h4>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Image
          src={imgTwo}
          style={{
            maxWidth: '700px',
            margin: 'auto',
            objectFit: 'contain',
            objectPosition: 'center center',
          }}
          layout="responsive"
          alt=""
        />
        <div style={{ marginBottom: '70px' }}>
          <h1 className="text-3xl">Indulge in Luxury</h1>
          <h4>
            Elevate Your Beauty with Our Exclusive Salon and Makeup Offerings.
          </h4>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <Image
          src={imgThree}
          style={{
            maxWidth: '700px',
            margin: 'auto',
            objectFit: 'contain',
            objectPosition: 'center center',
          }}
          layout="responsive"
          alt=""
        />
        <div style={{ marginBottom: '70px' }}>
          <h1 className="text-3xl">Rediscover Your Glow</h1>
          <h4>Pampering You Deserve with Expert Salon and Makeup Artistry.</h4>
        </div>
      </div>
    </Slider>
  );
}
