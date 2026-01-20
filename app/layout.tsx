'use client';
import '@/lib/i18n';

import 'tailwindcss/tailwind.css';
/* Basic CSS reset and normalization */
import 'normalize.css/normalize.css';

import '../styles/global.css';
import '../styles/variables.css';
import { ThemeProvider } from '@/components/ThemeProvider';

// Metadata moved to head.tsx or handled differently for client components

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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
