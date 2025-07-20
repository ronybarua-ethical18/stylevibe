'use client';

import React from 'react';

function SVTransactionDetails({ transaction }: any) {
  console.log('transaction', transaction);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <h2 className="text-xl font-bold mb-4">Transaction Details</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="font-semibold">Payment Intent ID:</div>
          <div>{transaction.paymentIntentId}</div>

          <div className="font-semibold">Booking ID:</div>
          <div>{transaction.bookingId}</div>

          <div className="font-semibold">Service Name:</div>
          <div>{transaction.serviceName}</div>

          <div className="font-semibold">Customer:</div>
          <div>{transaction.customer}</div>

          <div className="font-semibold">Payment Method:</div>
          <div>{transaction.paymentMethod}</div>

          {/* <div className="font-semibold">Paid Amount:</div>
        <div>${transaction.paidAmount.toFixed(2)}</div> */}

          {/* <div className="font-semibold">Application Fee:</div>
        <div>${transaction.applicationFee.toFixed(2)}</div> */}

          {/* <div className="font-semibold">Processing Fee:</div>
        <div>${transaction.processingFee.toFixed(2)}</div> */}

          <div className="font-semibold">Status:</div>
          <div>{transaction.status}</div>
        </div>
      </div>
    </div>
  );
}

export default SVTransactionDetails;
