import React from 'react';
import Image from 'next/image';
import { Cross2Icon } from '@radix-ui/react-icons';

export interface ChipProps {
  label: string;
  variant?: 'filled' | 'outlined';
  color?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  avatar?: React.ReactNode;
  icon?: React.ReactNode;
  clickable?: boolean;
  deletable?: boolean;
  onDelete?: () => void;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function Chip({
  label,
  variant = 'filled',
  color = 'default',
  size = 'md',
  avatar,
  icon,
  clickable = false,
  deletable = false,
  onDelete,
  onClick,
  disabled = false,
  className = ''
}: ChipProps) {
  const baseClasses = 'inline-flex items-center gap-1 font-medium rounded-full transition-all duration-200 border';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs min-h-[20px]',
    md: 'px-3 py-1 text-sm min-h-[24px]'
  };
  
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4'
  };
  
  const avatarSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5'
  };
  
  // Color classes for filled variant
  const filledColorClasses = {
    default: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
    primary: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-800',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700',
    success: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800',
    error: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800',
    info: 'bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-900 dark:text-cyan-200 dark:border-cyan-800'
  };
  
  // Color classes for outlined variant
  const outlinedColorClasses = {
    default: 'bg-transparent text-gray-700 border-gray-300 dark:text-gray-300 dark:border-gray-600',
    primary: 'bg-transparent text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-600',
    secondary: 'bg-transparent text-gray-600 border-gray-300 dark:text-gray-400 dark:border-gray-600',
    success: 'bg-transparent text-green-600 border-green-300 dark:text-green-400 dark:border-green-600',
    warning: 'bg-transparent text-yellow-600 border-yellow-300 dark:text-yellow-400 dark:border-yellow-600',
    error: 'bg-transparent text-red-600 border-red-300 dark:text-red-400 dark:border-red-600',
    info: 'bg-transparent text-cyan-600 border-cyan-300 dark:text-cyan-400 dark:border-cyan-600'
  };
  
  const colorClasses = variant === 'filled' ? filledColorClasses[color] : outlinedColorClasses[color];
  
  const interactiveClasses = (clickable || onClick) && !disabled 
    ? 'cursor-pointer hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500' 
    : '';
    
  const disabledClasses = disabled 
    ? 'opacity-50 cursor-not-allowed' 
    : '';
  
  const classes = `
    ${baseClasses} 
    ${sizeClasses[size]} 
    ${colorClasses} 
    ${interactiveClasses} 
    ${disabledClasses} 
    ${className}
  `.trim();
  
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onDelete) {
      onDelete();
    }
  };
  
  const content = (
    <>
      {avatar && (
        <span className={`rounded-full overflow-hidden ${avatarSizes[size]}`}>
          {avatar}
        </span>
      )}
      
      {icon && !avatar && (
        <span className={iconSizes[size]}>
          {icon}
        </span>
      )}
      
      <span className="truncate">{label}</span>
      
      {deletable && (
        <button
          type="button"
          onClick={handleDelete}
          disabled={disabled}
          className={`
            ${iconSizes[size]} rounded-full hover:bg-black/10 dark:hover:bg-white/10 
            transition-colors duration-200 flex items-center justify-center
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <Cross2Icon className="w-2.5 h-2.5" />
        </button>
      )}
    </>
  );
  
  if (clickable || onClick) {
    return (
      <button className={classes} onClick={handleClick} disabled={disabled}>
        {content}
      </button>
    );
  }
  
  return (
    <div className={classes}>
      {content}
    </div>
  );
}

// Convenience component for avatar chips
export interface AvatarChipProps extends Omit<ChipProps, 'avatar'> {
  avatarSrc?: string;
  avatarAlt?: string;
  avatarFallback?: string;
}

export function AvatarChip({ 
  avatarSrc, 
  avatarAlt = '', 
  avatarFallback, 
  label,
  ...props 
}: AvatarChipProps) {
  const avatar = avatarSrc ? (
    <Image 
      src={avatarSrc} 
      alt={avatarAlt} 
      width={24}
      height={24}
      className="w-full h-full object-cover rounded-full"
      unoptimized={true}
    />
  ) : avatarFallback ? (
    <div className="w-full h-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-xs font-medium">
      {avatarFallback}
    </div>
  ) : null;
  
  return <Chip {...props} label={label} avatar={avatar} />;
}