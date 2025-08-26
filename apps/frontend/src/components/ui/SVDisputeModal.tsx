'use client';

import { Modal } from 'antd';
import React, { useState } from 'react';

import SVButton from '../SVButton';

import SVDisputeForm from './SVDisputeForm';

interface SVDisputeModalProps {
  bookingId?: string;
  triggerText?: string;
}

export default function SVDisputeModal({
  bookingId = '',
  triggerText = 'File Dispute',
}: SVDisputeModalProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDisputeSubmit = (values: any) => {
    console.log('Dispute data:', values);
    // Handle the dispute submission here
    // You can send this data to your backend API
    setIsModalVisible(false);

    // Show success message or redirect
    // message.success('Dispute submitted successfully. We will review your case within 24-48 hours.');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <SVButton
        title={triggerText}
        size="small"
        type="default"
        style={{
          fontSize: '12px',
          height: '28px',
          borderColor: '#ff7875',
          color: '#ff4d4f',
        }}
        onClick={() => setIsModalVisible(true)}
      />

      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={handleCancel}
        width={700}
        centered
        destroyOnHidden
        style={{ maxHeight: '80vh' }}
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
          padding: 0,
        }}
      >
        <div className="p-4">
          <SVDisputeForm
            onSubmit={handleDisputeSubmit}
            onCancel={handleCancel}
            defaultBookingId={bookingId}
            title="File a Dispute"
            subtitle="Help us resolve your issue. Please provide details about your booking concern."
          />
        </div>
      </Modal>
    </>
  );
}
