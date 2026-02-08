'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';
import { HeaderProvider, useHeader } from './HeaderContext';
import {
  HomeIcon,
  GearIcon,
  HamburgerMenuIcon,
  DashboardIcon,
  FileTextIcon,
  ActivityLogIcon,
  Cross1Icon
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

function LayoutContent({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { title, rightContent, subtitle } = useHeader();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  const displayTitle = title || navItems.find(item => isActive(item.path))?.label || 'Home';

  return (
    <div className="layout-container bg-gray-50 dark:bg-dark-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div
        className={`
          sidebar-drawer
          fixed top-0 left-0 bottom-0 w-72 z-50
          flex flex-col bg-white dark:bg-dark-card border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <FileTextIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Yamagishi
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Inventory</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="p-2"
          >
            <Cross1Icon className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link key={item.key} href={item.path} onClick={handleNavClick}>
                  <div className={`
                    flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200
                    ${active
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}>
                    <span className={`flex-shrink-0 w-5 h-5 flex items-center justify-center`}>
                      {item.icon}
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              v0.0.0
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="main-area">
        <header className="header bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700">
          <div className="header-inner flex items-center justify-between h-14 px-4">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="p-2 flex-shrink-0 -ml-2"
              >
                <HamburgerMenuIcon className="w-5 h-5" />
              </Button>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate leading-tight">
                  {displayTitle}
                </h2>
                {subtitle && (
                  <p className="subtitle text-xs text-gray-500 dark:text-gray-400 truncate -mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {rightContent && (
              <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                {rightContent}
              </div>
            )}
          </div>
        </header>

        <main className="content">
          {children}
        </main>
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <HeaderProvider>
      <LayoutContent>{children}</LayoutContent>
    </HeaderProvider>
  );
}
