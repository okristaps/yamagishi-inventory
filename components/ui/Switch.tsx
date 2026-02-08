import React from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

export interface SwitchProps extends React.ComponentProps<typeof RadixSwitch.Root> {
  label?: string;
}

export function Switch({ 
  label, 
  className = '', 
  id, 
  ...props 
}: SwitchProps) {
  return (
    <div className="flex items-center space-x-2">
      <RadixSwitch.Root 
        className={`
          w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full relative 
          data-[state=checked]:bg-blue-500 outline-none cursor-default 
          transition-colors duration-200 focus:ring-2 focus:ring-blue-500
          ${className}
        `}
        id={id}
        {...props}
      >
        <RadixSwitch.Thumb className="
          block w-5 h-5 bg-white dark:bg-gray-200 rounded-full 
          transition-all duration-200 translate-x-0.5 will-change-transform 
          data-[state=checked]:translate-x-[22px]
        " />
      </RadixSwitch.Root>
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