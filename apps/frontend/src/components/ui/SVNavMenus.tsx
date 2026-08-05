import Link from 'next/link';
import React, { useState } from 'react';
import { useUserInfo } from '@/hooks/useUserInfo';
import ProfileDropmenu from './ProfileDropmenu';
import { useMenuHandler } from '@/utils/menuHandler';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact Us', href: '/contact' },
];

export default function SVNavMenus() {
  const { userInfo } = useUserInfo();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleMenuClick = useMenuHandler();

  const authButtons = (
    <>
      <Link
        href="/login"
        className="rounded-full border border-customPrimary-800 text-customPrimary-800 text-sm font-medium px-5 py-2 transition hover:bg-customPrimary-50"
      >
        Log in
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-customPrimary-800 text-white text-sm font-medium px-5 py-2 transition hover:bg-customPrimary-700"
      >
        Sign up
      </Link>
    </>
  );

  return (
    <nav className="bg-white/95 backdrop-blur border-b border-gray-100 sticky top-0 z-50">
      <div className="w-3/4 m-auto">
        <div className="flex justify-between items-center h-[72px]">
          {/* Logo */}
          <Link href="/" className="text-2xl text-customPrimary-800">
            <span className="font-bold">Style</span>
            <span className="font-light">Vibe</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-9">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative text-sm font-medium text-gray-600 transition hover:text-customPrimary-700 after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-customPrimary-500 after:transition-transform after:duration-200 hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop auth / profile */}
          {userInfo ? (
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
            <div className="hidden md:flex items-center gap-2.5">
              {authButtons}
            </div>
          )}

          {/* Mobile menu button */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="md:hidden bg-transparent border-0 p-2 text-gray-700 cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 6l12 12M18 6L6 18"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile panel */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-[15px] font-medium text-gray-700 transition hover:bg-customPrimary-50 hover:text-customPrimary-700"
              >
                {link.label}
              </Link>
            ))}
            {userInfo ? (
              <div className="px-3 pt-3 border-t border-gray-100 mt-2">
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
              <div className="flex items-center gap-2.5 px-3 pt-3 border-t border-gray-100 mt-2">
                {authButtons}
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
