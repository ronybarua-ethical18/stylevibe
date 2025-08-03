import { Request, Response } from 'express';
import sendResponse from '../../shared/sendResponse';
import tryCatchAsync from '../../shared/tryCatchAsync';
import { CustomerService } from './customer.service';
import pick from '../../shared/pick';
import { paginationFields } from '../../constants/pagination';
import { filterableFields } from '../../modules/services/service.constants';
import mongoose from 'mongoose';

const getAllCustomers = tryCatchAsync(async (req: Request, res: Response) => {
  const loggedUser = req.user as {
    userId: mongoose.Types.ObjectId;
    role: string;
  };
  const filterOptions = pick(req.query, filterableFields);
  const queryOptions = pick(req.query, paginationFields);

  const result = await CustomerService.getAllCustomers(
    loggedUser,
    queryOptions,
    filterOptions
  );

  console.log('result', result);
  sendResponse<any[]>(res, {
    statusCode: 200,
    success: true,
    message: 'All customers fetched successfully',
    meta: result.meta,
    data: result.data,
    loggedUserId: result.loggedUserId,
  });
});

export const CustomerController = {
  getAllCustomers,
};
