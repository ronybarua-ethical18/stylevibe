'use client';

import dynamic from 'next/dynamic';

// Dynamic import for Ant Design Table
const Table = dynamic(
  () => import('antd').then((mod) => ({ default: mod.Table })),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 p-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    ),
  }
);

type UMTableProps = {
  loading?: boolean;
  columns: any;
  dataSource: any;
  pageSize?: number;
  totalPages?: number;
  showSizeChanger?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onTableChange?: (pagination: any, filter: any, sorter: any) => void;
  showPagination?: boolean;
};

const SVDataTable = ({
  loading = false,
  columns,
  dataSource,
  pageSize,
  totalPages,
  showSizeChanger = true,
  onPaginationChange,
  onTableChange,
  showPagination = true,
}: UMTableProps) => {
  const paginationConfig = showPagination
    ? {
        pageSize: pageSize,
        total: totalPages,
        pageSizeOptions: [5, 10, 20],
        showSizeChanger: showSizeChanger,
        onChange: onPaginationChange,
      }
    : false;

  // Check if dataSource is empty
  const isEmpty = !dataSource || dataSource.length === 0;

  return (
    <Table
      className={isEmpty ? 'empty-table' : ''}
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={paginationConfig}
      onChange={onTableChange}
      rowKey={(record: any) => record?._id || record?.id || Math.random()}
    />
  );
};

export default SVDataTable;
