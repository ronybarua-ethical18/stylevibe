import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Input } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';

import HeroIllustration from '../../../public/1.png';

const POPULAR_SEARCHES = [
  'Balayage',
  'Bridal trial',
  'Signature facial',
  'Blowout',
];

const HERO_STATS = [
  { value: '500+', label: 'Local pros' },
  { value: '4.9', label: 'Avg. rating' },
  { value: '12,400', label: 'Bookings made' },
];

export default function SVHeroSection() {
  const [serviceName, setServiceName] = useState('');
  const [address, setAddress] = useState('');

  const handleSearch = () => {};

  return (
    <div className="bg-white">
      <div className="w-3/4 m-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center py-16 lg:py-20">
        {/* Copy + search */}
        <div>
          <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-customPrimary-500 mb-6">
            <span className="w-8 h-px bg-customPrimary-300" aria-hidden="true" />
            Hair · Makeup · Skincare · Bridal
          </p>

          <h1 className="text-5xl xl:text-6xl font-bold tracking-tight text-gray-800 leading-[1.08] m-0 mb-6">
            The right hands,
            <br />
            <span className="italic font-light text-customPrimary-800">
              near you.
            </span>
          </h1>

          <p className="text-lg text-gray-500 font-light leading-relaxed max-w-lg mb-9">
            StyleVibe connects you with local salons and independent artists.
            Confirmed slots, secure payment, and a direct line to your stylist
            — from first search to final mirror check.
          </p>

          {/* Search card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-2.5 flex flex-col sm:flex-row items-stretch shadow-custom-shadow max-w-2xl">
            <div className="flex-1 px-4 py-1.5">
              <div className="text-2xs font-semibold uppercase tracking-widest text-gray-500">
                Service
              </div>
              <Input
                placeholder='Try "balayage" or "bridal trial"'
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                prefix={<SearchOutlined className="text-gray-400" />}
                bordered={false}
                className="text-sm"
                style={{ padding: 0 }}
              />
            </div>
            <div className="hidden sm:block w-px bg-gray-200 my-2" />
            <div className="flex-1 px-4 py-1.5 border-t sm:border-t-0 border-gray-100">
              <div className="text-2xs font-semibold uppercase tracking-widest text-gray-500">
                Where
              </div>
              <Input
                placeholder="Neighbourhood or city"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                prefix={<EnvironmentOutlined className="text-gray-400" />}
                bordered={false}
                className="text-sm"
                style={{ padding: 0 }}
              />
            </div>
            <Button
              type="primary"
              size="large"
              onClick={handleSearch}
              className="px-8 m-1"
              style={{ height: '52px', borderRadius: '12px' }}
            >
              Search
            </Button>
          </div>

          {/* Popular searches */}
          <div className="flex flex-wrap items-center gap-2.5 mt-4 text-sm text-gray-500">
            <span>Popular:</span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setServiceName(term)}
                className="rounded-full border border-customPrimary-100 bg-customPrimary-50 text-customPrimary-700 text-xs px-3.5 py-1 cursor-pointer transition hover:border-customPrimary-300"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-10 lg:gap-14 mt-11 pt-7 border-t border-gray-100">
            {HERO_STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-semibold tracking-tight text-customPrimary-800 tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Illustration panel — same visual world as the login page */}
        <div className="relative justify-self-center w-full max-w-[470px]">
          <div className="bg-[#e9effb] rounded-[28px] px-7 pt-9 pb-5">
            <Image
              src={HeroIllustration}
              alt="Stylist blow-drying a client's hair in front of a salon mirror"
              priority
            />
            <p className="text-center text-sm font-medium text-[#3b4664] mt-3 mb-2">
              Unleash Your Radiance
            </p>
            <div
              className="flex justify-center gap-2 pb-1"
              aria-hidden="true"
            >
              <span className="w-8 h-1.5 rounded-full bg-customPrimary-500" />
              <span className="w-8 h-1.5 rounded-full bg-customPrimary-100" />
              <span className="w-8 h-1.5 rounded-full bg-customPrimary-100" />
            </div>
          </div>

          {/* Floating booking card */}
          <div className="absolute -right-3 bottom-24 z-10 bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-[13px] leading-snug max-w-[230px]">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              Booking
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e6fff9] text-[#00b359] text-[11px] font-medium px-2.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00b359]" />
                Confirmed
              </span>
            </div>
            <div className="text-gray-500 text-xs mt-1">
              Today · 2:30 PM
              <br />
              Luxe Loft Hair Studio
            </div>
          </div>

          {/* Floating chat card */}
          <div className="absolute -left-4 -bottom-6 z-10 bg-white border border-gray-100 rounded-xl shadow-lg px-4 py-3 text-[13px] leading-snug max-w-[250px]">
            <div className="flex items-center gap-2 font-semibold text-gray-800">
              <span className="w-2 h-2 rounded-full bg-customPrimary-500" />
              Maya (your stylist)
            </div>
            <div className="text-gray-500 text-xs mt-1">
              &ldquo;Running 5 min early — see you soon!&rdquo;
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
