'use client';

import React, { ReactNode, useState } from 'react';
import { Button, Col, Modal, Row, Switch, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { GrAdd } from 'react-icons/gr';
import { SubmitHandler } from 'react-hook-form';

import SVUplaod from '../SVUpload';

import {
  closeModal,
  globalSelector,
  showModal,
} from '@/redux/slices/globalSlice';
import Form from '@/components/Forms/Form';
import FormInput from '@/components/Forms/FormInput';
import FormSelectField from '@/components/Forms/FormSelectField';
import FormTextArea from '@/components/Forms/FormTextArea';
import { useCreateShopMutation, useUpdateShopMutation } from '@/redux/api/shop';
import { useGetUserProfileQuery } from '@/redux/api/users';
import { getUserInfo } from '@/services/auth.service';

export const SERVICE_TIME_SLOTS = [
  { value: '9:00 AM', label: '9:00 AM' },
  { value: '10:00 AM', label: '10:00 AM' },
  { value: '11:00 AM', label: '11:00 AM' },
  { value: '12:00 PM', label: '12:00 PM' },
  { value: '1:00 PM', label: '1:00 PM' },
  { value: '2:00 PM', label: '2:00 PM' },
  { value: '3:00 PM', label: '3:00 PM' },
  { value: '4:00 PM', label: '4:00 PM' },
  { value: '5:00 PM', label: '5:00 PM' },
  { value: '6:00 PM', label: '6:00 PM' },
  { value: '7:00 PM', label: '7:00 PM' },
  { value: '8:00 PM', label: '8:00 PM' },
  { value: '9:00 PM', label: '9:00 PM' },
  { value: '10:00 PM', label: '10:00 PM' },
];

export const SERVICE_OFF_DAYS = [
  { value: 'SUNDAY', label: 'Sunday' },
  { value: 'MONDAY', label: 'Monday' },
  { value: 'TUESDAY', label: 'Tuesday' },
  { value: 'WEDNESDAY', label: 'Wednesday' },
  { value: 'THURSDAY', label: 'Thursday' },
  { value: 'FRIDAY', label: 'Friday' },
  { value: 'SATURDAY', label: 'Saturday' },
];

type FormValues = {
  shopName: string;
  location: string;
  shopDescription: string;
  gallery: string[];
  maxResourcePerHour: number;
  serviceTime: {
    openingHour: string;
    closingHour: string;
    offDays: string[];
  };
};

type Props = {
  edit: boolean;
  shopData?: any;
};

const SVShopModal = ({ edit, shopData }: Props): ReactNode => {
  const { isModalOpen } = useSelector(globalSelector);
  const dispatch = useDispatch();
  const [images, setImages] = useState(shopData?.shop?.gallery || []);
  const [createShop, { isLoading }] = useCreateShopMutation();
  const [updateShop, { isLoading: isUpdateLoading }] = useUpdateShopMutation();
  const loggedUser = getUserInfo() as any;
  const { refetch } = useGetUserProfileQuery(loggedUser?.userId);
  const [isChecked, setIsChecked] = useState(false);

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    try {
      const manipulatedObj = {
        ...data,
        serviceTime: {
          openingHour:
            data?.openingHour || shopData?.shop?.serviceTime?.openingHour,
          closingHour:
            data?.closingHour || shopData?.shop?.serviceTime?.closingHour,
          offDays: data?.offDays || shopData?.shop?.serviceTime?.offDays,
        },
        maxResourcePerHour:
          Number(data?.maxResourcePerHour) ||
          shopData?.shop?.maxResourcePerHour,
        gallery: images?.map((image: any) => {
          return typeof image === 'string' ? { img: image } : image;
        }),
        location: data?.location || shopData?.shop?.location,
        shopName: data?.shopName || shopData?.shop?.shopName,
        shopDescription:
          data?.shopDescription || shopData?.shop?.shopDescription,
      };
      if (edit) {
        console.log('manipulatedObj', manipulatedObj);
        await updateShop({
          id: shopData?.shop?._id,
          data: manipulatedObj,
        }).unwrap();
      } else {
        await createShop(manipulatedObj).unwrap();
      }
      refetch();
      setIsChecked(false);
      dispatch(closeModal(false));
      message.success('Shop created successfully!');
    } catch (err: any) {
      message.error(err?.data?.message);
    }
  };

  const handleChange = (checked: any) => {
    setIsChecked(checked);
    dispatch(showModal(checked));
  };

  return (
    <div>
      <div className="flex justify-center">
        {edit ? (
          <Switch
            checked={isChecked}
            checkedChildren="Edit"
            unCheckedChildren="View"
            onChange={handleChange}
          />
        ) : (
          <div
            className="border border-dashed rounded-full flex items-center justify-center w-28 h-28 cursor-pointer"
            onClick={() => dispatch(showModal(true))}
          >
            <GrAdd />
          </div>
        )}
      </div>
      <Modal
        width={850}
        centered
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          dispatch(closeModal(false));
          setIsChecked(false);
        }}
        onClose={() => {
          dispatch(closeModal(false));
          setIsChecked(false);
        }}
        maskAnimation={true}
        style={{ height: '90vh', overflowY: 'auto' }}
        className="no-scrollbar "
      >
        <div className="overflow-y-scroll no-scrollbar w-full p-6 ">
          <h1 className="text-2xl text-center font-normal">Shop Information</h1>
          <h2 className="text-base text-center font-light text-gray-600 mb-8">
            Write down essential details about your shop and services.
          </h2>
          <Form submitHandler={onSubmit}>
            <Row gutter={24}>
              <Col className="gutter-row" span={12}>
                <FormInput
                  name="shopName"
                  placeholder="Enter shop name"
                  type="text"
                  label="Name"
                  defaultValue={shopData?.shop?.shopName || ''}
                  // defaultValue={incomingData?.name || ""}
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <FormInput
                  name="location"
                  placeholder="Enter shop location"
                  type="text"
                  label="Location"
                  defaultValue={shopData?.shop?.location || ''}
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <FormSelectField
                  name="openingHour"
                  options={SERVICE_TIME_SLOTS}
                  placeholder="Select"
                  label="Service Start Time"
                  defaultValue={shopData?.shop?.serviceTime?.openingHour || ''}
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <FormSelectField
                  name="closingHour"
                  options={SERVICE_TIME_SLOTS}
                  placeholder="Select"
                  label="Service End Time"
                  defaultValue={shopData?.shop?.serviceTime?.closingHour || ''}
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <FormInput
                  name="maxResourcePerHour"
                  placeholder="Max resource"
                  type="number"
                  label="Max Resource Per Hour"
                  defaultValue={shopData?.shop?.maxResourcePerHour || ''}
                />
              </Col>
              <Col className="gutter-row" span={12}>
                <FormSelectField
                  name="offDays"
                  options={SERVICE_OFF_DAYS}
                  placeholder="Select"
                  label="Service Off Days"
                  mode="multiple"
                  defaultValue={shopData?.shop?.serviceTime?.offDays || []}
                />
              </Col>
              <Col className="gutter-row" span={24}>
                <FormTextArea
                  name="shopDescription"
                  placeholder="Write Description"
                  label="Description"
                  maxLength={400}
                  defaultValue={shopData?.shop?.shopDescription || ''}
                />
              </Col>
              <Col className="gutter-row" span={24}>
                <h2 className="text-sm font-normal mt-4">
                  Upload Gallery Images
                </h2>
                <SVUplaod images={images} setImages={setImages} />
              </Col>
            </Row>
            <div className="flex justify-end mt-7">
              {!isLoading ? (
                <Button
                  htmlType="submit"
                  type="primary"
                  className="text-right"
                  disabled={isUpdateLoading || isLoading}
                >
                  {edit ? 'Update' : 'Submit'}
                </Button>
              ) : (
                <Button type="primary" loading iconPosition="end">
                  Loading
                </Button>
              )}
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default SVShopModal;
