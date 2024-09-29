// components/CapacityCard.tsx
import React from "react";

const CapacityCard = ({ title, description, usage }) => {
  return (
    <div className="card  rounded-lg p-3 w-full max-w-sm">
      <h3 className="text-lg title ">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <div className="flex justify-content-between mt-5">
        <span className="text-sm title">Used</span>
        <span className="text-sm title">{usage.toFixed(2)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1 overflow-hidden">
        <div
          className="h-full bg-blue-500 rounded-full"
          style={{ width: `${usage}%` }}
        >
          &nbsp;
        </div>{" "}
        {/* Adding non-breaking space */}
      </div>
    </div>
  );
};

export default CapacityCard;
