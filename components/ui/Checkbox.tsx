import React from 'react';
import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckIcon } from '@radix-ui/react-icons';

export interface CheckboxProps extends React.ComponentProps<typeof RadixCheckbox.Root> {
  label?: string;
}

export function Checkbox({ 
  label, 
  className = '', 
  id, 
  ...props 
}: CheckboxProps) {
  return (
    <div className="flex items-center space-x-2">
      <RadixCheckbox.Root 
        className={`
          w-5 h-5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
          rounded flex items-center justify-center 
          data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 
          transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${className}
        `}
        id={id}
        {...props}
      >
        <RadixCheckbox.Indicator className="text-white">
          <CheckIcon />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {label && (
        <label 
          htmlFor={id} 
          className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          {label}
        </label>
      )}
    </div>
  );
}