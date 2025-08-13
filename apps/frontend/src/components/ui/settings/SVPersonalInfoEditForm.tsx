import { Button, Divider, message } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';

import SVProfilePhotoUpload from '../SVProfileUpload';

import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import FormTextArea from '@/components/Forms/FormTextArea';
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@/redux/api/users';
import { getUserInfo } from '@/services/auth.service';

type FormValues = {
  firstName: string;
  lastName: string;
  phone: string;
  address?: string[];
  bio?: string;
  img?: string;
};

interface SVPersonalInfoEditFormProps {
  userProfile: any;
  setIsEditMode: Dispatch<SetStateAction<boolean>>;
}

function SVPersonalInfoEditForm({
  userProfile,
  setIsEditMode,
}: SVPersonalInfoEditFormProps) {
  const [photoUrl, setPhotoUrl] = useState<string>(userProfile?.img);
  const loggedUser = getUserInfo() as any;
  const { refetch } = useGetUserProfileQuery(loggedUser?.userId);
  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation();

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    try {
      const manipulatedObj = {
        ...data,
        img: photoUrl,
      };

      console.log('profile update data', manipulatedObj);
      const res = await updateUserProfile({
        id: loggedUser?.userId,
        data: manipulatedObj,
      }).unwrap();

      console.log('res', res);
      await refetch();
      message.success('Profile updated successfully!');
      setIsEditMode(false);
    } catch (err: any) {
      message.error(err?.data?.message);
    }
  };

  return (
    <div>
      <div className="my-5 flex justify-between items-center">
        <div className="flex space-x-5 items-center">
          <SVProfilePhotoUpload
            photoUrl={photoUrl}
            setPhotoUrl={(url: string | null) => setPhotoUrl(url || '')}
          />
          <div className="">
            <h4 className="text-base font-medium mb-0">
              {userProfile?.firstName + ' ' + userProfile?.lastName}
            </h4>
            <h5 className="mt-0 font-light mb-0">{userProfile?.role}</h5>
            <h5 className="mt-0 font-light">
              {userProfile?.address || 'Los angeles, California, USA'}
            </h5>
          </div>
        </div>
      </div>
      <Divider />
      <Form submitHandler={onSubmit}>
        <div className="my-5 grid grid-cols-2 gap-6">
          <div>
            <h1 className="mb-0 text-base font-normal ">First Name</h1>
            <FormInput
              name="firstName"
              type="text"
              size="large"
              placeholder="Enter your first name"
              style={{ height: '46px' }}
              defaultValue={userProfile?.firstName}
              variant="filled"
            />
          </div>
          <div>
            <h1 className="mb-0 text-base font-normal">Last Name</h1>
            <FormInput
              name="lastName"
              type="text"
              size="large"
              placeholder="Enter your last name"
              style={{ height: '46px' }}
              defaultValue={userProfile?.lastName}
              variant="filled"
            />
          </div>
          <div>
            <h1 className="mb-0 text-base font-normal mt-0">Email</h1>
            <FormInput
              name="email"
              type="text"
              size="large"
              style={{ height: '46px' }}
              placeholder="Enter your email"
              defaultValue={userProfile?.email}
              variant="filled"
              disabled={true}
            />
          </div>
          <div>
            <h1 className="mb-0 text-base font-normal mt-0">Address</h1>
            <FormInput
              name="address"
              type="text"
              size="large"
              style={{ height: '46px' }}
              placeholder="Enter your address"
              variant="filled"
              defaultValue={userProfile?.address}
            />
          </div>
        </div>
        <div>
          <h1 className="mb-0 text-base font-normal mt-0">Phone</h1>
          <FormInput
            name="phone"
            type="text"
            size="large"
            placeholder="Enter your phone"
            defaultValue={userProfile?.phone}
            variant="filled"
            style={{ height: '46px' }}
          />
        </div>
        <div>
          <h1 className="mb-0 text-base font-normal mt-5">Bio</h1>
          <FormTextArea
            name="bio"
            placeholder="Write bio"
            rows={10}
            variant="filled"
            defaultValue={userProfile?.bio || ''}
          />
        </div>

        <div className="flex justify-end mt-7">
          {!isLoading ? (
            <div className="flex space-x-2">
              <Button
                type="default"
                className="mr-2"
                onClick={() => setIsEditMode(false)}
              >
                Cancel
              </Button>
              <Button htmlType="submit" type="primary" className="text-right">
                Save Changes
              </Button>
            </div>
          ) : (
            <Button type="primary" loading iconPosition="end">
              Loading
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}

export default SVPersonalInfoEditForm;
