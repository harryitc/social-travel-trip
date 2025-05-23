import { ReactNode } from "react";

type GroupChatLayoutProps = {
    children: ReactNode;
};

/**
 * Simple layout component for Groups Chat pages
 * Logic được đưa trực tiếp vào từng page
 */
export default function GroupChatLayout({ children }: GroupChatLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
            {/* Main content area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
}
