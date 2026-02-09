'use client';
import '@/lib/i18n';

import 'tailwindcss/tailwind.css';
/* Basic CSS reset and normalization */
import 'normalize.css/normalize.css';

import '../styles/global.css';
import '../styles/variables.css';
import '../styles/simple-layout.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { KeyboardHandler } from '@/components/KeyboardHandler';
import { AuthProvider } from '@/components/AuthProvider';
import { QueryProvider } from '@/components/QueryProvider';
import { ToastProvider } from '@/components/ui/Toast';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, viewport-fit=cover" />
        <title>Yamagishi Inventory</title>
        <meta name="description" content="Inventory management app" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function getThemePreference() {
                  const savedTheme = localStorage.getItem('theme');
                  if (savedTheme === 'light') return 'light';
                  if (savedTheme === 'dark') return 'dark';
                  if (savedTheme === 'system' || !savedTheme) {
                    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  return 'light';
                }
                
                const theme = getThemePreference();
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
                
                // Prevent flash by setting color scheme immediately
                document.documentElement.style.colorScheme = theme;
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <KeyboardHandler />
        <QueryProvider>
          <ThemeProvider>
            <ToastProvider>
              <AuthProvider>
                {children}
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
