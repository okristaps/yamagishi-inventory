import React from 'react';
import * as RadixSelect from '@radix-ui/react-select';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  placeholder?: string;
  onValueChange?: (value: string) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
}

export function Select({
  options,
  value,
  placeholder = "Select an option...",
  onValueChange,
  label,
  error,
  disabled = false,
  className = ""
}: SelectProps) {
  const triggerClasses = `
    w-full px-3 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 
    transition-colors duration-200 bg-white text-gray-900 
    dark:bg-gray-800 dark:text-gray-100 flex items-center justify-between
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-800' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-800'
    }
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      
      <RadixSelect.Root 
        value={value} 
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger className={triggerClasses}>
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon>
            <ChevronDownIcon className="w-4 h-4 text-gray-400" />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content 
            className="
              bg-white dark:bg-gray-800 rounded-lg shadow-lg border 
              border-gray-200 dark:border-gray-600 p-1 max-h-60 overflow-y-auto
              z-50 min-w-[var(--radix-select-trigger-width)]
            "
            sideOffset={4}
          >
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                  className={`
                    relative flex items-center px-3 py-2 rounded text-sm cursor-pointer
                    select-none outline-none transition-colors duration-200
                    ${option.disabled 
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed' 
                      : 'text-gray-700 dark:text-gray-300 data-[highlighted]:bg-gray-100 dark:data-[highlighted]:bg-gray-700'
                    }
                  `}
                >
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                  <RadixSelect.ItemIndicator className="absolute right-2">
                    <CheckIcon className="w-4 h-4 text-blue-500" />
                  </RadixSelect.ItemIndicator>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}