import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/google-maps-override.css"; // Import CSS để ẩn UI của Google Maps
import { SidebarNav } from "@/components/common/side-bar";
import { TopbarNav } from "@/components/common/top-bar";
import { Toaster } from "@/components/ui/radix-ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'TripTribe - Mạng xã hội du lịch',
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
import { WebSocketProvider } from "@/lib/providers/websocket.provider";
import { NotificationListener } from "@/features/notifications/notification-listener";

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
            <WebSocketProvider>
              <NotificationListener />
              <div className="flex min-h-screen">
                <SidebarNav />
                <div className="flex-1 w-full lg:pl-80">
                  <TopbarNav />
                  <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto">
                    {children}
                  </main>
                </div>
              </div>
            </WebSocketProvider>
          </ThemeProvider>
        </AntdProviderLayout>
        <Toaster />
      </body>
    </html>
  );
}
