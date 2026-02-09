export const AuthState = {
  CHECKING: 'checking',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
} as const;

export type AuthState = (typeof AuthState)[keyof typeof AuthState];
