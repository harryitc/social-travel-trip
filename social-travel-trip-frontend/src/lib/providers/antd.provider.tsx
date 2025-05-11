'use client';
import '@ant-design/v5-patch-for-react-19';
import { App, ConfigProvider, theme } from 'antd';
import { useServerInsertedHTML } from 'next/navigation';
import { useMemo, useRef } from 'react';
import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import type Entity from '@ant-design/cssinjs/es/Cache';
import { useThemeModeStore } from '@/components/common/theme-mode/stores/theme-mode.store';
export default function AntdProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cache = useMemo<Entity>(() => createCache(), []);
  const isInsert = useRef(false);
  const { isDarkMode } = useThemeModeStore();

  useServerInsertedHTML(() => {
    // avoid duplicate css insert
    // refs: https://github.com/vercel/next.js/discussions/49354#discussioncomment-6279917
    if (isInsert.current) return;
    isInsert.current = true;

    return <style id="antd" dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />;
  });
  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Carousel: {
            arrowOffset: 20,
            arrowSize: 25
          },
        }
      }}
    >
      <StyleProvider cache={cache}>
        <App>{children}</App>
      </StyleProvider>
    </ConfigProvider>
  );
}
