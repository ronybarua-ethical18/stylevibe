import { Request, Response } from 'express';
import mongoose from 'mongoose';

import sendResponse from '../../shared/sendResponse';
import tryCatchAsync from '../../shared/tryCatchAsync';

import { IBlog } from './blog.interface';
import { BlogService } from './blog.service';

const createBlog = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId;
    role: string;
  };
  const result = await BlogService.createBlog(loggedUser, req.body);

  sendResponse<IBlog>(res, {
    statusCode: 200,
    success: true,
    message: 'Blog is created successfully',
    data: result,
  });
});

const getAllBlogs = tryCatchAsync(async (_req: Request, res: Response) => {
  const result = await BlogService.getAllBlogs();

  sendResponse<IBlog[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All blogs fetched successfully',
    data: result,
  });
});

export const BlogController = {
  createBlog,
  getAllBlogs,
};
