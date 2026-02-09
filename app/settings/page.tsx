'use client';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageHeader } from '@/components/HeaderContext';
import { Button, Page } from '@/components/ui';
import { UsersService } from '@/services/usersService';
import { ReloadIcon, PersonIcon } from '@radix-ui/react-icons';

export default function Settings() {
  const { t } = useTranslation();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  usePageHeader({
    title: t('settings.title'),
    subtitle: t('settings.subtitle'),
  });

  const handleSyncUsers = async () => {
    setIsSyncing(true);
    setSyncStatus(null);

    try {
      const result = await UsersService.sync();
      if (result.success) {
        setSyncStatus({
          type: 'success',
          message: t('settings.syncedUsers', { count: result.count }),
        });
      } else {
        setSyncStatus({
          type: 'error',
          message: result.error || t('settings.syncFailed'),
        });
      }
    } catch (error) {
      setSyncStatus({
        type: 'error',
        message: error instanceof Error ? error.message : t('settings.syncFailed'),
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <Page>
      <div className="space-y-4">
        <div className="bg-white dark:bg-dark-card rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-3">{t('settings.dataSync')}</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PersonIcon className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{t('settings.users')}</span>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSyncUsers}
                disabled={isSyncing}
                loading={isSyncing}
                leftIcon={!isSyncing ? <ReloadIcon /> : undefined}
              >
                {isSyncing ? t('settings.syncing') : t('settings.sync')}
              </Button>
            </div>

            {syncStatus && (
              <div className={`text-sm p-2 rounded-lg ${syncStatus.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}>
                {syncStatus.message}
              </div>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
