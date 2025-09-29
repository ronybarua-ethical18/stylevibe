import Image from 'next/image';
import React from 'react';

import Book from '../../../public/book.png';
import Enjoy from '../../../public/enjoy.png';
import Search from '../../../public/search.png';
import SVSectionTitle from '../SVSectionTitle';

export default function SVHowItWorks() {
  return (
    <div className="p-8 bg-gray-100 mt-20 text-center">
      <SVSectionTitle
        title1="How It"
        title2="Works"
        subtitle="Easy steps to get your beauty services"
      />

      <div className="flex justify-between items-center flex-wrap w-3/4 m-auto p-8">
        <div className="text-center flex flex-col items-center">
          <div className="p-8 border-2 border-customPrimary-800 rounded-full">
            <Image
              src={Search}
              objectFit="contain"
              objectPosition="center"
              width={80}
              height={80}
              alt=""
            />
          </div>
          <div>
            <h3 className="font-normal text-2xl text-gray-600 mt-5">
              1. Discover
            </h3>
            <p className="text-gray-600 text-base">
              Search for beauty services you need
            </p>
          </div>
        </div>
        <div className="text-center flex flex-col items-center">
          <div className="p-8 border-2 border-customPrimary-800 rounded-full">
            <Image
              src={Book}
              objectFit="contain"
              objectPosition="center"
              width={80}
              height={80}
              alt=""
            />
          </div>
          <div className="w-auto">
            <h3 className="font-normal text-2xl text-gray-600 mt-5">2. Book</h3>
            <p className="text-gray-600 text-base">
              Choose your service and book an appointment directly
            </p>
          </div>
        </div>
        <div className="text-center flex flex-col items-center">
          <div className="p-8 border-2 border-customPrimary-800 rounded-full">
            <Image
              src={Enjoy}
              objectFit="contain"
              objectPosition="center"
              width={80}
              height={80}
              alt=""
            />
          </div>
          <div className="w-auto">
            <h3 className="font-normal text-2xl text-gray-600 mt-5">
              3. Enjoy
            </h3>
            <p className="text-gray-600 text-base">
              Sit back and enjoy your unique beauty experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
