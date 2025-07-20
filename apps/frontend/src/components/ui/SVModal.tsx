'use client';

import React, { ReactNode } from 'react';
import { Modal } from 'antd';
import SVButton from '../SVButton';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeModal,
  globalSelector,
  showModal,
} from '@/redux/slices/globalSlice';
import { LiaEdit } from 'react-icons/lia';
import { usePathname } from 'next/navigation';
import CreateService from '../Services/CreateService';
import ServiceStatusUpdate from '../Services/ServiceStatusUpdate';
import BookingStatusUpdate from '../Bookings/BookingStatusUpdate';
import SVTransactionDetails from '../Transactions/components/SVTransactionDetails';
import { IoEyeOutline } from 'react-icons/io5';

interface IModal {
  modalTitle?: string;
  buttonTitle?: string;
  width?: string | number;
  data?: any;
  isOpen?: boolean;
  setSelectedRecord?: any;
  bookingId?: any;
  transaction?: any;
}

const SVModal = ({
  buttonTitle,
  bookingId,
  width,
  data,
  setSelectedRecord,
  transaction,
}: IModal): ReactNode => {
  const { isModalOpen } = useSelector(globalSelector);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const adminServicePath = pathname === '/admin/services';
  const sellerServicePath = pathname === '/seller/services';
  const sellerTransactionPath = pathname === '/seller/transactions';

  const renderContent = (): any => {
    if (sellerServicePath && !bookingId) {
      return data ? <CreateService savedData={data} /> : <CreateService />;
    } else if (sellerTransactionPath && transaction) {
      return <SVTransactionDetails transaction={transaction} />;
    } else if (adminServicePath && !bookingId) {
      return (
        <ServiceStatusUpdate
          serviceId={data?._id}
          serviceName={data?.name}
          onClose={() => {
            setSelectedRecord(null);
            dispatch(closeModal(false));
          }}
        />
      );
    } else {
      return (
        <BookingStatusUpdate
          bookingId={bookingId}
          serviceName={data?.name}
          onClose={() => {
            setSelectedRecord(null);
            dispatch(closeModal(false));
          }}
        />
      );
    }
  };

  return (
    <div>
      {adminServicePath && buttonTitle === 'Create service' ? (
        <></>
      ) : transaction ? (
        <IoEyeOutline
          className="mr-2 text-xl cursor-pointer"
          onClick={() => dispatch(showModal(true))}
        />
      ) : (
        buttonTitle && (
          <SVButton
            type="primary"
            title={buttonTitle}
            onClick={() => dispatch(showModal(true))}
          />
        )
      )}
      <Modal
        width={width}
        centered
        open={isModalOpen}
        footer={null}
        onCancel={() => {
          setSelectedRecord(null) ?? null;
          dispatch(closeModal(false));
        }}
        onClose={() => {
          setSelectedRecord(null) ?? null;
          dispatch(closeModal(false));
        }}
        maskStyle={{ background: 'rgba(0,0,0,0.09)' }}
        maskAnimation={true}
      >
        <div
          className="overflow-y-scroll no-scrollbar"
          style={{ height: '90%' }}
        >
          {renderContent()}
        </div>
      </Modal>
    </div>
  );
};

export default SVModal;
