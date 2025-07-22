import dynamic from 'next/dynamic';
import { Metadata } from 'next';
import React from 'react';

import { loginMetadata } from '@/config/metaData';

// Importing the client component dynamically
const LoginPage = dynamic(() => import('@/components/Login/Login'));

export const metadata: Metadata = loginMetadata;

export default function Login() {
  return (
    <>
      <LoginPage />
    </>
  );
}
