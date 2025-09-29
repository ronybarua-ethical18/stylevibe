import React from 'react';

import SVSectionTitle from '../SVSectionTitle';

import SVCollapse from './SVCollapse';

export default function SVFAQ() {
  return (
    <div className=" w-2/4 m-auto">
      <SVSectionTitle
        title1="Frequently Asked"
        title2="Questions"
        subtitle="Answers to common questions about our services"
      />
      <SVCollapse />
    </div>
  );
}
