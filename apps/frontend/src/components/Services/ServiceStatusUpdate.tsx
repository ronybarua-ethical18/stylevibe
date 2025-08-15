'use client';

import { message } from 'antd';
import React from 'react';
import { MdMiscellaneousServices } from 'react-icons/md'; // Import the new icon

import Form from '../Forms/Form';
import FormSelectField from '../Forms/FormSelectField';
import FormTextArea from '../Forms/FormTextArea';
import SVButton from '../SVButton';

import { useUpdateServiceMutation } from '@/redux/api/services';

interface ServiceStatusUpdateProps {
  serviceId: string;
  serviceName: string; // Add this prop
  onClose: () => void;
}

const ServiceStatusUpdate: React.FC<ServiceStatusUpdateProps> = ({
  serviceId,
  serviceName,
  onClose,
}) => {
  const [updateService, { isLoading }] = useUpdateServiceMutation();

  const onFinish = async (values: any) => {
    try {
      await updateService({
        id: serviceId,
        data: { status: values.status, notes: values.notes },
      }).unwrap();
      message.success('Service status updated successfully');
      onClose();
    } catch (error: any) {
      console.log('error from service status update', error);
      message.error('Failed to update service status');
    }
  };

  const statusOptions = [
    { label: 'Approved', value: 'APPROVED' },
    { label: 'Rejected', value: 'REJECTED' },
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-normal text-gray-800 mb-2 text-center">
        Update Service Status
      </h2>
      <div className="flex items-center justify-center mb-6">
        <MdMiscellaneousServices className="text-2xl mr-2 text-gray-400" />{' '}
        {/* Updated icon */}
        <h3 className="text-sm font-light text-gray-600">{serviceName}</h3>
      </div>
      <Form submitHandler={onFinish}>
        <FormSelectField
          name="status"
          options={statusOptions}
          placeholder="Select status"
          size="large"
          label="Select Status"
          required
        />

        <FormTextArea
          name="notes"
          placeholder="Enter notes here"
          size="large"
          label="Notes"
          required
        />
        <SVButton
          type="primary"
          htmlType="submit"
          loading={isLoading}
          title={isLoading ? 'Updating...' : 'Update Status'}
          className="w-full mt-5"
        />
      </Form>
    </div>
  );
};

export default ServiceStatusUpdate;
