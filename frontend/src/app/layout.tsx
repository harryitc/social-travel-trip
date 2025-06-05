import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/radix-ui/toaster";
import RouteLoader from "./route-loader"; // sẽ tạo ở bước sau

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'TravelLog - Mạng xã hội du lịch',
  description: 'Kết nối những người đam mê du lịch',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

import 'dayjs/locale/vi';
import AntdProviderLayout from "@/lib/providers/antd.provider";
import { ThemeProvider } from "next-themes";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 min-h-screen`}>
        <AntdProviderLayout>
          <ThemeProvider attribute="class" defaultTheme="light">
              <RouteLoader />
              {children}
          </ThemeProvider>
        </AntdProviderLayout>
        <Toaster />
      </body>
    </html>
  );
}
