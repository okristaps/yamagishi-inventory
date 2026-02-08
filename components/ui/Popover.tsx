import React from 'react';
import * as RadixPopover from '@radix-ui/react-popover';

export const Popover = RadixPopover.Root;
export const PopoverTrigger = RadixPopover.Trigger;
export const PopoverAnchor = RadixPopover.Anchor;
export const PopoverClose = RadixPopover.Close;

export interface PopoverContentProps extends React.ComponentProps<typeof RadixPopover.Content> {
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  showArrow?: boolean;
}

export function PopoverContent({
  children,
  side = 'bottom',
  align = 'center',
  showArrow = true,
  className = '',
  ...props
}: PopoverContentProps) {
  return (
    <RadixPopover.Portal>
      <RadixPopover.Content
        side={side}
        align={align}
        className={`
          z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border 
          border-gray-200 dark:border-gray-600 p-4 max-w-sm
          animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 
          data-[state=closed]:animate-out data-[state=closed]:fade-out-0 
          data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 
          data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 
          data-[side=top]:slide-in-from-bottom-2
          ${className}
        `}
        sideOffset={4}
        {...props}
      >
        {children}
        {showArrow && (
          <RadixPopover.Arrow className="fill-white dark:fill-gray-800 drop-shadow-sm" />
        )}
      </RadixPopover.Content>
    </RadixPopover.Portal>
  );
}

// Convenience component for simple confirmation popovers
export interface ConfirmPopoverProps {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  variant?: 'default' | 'destructive';
  children: React.ReactNode;
}

export function ConfirmPopover({
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'default',
  children
}: ConfirmPopoverProps) {
  const [open, setOpen] = React.useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  const handleCancel = () => {
    onCancel?.();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children}
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {description}
            </p>
          )}
          <div className="flex justify-end space-x-2 pt-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`
                px-3 py-1.5 text-sm rounded transition-colors
                ${variant === 'destructive' 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }
              `}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}