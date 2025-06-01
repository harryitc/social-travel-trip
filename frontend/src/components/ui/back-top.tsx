'use client';
import { ArrowUpOutlined } from '@ant-design/icons';
import { FloatButton } from 'antd';
export default function CustomBackTop() {
  return (
    <FloatButton.BackTop>
      <div className="fixed bottom-6 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition">
        <ArrowUpOutlined className="text-xl" />
      </div>
    </FloatButton.BackTop>
  );
}
