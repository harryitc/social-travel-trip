import { ReactNode } from "react";

/**
 * Layout component for Groups Chat pages
 * @param props Component props
 * @param props.children Child components
 */
export default function GroupChatLayout({ children }: { children: ReactNode }) {
    return (
        {children}
    );
}
