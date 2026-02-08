import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive' | 'ghost' | 'success' | 'warning' | 'info' | 'text' | 'link';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children, 
  className = '', 
  disabled,
  ...props 
}: ButtonProps) {
  const baseClasses = 'font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center gap-2 relative';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 dark:bg-gray-500 dark:hover:bg-gray-600 shadow-sm hover:shadow-md',
    outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500',
    destructive: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600 shadow-sm hover:shadow-md',
    ghost: 'text-gray-600 hover:bg-gray-100 focus:ring-gray-500 dark:text-gray-400 dark:hover:bg-gray-800',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 dark:bg-green-500 dark:hover:bg-green-600 shadow-sm hover:shadow-md',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-500 dark:bg-yellow-600 dark:hover:bg-yellow-700 shadow-sm hover:shadow-md',
    info: 'bg-cyan-600 hover:bg-cyan-700 text-white focus:ring-cyan-500 dark:bg-cyan-500 dark:hover:bg-cyan-600 shadow-sm hover:shadow-md',
    text: 'text-blue-600 hover:text-blue-700 hover:bg-blue-50 focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20',
    link: 'text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline focus:ring-blue-500 dark:text-blue-400 dark:hover:text-blue-300'
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs min-h-[24px]',
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-sm min-h-[40px]',
    lg: 'px-6 py-3 text-base min-h-[48px]',
    xl: 'px-8 py-4 text-lg min-h-[56px]'
  };
  
  const iconSizes = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6'
  };
  
  const disabledClasses = 'opacity-50 cursor-not-allowed hover:shadow-none';
  const loadingClasses = 'cursor-wait opacity-75';
  const fullWidthClasses = fullWidth ? 'w-full' : '';
  
  const isDisabled = disabled || loading;
  
  const classes = `
    ${baseClasses} 
    ${variantClasses[variant]} 
    ${sizeClasses[size]} 
    ${fullWidthClasses}
    ${isDisabled ? (loading ? loadingClasses : disabledClasses) : ''} 
    ${className}
  `.trim();
  
  const LoadingSpinner = () => (
    <svg className={`animate-spin ${iconSizes[size]}`} fill="none" viewBox="0 0 24 24">
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  
  return (
    <button 
      className={classes} 
      disabled={isDisabled}
      {...props}
    >
      {loading ? (
        <LoadingSpinner />
      ) : leftIcon ? (
        <span className={iconSizes[size]}>{leftIcon}</span>
      ) : null}
      
      <span className={loading ? 'opacity-0' : ''}>{children}</span>
      
      {!loading && rightIcon && (
        <span className={iconSizes[size]}>{rightIcon}</span>
      )}
    </button>
  );
}

// Convenience components for common patterns
export interface IconButtonProps extends Omit<ButtonProps, 'children' | 'leftIcon' | 'rightIcon'> {
  icon: React.ReactNode;
  'aria-label': string;
}

export function IconButton({ icon, className = '', ...props }: IconButtonProps) {
  return (
    <Button className={`!p-2 ${className}`} {...props}>
      {icon}
    </Button>
  );
}

export interface ButtonGroupProps {
  children: React.ReactNode;
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function ButtonGroup({ 
  children, 
  className = '', 
  orientation = 'horizontal' 
}: ButtonGroupProps) {
  const orientationClasses = orientation === 'horizontal' 
    ? 'flex-row' 
    : 'flex-col';
    
  return (
    <div className={`inline-flex ${orientationClasses} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        
        const isFirst = index === 0;
        const isLast = index === React.Children.count(children) - 1;
        
        const groupClasses = orientation === 'horizontal' 
          ? `${!isFirst ? '-ml-px' : ''} ${!isFirst && !isLast ? 'rounded-none' : isFirst ? 'rounded-r-none' : 'rounded-l-none'}`
          : `${!isFirst ? '-mt-px' : ''} ${!isFirst && !isLast ? 'rounded-none' : isFirst ? 'rounded-b-none' : 'rounded-t-none'}`;
        
        return React.cloneElement(child, {
          className: `${child.props.className || ''} ${groupClasses}`.trim()
        });
      })}
    </div>
  );
}