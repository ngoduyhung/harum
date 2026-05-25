
import React from 'react';
import { Loader2 } from 'lucide-react';

const StatCard = ({ icon, title, value, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-3xl font-bold text-gray-800">
            {value?.toLocaleString() ?? 0}
          </p>
        </div>
        <div className="bg-pblue/10 text-pblue p-2 rounded-lg">
          {React.cloneElement(icon, { size: 24 })}
        </div>
      </div>
    </div>
  );
};

export default StatCard;