import React, { useState } from 'react';
import { TravelPlanTemplate } from './mock-data';
import { Card, Typography, Tag, Button, Divider, List, Avatar, Tabs, Rate, Tooltip } from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  ShareAltOutlined,
  HeartOutlined,
  HeartFilled,
  DownloadOutlined
} from '@ant-design/icons';
import ApplyTemplateModal from './ApplyTemplateModal';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface TemplateDetailsProps {
  template: TravelPlanTemplate;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className="template-details">
      <Card
        bordered={false}
        cover={
          <div className="relative">
            <img
              alt={template.name}
              src={template.image}
              className="w-full h-64 object-cover"
              style={{ height: '300px', objectFit: 'cover' }}
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px'
              }}
            />
            <div className="absolute bottom-4 left-4 text-white">
              <Title level={2} style={{ color: 'white', margin: 0 }}>{template.name}</Title>
              <div className="flex items-center gap-2 mt-2">
                <EnvironmentOutlined />
                <Text style={{ color: 'white' }}>{template.destination}</Text>
                <Divider type="vertical" style={{ backgroundColor: 'rgba(255,255,255,0.5)' }} />
                <CalendarOutlined />
                <Text style={{ color: 'white' }}>{template.duration} ngày</Text>
              </div>
            </div>
          </div>
        }
        actions={[
          <Tooltip title={isFavorite ? "Bỏ yêu thích" : "Yêu thích"}>
            <Button
              type="text"
              icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
              onClick={() => setIsFavorite(!isFavorite)}
            >
              Yêu thích
            </Button>
          </Tooltip>,
          <Tooltip title="Chia sẻ mẫu kế hoạch">
            <Button type="text" icon={<ShareAltOutlined />}>
              Chia sẻ
            </Button>
          </Tooltip>,
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => setIsModalVisible(true)}
          >
            Áp dụng mẫu
          </Button>
        ]}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Tổng quan" key="1">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Rate disabled defaultValue={template.rating} allowHalf />
                <Text>({template.usageCount} lượt sử dụng)</Text>
              </div>

              <Paragraph>{template.description}</Paragraph>

              <div className="flex items-center gap-2 mt-2">
                <Avatar src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1" />
                <Text>Tạo bởi {template.authorName}</Text>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {template.tags.map(tag => (
                  <Tag key={tag}>#{tag}</Tag>
                ))}
              </div>
            </div>
          </TabPane>

          <TabPane tab="Lịch trình chi tiết" key="2">
            <Tabs
              defaultActiveKey="day-0"
              tabPosition="top"
              type="card"
              className="day-tabs"
              style={{
                marginBottom: '24px',
                background: '#f9f9f9',
                padding: '16px',
                borderRadius: '8px'
              }}
            >
              {template.days.map((day, index) => (
                <TabPane
                  tab={`Ngày ${index + 1}`}
                  key={`day-${index}`}
                  className="day-tab-content"
                >
                  <div className="day-activities" style={{ padding: '16px 0' }}>
                    {/* Loại bỏ tiêu đề ngày trùng lặp */}
                    <List
                      itemLayout="horizontal"
                      dataSource={day.activities}
                      renderItem={(activity) => (
                        <List.Item
                          className="activity-item"
                          style={{
                            padding: '16px',
                            borderRadius: '8px',
                            marginBottom: '12px',
                            border: '1px solid #f0f0f0',
                            background: 'white'
                          }}
                        >
                          <div className="activity-time" style={{
                            minWidth: '80px',
                            textAlign: 'center',
                            borderRight: '1px solid #f0f0f0',
                            paddingRight: '16px'
                          }}>
                            <Text strong style={{ fontSize: '18px', color: '#722ed1' }}>{activity.time}</Text>
                          </div>
                          <div className="activity-content" style={{ marginLeft: '16px', flex: 1 }}>
                            <Title level={5} style={{ marginBottom: '8px' }}>{activity.title}</Title>
                            <Paragraph style={{ marginBottom: '8px' }}>{activity.description}</Paragraph>
                            <div className="activity-location" style={{ display: 'flex', alignItems: 'center' }}>
                              <EnvironmentOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                              <Text type="secondary">{activity.location}</Text>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  </div>
                </TabPane>
              ))}
            </Tabs>
          </TabPane>
        </Tabs>
      </Card>

      <ApplyTemplateModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        template={template}
      />
    </div>
  );
};

export default TemplateDetails;
