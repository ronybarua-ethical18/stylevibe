import { Button, Input } from 'antd';
import Image from 'next/image';
import React, { useState } from 'react';

import HelloSticker from '../../../public/hello.png';
import SVSectionHeading from '../SVSectionHeading';

export default function SVNewsLetter() {
  const [email, setEmail] = useState('');

  const onSubmit = () => {};

  return (
    <div className="w-3/4 m-auto my-24">
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-simple-shadow text-center px-8 py-14 md:px-16">
        <Image
          src={HelloSticker}
          alt=""
          width={60}
          height={60}
          className="mx-auto mb-4 -rotate-6"
        />
        <SVSectionHeading
          center
          eyebrow="Stay in the loop"
          title1="First chair"
          title2="to know"
          subtitle="New providers in your area, seasonal looks and booking-fee promos — about one email a month."
        />
        <div className="flex gap-2.5 max-w-md mx-auto mt-8">
          <Input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email address"
            style={{ height: '48px', borderRadius: '999px', paddingLeft: 20 }}
          />
          <Button
            type="primary"
            size="large"
            onClick={onSubmit}
            className="px-7"
            style={{ height: '48px', borderRadius: '999px' }}
          >
            Subscribe
          </Button>
        </div>
      </div>
    </div>
  );
}
