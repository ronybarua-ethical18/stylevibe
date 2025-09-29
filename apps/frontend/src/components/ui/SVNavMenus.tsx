import Link from 'next/link';
import React from 'react';
import { Button } from 'antd';
import { useUserInfo } from '@/hooks/useUserInfo';
import ProfileDropmenu from './ProfileDropmenu';
import { useMenuHandler } from '@/utils/menuHandler';

export default function SVNavMenus({ footer }: any) {
  const { userInfo } = useUserInfo();

  const handleMenuClick = useMenuHandler();

  if (footer) {
    // Keep the existing footer navigation
    return (
      <div className="hidden md:flex items-center space-x-4">
        <a
          href="/"
          className="text-gray-600 transition duration-300 hover:text-violet-700"
        >
          Home
        </a>
        <a
          href="/about"
          className="text-gray-600 transition duration-300 hover:text-violet-700"
        >
          About
        </a>
        <a
          href="/services"
          className="text-gray-600 transition duration-300 hover:text-violet-700"
        >
          Services
        </a>
        <a
          href="/contact"
          className="text-gray-600 transition duration-300 hover:text-violet-700"
        >
          Contact
        </a>
      </div>
    );
  }

  // New main navbar design matching the image
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="w-3/4 m-auto">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl" style={{ color: '#4d3ca3' }}>
                <span className="font-bold">Style</span>
                <span className="font-light">Vibe</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
            >
              Services
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition duration-200"
            >
              Contact Us
            </Link>
          </div>

          {/* Conditional Auth/Profile Section */}
          {userInfo ? (
            // Show profile menu when user is logged in
            <div className="hidden md:flex items-center">
              <ProfileDropmenu
                user={{
                  name: userInfo?.name || 'User',
                  email: userInfo?.email || 'user@example.com',
                  img: userInfo?.img,
                  isOnline: true,
                  role: userInfo?.role,
                }}
                onMenuClick={handleMenuClick}
                reverseLayout={true}
                isHomepage={true}
              />
            </div>
          ) : (
            // Show auth buttons when user is not logged in
            <div className="hidden md:flex items-center space-x-3">
              <Link href="/login">
                <Button
                  type="default"
                  className="text-gray-700 hover:text-gray-900"
                  style={{
                    borderColor: '#4d3ca3',
                    color: '#4d3ca3',
                  }}
                >
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  type="primary"
                  style={{
                    backgroundColor: '#4d3ca3',
                    borderColor: '#4d3ca3',
                  }}
                  className="hover:opacity-90"
                >
                  Sign up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              type="text"
              icon={
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              }
              className="text-gray-700 hover:text-gray-900"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
