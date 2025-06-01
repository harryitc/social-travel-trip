'use client';
import { BulbOutlined, MoonFilled, SunFilled } from '@ant-design/icons';
import { useThemeModeStore } from './stores/theme-mode.store';
import { useEffect } from 'react';
import { Switch, Tooltip } from 'antd';

export default function ThemeMode() {
  const { isDarkMode, toggleDarkMode } = useThemeModeStore();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  return (
    <>
      <Tooltip title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}>
        <Switch
          checkedChildren={<BulbOutlined />}
          unCheckedChildren={<BulbOutlined />}
          checked={isDarkMode}
          onChange={toggleDarkMode}
        />
      </Tooltip>
    </>
  );
}
