'use client';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { CheckCircledIcon, CrossCircledIcon, ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';

type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  id: string;
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toast: (options: Omit<ToastData, 'id'>) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// Singleton reference for direct imports
let toastRef: ToastContextValue | null = null;

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

// Direct export functions - can be imported and used without hook
export const toast = {
  show: (options: Omit<ToastData, 'id'>) => toastRef?.toast(options),
  success: (title: string, description?: string) => toastRef?.success(title, description),
  error: (title: string, description?: string) => toastRef?.error(title, description),
  warning: (title: string, description?: string) => toastRef?.warning(title, description),
  info: (title: string, description?: string) => toastRef?.info(title, description),
};

const variantStyles: Record<ToastVariant, string> = {
  default: 'bg-white dark:bg-dark-card border-gray-200 dark:border-gray-700',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
};

const variantIconStyles: Record<ToastVariant, string> = {
  default: 'text-gray-500',
  success: 'text-green-600 dark:text-green-400',
  error: 'text-red-600 dark:text-red-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  info: 'text-blue-600 dark:text-blue-400',
};

const variantIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: <CheckCircledIcon className="w-5 h-5" />,
  error: <CrossCircledIcon className="w-5 h-5" />,
  warning: <ExclamationTriangleIcon className="w-5 h-5" />,
  info: <InfoCircledIcon className="w-5 h-5" />,
};

interface ToastProps extends ToastData {
  onOpenChange: (open: boolean) => void;
}

function Toast({ title, description, variant = 'default', duration = 4000, onOpenChange }: ToastProps) {
  const icon = variantIcons[variant];

  return (
    <ToastPrimitive.Root
      className={`
        ${variantStyles[variant]}
        border rounded-lg shadow-lg p-4
        data-[state=open]:animate-slideIn
        data-[state=closed]:animate-slideOut
        data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)]
        data-[swipe=cancel]:translate-x-0
        data-[swipe=cancel]:transition-transform
        data-[swipe=end]:animate-swipeOut
      `}
      duration={duration}
      onOpenChange={onOpenChange}
    >
      <div className="flex gap-3">
        {icon && (
          <div className={`flex-shrink-0 ${variantIconStyles[variant]}`}>
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title && (
            <ToastPrimitive.Title className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </ToastPrimitive.Title>
          )}
          {description && (
            <ToastPrimitive.Description className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {description}
            </ToastPrimitive.Description>
          )}
        </div>
      </div>
    </ToastPrimitive.Root>
  );
}

interface ToastProviderProps {
  children: React.ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toastFn = useCallback((options: Omit<ToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, ...options }]);
  }, []);

  const success = useCallback((title: string, description?: string) => {
    toastFn({ title, description, variant: 'success' });
  }, [toastFn]);

  const error = useCallback((title: string, description?: string) => {
    toastFn({ title, description, variant: 'error' });
  }, [toastFn]);

  const warning = useCallback((title: string, description?: string) => {
    toastFn({ title, description, variant: 'warning' });
  }, [toastFn]);

  const info = useCallback((title: string, description?: string) => {
    toastFn({ title, description, variant: 'info' });
  }, [toastFn]);

  const contextValue: ToastContextValue = {
    toast: toastFn,
    success,
    error,
    warning,
    info,
  };

  // Set singleton ref for direct imports
  useEffect(() => {
    toastRef = contextValue;
    return () => {
      toastRef = null;
    };
  });

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastPrimitive.Provider swipeDirection="right">
        {children}
        <ToastPrimitive.Viewport
          className="fixed top-0 right-0 p-4 flex flex-col gap-2 w-full max-w-sm z-[9999] outline-none"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        />
        {toasts.map(t => (
          <Toast
            key={t.id}
            {...t}
            onOpenChange={(open) => {
              if (!open) removeToast(t.id);
            }}
          />
        ))}
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  );
}
