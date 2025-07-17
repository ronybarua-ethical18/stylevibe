// src/components/DashboardCard.tsx
import React from 'react'

interface DashboardCardProps {
  icon: React.ReactNode
  value: number | string
  title: string
}

const DashboardCard: React.FC<DashboardCardProps> = ({ icon, value, title }) => (
  <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col items-center justify-center min-h-[180px]">
    <div className="mb-2">
      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
        <span className="text-2xl text-blue-400">{icon}</span>
      </div>
    </div>
    <div className="font-bold text-xl mb-1">{value}</div>
    <div className="text-gray-500 text-sm">{title}</div>
  </div>
)

export default DashboardCard