import dynamic from 'next/dynamic';
import React from 'react';

const CustomerPage = dynamic(() => import('@/components/Customers'), {
  ssr: false,
});

export default function Customers() {
  return <CustomerPage />;
}
