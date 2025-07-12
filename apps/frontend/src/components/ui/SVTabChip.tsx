import React from 'react'

interface IChipValue {
  value: number
  title: string
}

export default function SVTabChip({ value, title }: IChipValue) {
  const getStyles = () => {
    switch (title.toLowerCase()) {
      case 'active':
      case 'completed':
        return 'bg-[#e9f1ff] text-[#0661ff]'
      case 'pending':
        return 'bg-[#fff7cf] text-[#eda006]'
      case 'rejected':
      case 'refunded':
        return 'bg-[#ffebe6] text-[#ff5c33]'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={`px-2 rounded-md font-medium my-1 ${getStyles()}`}>
      <h5 className="m-0 text-2xs">{value}</h5>
    </div>
  )
}
