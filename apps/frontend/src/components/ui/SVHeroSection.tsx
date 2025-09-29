import React, { useState } from 'react';
import Image from 'next/image';
import { Button, Input } from 'antd';
import { SearchOutlined, EnvironmentOutlined } from '@ant-design/icons';

export default function SVHeroSection() {
  const [serviceName, setServiceName] = useState('');
  const [address, setAddress] = useState('');

  const handleSearch = () => {
    // Handle search functionality here
    console.log('Search:', { serviceName, address });
  };

  return (
    <div className="h-screen relative mb-20">
      {/* Full-width background purple */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: '#4d3ca3' }}
      ></div>

      {/* Full-width background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/hero.png"
          alt="Beauty salon service"
          fill
          className="object-contain"
          style={{ transform: 'translateX(18%)' }}
          priority
        />

        {/* Main gradient overlay - Purple fading to transparent from left to right */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(to right, #4d3ca3 0%, rgba(77, 60, 163, 0.8) 25%, rgba(77, 60, 163, 0.5) 50%, rgba(77, 60, 163, 0.2) 75%, transparent 90%)`,
          }}
        ></div>

        {/* Additional left overlay to hide shifted portion - extended coverage */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `linear-gradient(to right, #4d3ca3 0%, #4d3ca3 30%, rgba(77, 60, 163, 0.9) 38%, rgba(77, 60, 163, 0.5) 42%, transparent 47%)`,
          }}
        ></div>
      </div>

      {/* Content Container with w-3/4 m-auto positioning */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-3/4 m-auto">
          <div className="max-w-4xl">
            {/* Tag */}
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-white/40 text-xs font-medium text-white mb-8">
              <span className="w-2 h-2 bg-white rounded-full mr-3"></span>
              HAIR SALON, MASSEUSE, BEAUTY SALON
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl font-bold text-white leading-tight mb-6">
              Find a service
              <br />
              close to you
            </h1>

            {/* Subtitle */}
            <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-md">
              There are many variation of passages are lorem available, majority
              have suffered alteration in some form.
            </p>

            {/* Search Form with Ant Design */}
            <div className="bg-white rounded-full py-2 px-4 flex items-center shadow-lg max-w-2xl">
              {/* Service Name Input */}
              <div className="flex-1 px-5">
                <div className="text-xs text-gray-500 mb-1">Service Name</div>
                <Input
                  placeholder="Book your services..."
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  prefix={<SearchOutlined className="text-gray-400" />}
                  bordered={false}
                  className="text-sm"
                  style={{ padding: 0 }}
                />
              </div>

              {/* Divider */}
              <div className="w-px bg-gray-200 h-12 mx-4"></div>

              {/* Address Input */}
              <div className="flex-1 px-5">
                <div className="text-xs text-gray-500 mb-1">Address</div>
                <Input
                  placeholder="Where"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  prefix={<EnvironmentOutlined className="text-gray-400" />}
                  bordered={false}
                  className="text-sm"
                  style={{ padding: 0 }}
                />
              </div>

              {/* Search Button */}
              <Button
                type="primary"
                shape="round"
                size="large"
                icon={<SearchOutlined />}
                onClick={handleSearch}
                className="ml-4 px-8"
                style={{
                  backgroundColor: '#4d3ca3',
                  borderColor: '#4d3ca3',
                  height: '48px',
                  fontWeight: 'medium',
                }}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
