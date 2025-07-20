import React from 'react';
import moment from 'moment';
import SVButton from '@/components/SVButton';
import DashboardStats from './DashboardStats';

export default function Dashboard() {
  const userName = 'Courtney';
  const today = moment().format('ddd, MMMM D');

  return (
    <div>
      {/* <SVBreadCrumb ... /> */}
      <div>
        {/* <div className="text-sm text-gray-500 mb-2">{today}</div>
        <h1 className="text-3xl font-bold text-black mb-1">
          Hello, {userName}
        </h1> */}
        {/* <div className='flex space-x-2 items-center'>
          <div
            className="text-2xl font-bold bg-gradient-to-r from-[#3ECF8E] to-[#3A8DFF] bg-clip-text text-transparent"
          >
            How can I help you today?
          </div>
          <SVButton
            title="✦ Ask AI"
            style={{
              background: 'linear-gradient(90deg, #7F7FD5 0%, #86A8E7 100%)',
              color: '#fff',
              border: 'none',
              boxShadow: '0 2px 8px rgba(134, 168, 231, 0.15)',
              padding: '0 24px',
              borderRadius: '9999px',
              fontWeight: 600,
            }}
          />
        </div> */}
        <DashboardStats />
      </div>
    </div>
  );
}
