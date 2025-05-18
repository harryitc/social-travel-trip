import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/styles/google-maps-override.css"; // Import CSS để ẩn UI của Google Maps
import { ClerkProviders } from "@/lib/providers/clerk.provider";
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
};

import 'dayjs/locale/vi';
import AntdProviderLayout from "@/lib/providers/antd.provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-to-br from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950 min-h-screen`}>
        <ClerkProviders>
          <AntdProviderLayout>
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
          </AntdProviderLayout>
          {/* <ConfigProvider theme={{
            inherit: true,
          }} locale={viVN}>
            <App >

            </App>
            <Toaster />
          </ConfigProvider> */}
          <Toaster />
        </ClerkProviders>
      </body>
    </html>
  );
}
