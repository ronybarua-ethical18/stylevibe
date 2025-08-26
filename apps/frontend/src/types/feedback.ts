export interface IFeedback {
  _id: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
  };
  comment: string;
  rating: number;
  booking: {
    _id: string;
    bookingId: string;
    serviceDate: string;
    status?: string;
  };
  service: {
    _id: string;
    name: string;
    category: string;
    subCategory?: string;
    price?: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ICreateFeedbackPayload {
  comment: string;
  rating: number;
  booking: string;
  service: string;
}

export interface IFeedbacksResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    avgRating?: number;
    totalReviews?: number;
  };
  data: IFeedback[];
}

export interface IFeedbackResponse {
  success: boolean;
  message: string;
  data: IFeedback;
}
