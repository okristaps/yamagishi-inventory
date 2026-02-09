export function isValidErrorMessage(msg: string | undefined | null): boolean {
  if (!msg) return false;
  const trimmed = msg.trim();
  return trimmed !== '' && trimmed !== '{}' && trimmed !== '[]';
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return isValidErrorMessage(error.message) ? error.message : fallback;
  }
  if (typeof error === 'string') {
    return isValidErrorMessage(error) ? error : fallback;
  }
  if (error && typeof error === 'object') {
    const axiosMsg = (error as Record<string, unknown>).response as
      | Record<string, unknown>
      | undefined;
    if (axiosMsg?.data) {
      const dataMsg = (axiosMsg.data as Record<string, unknown>).message;
      if (typeof dataMsg === 'string' && isValidErrorMessage(dataMsg)) {
        return dataMsg;
      }
    }

    const objMsg = (error as Record<string, unknown>).message;
    if (typeof objMsg === 'string' && isValidErrorMessage(objMsg)) {
      return objMsg;
    }
    const values = (error as Record<string, unknown>).values as
      | Record<string, unknown>
      | undefined;
    if (
      values?.message &&
      typeof values.message === 'string' &&
      isValidErrorMessage(values.message)
    ) {
      return values.message;
    }

    try {
      const str = JSON.stringify(error);
      if (isValidErrorMessage(str)) {
        return str;
      }
    } catch {}
  }
  return fallback;
}

export function sanitizeErrorMessage(
  error: string | undefined,
): string | undefined {
  if (!error || error === '{}' || error === '[]' || error.trim() === '') {
    return undefined;
  }
  return error;
}

export function formatValue(value: unknown, column?: string): string {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toLocaleString();
    }
    const str = JSON.stringify(value);
    return str === '{}'
      ? '(empty object)'
      : str === '[]'
        ? '(empty array)'
        : str;
  }

  if (
    typeof value === 'string' &&
    column &&
    (column.includes('_at') ||
      column.includes('date') ||
      column.includes('Date'))
  ) {
    const date = new Date(value);
    if (!isNaN(date.getTime()) && value.includes('T')) {
      return date.toLocaleString();
    }
  }
  return String(value);
}
