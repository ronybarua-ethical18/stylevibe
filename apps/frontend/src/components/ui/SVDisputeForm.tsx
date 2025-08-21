'use client';

import { Button, Form, Input, Radio, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { FaMoneyBillWave, FaRedo } from 'react-icons/fa';
import styled from 'styled-components';
import type { UploadFile } from 'antd/es/upload/interface';

const { TextArea } = Input;

// Styled components
const DisputeTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0px;
  text-align: left;
`;

const DisputeSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
  text-align: left;
`;

const FormSection = styled.div`
  margin-bottom: 20px;
`;

const InputStyled = styled(Input)`
  border-radius: 12px;
  border: 1px solid #e1e5e9;
  padding: 12px 16px;
  font-size: 14px;
  height: 48px;

  &:focus,
  &:hover {
    border-color: #4d3ca3;
    box-shadow: 0 0 0 2px rgba(77, 60, 163, 0.1);
  }
`;

const TextAreaStyled = styled(TextArea)`
  .ant-input {
    border-radius: 12px;
    border: 1px solid #e1e5e9;
    padding: 16px;
    font-size: 14px;
    line-height: 1.5;

    &:focus,
    &:hover {
      border-color: #4d3ca3;
      box-shadow: 0 0 0 2px rgba(77, 60, 163, 0.1);
    }
  }
`;

const RadioGroupStyled = styled(Radio.Group)`
  width: 100%;
  display: flex;
  gap: 16px;

  .ant-radio-wrapper {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 2px solid #f0f0f0;
    border-radius: 12px;
    transition: all 0.3s ease;
    flex: 1;

    &:hover {
      border-color: #4d3ca3;
      background-color: #f8f9ff;
    }

    .ant-radio {
      margin-right: 12px;
    }

    .ant-radio-checked .ant-radio-inner {
      border-color: #4d3ca3;
      background-color: #4d3ca3;
    }

    .option-content {
      display: flex;
      align-items: center;
      flex: 1;

      .option-icon {
        font-size: 20px;
        margin-right: 12px;
        color: #4d3ca3;
      }

      .option-text {
        flex: 1;

        .option-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 4px;
        }

        .option-description {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }

  .ant-radio-wrapper-checked {
    border-color: #4d3ca3;
    background-color: #f8f9ff;
  }
`;

const UploadStyled = styled(Upload)`
  .ant-upload {
    width: 100%;
  }

  .ant-upload-drag {
    border-radius: 12px;
    border: 2px dashed #e1e5e9;
    background: #fafafa;

    &:hover {
      border-color: #4d3ca3;
    }
  }

  .ant-upload-btn {
    padding: 24px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: flex-end;
  margin-top: 32px;
`;

const SubmitButton = styled(Button)`
  background: #4d3ca3;
  border: none;
  height: 36px;
  padding: 0 24px;
  font-weight: 600;
  font-size: 14px;

  &:hover,
  &:focus {
    background: #4d3ca3 !important;
  }
`;

const CancelButton = styled(Button)`
  border: none;
  background: transparent;
  color: #6c757d;
  height: 36px;
  padding: 0 24px;
  font-weight: 500;
  font-size: 14px;

  &:hover,
  &:focus {
    background: #f8f9fa !important;
    color: #495057 !important;
  }
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
`;

// Resolution options
const resolutionOptions = [
  {
    value: 'refund',
    title: 'Request Refund',
    description: 'Get your money back for this booking',
    icon: FaMoneyBillWave,
  },
  {
    value: 'retake',
    title: 'Retake Service',
    description: 'Schedule the service again at no extra cost',
    icon: FaRedo,
  },
];

interface SVDisputeFormProps {
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
  defaultBookingId?: string;
}

export default function SVDisputeForm({
  onSubmit,
  onCancel,
  title = 'File a Dispute',
  subtitle = 'Help us resolve your issue. Please provide details about your booking concern.',
  defaultBookingId = '',
}: SVDisputeFormProps) {
  const [bookingId, setBookingId] = useState<string>(defaultBookingId);
  const [resolution, setResolution] = useState<string>('');
  const [complaint, setComplaint] = useState<string>('');
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  const [form] = Form.useForm();

  const handleSubmit = () => {
    if (!bookingId || !resolution || !complaint) {
      return;
    }

    const values = {
      bookingId,
      resolution,
      complaint,
      documents: fileList,
    };

    console.log('Dispute submitted:', values);
    onSubmit?.(values);
  };

  const handleCancel = () => {
    form.resetFields();
    setBookingId(defaultBookingId);
    setResolution('');
    setComplaint('');
    setFileList([]);
    onCancel?.();
  };

  const handleFileChange = ({
    fileList: newFileList,
  }: {
    fileList: UploadFile[];
  }) => {
    setFileList(newFileList);
  };

  const isFormValid = bookingId && resolution && complaint;

  return (
    <>
      <DisputeTitle>{title}</DisputeTitle>
      <DisputeSubtitle>{subtitle}</DisputeSubtitle>

      <Form form={form} layout="vertical">
        {/* Booking ID */}
        <FormSection>
          <FormLabel>Booking ID *</FormLabel>
          <InputStyled
            placeholder="Enter your booking ID (e.g., BK123456)"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
          />
        </FormSection>

        {/* Resolution Type */}
        <FormSection>
          <FormLabel>What would you like us to do? *</FormLabel>
          <RadioGroupStyled
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
          >
            {resolutionOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <Radio key={option.value} value={option.value}>
                  <div className="option-content">
                    <IconComponent className="option-icon" />
                    <div className="option-text">
                      <div className="option-title">{option.title}</div>
                      <div className="option-description">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </Radio>
              );
            })}
          </RadioGroupStyled>
        </FormSection>

        {/* Complaint Details */}
        <FormSection>
          <FormLabel>Describe your issue *</FormLabel>
          <TextAreaStyled
            placeholder="Please provide detailed information about what went wrong with your service..."
            rows={5}
            value={complaint}
            onChange={(e) => setComplaint(e.target.value)}
          />
        </FormSection>

        {/* File Upload */}
        <FormSection>
          <FormLabel>Supporting Documents (Optional)</FormLabel>
          <UploadStyled
            multiple
            fileList={fileList}
            onChange={handleFileChange}
            beforeUpload={() => false} // Prevent auto upload
            accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
          >
            <div style={{ textAlign: 'center' }}>
              <UploadOutlined
                style={{
                  fontSize: '24px',
                  color: '#4d3ca3',
                  marginBottom: '8px',
                }}
              />
              <div style={{ color: '#666', fontSize: '14px' }}>
                Click or drag files to upload
              </div>
              <div
                style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}
              >
                Supports: JPG, PNG, PDF, DOC (Max 5MB each)
              </div>
            </div>
          </UploadStyled>
        </FormSection>

        {/* Action Buttons */}
        <ButtonContainer>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <SubmitButton
            type="primary"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            Submit Dispute
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </>
  );
}
