import React from "react";
import ReactApexChart from "react-apexcharts";

export default function PieChart({ labels, series }) {
  const total = series.reduce((sum, value) => sum + value, 0);
  
  const options = {
    chart: {
      width: 420,
      height: 420,
      type: "donut",
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 150
        },
        dynamicAnimation: {
          enabled: true,
          speed: 450,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        }
      }
    },
    colors: ['#0EA5E9', '#6366F1', '#8B5CF6', '#EC4899', '#F43F5E'],
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 400,
              color: '#64748B',
              offsetY: 18,
            },
            value: {
              show: true,
              fontSize: '36px',
              fontFamily: 'DM Sans, sans-serif',
              fontWeight: 600,
              color: '#1E293B',
              offsetY: -15,
            },
            total: {
              show: true,
              showAlways: true,
              label: "Total VMs",
              fontSize: "14px",
              fontFamily: "DM Sans, sans-serif",
              fontWeight: 400,
              color: "#64748B",
              formatter: () => `${total}`
            }
          }
        },
        startAngle: 0,
        endAngle: 360,
        expandOnClick: false,
        dataLabels: {
          enabled: false,
          style: {
            fontSize: '0px'
          }
        }
      }
    },
    stroke: {
      show: false
    },
    dataLabels: {
      enabled: false,
      formatter: function () {
        return ''
      }
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: (val) => `${val} VMs`
      }
    },
    states: {
      hover: {
        filter: {
          type: 'darken',
          value: 0.15
        }
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: 'darken',
          value: 0.35
        }
      }
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
            width: 280,
            height: 280,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <ReactApexChart options={options} series={series} type="donut" />
    </div>
  );
}
