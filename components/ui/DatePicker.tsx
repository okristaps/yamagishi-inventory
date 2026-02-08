'use client';
import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';

export interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date...",
  label,
  error,
  disabled = false,
  minDate,
  maxDate,
  className = ""
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const isSameDay = (date1: Date | null | undefined, date2: Date | null | undefined) => {
    if (!date1 || !date2) return false;
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;
    onChange?.(date);
    setOpen(false);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(newMonth.getMonth() - 1);
      } else {
        newMonth.setMonth(newMonth.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const inputClasses = `
    w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 
    transition-colors duration-200 cursor-pointer
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-800' 
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-800'
    }
    bg-white text-gray-900 placeholder-gray-500
    dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400
    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
    ${className}
  `;

  const days = getDaysInMonth(currentMonth);
  const monthYear = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long'
  }).format(currentMonth);

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
              type="text"
              className={inputClasses}
              placeholder={placeholder}
              value={value ? formatDate(value) : ''}
              disabled={disabled}
              readOnly
            />
            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            className="
              bg-white dark:bg-gray-800 rounded-lg shadow-lg border 
              border-gray-200 dark:border-gray-600 p-4 z-50
            "
            sideOffset={4}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => handleMonthChange('prev')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              
              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {monthYear}
              </h3>
              
              <button
                onClick={() => handleMonthChange('next')}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <ChevronRightIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Day Labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((date, index) => (
                <button
                  key={index}
                  onClick={() => date && handleDateSelect(date)}
                  disabled={isDateDisabled(date)}
                  className={`
                    w-8 h-8 text-sm rounded transition-colors duration-200
                    ${!date 
                      ? 'cursor-default' 
                      : isDateDisabled(date)
                      ? 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                      : isSameDay(date, value)
                      ? 'bg-blue-500 text-white'
                      : isSameDay(date, new Date())
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  {date?.getDate()}
                </button>
              ))}
            </div>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}