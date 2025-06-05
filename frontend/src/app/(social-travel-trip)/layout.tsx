'use client';

import { SidebarNav } from '@/components/common/side-bar';
import { TabMenu } from '@/components/common/TabMenu';
import { TopbarNav } from '@/components/common/top-bar';
import { ReactNode } from 'react';

/**
 * Layout component for TravelLog pages
 * @param props Component props
 * @param props.children Child components
 */
export default function SocialTravelTripLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <SidebarNav />
            <div className="flex-1 w-full lg:pl-80">
                <TopbarNav />
                <main className="px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 max-w-[1600px] mx-auto">
                    <TabMenu />
                    <div className="container mx-auto px-2 sm:px-0">
                        {children}
                    </div>
                </main>
            </div>
        </div >
    );
}
