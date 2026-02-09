'use client';
import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, IconButton } from './ui/Button';
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from './ui/Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { HeaderProvider, useHeader } from './HeaderContext';
import { useUser } from './AuthProvider';
import { AuthService } from '@/api/auth.api';
import {
  GearIcon,
  HamburgerMenuIcon,
  DashboardIcon,
  Cross1Icon,
  CodeIcon,
  ExitIcon,
  ComponentInstanceIcon,
  PersonIcon
} from '@radix-ui/react-icons';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  devOnly?: boolean;
}

const navItems: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { key: 'settings', label: 'Settings', icon: <GearIcon />, path: '/settings' },
  { key: 'debug', label: 'Debug', icon: <CodeIcon />, path: '/debug' },
  { key: 'ui-library', label: 'UI Library', icon: <ComponentInstanceIcon />, path: '/ui-library', devOnly: true },
];

function LayoutContent({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { title, rightContent, subtitle } = useHeader();
  const user = useUser();

  const handleLogout = async () => {
    setSidebarOpen(false);
    await AuthService.logout();
    router.replace('/login');
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  const isDev = process.env.NODE_ENV === 'development';
  const visibleNavItems = navItems.filter(item => !item.devOnly || isDev);
  const displayTitle = title || visibleNavItems.find(item => isActive(item.path))?.label || 'Dashboard';

  return (
    <div className="layout-container bg-gray-50 dark:bg-dark-bg">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        width="sm"
        className="sidebar-drawer"
      >
        <SidebarHeader onClose={() => setSidebarOpen(false)} showCloseButton={false} className="!h-14 !min-h-14">
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex items-center space-x-2">
              <PersonIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <span className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {user?.name || 'Menu'}
              </span>
            </div>
            <IconButton
              icon={<Cross1Icon />}
              aria-label="Close sidebar"
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        </SidebarHeader>

        <SidebarContent className="!p-3">
          <div className="space-y-1">
            {visibleNavItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link key={item.key} href={item.path} onClick={handleNavClick}>
                  <div className={`
                    flex items-center space-x-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                    ${active
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }
                  `}>
                    <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span className="flex-1 font-medium">{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </SidebarContent>

        <SidebarFooter className="pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button
            variant="destructive"
            fullWidth
            leftIcon={<ExitIcon />}
            onClick={handleLogout}
            className="!justify-start mb-3"
          >
            Logout
          </Button>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 dark:text-gray-400">v0.0.0</span>
            <ThemeToggle />
          </div>
        </SidebarFooter>
      </Sidebar>

      <div className="main-area">
        <header className="header bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700">
          <div className="header-inner flex items-center justify-between h-14 px-4">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <IconButton
                icon={<HamburgerMenuIcon className="w-5 h-5" />}
                aria-label="Open menu"
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="flex-shrink-0 -ml-2"
              />
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
