'use client';
import '@/lib/i18n';

import 'tailwindcss/tailwind.css';
/* Basic CSS reset and normalization */
import 'normalize.css/normalize.css';

import '../styles/global.css';
import '../styles/variables.css';

// Metadata moved to head.tsx or handled differently for client components

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <title>Yamagishi Inventory</title>
        <meta name="description" content="Inventory management app" />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
