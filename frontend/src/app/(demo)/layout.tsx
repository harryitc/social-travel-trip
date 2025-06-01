import { ReactNode } from "react";

type DemoLayoutProps = {
    children: ReactNode;
};

export default function DemoLayout({
    children
}: DemoLayoutProps) {
    return (
        <>
            {children}
        </>);
}
