import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import React from 'react';

interface SVPaginationProps extends PaginationProps {
  onPageChange: PaginationProps['onChange'];
}

const SVPagination: React.FC<SVPaginationProps> = ({
  onPageChange,
  ...paginationProps
}) => (
  <div className="fixed bottom-[0px] left-[280px] right-[30px] p-5 rounded-md bg-white flex justify-center shadow-[box-shadow: rgba(0, 0, 0, 0.1) -4px 9px 25px -6px;]">
    <Pagination showSizeChanger onChange={onPageChange} {...paginationProps} />
  </div>
);

export default SVPagination;
