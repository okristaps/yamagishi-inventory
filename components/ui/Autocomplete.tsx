'use client';
import React, { useState, useRef, useEffect } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChevronDownIcon, CheckIcon } from '@radix-ui/react-icons';

export interface AutocompleteOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AutocompleteProps {
  options: AutocompleteOption[];
  value?: string;
  placeholder?: string;
  onSelectionChange?: (option: AutocompleteOption | null) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  clearable?: boolean;
  freeSolo?: boolean;
  loading?: boolean;
  noOptionsText?: string;
  className?: string;
}

export function Autocomplete({
  options,
  value,
  placeholder = "Search...",
  onSelectionChange,
  label,
  error,
  disabled = false,
  clearable = true,
  freeSolo = false,
  loading = false,
  noOptionsText = "No options",
  className = ""
}: AutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(
    value ? options.find(opt => opt.value === value) || null : null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter options based on search
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Update search value when selection changes
  useEffect(() => {
    if (selectedOption) {
      setSearchValue(selectedOption.label);
    }
  }, [selectedOption]);

  // Update selected option when value prop changes
  useEffect(() => {
    if (value) {
      const option = options.find(opt => opt.value === value);
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [value, options]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setOpen(true);

    if (freeSolo) {
      const customOption: AutocompleteOption = {
        value: newValue,
        label: newValue
      };
      onSelectionChange?.(customOption);
    }
  };

  const handleOptionSelect = (option: AutocompleteOption) => {
    setSelectedOption(option);
    setSearchValue(option.label);
    setOpen(false);
    onSelectionChange?.(option);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setSelectedOption(null);
    setSearchValue('');
    onSelectionChange?.(null);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setOpen(true);
  };

  const inputClasses = `
    w-full px-3 py-2 pr-8 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200
    ${error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-800'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-800'
    }
    bg-white text-gray-900 placeholder-gray-500
    dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              className={inputClasses}
              placeholder={placeholder}
              value={searchValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              disabled={disabled}
              autoComplete="off"
            />

            <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {clearable && selectedOption && !disabled && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              <ChevronDownIcon
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'transform rotate-180' : ''
                  }`}
              />
            </div>
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="
              bg-white dark:bg-gray-800 rounded-lg shadow-lg border 
              border-gray-200 dark:border-gray-600 p-1 max-h-60 overflow-y-auto
              w-[var(--radix-popover-trigger-width)] z-50
            "
            sideOffset={4}
          >
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                Loading...
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  className={`
                    w-full text-left px-3 py-2 rounded text-sm transition-colors duration-200
                    flex items-center justify-between
                    ${option.disabled
                      ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer'
                    }
                    ${selectedOption?.value === option.value ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''}
                  `}
                  onClick={() => !option.disabled && handleOptionSelect(option)}
                  disabled={option.disabled}
                >
                  <span>{option.label}</span>
                  {selectedOption?.value === option.value && (
                    <CheckIcon className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                {noOptionsText}
              </div>
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}