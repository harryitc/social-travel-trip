import { ReactNode } from "react";
import { TabMenu } from "@/components/common/TabMenu";

type GroupChatLayoutProps = {
    children: ReactNode;
    groups: ReactNode;
    chat: ReactNode;
    details: ReactNode;
    breadcrumb: ReactNode;
};

/**
 * Layout component for Groups Chat with 3-column fixed layout using Parallel Routes
 * - @groups: Left column - Group list
 * - @chat: Center column - Chat area
 * - @details: Right column - Group details
 * - @breadcrumb: Breadcrumb navigation
 * - children: Default route content
 */
export default function GroupChatLayout({
    children, groups, chat, details, breadcrumb
}: GroupChatLayoutProps) {
    return (
        <>
            <TabMenu />
            <div className="flex h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Breadcrumb */}
                    {breadcrumb}

                    {/* Main 3-column layout */}
                    <div className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 p-4 gap-4">
                        {/* Left column - Groups list */}
                        {groups}

                        {/* Center column - Chat area */}
                        {chat}

                        {/* Right column - Group details */}
                        {details}
                    </div>

                    {/* Default children content (for fallback routes) */}
                    {children}
                </div>
            </div>
        </>
    );
}
