import { Model, Document } from 'mongoose';

interface StatusCount {
  _id: string;
  count: number;
}

interface TotalsResult {
  total: number;
  [status: string]: number; // Dynamic keys for each status
}

export const getTotals = async (
  model: Model<Document>,
  queryPayload: any,
  statusList: string[]
): Promise<TotalsResult> => {
  const stats: StatusCount[] = await model.aggregate([
    { $match: queryPayload },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  // Initialize result object with all statuses set to 0
  const result: TotalsResult = {
    total: 0,
    ...statusList.reduce((acc, status) => ({ ...acc, [status]: 0 }), {}),
  };

  // Map stats to the result object
  stats.forEach(({ _id, count }) => {
    // Use Object.prototype.hasOwnProperty.call to avoid linting issues
    if (Object.prototype.hasOwnProperty.call(result, _id)) {
      result[_id] = count;
      result.total += count;
    }
  });

  return result;
};
