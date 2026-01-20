import React from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Button } from './Button';

export const Dialog = RadixDialog.Root;
export const DialogTrigger = RadixDialog.Trigger;

export function DialogContent({ 
  children, 
  className = '',
  ...props 
}: React.ComponentProps<typeof RadixDialog.Content>) {
  return (
    <RadixDialog.Portal>
      <RadixDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
      <RadixDialog.Content 
        className={`
          fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
          bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg 
          max-w-md w-full mx-4 border dark:border-gray-700 z-50
          ${className}
        `}
        {...props}
      >
        {children}
      </RadixDialog.Content>
    </RadixDialog.Portal>
  );
}

export function DialogTitle({ 
  children, 
  className = '',
  ...props 
}: React.ComponentProps<typeof RadixDialog.Title>) {
  return (
    <RadixDialog.Title 
      className={`text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 ${className}`}
      {...props}
    >
      {children}
    </RadixDialog.Title>
  );
}

export function DialogDescription({ 
  children, 
  className = '',
  ...props 
}: React.ComponentProps<typeof RadixDialog.Description>) {
  return (
    <RadixDialog.Description 
      className={`text-gray-600 dark:text-gray-300 mb-4 ${className}`}
      {...props}
    >
      {children}
    </RadixDialog.Description>
  );
}

export const DialogClose = RadixDialog.Close;

export interface DialogActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function DialogActions({ children, className = '' }: DialogActionsProps) {
  return (
    <div className={`flex justify-end space-x-2 mt-4 ${className}`}>
      {children}
    </div>
  );
}