import { Button } from 'antd';
import React from 'react';
import Chart from 'react-apexcharts';

import { topServices } from '@/utils/dummyServices';

const chartOptions = {
  chart: {
    type: 'donut' as const,
    toolbar: { show: false },
  },
  labels: topServices.map((d) => d.label),
  colors: topServices.map((d) => d.color),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: '50%',
      },
    },
  },
};

const chartSeries = topServices.map((d) => d.value);

const TopBookingsByServiceCategory = () => (
  <div className="bg-white rounded-2xl p-6 w-full h-full">
    <div className="flex justify-between items-center">
      <div>
        <div className="font-semibold text-lg">Top Bookings by Service</div>
      </div>
      <Button className="bg-gray-100 rounded-md px-4 py-1 text-sm font-medium text-gray-700 focus:outline-none">
        Weekly <span className="ml-1">▼</span>
      </Button>
    </div>
    <div className="flex items-center justify-between h-full">
      <div className="flex flex-col gap-6">
        {topServices.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: d.color }}
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 text-base">
                {d.label}
              </span>
              <span className="font-bold text-lg text-gray-900 mt-1">
                {d.value} %
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 flex items-center justify-center">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="donut"
          width={250}
          height={250}
        />
      </div>
    </div>
  </div>
);

export default TopBookingsByServiceCategory;
