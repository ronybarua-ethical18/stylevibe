'use client'

import React from 'react'
import SVDataTable from './SVDataTable'

export default function SVDataTableWithUtils({
  columns,
  data,
  totalPages,
  isLoading,
}: any) {

  return (
    <SVDataTable
      loading={isLoading}
      columns={columns}
      dataSource={data}
      totalPages={totalPages}
      showSizeChanger={true}
      showPagination={false}
    />
  )
}
