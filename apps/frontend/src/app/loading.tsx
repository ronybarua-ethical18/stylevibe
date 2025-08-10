'use client';
import React from 'react';
import { ProgressBar } from 'react-loader-spinner';

export default function Loading() {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <ProgressBar
        visible={true}
        height="80"
        width="80"
        // color="#6a9cff"
        ariaLabel="progress-bar-loading"
        borderColor="#6a9cff"
        wrapperClass=""
      />
    </div>
  );
}
