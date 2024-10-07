import React from "react";
import SemiCircleGauge from "../../shared/SemiCircle";


export default function ResourceUsage({data}) {
  return (
    <div className="  py-4 px-3  ">
      <div className="space-y-2">
        <div className="grid grid-col-2 justify-content-center gap-4 py-2">
          <span className="text-gray-400">{data.title}</span>
        </div>
        <div className="grid grid-col-2 justify-content-center gap-4">
          <SemiCircleGauge
            title={data.title}
            percentage={data.ratio}
            used={data.used}
            available={data.available}
          />
        </div>
        <div className="grid grid-col-2 justify-content-center gap-4 ">
          <div className="">
            <span className="text-black font-semibold">{data.used}{(data.title==='CPU')?'%':'GiB'}</span>
            <span className="text-gray-500"> used</span>
            <br />
            <span className="text-black font-semibold">{data.available}{(data.title==='CPU')?'Cores':'GiB'}</span>
            <span className="text-gray-500"> available</span>
          </div>
        </div>
      </div>
    </div>
  );
}
