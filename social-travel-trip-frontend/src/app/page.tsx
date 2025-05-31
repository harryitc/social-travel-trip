"use client";

import { ForumPage } from "@/features/forum";
import { TabMenu } from "@/components/common/TabMenu";
import { SidebarNav } from "@/components/common/side-bar";
import { TopbarNav } from "@/components/common/top-bar";

export default function Home() {
  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-purple-50 to-white dark:from-gray-950 dark:to-gray-900">
        <SidebarNav />
        <div className="flex-1 w-full lg:pl-80">
          <TopbarNav />
          <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto">
            <div className="mb-4 sm:mb-6 sticky top-16 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md py-2 rounded-lg shadow-sm">
              <TabMenu />
            </div>
            <div className="container mx-auto">
              <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl shadow-sm p-4 sm:p-6 border border-purple-100/50 dark:border-purple-900/30">
                <ForumPage />
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
