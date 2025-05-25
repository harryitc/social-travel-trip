import { ReactNode } from "react";

type MiniBlogLayoutProps = {
    children: ReactNode;
};

export default function MiniBlogLayout({
    children
}: MiniBlogLayoutProps) {
    return (
        <>
            {children}
        </>
    );
}
