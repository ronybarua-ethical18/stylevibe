import React from 'react';

interface ISectionHeading {
  eyebrow?: string;
  title1: string;
  title2?: string;
  subtitle?: string;
  center?: boolean;
}

export default function SVSectionHeading({
  eyebrow,
  title1,
  title2,
  subtitle,
  center,
}: ISectionHeading): JSX.Element {
  return (
    <div className={center ? 'text-center' : ''}>
      {eyebrow && (
        <p
          className={`flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-customPrimary-500 mb-4 ${
            center ? 'justify-center' : ''
          }`}
        >
          <span className="w-8 h-px bg-customPrimary-300" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight m-0">
        <span className="text-customPrimary-800">{title1}</span>
        {title2 && <span className="text-gray-500 font-normal"> {title2}</span>}
      </h2>
      {subtitle && (
        <p
          className={`text-gray-500 text-base mt-3 mb-0 max-w-xl ${
            center ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
