import React, { useState } from 'react';
import { Layout, Menu, Typography, Tabs } from 'antd';
import { 
  TemplateOutlined, 
  TeamOutlined, 
  CalendarOutlined, 
  PlusOutlined,
  SettingOutlined
} from '@ant-design/icons';
import TemplatesList from './TemplatesList';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { TabPane } = Tabs;

const PlanningPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('templates');
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider 
        collapsible 
        collapsed={collapsed} 
        onCollapse={setCollapsed}
        theme="light"
        style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
      >
        <div className="logo p-4 flex items-center justify-center">
          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
            {collapsed ? 'ST' : 'Social Travel'}
          </Title>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['templates']}
          selectedKeys={[activeTab]}
          onClick={({ key }) => setActiveTab(key as string)}
          items={[
            {
              key: 'templates',
              icon: <TemplateOutlined />,
              label: 'Mẫu kế hoạch'
            },
            {
              key: 'myplans',
              icon: <CalendarOutlined />,
              label: 'Kế hoạch của tôi'
            },
            {
              key: 'groups',
              icon: <TeamOutlined />,
              label: 'Nhóm của tôi'
            },
            {
              key: 'create',
              icon: <PlusOutlined />,
              label: 'Tạo kế hoạch mới'
            },
            {
              key: 'settings',
              icon: <SettingOutlined />,
              label: 'Cài đặt'
            }
          ]}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: '24px', background: '#fff', padding: '24px', borderRadius: '8px' }}>
          {activeTab === 'templates' && <TemplatesList />}
          {activeTab === 'myplans' && <div>Kế hoạch của tôi (Đang phát triển)</div>}
          {activeTab === 'groups' && <div>Nhóm của tôi (Đang phát triển)</div>}
          {activeTab === 'create' && <div>Tạo kế hoạch mới (Đang phát triển)</div>}
          {activeTab === 'settings' && <div>Cài đặt (Đang phát triển)</div>}
        </Content>
      </Layout>
    </Layout>
  );
};

export default PlanningPage;
