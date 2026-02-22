export const config = {
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  loginEndpoint: process.env.NEXT_PUBLIC_LOGIN_ENDPOINT ?? '',
} as const;
