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
          strokeWidth: "140%",
          margin: 8, // margin is in pixels
        },
        hollow: {
          margin: 5,
          size: "45%", // Increase size for a thicker look
        },
       
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            offsetY: -2,
            fontSize: "16px",
            fontFamily: "DM Sans",
            fontWeight: 600,
            color: "#000",
            formatter: function (val) {
              return `${val}%`;
            },
          },
        },
      },
    },
    stroke: {
      lineCap: "butt",
    },
    labels: [title],
  };

  const series = [percentage];

  return (
   
      <ReactApexChart
        options={options}
        series={series}
        type="radialBar"
        width={320}
      />

  );
}
