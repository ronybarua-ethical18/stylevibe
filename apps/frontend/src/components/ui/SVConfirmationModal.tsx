'use client';
import { Modal } from 'antd';
import React, { ReactNode, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { IoTrashOutline } from 'react-icons/io5';

import SVButton from '../SVButton';

interface IModal {
  modalTitle?: string;
  buttonTitle?: string;
  width?: string | number;
  func?: () => Promise<void>; // Changed to a function type
  item: any;
  isLoading?: boolean;
}

const SVConfirmationModal = ({
  func,
  buttonTitle = 'Confirm',
  isLoading,
}: IModal): ReactNode => {
  const [open, setOpen] = useState(false);

  const handleOpenModal = () => {
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };

  return (
    <>
      <IoTrashOutline
        className="text-xl cursor-pointer ml-2"
        onClick={handleOpenModal}
      />
      <Modal
        open={open}
        centered
        footer={null}
        onCancel={handleCloseModal}
        // maskStyle={{background:"rgba(0,0,0,0.09)"}}
      >
        <div className="pt-6 pb-0 px-2">
          <div className="flex items-start">
            <FaRegTrashAlt className="text-3xl mr-5 text-[#f0424c] mt-1 font-semibold" />
            <div>
              <p className="text-lg font-light m-0">
                Are you sure you want to{' '}
                <span className="font-medium">delete the item?</span> This
                cannot be undone.
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-10">
            <SVButton
              title="Cancel"
              type="text"
              style={{
                // background: '#fff',
                color: '#000',
                marginRight: '15px',
                borderRadius: '10px',
              }}
              onClick={handleCloseModal}
            />
            <SVButton
              title={buttonTitle}
              disabled={isLoading}
              type="primary"
              style={{ background: '#f0424c', borderRadius: '10px' }}
              onClick={() => {
                func!();
                if (!isLoading) {
                  handleCloseModal();
                }
              }}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SVConfirmationModal;
