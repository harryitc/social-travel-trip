'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { ClerkProvider } from '@clerk/nextjs';
import { viVN } from '@clerk/localizations';

export function Providers({ children }: { children: ReactNode }) {
  return (
      <ThemeProvider attribute="class" defaultTheme="light">
        {children}
      </ThemeProvider>
    // <ClerkProvider 
    //   publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    //   localization={viVN}
    // >
    // </ClerkProvider>
  );
}