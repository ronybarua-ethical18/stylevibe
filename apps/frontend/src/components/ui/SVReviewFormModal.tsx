'use client';

import { Modal } from 'antd';
import React, { useState } from 'react';

import SVButton from '../SVButton';

import SVReviewForm from './SVReviewForm';

export default function SVReviewFormModal() {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleReviewSubmit = (values: any) => {
    console.log('Review data:', values);
    // Handle the review submission here
    // You can send this data to your backend API
    setIsModalVisible(false);
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
        className="bg-customPrimary-800 border-customPrimary-800"
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
          />
        </div>
      </Modal>
    </>
  );
}
