import { Collapse } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';

import SVSectionHeading from '../SVSectionHeading';

const FAQ_ITEMS = [
  {
    key: '1',
    label: 'When am I actually charged?',
    children: (
      <p className="text-gray-500 m-0">
        Your card is authorised when you book, but the payment is only captured
        after your provider marks the service complete. If a booking is
        cancelled in time, the hold is simply released.
      </p>
    ),
  },
  {
    key: '2',
    label: 'Can I talk to my stylist before the appointment?',
    children: (
      <p className="text-gray-500 m-0">
        Yes — every booking opens a private chat room between you and your
        provider. Share reference photos, ask prep questions, or update your
        arrival time.
      </p>
    ),
  },
  {
    key: '3',
    label: 'How do I know the reviews are real?',
    children: (
      <p className="text-gray-500 m-0">
        Reviews can only be left by customers whose bookings were completed on
        the platform, and each review is tied to a specific service.
      </p>
    ),
  },
  {
    key: '4',
    label: "I'm a stylist — what does it cost to join?",
    children: (
      <p className="text-gray-500 m-0">
        Creating a shop is free. StyleVibe takes a flat 10% fee per completed
        booking, and the rest is transferred directly to your connected Stripe
        account.
      </p>
    ),
  },
];

export default function SVFAQ() {
  return (
    <div className="w-3/4 m-auto my-24">
      <SVSectionHeading center title1="Questions," title2="answered" />
      <div className="max-w-3xl mx-auto mt-10 faq-collapse">
        <Collapse
          ghost
          items={FAQ_ITEMS}
          expandIconPosition="end"
          expandIcon={({ isActive }) => (
            <PlusOutlined
              rotate={isActive ? 45 : 0}
              style={{ color: '#6a5ac2', fontSize: 16 }}
            />
          )}
        />
      </div>
    </div>
  );
}
