'use client';

import React from 'react';
import { message } from 'antd';
import { MdMiscellaneousServices } from 'react-icons/md'; // Import the new icon

import SVButton from '../SVButton';
import Form from '../Forms/Form';
import FormSelectField from '../Forms/FormSelectField';
import FormTextArea from '../Forms/FormTextArea';

import { useUpdateBookingMutation } from '@/redux/api/bookings';

interface BookingStatusUpdateProps {
  bookingId: string;
  serviceName: string; // Add this prop
  onClose: () => void;
}

const BookingStatusUpdate: React.FC<BookingStatusUpdateProps> = ({
  bookingId,
  serviceName,
  onClose,
}) => {
  const [updateBooking, { isLoading }] = useUpdateBookingMutation();

  const onFinish = async (values: any) => {
    try {
      await updateBooking({
        id: bookingId,
        data: { status: values.status, notes: values.notes },
      }).unwrap();
      message.success('Booking status updated successfully');
      onClose();
    } catch (error) {
      message.error('Failed to update booking status');
    }
  };

  const statusOptions = [
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ];

  return (
    <div className="p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-normal text-gray-800 mb-2 text-center">
        Update Booking Status
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

export default BookingStatusUpdate;
