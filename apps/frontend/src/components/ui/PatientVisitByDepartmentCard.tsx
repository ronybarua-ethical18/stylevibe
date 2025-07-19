import React from "react";
import Chart from "react-apexcharts";

const data = [
  { label: "Psychiatrist", value: 45, color: "#5B6CFF" },
  { label: "Cardiologist", value: 25, color: "#FFB547" },
  { label: "Dermatologist", value: 30, color: "#A685FF" },
];

const chartOptions = {
  chart: {
    type: "donut",
    toolbar: { show: false },
  },
  labels: data.map((d) => d.label),
  colors: data.map((d) => d.color),
  legend: { show: false },
  dataLabels: { enabled: false },
  plotOptions: {
    pie: {
      donut: {
        size: "70%",
      },
    },
  },
};

const chartSeries = data.map((d) => d.value);

const PatientVisitByDepartmentCard = () => (
  <div className="bg-white rounded-2xl shadow-custom-shadow p-6 w-full max-w-sm">
    <div className="flex justify-between items-center">
      <div>
        <div className="font-semibold text-lg">Patient Visit by Department</div>
      </div>
      <button
        className="bg-gray-100 rounded-md px-4 py-1 text-sm font-medium text-gray-700 focus:outline-none"
      >
        Weekly <span className="ml-1">▼</span>
      </button>
    </div>
    <div className="flex items-center mt-6">
      <div className="flex flex-col gap-6 flex-1">
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
      <div className="w-52 ml-2"> {/* Increased width from w-36 to w-52 */}
        <Chart options={{
          ...chartOptions,
          chart: {
            ...chartOptions.chart,
            type: "donut" as const,
          },
          plotOptions: {
            ...chartOptions.plotOptions,
            pie: {
              ...chartOptions.plotOptions.pie,
              donut: {
                ...chartOptions.plotOptions.pie.donut,
                size: "85%", // Increased donut size
              },
            },
          },
        }} series={chartSeries} type="donut" width={200} />
      </div>
    </div>
  </div>
);

export default PatientVisitByDepartmentCard; 