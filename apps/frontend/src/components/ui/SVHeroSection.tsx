import React from 'react';

import SVButton from '../SVButton';

export default function SVHeroSection() {
  return (
    <div className="h-screen  m-auto text-white flex flex-col justify-center">
      <h1 className="text-white text-6xl">Salon Makeup</h1>
      <h1 className="text-white text-6xl">Service</h1>
      <p className="text-sm text-gray-200 font-extralight my-5">
        Indulge in a transformative experience with our salon makeup service,
        where beauty meets expertise. Our skilled makeup artists are dedicated
        to enhancing your natural features while bringing your vision to life.
        Whether it is for a special occasion, a glamorous night out, or simply
        to treat yourself, our salon offers a personalized approach to makeup
        application. Using high-quality products and techniques tailored to your
        unique style, we create stunning looks that leave you feeling confident
        and radiant. Elevate your beauty routine with our salon makeup service
        and step into a world of glamour and allure.
      </p>
      <SVButton
        title="GET STARTED"
        type="primary"
        className="mt-5 border border-r-4 text-customPrimary-800"
        style={{
          background: 'white',
          fontWeight: 'bold',
          maxWidth: '150px',
          color: '#4d3ca3',
        }}
      />
    </div>
  );
}
