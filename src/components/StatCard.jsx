// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export function StatCard({
  title,
  value,
  change,
  changeType,
  icon: Icon
}) {
  const getChangeColor = () => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600';
      case 'decrease':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };
  const getChangeIcon = () => {
    switch (changeType) {
      case 'increase':
        return <TrendingUp size={16} />;
      case 'decrease':
        return <TrendingDown size={16} />;
      default:
        return <Minus size={16} />;
    }
  };
  return <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && <div className={`flex items-center gap-1 mt-2 ${getChangeColor()}`}>
              {getChangeIcon()}
              <span className="text-sm font-medium">{change}</span>
            </div>}
        </div>
        {Icon && <div className="p-3 bg-blue-50 rounded-lg">
            <Icon size={24} className="text-blue-600" />
          </div>}
      </div>
    </div>;
}