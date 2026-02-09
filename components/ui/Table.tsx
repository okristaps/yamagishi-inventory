import React from 'react';
import { useTranslation } from 'react-i18next';
import { Cross2Icon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

export interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className = '' }: TableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        {children}
      </table>
    </div>
  );
}

export interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function TableHeader({ children, className = '' }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-50 dark:bg-gray-800 ${className}`}>
      {children}
    </thead>
  );
}

export interface TableBodyProps {
  children: React.ReactNode;
  className?: string;
}

export function TableBody({ children, className = '' }: TableBodyProps) {
  return (
    <tbody className={`divide-y divide-gray-200 dark:divide-gray-700 ${className}`}>
      {children}
    </tbody>
  );
}

export interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export function TableRow({ children, className = '', onClick, hoverable = true }: TableRowProps) {
  const hoverClasses = hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50' : '';
  const clickClasses = onClick ? 'cursor-pointer' : '';

  return (
    <tr
      className={`${hoverClasses} ${clickClasses} ${className}`}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

export interface TableHeadProps {
  children: React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortDirection?: 'asc' | 'desc' | null;
  onSort?: () => void;
}

export function TableHead({
  children,
  className = '',
  sortable = false,
  sortDirection = null,
  onSort
}: TableHeadProps) {
  const sortableClasses = sortable
    ? 'cursor-pointer select-none hover:bg-gray-100 dark:hover:bg-gray-700'
    : '';

  return (
    <th
      className={`px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${sortableClasses} ${className}`}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && (
          <span className="text-gray-400 dark:text-gray-500">
            {sortDirection === 'asc' ? '↑' : sortDirection === 'desc' ? '↓' : '↕'}
          </span>
        )}
      </div>
    </th>
  );
}

export interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
  colSpan?: number;
  title?: string;
}

export function TableCell({ children, className = '', align = 'left', colSpan, title }: TableCellProps) {
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  };

  return (
    <td
      className={`px-4 py-3 text-gray-700 dark:text-gray-300 ${alignClasses[align]} ${className}`}
      colSpan={colSpan}
      title={title}
    >
      {children}
    </td>
  );
}

export interface TableContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function TableContainer({ children, className = '' }: TableContainerProps) {
  return (
    <div className={`bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export interface TableToolbarProps {
  title?: string;
  subtitle?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
}

export function TableToolbar({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  searchPlaceholder,
  children,
  className = '',
}: TableToolbarProps) {
  const { t } = useTranslation();
  const placeholder = searchPlaceholder ?? t('table.search');

  return (
    <div className={`p-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {(title || subtitle) && (
          <div>
            {title && (
              <h3 className="font-medium text-gray-900 dark:text-gray-100">
                {title}
                {subtitle && (
                  <span className="ml-2 text-sm font-normal text-gray-500">{subtitle}</span>
                )}
              </h3>
            )}
          </div>
        )}
        <div className="flex items-center gap-3">
          {onSearchChange && (
            <div className="relative flex items-center">
              <MagnifyingGlassIcon className="absolute left-3 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchValue || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={placeholder}
                className="pl-9 pr-9 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-input text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-800 focus:border-gray-500 dark:focus:border-gray-400 w-48"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  aria-label={t('common.clear')}
                >
                  <Cross2Icon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export interface TableFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function TableFooter({ children, className = '' }: TableFooterProps) {
  return (
    <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 ${className}`}>
      {children}
    </div>
  );
}

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  totalRows: number;
  rowsPerPage: number;
  rowsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  className?: string;
  showRowsPerPage?: boolean;
  showInfo?: boolean;
}

export function TablePagination({
  currentPage,
  totalPages,
  totalRows,
  rowsPerPage,
  rowsPerPageOptions = [10, 25, 50, 100],
  onPageChange,
  onRowsPerPageChange,
  className = '',
  showRowsPerPage = true,
  showInfo = true,
}: TablePaginationProps) {
  const { t } = useTranslation();
  const startRow = totalRows === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);

  return (
    <div className={`px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        {showInfo && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {totalRows > 0
              ? `${t('common.showing')} ${startRow} - ${endRow} ${t('common.of')} ${totalRows}`
              : t('table.noRows')
            }
          </div>
        )}

        <div className="flex items-center gap-3">
          {showRowsPerPage && onRowsPerPageChange && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">{t('common.rows')}</span>
              <select
                value={rowsPerPage}
                onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
                className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-dark-card text-gray-700 dark:text-gray-300"
              >
                {rowsPerPageOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-1">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
              aria-label={t('table.previous')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-2 text-sm text-gray-600 dark:text-gray-400">
              {currentPage} / {totalPages || 1}
            </span>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
              aria-label={t('table.next')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
