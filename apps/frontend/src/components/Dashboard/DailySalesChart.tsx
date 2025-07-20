import React from "react";
import Chart from "react-apexcharts";

const data = [200, 800, 600, 1200, 1000, 1700, 1200];
const categories = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const maxValue = Math.max(...data);
const maxIndex = data.indexOf(maxValue);

const options = {
  chart: {
    type: "line",
    toolbar: { show: false },
    zoom: { enabled: false },
    background: "transparent",
  },
  grid: {
    show: true,
    borderColor: "#e5eaf2",
    strokeDashArray: 4,
  },
  dataLabels: {
    enabled: true,
    enabledOnSeries: [0],
    formatter: (val: number, opts: any) =>
      opts.dataPointIndex === maxIndex ? `$${val}` : "",
    offsetY: -10,
    style: {
      fontSize: "14px",
      fontWeight: "bold",
      colors: ["#333"],
    },
    background: {
      enabled: true,
      foreColor: "#fff",
      borderRadius: 4,
      padding: 4,
      opacity: 0.9,
      dropShadow: { enabled: false },
    },
  },
  stroke: {
    curve: "smooth",
    width: 3,
    colors: ["#4f8cff"],
  },
  markers: {
    size: [0, 0, 0, 0, 0, 6, 0], // Only show marker on max value (Thu)
    colors: ["#fff"],
    strokeColors: "#4f8cff",
    strokeWidth: 3,
    hover: { size: 8 },
    discrete: [
      {
        seriesIndex: 0,
        dataPointIndex: maxIndex,
        fillColor: "#fff",
        strokeColor: "#4f8cff",
        size: 8,
      },
    ],
  },
  xaxis: {
    categories,
    labels: { style: { colors: "#7b8a9c", fontWeight: 500 } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    min: 0,
    max: 2000,
    tickAmount: 4,
    labels: {
      formatter: (val: number) => `$${val}`,
      style: { colors: "#7b8a9c", fontWeight: 500 },
    },
  },
  tooltip: {
    enabled: true,
    custom: function({ series, seriesIndex, dataPointIndex, w }) {
      // Example: Replace with your real date logic if you have dates
      // For demo, we'll just use a static date string
      // You can map categories to dates if needed
      const date = "July, 29th 2021"; // Replace with your dynamic date if available
      const value = series[seriesIndex][dataPointIndex]
        .toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        .replace('.', ','); // For $119,87 style
      return `
        <div style="
          background: #2d2357;
          color: #fff;
          padding: 12px 18px;
          border-radius: 12px;
          font-size: 15px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          min-width: 120px;
          text-align: left;
        ">
          <div style="font-size: 14px; opacity: 0.8; margin-bottom: 4px;">
            ${date}
          </div>
          <div style="font-size: 22px; font-weight: bold; letter-spacing: 1px;">
            $${value}
          </div>
        </div>
      `;
    },
  },
};

const series = [
  {
    name: "Income",
    data,
  },
];

export default function DailySalesChart() {
  return (
    <div
      style={{
        background: "#ffff",
        borderRadius: 16,
        padding: 24,
        height: "100%", // Make this container take 100% height of its parent
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ fontWeight: 600, fontSize: 20 }}>Income</div>
        <button
          style={{
            background: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "6px 16px",
            fontWeight: 500,
            color: "#4f8cff",
            cursor: "pointer",
          }}
        >
          Weekly ▼
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Chart options={options} series={series} type="line" height="100%" />
      </div>
    </div>
  );
}