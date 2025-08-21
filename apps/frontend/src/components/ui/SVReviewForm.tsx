'use client';

import { Button, Form, Input } from 'antd';
import React, { useState } from 'react';
import {
  BsEmojiAngry,
  BsEmojiFrown,
  BsEmojiNeutral,
  BsEmojiSmile,
  BsEmojiLaughing,
} from 'react-icons/bs';
import styled from 'styled-components';

const { TextArea } = Input;

const ReviewTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #333;
  margin-bottom: 0px;
  text-align: left;
`;

const ReviewSubtitle = styled.p`
  font-size: 16px;
  color: #666;
  margin-bottom: 32px;
  line-height: 1.5;
  text-align: left;
`;

const RatingContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 32px;
  justify-content: space-between;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const RatingOption = styled.div<{ selected: boolean; ratingType: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  background: ${(props) => (props.selected ? '#4d3ca3' : '#f8f9fa')};
  color: ${(props) => (props.selected ? 'white' : '#666')};
  min-width: 80px;
  flex: 1;

  &:hover {
    background: ${(props) => (props.selected ? '#4d3ca3' : '#e9ecef')};
    transform: translateY(-2px);
  }

  .rating-icon {
    font-size: 28px;
    margin-bottom: 8px;
    color: ${(props) => {
      if (props.selected) return 'white';
      switch (props.ratingType) {
        case 'terrible':
          return '#dc3545';
        case 'bad':
          return '#fd7e14';
        case 'okay':
          return '#ffc107';
        case 'good':
          return '#28a745';
        case 'amazing':
          return '#20c997';
        default:
          return '#666';
      }
    }};
  }

  .rating-label {
    font-size: 14px;
    font-weight: 500;
    text-transform: capitalize;
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

// Rating options
const ratingOptions = [
  { key: 'terrible', label: 'Terrible', icon: BsEmojiAngry },
  { key: 'bad', label: 'Bad', icon: BsEmojiFrown },
  { key: 'okay', label: 'Okay', icon: BsEmojiNeutral },
  { key: 'good', label: 'Good', icon: BsEmojiSmile },
  { key: 'amazing', label: 'Amazing', icon: BsEmojiLaughing },
];

interface SVReviewFormProps {
  onSubmit?: (values: any) => void;
  onCancel?: () => void;
  title?: string;
  subtitle?: string;
}

export default function SVReviewForm({
  onSubmit,
  onCancel,
  title = 'Rate Your Experience',
  subtitle = 'How was your beauty service experience? Your feedback helps us improve our services.',
}: SVReviewFormProps) {
  const [selectedRating, setSelectedRating] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [contactConsent, setContactConsent] = useState<boolean>(true);
  const [researchConsent, setResearchConsent] = useState<boolean>(false);

  const [form] = Form.useForm();

  const handleSubmit = () => {
    const values = {
      rating: selectedRating,
      feedback,
      contactConsent,
      researchConsent,
    };

    console.log('Review submitted:', values);
    onSubmit?.(values);
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedRating('');
    setFeedback('');
    setContactConsent(true);
    setResearchConsent(false);
    onCancel?.();
  };

  return (
    <>
      <ReviewTitle>{title}</ReviewTitle>
      <ReviewSubtitle>{subtitle}</ReviewSubtitle>

      <Form form={form} layout="vertical">
        {/* Rating Section */}
        <RatingContainer>
          {ratingOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <RatingOption
                key={option.key}
                selected={selectedRating === option.key}
                ratingType={option.key}
                onClick={() => setSelectedRating(option.key)}
              >
                <IconComponent className="rating-icon" />
                <span className="rating-label">{option.label}</span>
              </RatingOption>
            );
          })}
        </RatingContainer>

        {/* Feedback Text Area */}
        <Form.Item label="Tell us about your service experience">
          <TextAreaStyled
            placeholder="Share details about the service quality, staff professionalism, ambiance, or any suggestions..."
            rows={4}
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </Form.Item>

        {/* Action Buttons */}
        <ButtonContainer>
          <CancelButton onClick={handleCancel}>Cancel</CancelButton>
          <SubmitButton
            type="primary"
            onClick={handleSubmit}
            disabled={!selectedRating}
          >
            Submit Review
          </SubmitButton>
        </ButtonContainer>
      </Form>
    </>
  );
}
