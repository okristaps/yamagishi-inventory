'use client';

import { useTranslation } from 'react-i18next';
import { Button, Card, Alert } from '@/components/ui';
import { ReloadIcon } from '@radix-ui/react-icons';
import { DbStatus } from './types';

interface DatabaseStatusProps {
  status: DbStatus;
  errorMessage: string | null;
  isLoading: boolean;
  onReload: () => void;
}

export function DatabaseStatus({ status, errorMessage, isLoading, onReload }: DatabaseStatusProps) {
  const { t } = useTranslation();

  const statusColor = status === DbStatus.CONNECTED
    ? 'bg-green-500'
    : status === DbStatus.ERROR
      ? 'bg-red-500'
      : 'bg-yellow-500';

  const statusText = status === DbStatus.CONNECTED
    ? t('debug.databaseConnected')
    : status === DbStatus.ERROR
      ? t('debug.connectionError')
      : t('debug.checking');

  return (
    <Card padding="sm" className="!p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColor}`} />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {statusText}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onReload}
          disabled={isLoading}
        >
          <ReloadIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      {errorMessage && (
        <Alert severity="error" className="mt-2">
          {errorMessage}
        </Alert>
      )}
    </Card>
  );
}
