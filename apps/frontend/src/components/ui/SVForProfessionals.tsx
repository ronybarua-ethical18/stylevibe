import { Button } from 'antd';
import Link from 'next/link';
import React from 'react';

import SVSectionHeading from '../SVSectionHeading';

const PERKS = [
  'Open a shop profile with your own service catalogue, pricing and photos',
  'Control your calendar — service hours, time slots and off-days',
  'Get paid directly to your connected Stripe account, minus a flat 10% platform fee',
  'Track revenue, bookings and reviews from one dashboard',
];

const LEDGER_ROWS = [
  { label: 'Bookings completed', value: '17' },
  { label: 'Gross earnings', value: '$1,240' },
  { label: 'Platform fee (10%)', value: '−$124' },
];

export default function SVForProfessionals() {
  return (
    <div className="w-3/4 m-auto my-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-custom-shadow">
        <div className="p-10 lg:p-14">
          <SVSectionHeading
            eyebrow="For professionals"
            title1="Run your chair"
            title2="like a business"
          />
          <ul className="list-none p-0 mt-6 mb-8 grid gap-3">
            {PERKS.map((perk) => (
              <li key={perk} className="flex items-start gap-3 text-[15px] text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-customPrimary-500 mt-2.5 shrink-0" />
                {perk}
              </li>
            ))}
          </ul>
          <Link href="/signup">
            <Button
              type="primary"
              size="large"
              className="px-8"
              style={{ height: '48px', borderRadius: '999px' }}
            >
              Open your shop
            </Button>
          </Link>
        </div>

        <div className="self-stretch flex items-center justify-center bg-[#e9effb] min-h-[340px] p-10">
          <div
            className="bg-white rounded-xl border border-gray-100 shadow-lg px-6 py-5 w-full max-w-[300px] text-[13px] text-gray-800"
            role="img"
            aria-label="Sample earnings summary for a provider"
          >
            <div className="text-2xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              This week · Velvet Chair Salon
            </div>
            {LEDGER_ROWS.map((row) => (
              <div
                key={row.label}
                className="flex justify-between py-2 border-t first:border-t-0 border-gray-100 tabular-nums"
              >
                <span className="text-gray-500">{row.label}</span>
                <span className="font-semibold">{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-1 border-t-2 border-gray-800 font-semibold tabular-nums">
              <span>Paid to your Stripe</span>
              <span>$1,116</span>
            </div>
            <div className="flex justify-between py-2 mt-1 border-t border-gray-100 tabular-nums">
              <span className="text-gray-500">vs. last week</span>
              <span className="font-semibold text-[#00b359]">+18%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
