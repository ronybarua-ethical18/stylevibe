import React from 'react';

import SVSectionHeading from '../SVSectionHeading';

interface ITestimonial {
  initials: string;
  name: string;
  service: string;
  quote: string;
}

const TESTIMONIALS: ITestimonial[] = [
  {
    initials: 'SR',
    name: 'Sadia R.',
    service: 'Balayage & Gloss · Luxe Loft',
    quote:
      'Booked a balayage on Tuesday, chatted with my colourist that night about photos, sat down Thursday. It felt organised in a way salons never are.',
  },
  {
    initials: 'NA',
    name: 'Nadia A.',
    service: 'Bridal Trial · Aura Beauty Bar',
    quote:
      'The hold-and-capture payment sold me. My artist got paid the moment we finished, and I never had to fumble with cash or a card reader.',
  },
];

export default function SVClientReview() {
  return (
    <div className="w-3/4 m-auto my-24">
      <SVSectionHeading
        eyebrow="Client notes"
        title1="Word of mouth,"
        title2="in writing"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
        {TESTIMONIALS.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="relative bg-white border border-gray-200 rounded-2xl px-8 pt-8 pb-6 m-0 shadow-review-card"
          >
            <span
              className="absolute top-11 left-6 text-7xl font-bold leading-[0] text-customPrimary-300"
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <p className="text-gray-700 text-base leading-relaxed mt-7 mb-5">
              {testimonial.quote}
            </p>
            <figcaption className="flex items-center gap-3 text-[13px] text-gray-500">
              <span
                className="flex items-center justify-center w-10 h-10 rounded-full bg-customPrimary-800 text-white text-xs font-semibold shrink-0"
                aria-hidden="true"
              >
                {testimonial.initials}
              </span>
              <span>
                <span className="block font-semibold text-gray-800">
                  {testimonial.name}
                </span>
                {testimonial.service}
              </span>
              <span
                className="ml-auto text-customPrimary-500 tracking-widest text-sm"
                aria-label="5 out of 5 stars"
              >
                ★★★★★
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
