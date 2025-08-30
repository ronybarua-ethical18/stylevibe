import { paginationHelpers } from '../../helpers/pagination';
import { queryFieldsManipulation } from '../../helpers/queryFieldsManipulation';
import BookingModel from '../../modules/bookings/booking.model';
import {
  IFilterOptions,
  IGenericResponse,
  IPaginationOptions,
} from '../../shared/interfaces/common.interface';
import { JwtPayload } from 'jsonwebtoken';
import { SortOrder } from 'mongoose';
import { getTotals } from '../services/service.utils';
import { isAdmin } from '../../utils/isAdmin';

const getAllCustomers = async (
  loggedUser: JwtPayload,
  queryOptions: IPaginationOptions,
  filterOptions: IFilterOptions
): Promise<IGenericResponse<any[]>> => {
  let queryPayload = { seller: loggedUser.userId } as any;
  if (isAdmin(loggedUser.role)) {
    queryPayload = {};
  }
  const { searchTerm, ...filterableFields } = filterOptions;
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelpers.calculatePagination(queryOptions);

  const sortCondition: { [key: string]: SortOrder } = {};

  if (sortBy && sortOrder) {
    sortCondition[sortBy] = sortOrder;
  }

  const queriesWithFilterableFields = queryFieldsManipulation(
    searchTerm,
    ['name', 'category', 'subCategory', 'status'],
    filterableFields
  );

  if (queriesWithFilterableFields.length > 0) {
    queryPayload.$and = queriesWithFilterableFields;
  }

  const customers = await BookingModel.find(queryPayload)
    .populate('customer', 'firstName lastName email')
    .populate('serviceId', 'name category subCategory price')
    .sort(sortCondition)
    .select('customer serviceId totalAmount bookingId status seller')
    .skip(skip)
    .limit(limit);

  const totals = await getTotals(
    BookingModel as any,
    isAdmin(loggedUser.role) ? {} : queryPayload,
    ['BOOKED', 'CANCELLED', 'COMPLETED']
  );

  return {
    meta: {
      page,
      limit,
      total: totals?.total,
      totalBooked: totals['BOOKED'],
      totalCompleted: totals['COMPLETED'],
      totalCancelled: totals['CANCELLED'],
    },
    data: customers,
    loggedUserId: loggedUser.userId,
  };
};

export const CustomerService = {
  getAllCustomers,
};
