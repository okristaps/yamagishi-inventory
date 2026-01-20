import React from 'react';
import * as RadixSeparator from '@radix-ui/react-separator';

export interface SeparatorProps extends React.ComponentProps<typeof RadixSeparator.Root> {
  orientation?: 'horizontal' | 'vertical';
}

export function Separator({ 
  orientation = 'horizontal', 
  className = '',
  ...props 
}: SeparatorProps) {
  return (
    <RadixSeparator.Root 
      orientation={orientation}
      className={`
        bg-gray-200 dark:bg-gray-600
        ${orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'}
        ${className}
      `}
      {...props}
    />
  );
}