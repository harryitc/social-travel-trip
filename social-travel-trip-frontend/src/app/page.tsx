"use client";

import { ForumPage } from "@/features/forum";
import { TabMenu } from "@/components/common/TabMenu";
import { App } from "antd";

export default function Home() {
  // Initialize Ant Design App context
  App.useApp();

  return (
    <>
      <TabMenu />
      <div className="container mx-auto px-2 sm:px-0">
        <ForumPage />
      </div>
    </>
  );
}
