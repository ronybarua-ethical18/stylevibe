import Image, { StaticImageData } from 'next/image';
import Link from 'next/link';
import React from 'react';

import HairIllustration from '../../../public/h2.jpg';
import MakeupIllustration from '../../../public/h4.jpg';
import SalonIllustration from '../../../public/2.png';
import OccasionIllustration from '../../../public/header1.jpg';
import SVSectionHeading from '../SVSectionHeading';

interface ICategory {
  name: string;
  sub: string;
  count: string;
  img: StaticImageData;
  alt: string;
}

const CATEGORIES: ICategory[] = [
  {
    name: 'Hair',
    sub: 'Cuts · colour · styling',
    count: '120+ services',
    img: HairIllustration,
    alt: 'Illustration of hands holding a comb, scissors and hair dryer',
  },
  {
    name: 'Makeup',
    sub: 'Everyday · evening · editorial',
    count: '85+ services',
    img: MakeupIllustration,
    alt: 'Illustration of makeup artists with lipstick and brushes',
  },
  {
    name: 'Skincare',
    sub: 'Facials · treatments · glow',
    count: '60+ services',
    img: SalonIllustration,
    alt: 'Illustration of a salon room with styling stations and mirrors',
  },
  {
    name: 'Special occasion',
    sub: 'Bridal · prom · photoshoot',
    count: '40+ services',
    img: OccasionIllustration,
    alt: "Illustration of stylists preparing a client's dramatic look",
  },
];

export default function SVTypesOfServices() {
  return (
    <div className="w-3/4 m-auto my-24">
      <SVSectionHeading
        eyebrow="Categories"
        title1="Whatever beautiful"
        title2="means today"
        subtitle="Four signature categories, hundreds of services — from a quick trim to the full bridal morning."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-12">
        {CATEGORIES.map((category) => (
          <Link
            href="/services"
            key={category.name}
            className="group flex flex-col bg-white border border-gray-200 rounded-2xl p-3.5 pb-5 transition duration-200 hover:-translate-y-1 hover:shadow-custom-shadow"
          >
            <div className="flex items-center justify-center aspect-[5/4] bg-white border border-gray-100 rounded-xl overflow-hidden mb-4">
              <Image
                src={category.img}
                alt={category.alt}
                className="w-[88%] h-[88%] object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 tracking-tight mx-1.5 m-0">
              {category.name}
            </h3>
            <p className="text-xs text-gray-500 mx-1.5 mt-0.5 mb-3">
              {category.sub}
            </p>
            <span className="self-start mx-1.5 mt-auto rounded-full bg-customPrimary-50 text-customPrimary-700 text-xs font-medium px-3 py-0.5">
              {category.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
