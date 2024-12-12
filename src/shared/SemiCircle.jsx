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
      offsetY: -10,
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#e7e7e7",
          strokeWidth: "150%",
          margin: 1, // margin is in pixels
        },
        hollow: {
          margin: 1,
          size: "45%", // Increase size for a thicker look
        },
       
        dataLabels: {
          name: {
            show: true,
            offsetY: -92,
            color: "#000",
            fontSize: "14px",
            fontFamily: "DM Sans",
            fontWeight: 600,
          },
          value: {
            offsetY: -17,
            fontSize: "16px",
            fontFamily: "DM Sans",
            fontWeight: 600,
            color: "#2563EB",
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
