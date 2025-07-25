import { DownOutlined, ClockCircleOutlined } from '@ant-design/icons';
import React from 'react';

const appointments = [
  {
    name: 'Leeann Elisha',
    time: '12:00 pm',
    duration: '45 min',
    color: '#FF6B6B',
  },
  {
    name: 'Brittany Jones',
    time: '1:00 pm',
    duration: '25 min',
    color: '#4D8DFF',
  },
];

export default function CustomerSchedule() {
  return (
    <div className="bg-white rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <span className="font-semibold text-lg text-gray-800">
          Customer Schedule
        </span>
        <button className="flex items-center bg-[#f1f5ff] text-[#4d8dff] text-xs font-medium px-3 py-1 rounded-lg">
          Today <DownOutlined className="ml-1 text-xs" />
        </button>
      </div>
      {/* Appointments */}
      {appointments.map((a) => (
        <div key={a.name} className="mb-6 last:mb-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ background: a.color }}
              />
              <span className="font-semibold text-gray-800">{a.name}</span>
            </div>
            <span className="text-gray-400 text-sm">{a.duration}</span>
          </div>
          {/* Time with icon */}
          <div className="flex items-center gap-2 mt-1 text-gray-500 text-xs">
            <ClockCircleOutlined className="text-[#bdbdbd]" />
            <span>{a.time}</span>
          </div>
          {/* Links below time */}
          <div className="flex items-center gap-4 mt-1 text-xs">
            <span className="cursor-pointer text-[#4d8dff] hover:underline">
              Medical History
            </span>
            <span className="cursor-pointer text-[#4d8dff] hover:underline">
              Reports
            </span>
          </div>
          <div className="flex gap-2 mt-3">
            <button className="bg-[#e6f4ff] text-[#4d8dff] text-xs font-medium px-3 py-1 rounded-md">
              Message
            </button>
            <button className="bg-[#fff0f0] text-[#ff6b6b] text-xs font-medium px-3 py-1 rounded-md">
              Cancel
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
