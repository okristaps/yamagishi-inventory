import React from 'react';

interface PageProps {
  children: React.ReactNode;
  className?: string;
}

export function Page({ children, className = '' }: PageProps) {
  return (
    <div className={`py-4 ${className}`}>
      {children}
    </div>
  );
}
