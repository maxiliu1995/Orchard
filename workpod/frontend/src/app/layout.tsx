// src/app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { ClientLayout } from './ClientLayout';
import { Toaster } from 'sonner';
import { Providers } from './providers';
import { StoreDebug } from '@/components/debug/StoreDebug';
import { CorsTest } from '@/components/debug/CorsTest';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'WorkPod',
  description: 'A modern workspace management platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('RootLayout - Rendering');
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className={inter.className}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
          <Toaster />
          <StoreDebug />
          <CorsTest />
        </Providers>
      </body>
    </html>
  );
}
