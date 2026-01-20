import React from 'react';
import * as RadixDropdownMenu from '@radix-ui/react-dropdown-menu';

export const DropdownMenu = RadixDropdownMenu.Root;
export const DropdownMenuTrigger = RadixDropdownMenu.Trigger;

export function DropdownMenuContent({ 
  children, 
  className = '',
  ...props 
}: React.ComponentProps<typeof RadixDropdownMenu.Content>) {
  return (
    <RadixDropdownMenu.Portal>
      <RadixDropdownMenu.Content 
        className={`
          bg-white dark:bg-gray-800 rounded-md shadow-lg border 
          border-gray-200 dark:border-gray-600 p-1 min-w-[160px] z-50
          ${className}
        `}
        {...props}
      >
        {children}
      </RadixDropdownMenu.Content>
    </RadixDropdownMenu.Portal>
  );
}

export function DropdownMenuItem({ 
  children, 
  className = '',
  variant = 'default',
  ...props 
}: React.ComponentProps<typeof RadixDropdownMenu.Item> & {
  variant?: 'default' | 'destructive';
}) {
  const variantClasses = variant === 'destructive' 
    ? 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700';

  return (
    <RadixDropdownMenu.Item 
      className={`
        px-2 py-2 text-sm rounded cursor-pointer outline-none 
        transition-colors duration-200 focus:bg-gray-100 dark:focus:bg-gray-700
        ${variantClasses} ${className}
      `}
      {...props}
    >
      {children}
    </RadixDropdownMenu.Item>
  );
}

export function DropdownMenuSeparator({ 
  className = '',
  ...props 
}: React.ComponentProps<typeof RadixDropdownMenu.Separator>) {
  return (
    <RadixDropdownMenu.Separator 
      className={`h-px bg-gray-200 dark:bg-gray-600 my-1 ${className}`}
      {...props}
    />
  );
}