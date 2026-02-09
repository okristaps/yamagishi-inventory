'use client';

import { useTranslation } from 'react-i18next';
import { Button, Card, CardHeader, CardTitle, CardContent, Textarea, Alert } from '@/components/ui';
import { PlayIcon } from '@radix-ui/react-icons';
import { QueryResult } from './types';
import { sanitizeErrorMessage } from './utils';

interface QueryEditorProps {
  query: string;
  queryResult: QueryResult | null;
  isLoading: boolean;
  onQueryChange: (query: string) => void;
  onExecute: () => void;
  onClear: () => void;
}

export function QueryEditor({
  query,
  queryResult,
  isLoading,
  onQueryChange,
  onExecute,
  onClear,
}: QueryEditorProps) {
  const { t } = useTranslation();

  return (
    <Card padding="sm" className="!p-4">
      <CardHeader className="!mb-3">
        <CardTitle className="!text-base">
          {t('debug.customQuery')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t('debug.queryPlaceholder')}
          className="h-24 font-mono resize-none"
        />
        <div className="mt-2 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={onExecute}
            disabled={isLoading || !query.trim()}
            rightIcon={<PlayIcon />}
          >
            {t('common.execute')}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
          >
            {t('common.clear')}
          </Button>
        </div>

        {queryResult && (
          <div className="mt-4">
            {sanitizeErrorMessage(queryResult.error) ? (
              <Alert severity="error">
                {sanitizeErrorMessage(queryResult.error)}
              </Alert>
            ) : queryResult.affectedRows !== undefined ? (
              <Alert severity="success">
                {t('debug.queryExecuted')} {queryResult.affectedRows}
              </Alert>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {queryResult.rows.length} {t('debug.rowsReturned')}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
