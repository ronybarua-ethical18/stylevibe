import { Button, Col, Row, message, notification } from 'antd';
import { useEffect, useState } from 'react';
import { SubmitHandler } from 'react-hook-form';
import { useDispatch } from 'react-redux';

import Form from '../Forms/Form';
import FormInput from '../Forms/FormInput';
import FormSelectField from '../Forms/FormSelectField';
import FormTextArea from '../Forms/FormTextArea';
import SVUplaod from '../ui/SVUpload';

import {
  SERVICE_CATEGORIES,
  SERVICE_SUB_CATEGORIES,
} from '@/constants/options';
import {
  useCreateServiceMutation,
  useUpdateServiceMutation,
} from '@/redux/api/services';
import { closeModal } from '@/redux/slices/globalSlice';

type FormValues = {
  name: string;
  price: string;
  category: string;
  subCategory: string;
  description: string;
  images: string[];
};

export default function CreateService({ savedData }: any) {
  const [images, setImages] = useState<{ img: string }[]>(
    savedData?.images || []
  );
  const [createService] = useCreateServiceMutation();
  const dispatch = useDispatch();

  const [incomingData, setIncomingData] = useState(savedData || {});
  const [updateService] = useUpdateServiceMutation();

  useEffect(() => {
    setIncomingData(savedData || {});
  }, [savedData]);

  console.log('data from create service', savedData);

  const onSubmit: SubmitHandler<FormValues> = async (data: any) => {
    try {
      if (savedData) {
        await updateService({
          id: savedData._id,
          data: {
            ...data,
            price: Number(data?.price),
            images,
          },
        }).unwrap();
      } else {
        await createService({
          ...data,
          price: Number(data?.price),
          images,
        }).unwrap();
      }

      notification.success({
        message: savedData
          ? 'Service updated successfully'
          : 'Service created successfully',
        description: savedData
          ? 'Your service has been updated successfully.'
          : 'Your service has been created successfully.',
      });
      setImages([]);
      dispatch(closeModal(false));
    } catch (err: any) {
      message.error(err?.data?.message);
    }
  };
  return (
    <div className="p-5 bg-white">
      <h1 className="text-center text-2xl">
        {savedData ? 'Edit Service' : 'Create Service'}
      </h1>
      <div className="mt-5">
        <Form submitHandler={onSubmit}>
          <Row gutter={24}>
            <Col className="gutter-row" span={12}>
              <FormInput
                name="name"
                placeholder="Enter service name"
                type="text"
                label="Name"
                defaultValue={incomingData?.name || ''}
              />
            </Col>
            <Col className="gutter-row" span={12}>
              <FormInput
                name="price"
                placeholder="Enter service price"
                type="number"
                label="Price"
                defaultValue={incomingData?.price || ''}
              />
            </Col>
            <Col className="gutter-row" span={12}>
              <FormSelectField
                name="category"
                options={SERVICE_CATEGORIES}
                placeholder="Select"
                label="Select Category"
                defaultValue={incomingData?.category || ''}
              />
            </Col>
            <Col className="gutter-row" span={12}>
              <FormSelectField
                name="subCategory"
                options={SERVICE_SUB_CATEGORIES}
                placeholder="Select"
                label="Select Category"
                defaultValue={incomingData?.subCategory}
              />
            </Col>
            <Col className="gutter-row" span={24}>
              <FormTextArea
                name="description"
                placeholder="Write Description"
                label="Description"
                defaultValue={incomingData?.description}
              />
            </Col>
            <Col className="gutter-row" span={24}>
              <h2 className="text-sm font-normal mt-4">Upload Images</h2>
              <SVUplaod images={images} setImages={setImages} />
            </Col>
          </Row>
          <div className="flex justify-end mt-7">
            <Button htmlType="submit" type="primary" className="text-right">
              {savedData ? 'Update' : 'Submit'}
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
