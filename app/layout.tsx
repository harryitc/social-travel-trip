import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import { TopbarNav } from '@/components/layout/top-bar';
import { SidebarNav } from '@/components/layout/side-bar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TripTribe - Mạng xã hội du lịch',
  description: 'Kết nối những người đam mê du lịch',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.className} bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 min-h-screen`}>
        <Providers>
          <div className="flex min-h-screen">
            <div className="fixed inset-y-0 z-50 w-64 hidden lg:block">
              <SidebarNav />
            </div>
            <div className="flex-1 lg:pl-64">
              <TopbarNav />
              <main className="px-4 sm:px-6 md:px-8 py-6">
                {children}
              </main>
            </div>
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}