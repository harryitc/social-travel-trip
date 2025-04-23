'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
import { viVN } from '@clerk/localizations';
import { TripProvider } from '@/components/planning/trip-context';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
      localization={viVN}
    >
      <ThemeProvider attribute="class" defaultTheme="light">
        <TripProvider>
          {children}
        </TripProvider>
      </ThemeProvider>
    </ClerkProvider>
  );
}