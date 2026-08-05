import Link from 'next/link';
import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa6';

const FOOTER_COLUMNS = [
  {
    heading: 'Explore',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Services', href: '/services' },
      { label: 'About us', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Professionals',
    links: [
      { label: 'Open your shop', href: '/signup' },
      { label: 'Seller dashboard', href: '/login' },
      { label: 'Pricing & fees', href: '/about' },
      { label: 'Stripe payouts', href: '/about' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/' },
      { label: 'Contact', href: '/contact' },
      { label: 'Terms & privacy', href: '/' },
    ],
  },
];

export default function SVFooter() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="w-3/4 m-auto">
        <div className="grid grid-cols-2 md:grid-cols-[1.4fr_1fr_1fr_1fr] gap-8 pt-14 pb-10">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl text-customPrimary-800">
              <span className="font-bold">Style</span>
              <span className="font-light">Vibe</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-[30ch] mt-3 mb-5">
              The booking platform for salons, artists and the people who trust
              them.
            </p>
            <div className="flex gap-4">
              <FaFacebookF className="text-lg text-customPrimary-800 cursor-pointer hover:text-customPrimary-500" />
              <FaTwitter className="text-lg text-customPrimary-800 cursor-pointer hover:text-customPrimary-500" />
              <FaInstagram className="text-lg text-customPrimary-800 cursor-pointer hover:text-customPrimary-500" />
              <FaLinkedin className="text-lg text-customPrimary-800 cursor-pointer hover:text-customPrimary-500" />
            </div>
          </div>
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-800 mb-4">
                {column.heading}
              </h4>
              <ul className="list-none p-0 m-0 grid gap-2.5 text-sm">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-gray-500 transition hover:text-customPrimary-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-gray-100 py-6 text-xs text-gray-400">
          <span>© {new Date().getFullYear()} StyleVibe. All rights reserved.</span>
          <span>Made for salons, artists and their regulars.</span>
        </div>
      </div>
    </footer>
  );
}
