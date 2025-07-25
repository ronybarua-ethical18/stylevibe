import { Divider } from 'antd';
import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa6';

import SVNavMenus from './SVNavMenus';

export default function SVFooter() {
  return (
    <div className="bg-white text-center">
      <div className=" w-2/4 m-auto pt-10 pb-5">
        <h1>
          <strong className="text-customPrimary-800 text-3xl font-semibold">
            Style
          </strong>
          <span className="text-customPrimary-800 text-3xl font-thin">
            Vibe
          </span>
        </h1>
        <div className="flex justify-center my-6">
          <SVNavMenus footer={true} />
        </div>
        <div className="flex justify-center mt-5">
          <FaFacebookF className="text-3xl text-customPrimary-800 cursor-pointer hover:text-gray-600" />
          <FaTwitter className="ml-5 text-3xl text-customPrimary-800 cursor-pointer hover:text-gray-600" />
          <FaInstagram className="mx-5 text-3xl text-customPrimary-800 cursor-pointer hover:text-gray-600" />
          <FaLinkedin className="text-3xl text-customPrimary-800 cursor-pointer hover:text-gray-600" />
        </div>
        <Divider />
        <h6 className="text-center text-sm font-light">
          Copyright 2024 | All rights reserved
        </h6>
      </div>
    </div>
  );
}
