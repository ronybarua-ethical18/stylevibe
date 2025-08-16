import dynamic from 'next/dynamic';
import React from 'react';

const Transactions = dynamic(() => import('@/components/Transactions'), {
  // Remove ssr: false to enable server-side rendering
  loading: () => <div>Loading...</div>, // Optional loading state
});

function TransactionsPage() {
  return <Transactions />;
}

export default TransactionsPage;
