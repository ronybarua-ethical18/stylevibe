import React from 'react'

export default function SVNavMenus({ footer }:any) {
  return (
    <>
      {!footer ? (
        <div className="hidden md:flex items-center space-x-4 uppercase">
          <a
            href="#"
            className="rounded-3xl text-sm text-white transition duration-300 hover:text-violet-700 hover:font-medium hover:bg-white py-2 px-4 "
          >
            Home
          </a>
          <a
            href="#"
            className="rounded-3xl text-sm text-white transition duration-300 hover:text-violet-700 hover:bg-white py-2 px-4 hover:font-medium"
          >
            About
          </a>
          <a
            href="#"
            className="rounded-3xl text-sm text-white transition duration-300 hover:text-violet-700 hover:bg-white py-2 px-4 hover:font-medium"
          >
            Services
          </a>
          <a
            href="#"
            className="rounded-3xl text-sm text-white duration-300 transition-all hover:text-violet-700 hover:bg-white py-2 px-4 hover:font-medium"
          >
            Contact
          </a>
        </div>
      ) : (
        <div className="hidden md:flex items-center space-x-4">
          <a
            href="#"
            className="text-gray-600 transition duration-300 hover:text-violet-700"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-600 transition duration-300 hover:text-violet-700"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-600 transition duration-300 hover:text-violet-700"
          >
            Services
          </a>
          <a
            href="#"
            className="text-gray-600 transition duration-300 hover:text-violet-700"
          >
            Contact
          </a>
        </div>
      )}
    </>
  )
}
