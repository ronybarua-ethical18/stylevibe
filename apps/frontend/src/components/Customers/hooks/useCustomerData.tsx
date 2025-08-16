import { useMemo } from 'react';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';

export const useCustomerData = ({ customers }: { customers: any }) => {
  const breadcrumbItems = useMemo(() => getBreadcrumbItems('customers'), []);
  const totalCustomers = useMemo(
    () => customers?.meta?.total || 0,
    [customers?.meta?.total]
  );

  return { breadcrumbItems, totalCustomers };
};
