import dynamic from 'next/dynamic';
import React from 'react';

const Transactions = dynamic(() => import('@/components/Transactions'), {
  ssr: false, // Disable server-side rendering if the component should only load on the client side
});

function TransactionsPage() {
  return <Transactions />;
}

export default TransactionsPage;
