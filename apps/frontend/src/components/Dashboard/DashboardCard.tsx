// src/components/DashboardCard.tsx
import React from 'react';

interface DashboardCardProps {
  icon: React.ReactNode;
  value: number | string;
  title: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  value,
  title,
}) => (
  <div className="bg-white rounded-xl px-4 py-3 flex items-center">
    <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-blue-50 mr-4">
      <span className="text-xl text-blue-400">{icon}</span>
    </div>
    <div className="flex flex-col justify-center">
      <div className="text-gray-500 text-sm mb-1">{title}</div>
      <div className="font-medium text-2xl">{value}</div>
    </div>
  </div>
);

export default DashboardCard;
