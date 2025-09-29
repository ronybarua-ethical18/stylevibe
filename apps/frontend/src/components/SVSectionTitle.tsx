import React from 'react';

interface ISectionTitle {
  title1: string;
  title2: string;
  subtitle?: string;
}
export default function SVSectionTitle({
  title1,
  title2,
  subtitle,
}: ISectionTitle): JSX.Element {
  return (
    <div className="flex flex-col items-center my-10">
      <div className="flex justify-center mb-0">
        <h2 className="mr-2 text-customPrimary-800 text-3xl leading-none m-0">
          {title1}
        </h2>
        <h2 className="text-gray-600 text-3xl font-normal leading-none m-0">
          {title2}
        </h2>
      </div>
      {subtitle && (
        <p className="text-gray-500 text-lg text-center m-0 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
