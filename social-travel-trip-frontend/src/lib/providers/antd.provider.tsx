'use client';
import '@ant-design/v5-patch-for-react-19';
import { App, ConfigProvider, theme } from 'antd';
import { useThemeModeStore } from '@/components/common/theme-mode/stores/theme-mode.store';
import { AntdRegistry } from '@ant-design/nextjs-registry';

export default function AntdProviderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isDarkMode } = useThemeModeStore();

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
          components: {
            // Carousel: {
            //   arrowOffset: 20,
            //   arrowSize: 25
            // },
          },
        }}
      >
          {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}
