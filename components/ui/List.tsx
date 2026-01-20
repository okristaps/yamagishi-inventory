import React from 'react';

export interface ListGroupProps {
  children: React.ReactNode;
  className?: string;
}

export function ListGroup({ children, className = '' }: ListGroupProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export interface ListItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

export function ListItem({ 
  children, 
  onClick, 
  href, 
  active = false, 
  disabled = false, 
  className = '' 
}: ListItemProps) {
  const baseClasses = `
    flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0
    transition-colors duration-200
  `;
  
  const stateClasses = disabled
    ? 'opacity-50 cursor-not-allowed'
    : active
    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
    : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700';
  
  const interactiveClasses = (onClick || href) && !disabled 
    ? 'cursor-pointer' 
    : '';
  
  const classes = `${baseClasses} ${stateClasses} ${interactiveClasses} ${className}`;
  
  if (href && !disabled) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    );
  }
  
  if (onClick && !disabled) {
    return (
      <button className={classes} onClick={onClick}>
        {children}
      </button>
    );
  }
  
  return (
    <div className={classes}>
      {children}
    </div>
  );
}

export interface ListItemTextProps {
  primary: React.ReactNode;
  secondary?: React.ReactNode;
  className?: string;
}

export function ListItemText({ primary, secondary, className = '' }: ListItemTextProps) {
  return (
    <div className={`flex-1 ${className}`}>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {primary}
      </div>
      {secondary && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {secondary}
        </div>
      )}
    </div>
  );
}

export interface ListItemIconProps {
  children: React.ReactNode;
  className?: string;
}

export function ListItemIcon({ children, className = '' }: ListItemIconProps) {
  return (
    <div className={`mr-3 text-gray-400 dark:text-gray-500 ${className}`}>
      {children}
    </div>
  );
}