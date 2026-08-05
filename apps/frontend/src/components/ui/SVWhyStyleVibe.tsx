import React from 'react';

import SVSectionHeading from '../SVSectionHeading';

interface IFeature {
  icon: JSX.Element;
  title: string;
  description: string;
}

const FEATURES: IFeature[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <path d="M21 12a8 8 0 0 1-8 8H5l-2 2V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" />
      </svg>
    ),
    title: 'A direct line to your artist',
    description:
      "Every booking opens its own chat room. Ask about hair history, share inspiration photos, say you're running late.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    title: "Pay when it's done",
    description:
      'Stripe holds your payment at booking and captures it only after the service is completed. No-shows protected, both ways.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
      </svg>
    ),
    title: 'Real availability',
    description:
      'Providers manage their own hours, slots and off-days — so the time you book is a time they actually have.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
        <path d="M12 3l2.7 5.6 6.3.9-4.5 4.3 1 6.2-5.5-3-5.5 3 1-6.2L3 9.5l6.3-.9z" />
      </svg>
    ),
    title: 'Reviews you can trust',
    description:
      'Only customers with a completed booking can rate a service. Every star was earned in a chair.',
  },
];

export default function SVWhyStyleVibe() {
  return (
    <div className="w-3/4 m-auto my-24">
      <SVSectionHeading
        eyebrow="Why StyleVibe"
        title1="Built around the appointment,"
        title2="not the app"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-12">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="bg-white border border-gray-100 rounded-2xl p-6 shadow-simple-shadow"
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-[50%_50%_10px_10px] border border-customPrimary-300 bg-customPrimary-50 text-customPrimary-500">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-500 text-sm m-0">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
