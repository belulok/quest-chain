import React from 'react';

export interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  className?: string;
  color?: 'primary' | 'secondary' | 'accent' | 'error' | 'success';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showValue = false,
  className = '',
  color = 'primary',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const colorClasses = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    error: 'bg-red-500',
    success: 'bg-green-500',
  };
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="font-pixel text-sm text-gray-300">{label}</span>
          {showValue && (
            <span className="font-pixel text-sm text-gray-300">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
