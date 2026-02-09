'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageHeader } from '@/components/HeaderContext';
import { AppDataSource, DatabaseService } from '@/database/typeorm.config';
import {
  TableInfo,
  QueryResult,
  DbStatus,
  getErrorMessage,
  DatabaseStatus,
  TablesList,
  QueryEditor,
  DataTable,
} from './components';

export default function DebugPage() {
  const { t } = useTranslation();
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [tableData, setTableData] = useState<QueryResult | null>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState<DbStatus>(DbStatus.CHECKING);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  usePageHeader({
    title: t('debug.title'),
    subtitle: t('debug.subtitle'),
  });

  useEffect(() => {
    initializeAndLoadTables();
  }, []);

  const initializeAndLoadTables = async () => {
    setIsLoading(true);
    setDbStatus(DbStatus.CHECKING);
    setErrorMessage(null);

    try {
      await DatabaseService.initialize();
      setDbStatus(DbStatus.CONNECTED);
      await loadTables();
    } catch (error) {
      console.error('Database initialization error:', error);
      setDbStatus(DbStatus.ERROR);
      setErrorMessage(getErrorMessage(error, t('debug.failedToInitialize')));
    } finally {
      setIsLoading(false);
    }
  };

  const loadTables = async () => {
    try {
      const result = await AppDataSource.query(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
      );

      const tablesWithCount: TableInfo[] = await Promise.all(
        result.map(async (row: { name: string }) => {
          try {
            const countResult = await AppDataSource.query(`SELECT COUNT(*) as count FROM "${row.name}"`);
            return {
              name: row.name,
              rowCount: countResult[0]?.count || 0,
            };
          } catch {
            return { name: row.name, rowCount: 0 };
          }
        })
      );

      setTables(tablesWithCount);
    } catch (error) {
      console.error('Failed to load tables:', error);
      setErrorMessage(t('debug.failedToLoadTables'));
    }
  };

  const loadTableData = async (tableName: string) => {
    setIsLoading(true);
    setSelectedTable(tableName);
    setQueryResult(null);

    try {
      const columnsResult = await AppDataSource.query(`PRAGMA table_info("${tableName}")`);
      const columns = columnsResult.map((col: { name: string }) => col.name);
      const rows = await AppDataSource.query(`SELECT * FROM "${tableName}"`);

      setTableData({ columns, rows });
    } catch (error) {
      console.error('Failed to load table data:', error);
      setTableData({
        columns: [],
        rows: [],
        error: getErrorMessage(error, t('debug.failedToLoadData')),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeQuery = async () => {
    if (!customQuery.trim()) return;

    setIsLoading(true);
    setQueryResult(null);

    try {
      const result = await AppDataSource.query(customQuery);

      if (Array.isArray(result) && result.length > 0) {
        setQueryResult({
          columns: Object.keys(result[0]),
          rows: result,
        });
      } else if (Array.isArray(result)) {
        setQueryResult({
          columns: [],
          rows: [],
          affectedRows: 0,
        });
      } else {
        setQueryResult({
          columns: [],
          rows: [],
          affectedRows: result?.changes || result?.affectedRows || 0,
        });
      }

      await loadTables();
    } catch (error) {
      console.error('Query error:', error);
      setQueryResult({
        columns: [],
        rows: [],
        error: getErrorMessage(error, t('debug.queryFailed')),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearQuery = () => {
    setCustomQuery('');
    setQueryResult(null);
  };

  const deleteRow = async (tableName: string, row: Record<string, unknown>) => {
    const idColumn = 'id' in row ? 'id' : Object.keys(row)[0];
    const idValue = row[idColumn];

    setIsLoading(true);

    try {
      await AppDataSource.query(
        `DELETE FROM "${tableName}" WHERE "${idColumn}" = ?`,
        [idValue]
      );

      await loadTableData(tableName);
      await loadTables();
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage(getErrorMessage(error, t('debug.failedToDelete')));
    } finally {
      setIsLoading(false);
    }
  };

  const currentData = useMemo(() => {
    return queryResult && queryResult.rows.length > 0 ? queryResult : tableData;
  }, [queryResult, tableData]);

  const isQueryResult = !!(queryResult && queryResult.rows.length > 0);

  return (
    <div className="p-4 space-y-4">
      <DatabaseStatus
        status={dbStatus}
        errorMessage={errorMessage}
        isLoading={isLoading}
        onReload={initializeAndLoadTables}
      />

      <TablesList
        tables={tables}
        selectedTable={selectedTable}
        isLoading={isLoading}
        onSelectTable={loadTableData}
      />

      <QueryEditor
        query={customQuery}
        queryResult={queryResult}
        isLoading={isLoading}
        onQueryChange={setCustomQuery}
        onExecute={executeQuery}
        onClear={handleClearQuery}
      />

      {currentData && currentData.columns.length > 0 && (
        <DataTable
          data={currentData}
          selectedTable={selectedTable}
          isQueryResult={isQueryResult}
          onDeleteRow={deleteRow}
        />
      )}
    </div>
  );
}
