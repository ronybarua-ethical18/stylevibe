import React from 'react';

interface ISectionTitle {
  title1: string;
  title2: string;
}
export default function SVSectionTitle({
  title1,
  title2,
}: ISectionTitle): JSX.Element {
  return (
    <div className="flex justify-center my-10 ">
      <h2 className="mr-2 text-customPrimary-800 text-3xl">{title1}</h2>
      <h2 className="text-gray-600 text-3xl font-normal">{title2}</h2>
    </div>
  );
}
