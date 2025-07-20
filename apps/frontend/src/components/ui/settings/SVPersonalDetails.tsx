'use client';

import { Divider } from 'antd';
import Image from 'next/image';
import React from 'react';
import placeholderImg from '../../../../public/placeholder.jpg';
import { BiEdit } from 'react-icons/bi';
import { Dispatch, SetStateAction } from 'react';

interface SVPersonalDetailsProps {
  userProfile: any;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}

function SVPersonalDetails({
  userProfile,
  setIsEditMode,
}: SVPersonalDetailsProps) {
  return (
    <div>
      <div className="my-5 flex justify-between items-center">
        <div className="flex space-x-5 items-center">
          <Image
            src={userProfile?.img || placeholderImg}
            alt="profile"
            width={80}
            height={80}
            className="rounded-full"
          />
          <div className="">
            <h4 className="text-lg font-normal mb-0">
              {userProfile?.firstName + ' ' + userProfile?.lastName}
            </h4>
            <h5 className="mt-0 font-light mb-0">{userProfile?.role}</h5>
            <h5 className="mt-0 font-light">
              {userProfile?.address || 'Los angeles, California, USA'}
            </h5>
          </div>
        </div>
        <BiEdit
          size={25}
          className="cursor-pointer text-gray-500"
          onClick={() => setIsEditMode(true)}
        />
      </div>
      <Divider />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <h4 className="text-lg font-normal mb-0">First Name</h4>
          <p className="mt-0 font-light text-base">{userProfile?.firstName}</p>
        </div>
        <div>
          <h4 className="text-lg font-normal mb-0">Last Name</h4>
          <p className="mt-0 font-light text-base">{userProfile?.lastName}</p>
        </div>
        <div>
          <h4 className="text-lg font-normal mb-0">Email</h4>
          <p className="mt-0 font-light text-base">{userProfile?.email}</p>
        </div>
        <div>
          <h4 className="text-lg font-normal mb-0">Phone</h4>
          <p className="mt-0 font-light text-base">{userProfile?.phone}</p>
        </div>
        <div>
          <h4 className="text-lg font-normal mb-0">Address</h4>
          <p className="mt-0 font-light text-base">{userProfile?.address}</p>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-normal mt-5">Bio</h4>
        <p className="mt-0 font-light text-base">{userProfile?.bio}</p>
      </div>
    </div>
  );
}

export default SVPersonalDetails;
