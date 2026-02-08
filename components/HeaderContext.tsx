'use client';
import React, { createContext, useContext, useState, useRef, useLayoutEffect, ReactNode } from 'react';

interface HeaderContextType {
  title: string;
  setTitle: (title: string) => void;
  rightContent: ReactNode | null;
  setRightContent: (content: ReactNode | null) => void;
  subtitle: string | null;
  setSubtitle: (subtitle: string | null) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [rightContent, setRightContent] = useState<ReactNode | null>(null);
  const [subtitle, setSubtitle] = useState<string | null>(null);

  return (
    <HeaderContext.Provider value={{
      title,
      setTitle,
      rightContent,
      setRightContent,
      subtitle,
      setSubtitle
    }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
}

// Hook to set header content from a page
// Uses refs to avoid infinite re-render loops with ReactNode content
export function usePageHeader(options: {
  title?: string;
  subtitle?: string | null;
  rightContent?: ReactNode;
}) {
  const { setTitle, setRightContent, setSubtitle } = useHeader();
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Set on mount, cleanup on unmount
  useLayoutEffect(() => {
    const opts = optionsRef.current;

    if (opts.title !== undefined) {
      setTitle(opts.title);
    }
    if (opts.subtitle !== undefined) {
      setSubtitle(opts.subtitle);
    }
    if (opts.rightContent !== undefined) {
      setRightContent(opts.rightContent);
    }

    // Cleanup on unmount
    return () => {
      setTitle('');
      setRightContent(null);
      setSubtitle(null);
    };
  }, [setTitle, setSubtitle, setRightContent]); // Setters are stable

  // Update when title or subtitle strings change
  useLayoutEffect(() => {
    if (options.title !== undefined) {
      setTitle(options.title);
    }
  }, [options.title, setTitle]);

  useLayoutEffect(() => {
    if (options.subtitle !== undefined) {
      setSubtitle(options.subtitle);
    }
  }, [options.subtitle, setSubtitle]);
}
