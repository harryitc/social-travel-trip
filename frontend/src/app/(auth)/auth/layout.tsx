'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import WeatherThemeComponent from '@/components/ui/theme-animation/weather';

/**
 * Layout component for authentication pages
 * @param props Component props
 * @param props.children Child components
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950">
      <header className="py-4 px-6 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold">ST</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              TravelLog
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <footer className="py-4 px-6 border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} TravelLog. All rights reserved.
        </div>
      </footer>
      {/* <WeatherThemeComponent /> */}
    </div>
  );
}
