import React from 'react';

export interface ProgressProps {
  value?: number;
  max?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

export function Progress({
  value,
  max = 100,
  variant = 'determinate',
  color = 'primary',
  size = 'md',
  showLabel = false,
  label,
  className = ''
}: ProgressProps) {
  const percentage = variant === 'determinate' && value !== undefined ? Math.min(Math.max((value / max) * 100, 0), 100) : 0;
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const colorClasses = {
    primary: 'bg-blue-600 dark:bg-blue-500',
    secondary: 'bg-gray-600 dark:bg-gray-500',
    success: 'bg-green-600 dark:bg-green-500',
    warning: 'bg-yellow-500 dark:bg-yellow-600',
    error: 'bg-red-600 dark:bg-red-500',
    info: 'bg-cyan-600 dark:bg-cyan-500'
  };
  
  const baseClasses = `
    w-full rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden
    ${sizeClasses[size]}
  `;
  
  const barClasses = `
    h-full rounded-full transition-all duration-300 ease-out
    ${colorClasses[color]}
    ${variant === 'indeterminate' ? 'animate-pulse' : ''}
  `;
  
  const indeterminateBarClasses = `
    h-full rounded-full animate-pulse
    ${colorClasses[color]}
    w-1/3 animate-[progress-indeterminate_1.5s_ease-in-out_infinite]
  `;
  
  return (
    <div className={`space-y-1 ${className}`}>
      {(showLabel || label) && (
        <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-300">
          <span>{label || 'Progress'}</span>
          {variant === 'determinate' && showLabel && (
            <span>{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      
      <div className={baseClasses}>
        {variant === 'determinate' ? (
          <div 
            className={barClasses}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        ) : (
          <div className="relative overflow-hidden h-full">
            <div 
              className={indeterminateBarClasses}
              role="progressbar"
              aria-valuenow={undefined}
              aria-valuemin={0}
              aria-valuemax={max}
            />
          </div>
        )}
      </div>
    </div>
  );
}

// Circular Progress Component
export interface CircularProgressProps {
  value?: number;
  max?: number;
  variant?: 'determinate' | 'indeterminate';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: number;
  thickness?: number;
  showLabel?: boolean;
  className?: string;
}

export function CircularProgress({
  value = 0,
  max = 100,
  variant = 'determinate',
  color = 'primary',
  size = 40,
  thickness = 4,
  showLabel = false,
  className = ''
}: CircularProgressProps) {
  const percentage = variant === 'determinate' ? Math.min(Math.max((value / max) * 100, 0), 100) : 25;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = variant === 'determinate' 
    ? circumference - (percentage / 100) * circumference 
    : circumference * 0.75;
  
  const colorClasses = {
    primary: 'stroke-blue-600 dark:stroke-blue-500',
    secondary: 'stroke-gray-600 dark:stroke-gray-500',
    success: 'stroke-green-600 dark:stroke-green-500',
    warning: 'stroke-yellow-500 dark:stroke-yellow-600',
    error: 'stroke-red-600 dark:stroke-red-500',
    info: 'stroke-cyan-600 dark:stroke-cyan-500'
  };
  
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
          className="text-gray-200 dark:text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={thickness}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`
            transition-all duration-300 ease-out
            ${colorClasses[color]}
            ${variant === 'indeterminate' ? 'animate-spin' : ''}
          `}
          style={{
            transformOrigin: `${size / 2}px ${size / 2}px`
          }}
        />
      </svg>
      
      {showLabel && variant === 'determinate' && (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-gray-600 dark:text-gray-300">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

// Add the custom animation to your global CSS or Tailwind config
// @keyframes progress-indeterminate {
//   0% { transform: translateX(-100%); }
//   50% { transform: translateX(0%); }
//   100% { transform: translateX(100%); }
// }