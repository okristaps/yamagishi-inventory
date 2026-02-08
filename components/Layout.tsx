'use client';
import React, { useState, useRef, useEffect, memo, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';
import {
  HomeIcon,
  GearIcon,
  HamburgerMenuIcon,
  DashboardIcon,
  FileTextIcon,
  ActivityLogIcon
} from '@radix-ui/react-icons';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const navItems: NavItem[] = [
  { key: 'home', label: 'Home', icon: <HomeIcon />, path: '/' },
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { key: 'settings', label: 'Settings', icon: <GearIcon />, path: '/settings' },
  { key: 'test', label: 'Test', icon: <ActivityLogIcon />, path: '/test' },
];

export function Layout({ children }: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (
      !sidebarCollapsed &&
      sidebarRef.current &&
      mainContentRef.current &&
      !sidebarRef.current.contains(event.target as Node) &&
      mainContentRef.current.contains(event.target as Node)
    ) {
      setSidebarCollapsed(true);
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  return (
    <div className="layout-container bg-gray-50 dark:bg-dark-bg">
      <div
        ref={sidebarRef}
        className={`
          sidebar flex flex-col bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-700
          transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'w-20' : 'w-64'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-2">
              <FileTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Yamagishi
              </h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2"
          >
            <HamburgerMenuIcon className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return sidebarCollapsed ? (
                <div key={item.key} className="w-full flex justify-center mb-2">
                  <Link href={item.path} className="inline-block">
                    <div className={`
                      w-20 h-18 rounded-lg flex items-center justify-center transition-colors duration-200
                      ${active
                        ? 'text-blue-600 dark:text-blue-400'
                        : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-400'
                      }
                    `}>
                      <span className="w-12 h-12 flex items-center justify-center">{item.icon}</span>
                    </div>
                  </Link>
                </div>
              ) : (
                <Link key={item.key} href={item.path}>
                  <div className={`
                    flex items-center space-x-4 px-4 py-4 rounded-lg cursor-pointer transition-colors duration-200
                    ${active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-r-4 border-blue-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}>
                    <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center ${active ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`}>
                      {item.icon}
                    </span>
                    <span className="flex-1 font-medium text-lg">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        {!sidebarCollapsed && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                v5.1.0
              </div>
              <ThemeToggle />
            </div>
          </div>
        )}
      </div>

      <div ref={mainContentRef} className="main-area">
        <header className="header bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {navItems.find(item => isActive(item.path))?.label || 'Home'}
              </h2>
            </div>
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}