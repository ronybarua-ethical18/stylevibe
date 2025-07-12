import dynamic from 'next/dynamic';
import { loginMetadata } from '@/config/metaData';
import { Metadata } from 'next';
import React from 'react';

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
