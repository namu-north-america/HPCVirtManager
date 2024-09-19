import React from "react";
import ReactApexChart from "react-apexcharts";

export default function PieChart({ labels, series }) {
  const options = {
    chart: {
      width: 380,
      type: "donut",
    },
    legend: {
      show: false,
    },
    labels,
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return <ReactApexChart options={options} series={series} type="donut" />;
}
