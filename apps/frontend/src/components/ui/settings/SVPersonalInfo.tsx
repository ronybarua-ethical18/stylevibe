'use client';

import React, { useState } from 'react';

import SVPersonalDetails from './SVPersonalDetails';
import SVPersonalInfoEditForm from './SVPersonalInfoEditForm';

function SVPersonalInfo({ userProfile }: any) {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div>
      <h1 className="text-xl font-normal">Personal Information</h1>
      <div className="p-5 rounded-md " style={{ border: '1px solid #eee' }}>
        {isEditMode ? (
          <SVPersonalInfoEditForm
            userProfile={userProfile}
            setIsEditMode={setIsEditMode}
          />
        ) : (
          <SVPersonalDetails
            userProfile={userProfile}
            setIsEditMode={setIsEditMode}
          />
        )}
      </div>
    </div>
  );
}

export default SVPersonalInfo;
