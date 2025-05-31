import { ReactNode } from "react";
import { SidebarNav } from "@/components/common/side-bar";
import { TopbarNav } from "@/components/common/top-bar";

type MiniBlogLayoutProps = {
    children: ReactNode;
};

export default function MiniBlogLayout({
    children
}: MiniBlogLayoutProps) {
    return (
        <div className="flex min-h-screen">
            <main className="px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </main>
        </div>
        // <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-purple-950 dark:via-gray-900 dark:to-indigo-950">
        //     <div className="flex min-h-screen">
        //         <SidebarNav />
        //         <div className="flex-1 w-full lg:pl-80">
        //             <TopbarNav />
        //         </div>
        //     </div>
        // </div>
    );
}
