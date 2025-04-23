import React, { useState } from 'react';
import { TravelPlanTemplate, Day, Activity } from './mock-data';
import { TripGroup, getUserGroups } from './trip-groups-data';
import { Modal, Button, List, Avatar, Typography, Divider, message, Tabs, Tag, Tooltip } from 'antd';
import { UserOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

interface ApplyTemplateModalProps {
  isVisible: boolean;
  onClose: () => void;
  template: TravelPlanTemplate | null;
}

const ApplyTemplateModal: React.FC<ApplyTemplateModalProps> = ({ isVisible, onClose, template }) => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('groups');
  const [isApplying, setIsApplying] = useState<boolean>(false);
  
  // Get user groups
  const userGroups = getUserGroups();
  
  // Handle apply template to group
  const handleApplyTemplate = () => {
    if (!selectedGroup || !template) return;
    
    setIsApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      message.success(`Đã áp dụng mẫu kế hoạch "${template.name}" cho nhóm "${userGroups.find(g => g.id === selectedGroup)?.title}"`);
      setIsApplying(false);
      onClose();
    }, 1000);
  };
  
  if (!template) return null;
  
  return (
    <Modal
      title={<Title level={4}>Áp dụng mẫu kế hoạch</Title>}
      open={isVisible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button 
          key="apply" 
          type="primary" 
          onClick={handleApplyTemplate}
          disabled={!selectedGroup || isApplying}
          loading={isApplying}
        >
          Áp dụng
        </Button>
      ]}
    >
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="Chọn nhóm" key="groups">
          <Paragraph>
            Chọn nhóm/chuyến đi bạn muốn áp dụng mẫu kế hoạch này:
          </Paragraph>
          
          <List
            itemLayout="horizontal"
            dataSource={userGroups}
            renderItem={(group) => {
              const isSelected = selectedGroup === group.id;
              const hasPlan = group.hasPlan;
              
              return (
                <List.Item
                  onClick={() => setSelectedGroup(group.id)}
                  className={`cursor-pointer p-3 rounded-lg transition-all ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  style={{ cursor: 'pointer', padding: '12px', borderRadius: '8px', transition: 'all 0.3s ease' }}
                >
                  <List.Item.Meta
                    avatar={<Avatar src={group.image} size={64} shape="square" style={{ borderRadius: '8px' }} />}
                    title={
                      <div className="flex items-center gap-2">
                        <Text strong>{group.title}</Text>
                        {hasPlan && (
                          <Tooltip title="Nhóm này đã có kế hoạch. Nếu áp dụng mẫu mới, kế hoạch cũ sẽ bị ghi đè.">
                            <Tag color="orange" icon={<InfoCircleOutlined />}>Đã có kế hoạch</Tag>
                          </Tooltip>
                        )}
                        {isSelected && <CheckCircleOutlined style={{ color: '#1890ff' }} />}
                      </div>
                    }
                    description={
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Text type="secondary">{group.location}</Text>
                          <Divider type="vertical" />
                          <Text type="secondary">{group.date}</Text>
                        </div>
                        <div className="flex items-center gap-2">
                          <TeamOutlined /> <Text type="secondary">{group.members.count} thành viên</Text>
                          <Divider type="vertical" />
                          <Text type="secondary">{group.duration}</Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </TabPane>
        
        <TabPane tab="Chi tiết mẫu" key="details">
          <div className="mb-4">
            <Title level={4}>{template.name}</Title>
            <div className="flex items-center gap-2 mb-2">
              <Text>{template.destination}</Text>
              <Divider type="vertical" />
              <Text>{template.duration} ngày</Text>
            </div>
            <Paragraph>{template.description}</Paragraph>
            
            <div className="flex flex-wrap gap-2 mt-2">
              {template.tags.map(tag => (
                <Tag key={tag}>#{tag}</Tag>
              ))}
            </div>
          </div>
          
          <Divider />
          
          <div>
            <Title level={5}>Lịch trình chi tiết:</Title>
            
            {template.days.map((day, index) => (
              <div key={day.id} className="mb-6">
                <Title level={5} className="mb-3">Ngày {index + 1}</Title>
                
                <List
                  size="small"
                  dataSource={day.activities}
                  renderItem={(activity) => (
                    <List.Item>
                      <List.Item.Meta
                        title={
                          <div className="flex items-center gap-2">
                            <Text strong>{activity.time}</Text>
                            <Text>{activity.title}</Text>
                          </div>
                        }
                        description={
                          <div>
                            <Text type="secondary">{activity.description}</Text>
                            <div>
                              <Text type="secondary">Địa điểm: {activity.location}</Text>
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </div>
            ))}
          </div>
        </TabPane>
      </Tabs>
    </Modal>
  );
};

export default ApplyTemplateModal;
