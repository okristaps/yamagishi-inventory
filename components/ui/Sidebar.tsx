import React from 'react';
import { Button } from './Button';

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlay?: boolean;
  position?: 'left' | 'right';
  width?: 'sm' | 'md' | 'lg';
}

export function Sidebar({ 
  isOpen, 
  onClose, 
  children, 
  className = '',
  overlay = true,
  position = 'left',
  width = 'md'
}: SidebarProps) {
  const widthClasses = {
    sm: 'w-64',
    md: 'w-80',
    lg: 'w-96'
  };

  const positionClasses = {
    left: `left-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`,
    right: `right-0 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
  };

  return (
    <>
      {/* Overlay */}
      {overlay && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`
          fixed top-0 bottom-0 z-50
          ${widthClasses[width]}
          ${positionClasses[position]}
          bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          flex flex-col
          ${className}
        `}
      >
        {children}
      </div>
    </>
  );
}

export interface SidebarHeaderProps {
  children: React.ReactNode;
  onClose?: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export function SidebarHeader({ 
  children, 
  onClose, 
  showCloseButton = true, 
  className = '' 
}: SidebarHeaderProps) {
  return (
    <div className={`p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between ${className}`}>
      <div className="flex-1">
        {children}
      </div>
      {showCloseButton && onClose && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="ml-2"
        >
          ✕
        </Button>
      )}
    </div>
  );
}

export interface SidebarContentProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarContent({ children, className = '' }: SidebarContentProps) {
  return (
    <div className={`flex-1 overflow-y-auto p-4 ${className}`}>
      {children}
    </div>
  );
}

export interface SidebarFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarFooter({ children, className = '' }: SidebarFooterProps) {
  return (
    <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${className}`}>
      {children}
    </div>
  );
}

export interface SidebarItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SidebarItem({ 
  children, 
  icon, 
  active = false, 
  onClick, 
  className = '' 
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors duration-200
        ${active 
          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500' 
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
        ${className}
      `}
    >
      {icon && (
        <span className={`flex-shrink-0 ${active ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>
          {icon}
        </span>
      )}
      <span className="flex-1">{children}</span>
    </button>
  );
}

export interface SidebarSectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function SidebarSection({ title, children, className = '' }: SidebarSectionProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      {title && (
        <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
}