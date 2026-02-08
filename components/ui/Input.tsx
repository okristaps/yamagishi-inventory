import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}: InputProps) {
  const inputClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-800' 
      : 'border-gray-300 focus:border-gray-500 focus:ring-gray-200 dark:border-gray-600 dark:focus:border-gray-400 dark:focus:ring-gray-800'
    }
    bg-white text-gray-900 placeholder-gray-500
    dark:bg-dark-input dark:text-gray-100 dark:placeholder-gray-400
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <input className={inputClasses} {...props} />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ 
  label, 
  error, 
  helperText, 
  className = '', 
  ...props 
}: TextareaProps) {
  const textareaClasses = `
    w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 transition-colors duration-200 resize-vertical
    ${error 
      ? 'border-red-300 focus:border-red-500 focus:ring-red-200 dark:border-red-600 dark:focus:border-red-500 dark:focus:ring-red-800' 
      : 'border-gray-300 focus:border-gray-500 focus:ring-gray-200 dark:border-gray-600 dark:focus:border-gray-400 dark:focus:ring-gray-800'
    }
    bg-white text-gray-900 placeholder-gray-500
    dark:bg-dark-input dark:text-gray-100 dark:placeholder-gray-400
    ${className}
  `;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <textarea className={textareaClasses} {...props} />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      {helperText && !error && (
        <p className="text-sm text-gray-500 dark:text-gray-400">{helperText}</p>
      )}
    </div>
  );
}