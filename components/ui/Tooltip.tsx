import React from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delayDuration?: number;
  disabled?: boolean;
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = 'top',
  align = 'center',
  delayDuration = 400,
  disabled = false,
  className = ''
}: TooltipProps) {
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <RadixTooltip.Provider delayDuration={delayDuration}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          {children}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <RadixTooltip.Content
            side={side}
            align={align}
            className={`
              z-50 px-3 py-2 text-sm text-white bg-gray-900 dark:bg-gray-700 
              rounded-lg shadow-lg border border-gray-200 dark:border-gray-600
              animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out 
              data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 
              data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 
              data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2
              ${className}
            `}
            sideOffset={4}
          >
            {content}
            <RadixTooltip.Arrow className="fill-gray-900 dark:fill-gray-700" />
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
}

// Convenience wrapper for simple text tooltips
export interface SimpleTooltipProps extends Omit<TooltipProps, 'content'> {
  text: string;
}

export function SimpleTooltip({ text, children, ...props }: SimpleTooltipProps) {
  return (
    <Tooltip content={text} {...props}>
      {children}
    </Tooltip>
  );
}