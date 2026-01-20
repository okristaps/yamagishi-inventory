import React from 'react';
import { 
  CheckCircledIcon, 
  InfoCircledIcon, 
  ExclamationTriangleIcon, 
  Cross2Icon,
  CrossCircledIcon 
} from '@radix-ui/react-icons';

export interface AlertProps {
  children: React.ReactNode;
  severity?: 'success' | 'info' | 'warning' | 'error';
  variant?: 'filled' | 'outlined' | 'standard';
  title?: string;
  onClose?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function Alert({
  children,
  severity = 'info',
  variant = 'standard',
  title,
  onClose,
  icon,
  className = ''
}: AlertProps) {
  const baseClasses = 'p-4 rounded-lg border flex items-start gap-3 transition-all duration-200';
  
  // Default icons for each severity
  const defaultIcons = {
    success: <CheckCircledIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    info: <InfoCircledIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    warning: <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />,
    error: <CrossCircledIcon className="w-5 h-5 flex-shrink-0 mt-0.5" />
  };
  
  // Color classes for different variants
  const variantClasses = {
    filled: {
      success: 'bg-green-600 text-white border-green-600',
      info: 'bg-blue-600 text-white border-blue-600',
      warning: 'bg-yellow-600 text-white border-yellow-600',
      error: 'bg-red-600 text-white border-red-600'
    },
    outlined: {
      success: 'bg-transparent text-green-700 border-green-300 dark:text-green-400 dark:border-green-600',
      info: 'bg-transparent text-blue-700 border-blue-300 dark:text-blue-400 dark:border-blue-600',
      warning: 'bg-transparent text-yellow-700 border-yellow-300 dark:text-yellow-400 dark:border-yellow-600',
      error: 'bg-transparent text-red-700 border-red-300 dark:text-red-400 dark:border-red-600'
    },
    standard: {
      success: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-200 dark:border-green-800',
      info: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200 dark:border-blue-800',
      warning: 'bg-yellow-50 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200 dark:border-yellow-800',
      error: 'bg-red-50 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-200 dark:border-red-800'
    }
  };
  
  const colorClasses = variantClasses[variant][severity];
  
  const classes = `${baseClasses} ${colorClasses} ${className}`;
  
  const displayIcon = icon || defaultIcons[severity];
  
  return (
    <div className={classes} role="alert">
      {displayIcon}
      
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-semibold mb-1">
            {title}
          </div>
        )}
        <div className={title ? 'text-sm' : ''}>
          {children}
        </div>
      </div>
      
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className={`
            flex-shrink-0 rounded p-1 transition-colors duration-200
            ${variant === 'filled' 
              ? 'hover:bg-black/10 text-white/80 hover:text-white' 
              : 'hover:bg-gray-100 dark:hover:bg-gray-800 opacity-70 hover:opacity-100'
            }
          `}
        >
          <Cross2Icon className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

// Convenience components for specific severities
export interface SuccessAlertProps extends Omit<AlertProps, 'severity'> {}
export function SuccessAlert(props: SuccessAlertProps) {
  return <Alert {...props} severity="success" />;
}

export interface InfoAlertProps extends Omit<AlertProps, 'severity'> {}
export function InfoAlert(props: InfoAlertProps) {
  return <Alert {...props} severity="info" />;
}

export interface WarningAlertProps extends Omit<AlertProps, 'severity'> {}
export function WarningAlert(props: WarningAlertProps) {
  return <Alert {...props} severity="warning" />;
}

export interface ErrorAlertProps extends Omit<AlertProps, 'severity'> {}
export function ErrorAlert(props: ErrorAlertProps) {
  return <Alert {...props} severity="error" />;
}