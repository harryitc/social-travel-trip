import { ReactNode } from "react";
import { TabMenu } from "@/components/common/TabMenu";
import { WebSocketProvider } from "@/lib/providers/websocket.provider";
import { GroupChatHeader } from "@/features/trips/components";

type GroupChatLayoutProps = {
    children: ReactNode;
    groups: ReactNode;
};

export default function GroupChatLayout({
    children, groups
}: GroupChatLayoutProps) {
    return (
        <>
            <TabMenu />
            <div className="flex h-[100vh] bg-gray-50 dark:bg-gray-900">
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Header with breadcrumb and notifications */}
                    <GroupChatHeader />
                    <WebSocketProvider>
                        {/* Main 3-column layout */}
                        <div className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 p-4 gap-4">
                            {/* Left column - Groups list */}
                            {groups}

                            {/* Center column - Chat area */}
                            {/* {chat} */}

                            {/* Right column - Group details */}
                            {/* {details} */}
                            {/* Default children content (for fallback routes) */}
                            {children}
                        </div>

                    </WebSocketProvider>
                </div>
            </div>
        </>
    );
}
