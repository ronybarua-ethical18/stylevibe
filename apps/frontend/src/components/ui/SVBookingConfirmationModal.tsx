'use client';

import React, { ReactNode, useState } from 'react';
import { Modal } from 'antd';
import SVButton from '../SVButton';
import SVBookingDetails from './SVBookingDetails';
import PaymentWrapper from '../Forms/PaymentForm';
import SVStepper from './SVStepper';
import { BiArrowBack } from 'react-icons/bi';
import moment from 'moment';

const SVBookingConfirmationModal = ({
  width,
  service,
}: {
  width: string | number;
  service: any;
}): ReactNode => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(!open);

  // Update the default date to use UTC
  const [selectedDate, setSelectedDate] = useState(
    moment.utc().format('YYYY-MM-DD')
  );
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{
    _id: string;
    startTime: string;
    maxResourcePerHour: number;
  }>();

  const [selectedMethod, setSelectedMethod] = useState<any>();

  const handleSelect = (item: { item: any }) => {
    setSelectedMethod(item);
  };

  const [current, setCurrent] = useState(0);
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const processingFees = Number(
    ((service?.price * 2.9) / 100 + 0.3).toFixed(2)
  );
  const totalAmount = Number((processingFees + service?.price).toFixed(2));

  const steps = [
    {
      title: 'Date Selection',
      content: (
        <SVBookingDetails
          service={service}
          next={next}
          processingFees={processingFees}
          totalAmount={totalAmount}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTimeSlots={selectedTimeSlots}
          setSelectedTimeSlots={setSelectedTimeSlots}
          selectedMethod={selectedMethod}
          handleSelect={handleSelect}
        />
      ),
    },
    {
      title: 'Payment',
      content: (
        <PaymentWrapper
          service={service}
          processingFees={processingFees}
          totalAmount={totalAmount}
          handleClose={handleClose}
          serviceDate={selectedDate}
          serviceStartTime={selectedTimeSlots?.startTime || ''}
        />
      ),
    },
  ];

  console.log('selected method', selectedMethod);

  return (
    <div>
      <SVButton
        title="Book now"
        type="primary"
        style={{
          background: '#4d3ca3',
          borderRadius: '10px',
          width: '100%',
        }}
        onClick={handleOpen}
      />

      <Modal
        width={width}
        centered
        open={open}
        footer={null}
        onCancel={handleClose}
        onClose={handleClose}
        // maskStyle={{ background: 'rgba(0,0,0,0.09)' }}
        maskAnimation={true}
      >
        <div className="text-center px-6 py-2 relative h-[90vh] max-h-[800px] overflow-y-auto overflow-x-hidden scrollbar-hide">
          {current > 0 && (
            <BiArrowBack
              onClick={prev}
              className="absolute left-9 top-8 text-gray-500 text-2xl cursor-pointer"
            />
          )}
          <h1 className="text-3xl">Booking Confirmation</h1>
          <h3 className="font-extralight text-base">
            Kindly review your booking details below. Once you are satisfied,
            proceed to confirm your booking for a seamless salon experience.
          </h3>

          <div className="w-full mt-0 p-4">
            <SVStepper steps={steps} current={current} />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SVBookingConfirmationModal;
