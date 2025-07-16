import React from 'react'
import { Segmented } from 'antd'
import type { SegmentedValue } from 'antd/es/segmented'
import SVDataTableWithUtils from './SVDataTableWithUtils'
import SVFilledInput from './SVFilledInput'
import { BiSearch } from 'react-icons/bi'
import SVDateRangePicker from './SVDateRangePicker'
import SVTabChip from './SVTabChip'

interface TabItem {
  value: string
  label: string
  chipTitle: string
  chipValue: number
  activeColor?: string
}

interface SharedTabsProps {
  items: TabItem[]
  columns: any
  data: any[]
  isLoading: boolean
  totalPages: number
  activeTab: SegmentedValue
  onTabChange: (value: SegmentedValue) => void
  onSearch: (searchTerm: string) => void
  onDateRangeChange?: (dateRange: [Date, Date]) => void
}

const SharedTabs: React.FC<SharedTabsProps> = ({
  items,
  columns,
  data,
  isLoading,
  totalPages,
  activeTab,
  onTabChange,
  onSearch,
  onDateRangeChange
}) => {

  console.log("items from shared tabs",  items)
  const renderContent = () => {
    return (
      <SVDataTableWithUtils
        columns={columns}
        data={data}
        totalPages={totalPages}
        isLoading={isLoading}
      />
    )
  }

  return (
    <div>
      <div className="py-3 px-2 rounded-md bg-white flex justify-between">
        <Segmented
          options={items.map(item => ({
            value: item.value,
            label: (
              <div className="flex items-center">
                <SVTabChip title={item.chipTitle} value={item.chipValue} />
                <span
                  style={{
                    marginLeft: 8,
                    color: activeTab === item.value ? item.activeColor || 'inherit' : 'inherit',
                  }}
                >
                  {item.label}
                </span>
              </div>
            ),
          }))}
          value={activeTab}
          onChange={onTabChange}
        />
        <div className="w-[50%] flex">
          <SVFilledInput
            placeholder="Search"
            variant="filled"
            prefix={<BiSearch />}
            onChange={(e) => onSearch(e.target.value)}
          />
        
            <div className='h-full'>
              <SVDateRangePicker className="ml-5 w-full"  />
            </div>
      
        </div>
      </div>
      <div style={{ marginTop: 16 }}>{renderContent()}</div>
    </div>
  )
}

export default SharedTabs