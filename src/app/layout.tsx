import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';
import { cn } from '@/lib/utils';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'T-MobiliCheck',
  description: 'App móvil de Orden de Mantenimiento Preventivo Trimestral',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={cn('min-h-screen bg-gray-50 font-body antialiased', inter.variable)}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
