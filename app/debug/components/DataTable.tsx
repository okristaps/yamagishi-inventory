'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks';
import {
  IconButton,
  ConfirmPopover,
  Table,
  TableContainer,
  TableToolbar,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TablePagination,
} from '@/components/ui';
import { TrashIcon } from '@radix-ui/react-icons';
import { QueryResult, SortDirection } from './types';
import { formatValue, sanitizeErrorMessage } from './utils';

interface DataTableProps {
  data: QueryResult;
  selectedTable: string | null;
  isQueryResult: boolean;
  onDeleteRow: (tableName: string, row: Record<string, unknown>) => void;
}

export function DataTable({ data, selectedTable, isQueryResult, onDeleteRow }: DataTableProps) {
  const { t } = useTranslation();

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === SortDirection.ASC) {
        setSortDirection(SortDirection.DESC);
      } else if (sortDirection === SortDirection.DESC) {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection(SortDirection.ASC);
      }
    } else {
      setSortColumn(column);
      setSortDirection(SortDirection.ASC);
    }
    setCurrentPage(1);
  };

  const { paginatedRows, totalPages, totalRows } = useMemo(() => {
    if (!data || data.error || data.rows.length === 0) {
      return { paginatedRows: [], totalPages: 0, totalRows: 0 };
    }

    let rows = [...data.rows];

    if (debouncedSearchTerm.trim()) {
      const term = debouncedSearchTerm.toLowerCase();
      rows = rows.filter(row =>
        data.columns.some(col => {
          const value = row[col];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(term);
        })
      );
    }

    // Sort
    if (sortColumn && sortDirection) {
      rows.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (aVal === null || aVal === undefined) return sortDirection === SortDirection.ASC ? 1 : -1;
        if (bVal === null || bVal === undefined) return sortDirection === SortDirection.ASC ? -1 : 1;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === SortDirection.ASC ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        const comparison = aStr.localeCompare(bStr);
        return sortDirection === SortDirection.ASC ? comparison : -comparison;
      });
    }

    const totalRows = rows.length;
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedRows = rows.slice(startIndex, startIndex + rowsPerPage);

    return { paginatedRows, totalPages, totalRows };
  }, [data, debouncedSearchTerm, sortColumn, sortDirection, currentPage, rowsPerPage]);

  const isViewingTable = selectedTable && !isQueryResult;
  const title = isQueryResult ? t('debug.queryResults') : selectedTable || t('debug.data');

  if (!data.columns.length) {
    return null;
  }

  return (
    <TableContainer>
      <TableToolbar
        title={title}
        subtitle={`(${totalRows} ${t('common.rows')})`}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={t('debug.searchAllColumns')}
      />

      {sanitizeErrorMessage(data.error) ? (
        <div className="p-4 text-red-500">{sanitizeErrorMessage(data.error)}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow hoverable={false}>
              {data.columns.map((col) => (
                <TableHead
                  key={col}
                  sortable
                  sortDirection={sortColumn === col ? sortDirection : null}
                  onSort={() => handleSort(col)}
                >
                  {col}
                </TableHead>
              ))}
              {isViewingTable && (
                <TableHead className="text-right">{t('common.actions')}</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRows.length === 0 ? (
              <TableRow hoverable={false}>
                <TableCell
                  className="py-8 text-center text-gray-500 dark:text-gray-400"
                  colSpan={data.columns.length + (isViewingTable ? 1 : 0)}
                >
                  {searchTerm ? t('common.noMatchingRows') : t('common.noRows')}
                </TableCell>
              </TableRow>
            ) : (
              paginatedRows.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {data.columns.map((col) => (
                    <TableCell
                      key={col}
                      className="whitespace-nowrap max-w-xs truncate"
                      title={formatValue(row[col], col)}
                    >
                      {formatValue(row[col], col)}
                    </TableCell>
                  ))}
                  {isViewingTable && (
                    <TableCell align="right">
                      <ConfirmPopover
                        title={t('debug.deleteRow')}
                        description={t('debug.deleteRowConfirm', {
                          id: (row as Record<string, unknown>).id ?? Object.values(row)[0]
                        })}
                        confirmText={t('common.delete')}
                        variant="destructive"
                        onConfirm={() => onDeleteRow(selectedTable!, row as Record<string, unknown>)}
                      >
                        <IconButton
                          icon={<TrashIcon />}
                          aria-label={t('debug.deleteRow')}
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        />
                      </ConfirmPopover>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}

      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalRows={totalRows}
        rowsPerPage={rowsPerPage}
        onPageChange={setCurrentPage}
        onRowsPerPageChange={(rows) => {
          setRowsPerPage(rows);
          setCurrentPage(1);
        }}
      />
    </TableContainer>
  );
}
