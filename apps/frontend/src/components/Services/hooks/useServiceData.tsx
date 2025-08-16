import { useMemo } from 'react';
import { getBreadcrumbItems } from '@/utils/getBreadcumItems';

export const useServiceData = ({
  services,
  selectedRecord,
}: {
  services: any;
  selectedRecord: any;
}) => {
  const breadcrumbItems = useMemo(() => getBreadcrumbItems('services'), []);
  const totalServices = useMemo(
    () => services?.meta?.total || 0,
    [services?.meta?.total]
  );
  const shouldShowModal = useMemo(
    () => selectedRecord !== null,
    [selectedRecord]
  );

  return { breadcrumbItems, totalServices, shouldShowModal };
};
