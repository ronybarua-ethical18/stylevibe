import React from 'react';
import HappyClient from '../../../public/client.png';
import Image from 'next/image';
import { CountUp } from 'use-count-up';

export default function SVTotalClients() {
  return (
    <div className="my-24 h-[450px] relative">
      <div className="flex justify-between absolute top-0 w-full -z-10 ">
        <Image
          src={HappyClient}
          layout="fixed"
          objectFit="cover"
          objectPosition="center"
          alt=""
          className="h-[450px] w-full"
        />
      </div>
      <div className="absolute w-full h-[450px] bg-white top-0 opacity-20 -z-10"></div>
      <div className="w-3/4 m-auto pt-14">
        <h1>
          <strong className="text-customPrimary-800 text-3xl font-semibold">
            Style
          </strong>
          <span className="text-customPrimary-800 text-3xl font-thin">
            Vibe
          </span>
        </h1>
        <div className="h-[2px] w-[50px] bg-customPrimary-800"></div>
        <p className="text-gray-600 mt-5">
          Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
          nonummy nibh volutpat.
        </p>
        <p className="text-gray-600 ">
          euismod tincidunt ut laoreet dolore magna aliquam erat Ut wisi enim ad
          minim veniam, quis
        </p>
        <p className="text-gray-600 ">
          nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex
          ea commodo consequat.
        </p>
        <p className="text-gray-600 ">
          Suscipit lobortis nisl ut aliquip ex ea commodo consequat.
        </p>
      </div>
      <div className="w-3/4 m-auto mt-14 flex items-center">
        <div>
          <h1 className="text-4xl text-customPrimary-800">
            <CountUp
              thousandsSeparator=","
              isCounting
              end={1320}
              duration={3.2}
            />{' '}
            +
          </h1>
          <h1 className="text-base text-gray-600 font-medium">
            Happy Customers
          </h1>
        </div>
        <div className="mx-16">
          <h1 className="text-4xl text-customPrimary-800">
            <CountUp isCounting end={330} duration={3.2} /> +
          </h1>
          <h1 className="text-base text-gray-600 font-medium">
            Number of shops
          </h1>
        </div>
        <div>
          <h1 className="text-4xl text-customPrimary-800">
            <CountUp isCounting end={250} duration={3.2} /> +
          </h1>
          <h1 className="text-base text-gray-600 font-medium">
            Professional services
          </h1>
        </div>
      </div>
    </div>
  );
}
