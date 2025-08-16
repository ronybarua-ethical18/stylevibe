import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { IoEyeOutline } from 'react-icons/io5';
import { LiaEdit } from 'react-icons/lia';
import SVStatusChip from '../../SVStatusChip';
import SVConfirmationModal from '../../ui/SVConfirmationModal';
import { transformingText } from '@/utils/transformingText';

export const useServiceColumns = ({
  userInfo,
  handleEditClick,
  handleDelete,
  isDeleting,
}: {
  userInfo: any;
  handleEditClick: (record: any) => void;
  handleDelete: (serviceId: any) => void;
  isDeleting: boolean;
}) => {
  const router = useRouter();

  return useMemo(
    () => [
      {
        title: 'Service name',
        dataIndex: 'name',
        render: (name: string, record: any) => (
          <span
            className="cursor-pointer"
            onClick={() =>
              router.push(`/${userInfo?.role}/services/${record?._id}`)
            }
          >
            {name}
          </span>
        ),
      },
      {
        title: 'Category',
        dataIndex: 'category',
      },
      {
        title: 'Subcategory',
        dataIndex: 'subCategory',
      },
      {
        title: 'Price',
        dataIndex: 'price',
        render: (price: number) => `$${price?.toFixed(2)}`,
      },
      {
        title: 'Shop name',
        render: (record: any) => record?.shop?.shopName,
      },
      {
        title: 'Availability',
        dataIndex: 'availability',
        render: (availability: boolean) => (availability ? 'Available' : 'N/A'),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        render: (status: string) => (
          <SVStatusChip status={transformingText(status)} />
        ),
      },
      {
        title: 'Action',
        align: 'right',
        render: (record: any) => (
          <div className="flex justify-end">
            <div className="flex align-baseline">
              <IoEyeOutline
                className="mr-2 text-xl cursor-pointer"
                onClick={() =>
                  router.push(`/${userInfo?.role}/services/${record?._id}`)
                }
              />
              <LiaEdit
                className="mr-2 text-xl cursor-pointer"
                onClick={() => handleEditClick(record)}
              />
              <SVConfirmationModal
                buttonTitle={isDeleting ? 'Processing...' : 'Confirm'}
                item={record}
                func={async () => await handleDelete(record._id)}
                isLoading={isDeleting}
              />
            </div>
          </div>
        ),
      },
    ],
    [userInfo?.role, handleEditClick, handleDelete, isDeleting, router]
  );
};
