import { Button } from "antd";
import React from "react";
import Chart from "react-apexcharts";

const data = [
  { label: "Beard and Hair Services", value: 45, color: "#5B6CFF" },
  { label: "Makeup Services", value: 25, color: "#FFB547" },
  { label: "Skincare Services", value: 30, color: "#A685FF" },
  { label: "Special Occasion Services", value: 20, color: "#34C759" },
];

const chartOptions = {
  chart: {
    type: "donut" as const,
    toolbar: { show: false },
  },
  labels: data.map((d) => d.label),
  colors: data.map((d) => d.color),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "50%",
      },
    },
  },
};

const chartSeries = data.map((d) => d.value);

const PatientVisitByDepartmentCard = () => (
  <div className="bg-white rounded-2xl p-6 w-full h-full">
    <div className="flex justify-between items-center">
      <div>
        <div className="font-semibold text-lg">Top Bookings by Service</div>
      </div>
      <Button
        className="bg-gray-100 rounded-md px-4 py-1 text-sm font-medium text-gray-700 focus:outline-none"
      >
        Weekly <span className="ml-1">▼</span>
      </Button>
    </div>
    <div className="flex items-center justify-between h-full">
      <div className="flex flex-col gap-6">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-3">
            <span
              className="inline-block w-3 h-3 rounded-full"
              style={{ background: d.color }}
            />
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 text-base">{d.label}</span>
              <span className="font-bold text-lg text-gray-900 mt-1">{d.value} %</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-shrink-0 flex items-center justify-center">
        <Chart options={chartOptions} series={chartSeries} type="donut" width={250} height={250} />
      </div>
    </div>
  </div>
);

export default PatientVisitByDepartmentCard;