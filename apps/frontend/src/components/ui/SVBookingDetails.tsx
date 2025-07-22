import { Checkbox, Col, Divider, Radio, Row, message } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import Image from 'next/image';

import VisaImg from '../../../public/visa.png';
import PaypalImg from '../../../public/picon.png';
import SVButton from '../SVButton';

import SVCalendar from './SVCalendar';
import SVBookedService from './SVBookedService';

const paymentMethods = [
  {
    id: 1,
    name: 'Card Payment',
    type: 'card',
    subTitle: 'Pay via your visa card',
    img: VisaImg,
  },
  {
    id: 2,
    name: 'Paypal Payment',
    type: 'paypal',
    subTitle: 'Pay via your paypal account',
    img: PaypalImg,
  },
];

export default function SVBookingDetails({
  service,
  next,
  processingFees,
  totalAmount,
  selectedDate,
  setSelectedDate,
  selectedTimeSlots,
  setSelectedTimeSlots,
  selectedMethod,
  handleSelect,
}: {
  service: any;
  next: () => void;
  processingFees: number;
  totalAmount: number;
  selectedDate: string;
  setSelectedDate: any;
  selectedTimeSlots: any;
  setSelectedTimeSlots: any;
  selectedMethod: any;
  handleSelect: any;
}): ReactNode {
  const [isChecked, setIsChecked] = useState(true);

  const handleCheckboxChange = (e: any) => {
    setIsChecked(e.target.checked);
  };

  useEffect(() => {
    if (!isChecked) {
      message.warning({
        content: 'Please accept the privacy policy and terms to proceed.',
        duration: 3,
      });
    }
  }, [isChecked]);

  return (
    <div>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col md={9}>
          <SVCalendar
            service={service}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            selectedTimeSlots={selectedTimeSlots}
            setSelectedTimeSlots={setSelectedTimeSlots}
          />
        </Col>
        <Col md={15}>
          <div className="text-left">
            <SVBookedService service={service} />
            <Divider />
            <div className="">
              <h2 className="text-lg font-normal mt-5">
                Select Payment Method
              </h2>
              <div className="flex space-x-4">
                {paymentMethods.map((item) => (
                  <div
                    key={item.id}
                    className={`w-[50%] px-2 py-4 flex rounded-md border items-center justify-between ${
                      selectedMethod?.id === item.id ? 'border-blue-500' : ''
                    }`}
                    onClick={() => handleSelect(item)}
                  >
                    <div className="flex items-center">
                      <Radio checked={selectedMethod?.id === item.id} />
                      <div className="ml-2">
                        <strong className="font-medium">{item.name}</strong>
                        <h2 className="font-light m-0">{item.subTitle}</h2>
                      </div>
                    </div>
                    <Image
                      src={item.img}
                      alt={`${item.name} payment icon`}
                      width={0}
                      height={0}
                      sizes="100vw"
                      className="rounded-sm w-auto h-auto"
                      style={{ objectFit: 'contain' }}
                      priority
                    />
                  </div>
                ))}
              </div>
            </div>
            <h6 className="font-light my-5 ">
              A processing fee of <strong>2.9%</strong> of the service amount
              plus an additional fixed charge of <strong>€0.30</strong> will be
              applied to the total cost of your purchase.
            </h6>

            <div>
              {/* <h2 className="text-lg font-normal mt-5">Booking Summary</h2> */}
              {/* <Divider style={{margin:0}}/> */}
              <div className="flex justify-between items-center">
                <h2 className="font-normal mb-0">Total service fee</h2>
                <strong className="font-medium">${service?.price}</strong>
              </div>
              <div className="flex justify-between items-center">
                <h2 className="font-normal">Tax & Processing Fees</h2>
                <strong className="font-medium">
                  ${processingFees.toFixed(2)}
                </strong>
              </div>

              <Divider style={{ margin: 0 }} />
              <div className="flex justify-between items-center">
                <h2 className="text-base font-medium">Total amount</h2>
                <strong className="font-medium">${totalAmount}</strong>
              </div>
            </div>
            <div className="flex justify-between items-center mt-8">
              <Checkbox onChange={handleCheckboxChange} checked={isChecked}>
                I agree to the privacy policy and terms.
              </Checkbox>
              <SVButton
                disabled={
                  !isChecked || !selectedTimeSlots || !selectedMethod?.type
                }
                title="Continue to payment"
                style={{ background: '#4d3ca3', marginBottom: 0 }}
                onClick={next}
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
}
