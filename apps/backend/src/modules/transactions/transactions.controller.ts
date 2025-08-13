import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { paginationFields } from '../../constants/pagination';
import pick from '../../shared/pick';
import sendResponse from '../../shared/sendResponse';
import tryCatchAsync from '../../shared/tryCatchAsync';

import { filterableFields } from './transaction.constants';
import { ITransactions } from './transactions.interface';
import { TransactionService } from './transactions.service';

const createTransaction = tryCatchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.createTransaction(req.body);

  sendResponse<ITransactions>(res, {
    statusCode: 200,
    success: true,
    message: 'New transaction created successfully',
    data: result,
  });
});

const getAllTransactions = tryCatchAsync(
  async (req: Request, res: Response) => {
    const loggedUser = req.user as {
      userId: mongoose.Types.ObjectId;
      role: string;
    };
    const filterOptions = pick(req.query, filterableFields);
    const queryOptions = pick(req.query, paginationFields);

    const result = await TransactionService.getAllTransactions(
      loggedUser,
      queryOptions,
      filterOptions
    );

    sendResponse<ITransactions[]>(res, {
      statusCode: 200,
      success: true,
      message: 'All transactions fetched successfully',
      meta: result.meta,
      data: result.data,
    });
  }
);

const updateTransaction = tryCatchAsync(async (req: Request, res: Response) => {
  const paymentIntentId = 'sfjkshkfsdf';
  const result = await TransactionService.updateTransaction(
    paymentIntentId,
    req.body
  );
  sendResponse<ITransactions>(res, {
    statusCode: 200,
    success: true,
    message: 'Transaction updated successfully',
    data: result,
  });
});

const deleteTransaction = tryCatchAsync(async (req: Request, res: Response) => {
  if (typeof req.params.serviceId === 'string') {
    await TransactionService.deleteTransaction(
      new mongoose.Types.ObjectId(req.params['serviceId'])
    );

    sendResponse<ITransactions>(res, {
      statusCode: 200,
      success: true,
      message: 'Transaction deleted successfully',
    });
  }
});

export const TransactionServiceController = {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
};
