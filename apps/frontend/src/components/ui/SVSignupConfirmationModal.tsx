'use client';

import { Modal } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
import React, { ReactNode, useState } from 'react';
import { GrClose } from 'react-icons/gr';

import ModalImage from '../../../public/modal.jpg';
import SVButton from '../SVButton';

const SVSignupConfirmationModal = ({
  width,
}: {
  width: string | number;
}): ReactNode => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        afterClose={handleClose}
        closeIcon={
          <div
            style={{
              padding: '5px',
              borderRadius: '50%',
              marginRight: '30px',
              marginTop: '15px',
              background: 'white',
            }}
          >
            <GrClose
              style={{
                fontSize: '14px',
              }}
            />
          </div>
        }
        // maskStyle={{ background: 'rgba(0,0,0,0.09)' }}
        wrapClassName="custom-modal-wrap"
      >
        <div className="text-center">
          <Image
            src={ModalImage}
            alt="modal image"
            style={{ height: '200px' }}
          />
          <h2 className="text-base font-normal text-center">
            For booking a service you need to create an account to our portal
          </h2>
          <h1 className="text-3xl font-medium text-center mt-5">
            Let is get started
          </h1>
          <Link href="/login">
            <SVButton
              type="primary"
              title="Sign up now"
              className="mt-10"
              style={{ background: '#4d3ca3', width: '100%' }}
            />
          </Link>
        </div>
      </Modal>
    </div>
  );
};

export default SVSignupConfirmationModal;
