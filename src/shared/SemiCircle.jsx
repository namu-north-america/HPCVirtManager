import React from "react";
import ReactApexChart from "react-apexcharts";

export default function SemiCircleGauge({
  title,
  percentage,
  used,
  available,
}) {
  const options = {
    chart: {
      type: "radialBar",
      offsetY: -20,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "97%",
          margin: 5, // margin is in pixels
        },
       
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -10,
            fontSize: "22px",
            fontWeight: 600,
            color: "#000",
            formatter: function (val) {
              return `${percentage}%`;
            },
          },
        },
      },
    },
    stroke: {
      lineCap: "round",
    },
    labels: [title],
  };

  const series = [percentage];

  return (
   
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        width={250}
      />

  );
}
