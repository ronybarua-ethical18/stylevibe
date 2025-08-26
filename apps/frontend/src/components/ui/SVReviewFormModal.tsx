'use client';

import { Modal, message } from 'antd';
import React, { useState } from 'react';

import SVButton from '../SVButton';
import { useCreateFeedbackMutation } from '@/redux/api/feedbacks';

import SVReviewForm from './SVReviewForm';

interface SVReviewFormModalProps {
  bookingObjectId?: string; // MongoDB _id for API
  serviceId?: string; // MongoDB _id for API
  bookingId?: string; // Human-readable ID for display
  serviceName?: string; // Service name for display
}

export default function SVReviewFormModal({
  bookingObjectId,
  serviceId,
}: SVReviewFormModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createFeedback, { isLoading }] = useCreateFeedbackMutation();

  // Mapping from your form values to API format
  const mapRatingToNumber = (rating: string): number => {
    const ratingMap: { [key: string]: number } = {
      terrible: 1,
      bad: 2,
      okay: 3,
      good: 4,
      amazing: 5,
    };
    return ratingMap[rating] || 3;
  };

  const handleReviewSubmit = async (values: any) => {
    if (!bookingObjectId || !serviceId) {
      message.error('Booking and service information required');
      return;
    }

    try {
      const feedbackData = {
        comment: values.feedback || '',
        rating: mapRatingToNumber(values.rating),
        booking: bookingObjectId,
        service: serviceId,
      };

      const response = await createFeedback(feedbackData).unwrap();
      message.success(response.message); // Use backend message
      setIsModalVisible(false);
    } catch (error: any) {
      console.error('Debug - API Error:', error);
      const errorMessage = error?.data?.message || 'Failed to submit review';
      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <SVButton
        title="Rate Service"
        type="default"
        size="small"
        style={{
          fontSize: '12px',
          height: '28px',
          borderColor: '#d9d9d9',
          color: '#595959',
        }}
        onClick={() => setIsModalVisible(true)}
        disabled={!bookingObjectId || !serviceId}
      />

      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={550}
        centered
        destroyOnHidden
      >
        <div className="p-4">
          <SVReviewForm
            onSubmit={handleReviewSubmit}
            onCancel={handleCancel}
            title="Rate Your Experience"
            subtitle="How was your beauty service experience? Your feedback helps us improve our services."
            isLoading={isLoading}
          />
        </div>
      </Modal>
    </>
  );
}
