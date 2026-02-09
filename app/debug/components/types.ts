export interface TableInfo {
  name: string;
  rowCount: number;
}

export interface QueryResult {
  columns: string[];
  rows: Record<string, unknown>[];
  error?: string;
  affectedRows?: number;
}

export const SortDirection = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

export type SortDirection = (typeof SortDirection)[keyof typeof SortDirection] | null;

export const DbStatus = {
  CHECKING: 'checking',
  CONNECTED: 'connected',
  ERROR: 'error',
} as const;

export type DbStatus = (typeof DbStatus)[keyof typeof DbStatus];
