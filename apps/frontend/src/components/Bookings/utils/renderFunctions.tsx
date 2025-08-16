import moment from 'moment';
import SVStatusChip from '@/components/SVStatusChip';
import { transformingText } from '@/utils/transformingText';

export const renderBookingId = (data: any) => <>{data?.bookingId}</>;

export const renderServiceName = (data: any) => <>{data?.serviceId?.name}</>;

export const renderPrice = (data: any) => <>{`$${data?.serviceId?.price}`}</>;

export const renderServiceDate = (data: any) => (
  <>{`${moment(data?.shopTimeSlot?.slotFor).format('MMMM Do YYYY')}`}</>
);

export const renderCustomerName = (data: any) => (
  <div>{data?.customer?.firstName + ' ' + data?.customer?.lastName}</div>
);

export const renderCustomerPhone = (data: any) => (
  <>{data?.customer?.phone || 'N/A'}</>
);

export const renderStatus = (data: any) => {
  const status = transformingText(data);
  return <SVStatusChip status={status} />;
};
