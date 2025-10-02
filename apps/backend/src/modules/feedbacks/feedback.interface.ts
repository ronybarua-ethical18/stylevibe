import mongoose, { Document } from 'mongoose';

export interface IFeedback extends Document {
  user: mongoose.Types.ObjectId;
  comment: string;
  rating: number;
  booking: mongoose.Types.ObjectId;
  service: mongoose.Types.ObjectId;
}
