'use client';
import { usePageHeader } from '@/components/HeaderContext';
import { IconButton } from '@/components/ui';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

export default function Settings() {
  // Example: Set custom header content for this page
  usePageHeader({
    title: 'Settings',
    subtitle: 'App configuration',
    rightContent: (
      <IconButton
        icon={<MagnifyingGlassIcon />}
        aria-label="Search settings"
        variant="ghost"
        size="sm"
      />
    ),
  });

  return (
    <div className="p-4">
      <div className="space-y-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">General</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure general app settings
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Account</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage your account settings
          </p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Notifications</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Configure notification preferences
          </p>
        </div>
      </div>
    </div>
  );
}
