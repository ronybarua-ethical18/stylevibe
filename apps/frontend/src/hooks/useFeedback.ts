import { useState } from 'react';
import { message } from 'antd';

import {
  useCreateFeedbackMutation,
  useGetFeedbacksByServiceQuery,
} from '@/redux/api/feedbacks';
import { ICreateFeedbackPayload } from '@/types/feedback';

export const useFeedback = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createFeedback] = useCreateFeedbackMutation();

  const submitFeedback = async (feedbackData: ICreateFeedbackPayload) => {
    setIsSubmitting(true);
    try {
      const result = await createFeedback(feedbackData).unwrap();
      message.success('Feedback submitted successfully!');
      return result;
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Failed to submit feedback';
      message.error(errorMessage);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitFeedback,
    isSubmitting,
  };
};

export const useServiceFeedbacks = (serviceId: string, params: any = {}) => {
  const {
    data: feedbacksData,
    isLoading,
    error,
    refetch,
  } = useGetFeedbacksByServiceQuery(
    { serviceId, ...params },
    { skip: !serviceId }
  );

  return {
    feedbacks: feedbacksData?.data || [],
    meta: feedbacksData?.meta,
    isLoading,
    error,
    refetch,
  };
};
