import React from 'react';
import PieChart from "../../../shared/PieChart";
const InfoCircle = ({ percentage, label, color }) => {
  return (
    <div className="flex align-items-center">
     
        
         <PieChart
                labels={["Total","Used"]}
                series={[100,50]}
              />
       
        <div>
        <span className="text-2xl font-bold">{percentage}</span>
        <span className="text-sm">{label}</span>
        </div>
     
    </div>
  );
};
export default InfoCircle;