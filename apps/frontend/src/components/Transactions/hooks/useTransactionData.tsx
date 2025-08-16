import { useMemo } from 'react';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';

export const useTransactionData = ({
  transactions,
  selectedRecord,
}: {
  transactions: any;
  selectedRecord: any;
}) => {
  const breadcrumbItems = useMemo(() => getBreadcrumbItems('services'), []);
  const totalTransactions = useMemo(
    () => transactions?.meta?.total || 0,
    [transactions?.meta?.total]
  );
  const shouldShowModal = useMemo(
    () => selectedRecord !== null,
    [selectedRecord]
  );

  return { breadcrumbItems, totalTransactions, shouldShowModal };
};
