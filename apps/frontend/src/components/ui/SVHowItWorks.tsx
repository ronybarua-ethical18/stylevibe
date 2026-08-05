import Image, { StaticImageData } from 'next/image';
import React from 'react';

import Book from '../../../public/book.png';
import Enjoy from '../../../public/enjoy.png';
import Search from '../../../public/search.png';
import SVSectionHeading from '../SVSectionHeading';

interface IStep {
  icon: StaticImageData;
  title: string;
  description: string;
}

const STEPS: IStep[] = [
  {
    icon: Search,
    title: '1. Discover',
    description:
      'Search by service and neighbourhood. Compare providers by verified ratings, price and real-time availability.',
  },
  {
    icon: Book,
    title: '2. Book & pay securely',
    description:
      'Pick a slot that suits you and pay through Stripe. Your payment is held — and only captured once the service is done.',
  },
  {
    icon: Enjoy,
    title: '3. Show up & enjoy',
    description:
      'Chat with your artist before the appointment, walk in, walk out glowing — then leave a review that counts.',
  },
];

export default function SVHowItWorks() {
  return (
    <div className="w-3/4 m-auto my-24">
      <SVSectionHeading
        eyebrow="How it works"
        title1="Three steps"
        title2="to the chair"
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-12 text-center">
        {STEPS.map((step) => (
          <div key={step.title} className="flex flex-col items-center">
            <div className="flex items-center justify-center w-28 h-28 bg-white border-2 border-customPrimary-300 rounded-full shadow-simple-shadow mb-5">
              <Image src={step.icon} width={52} height={52} alt="" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 m-0 mb-2">
              {step.title}
            </h3>
            <p className="text-gray-500 text-[15px] m-0 max-w-xs">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
