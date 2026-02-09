'use client';

import { useTranslation } from 'react-i18next';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { TableIcon } from '@radix-ui/react-icons';
import { TableInfo } from './types';

interface TablesListProps {
  tables: TableInfo[];
  selectedTable: string | null;
  isLoading: boolean;
  onSelectTable: (tableName: string) => void;
}

export function TablesList({ tables, selectedTable, isLoading, onSelectTable }: TablesListProps) {
  const { t } = useTranslation();

  return (
    <Card padding="sm" className="!p-4">
      <CardHeader className="!mb-3">
        <CardTitle className="!text-base flex items-center gap-2">
          <TableIcon className="w-4 h-4" />
          {t('debug.tables')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tables.map((table) => (
            <Button
              key={table.name}
              variant={selectedTable === table.name ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => onSelectTable(table.name)}
            >
              {table.name} ({table.rowCount})
            </Button>
          ))}
          {tables.length === 0 && !isLoading && (
            <p className="text-sm text-gray-500">{t('debug.noTablesFound')}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
