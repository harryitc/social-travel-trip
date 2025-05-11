'use client';
import MenuAntd from '@/components/common/menu';
import LogViewer from '@/components/ui/log-viewer';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Layout } from 'antd';

const { Header, Sider, Content } = Layout;
export default function Default({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Layout className="h-screen">
      {/* Sidebar */}
      <Sider className="bg-white shadow-md">
        <div className="p-4 text-lg font-bold text-center">Eduzaa</div>
        <MenuAntd></MenuAntd>
      </Sider>

      <Layout>
        {/* Header */}
        <Header className="bg-blue-500 text-white p-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Dashboard</h1>
          <Avatar icon={<UserOutlined />} />
        </Header>

        {/* Main Content */}
        <Content className="p-6 bg-gray-100">{children}</Content>
      </Layout>
      <LogViewer />
    </Layout>
  );
}
