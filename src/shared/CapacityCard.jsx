// components/CapacityCard.tsx
import React from "react";

const CapacityCard = ({ title, description, usage }) => {
  const getProgressColor = (usage) => {
    if (usage >= 90) return 'linear-gradient(90deg, #EF4444 0%, #F87171 100%)';
    if (usage >= 75) return 'linear-gradient(90deg, #F59E0B 0%, #FBBF24 100%)';
    return 'linear-gradient(90deg, #3B82F6 0%, #60A5FA 100%)';
  };

  return (
    <div className="card rounded-lg p-3 w-full max-w-sm">
      <h3 className="text-lg title">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
      <div className="flex justify-content-between mt-5">
        <span className="text-sm title">Used</span>
        <span className="text-sm title">{usage}%</span>
      </div>
      <div className="w-full bg-gray-200/60 rounded-full h-0.5 overflow-hidden backdrop-blur-sm">
        <div
          className="h-full rounded-full transition-all duration-700 ease-in-out transform hover:scale-y-150"
          style={{ 
            width: `${usage}%`,
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
            background: getProgressColor(usage),
            transition: 'all 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          &nbsp;
        </div>
      </div>
    </div>
  );
};

export default CapacityCard;
