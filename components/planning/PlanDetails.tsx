import React, { useState } from 'react';
import { TravelPlanTemplate, Activity } from './mock-data';
import { TripGroup, TripMember } from './trip-groups-data';
import {
  Card,
  Typography,
  Tabs,
  Timeline,
  Button,
  Divider,
  Tag,
  Avatar,
  List,
  Modal,
  Form,
  Input,
  TimePicker,
  message
} from 'antd';
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  TeamOutlined,
  CalendarOutlined,
  SaveOutlined,
  ExportOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

interface PlanDetailsProps {
  group: TripGroup;
  template: TravelPlanTemplate;
}

const PlanDetails: React.FC<PlanDetailsProps> = ({ group, template }) => {
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Generate dates based on group's start date
  const generateDates = () => {
    const dateRange = group.date.split(' - ');
    const startDate = dayjs(dateRange[0], 'DD/MM/YYYY');

    return template.days.map((day, index) => {
      return {
        ...day,
        date: startDate.add(index, 'day').toDate()
      };
    });
  };

  const days = generateDates();

  // Handle edit activity
  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    form.setFieldsValue({
      title: activity.title,
      time: dayjs(activity.time, 'HH:mm'),
      description: activity.description,
      location: activity.location
    });
    setIsModalVisible(true);
  };

  // Handle save activity
  const handleSaveActivity = () => {
    form.validateFields().then((values: any) => {
      // Xử lý cập nhật hoạt động với values ở đây
      message.success('Đã cập nhật hoạt động');
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // Handle add new activity
  const handleAddActivity = (_dayId: string) => {
    // Sử dụng tham số dayId khi cần thêm hoạt động vào ngày cụ thể
    setEditingActivity(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  return (
    <div className="plan-details">
      <Card
        bordered={false}
        title={
          <div className="flex justify-between items-center">
            <Title level={4}>{group.title} - Kế hoạch chi tiết</Title>
            <div>
              <Button icon={<SaveOutlined />} style={{ marginRight: 8 }}>
                Lưu thay đổi
              </Button>
              <Button icon={<ExportOutlined />} type="primary">
                Xuất PDF
              </Button>
            </div>
          </div>
        }
      >
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <EnvironmentOutlined />
              <Text>{group.location}</Text>
            </div>
            <Divider type="vertical" />
            <div className="flex items-center gap-2">
              <CalendarOutlined />
              <Text>{group.date}</Text>
            </div>
            <Divider type="vertical" />
            <div className="flex items-center gap-2">
              <TeamOutlined />
              <Text>{group.members.count} thành viên</Text>
            </div>
          </div>

          <Paragraph>
            Kế hoạch này được tạo dựa trên mẫu "{template.name}".
          </Paragraph>

          <div className="flex flex-wrap gap-2 mt-2">
            {group.hashtags.map(tag => (
              <Tag key={tag}>#{tag}</Tag>
            ))}
          </div>
        </div>

        <Tabs activeKey={activeTabKey} onChange={setActiveTabKey}>
          <TabPane tab="Lịch trình theo ngày" key="1">
            {days.map((day, index) => (
              <div key={day.id} className="mb-8">
                <div className="flex justify-between items-center mb-4"
                  style={{
                    background: '#f9f9f9',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    borderLeft: '4px solid #722ed1'
                  }}
                >
                  <Title level={4} style={{ margin: 0 }}>
                    Ngày {index + 1}: {dayjs(day.date).format('DD/MM/YYYY')}
                  </Title>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => handleAddActivity(day.id)}
                  >
                    Thêm hoạt động
                  </Button>
                </div>

                <Timeline mode="left" style={{ padding: '16px 0' }}>
                  {day.activities.map(activity => (
                    <Timeline.Item
                      key={activity.id}
                      label={
                        <Text strong style={{ fontSize: '16px', color: '#722ed1' }}>
                          {activity.time}
                        </Text>
                      }
                      dot={<ClockCircleOutlined style={{ fontSize: '16px', color: '#722ed1' }} />}
                    >
                      <Card
                        size="small"
                        title={activity.title}
                        style={{
                          borderRadius: '8px',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          border: '1px solid #f0f0f0'
                        }}
                        extra={
                          <div>
                            <Button
                              type="text"
                              icon={<EditOutlined />}
                              onClick={() => handleEditActivity(activity)}
                            />
                            <Button
                              type="text"
                              danger
                              icon={<DeleteOutlined />}
                            />
                          </div>
                        }
                      >
                        <Paragraph>{activity.description}</Paragraph>
                        <div className="flex items-center gap-1">
                          <EnvironmentOutlined style={{ color: '#1890ff' }} />
                          <Text type="secondary">{activity.location}</Text>
                        </div>
                      </Card>
                    </Timeline.Item>
                  ))}
                </Timeline>
              </div>
            ))}
          </TabPane>

          <TabPane tab="Thành viên" key="2">
            <List
              itemLayout="horizontal"
              dataSource={group.members.list}
              renderItem={(member: TripMember) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={member.avatar} />}
                    title={
                      <div className="flex items-center gap-2">
                        <Text>{member.name}</Text>
                        {member.role === 'admin' && <Tag color="blue">Quản trị viên</Tag>}
                      </div>
                    }
                    description={`Thành viên nhóm`}
                  />
                </List.Item>
              )}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={editingActivity ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSaveActivity}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="Tên hoạt động"
            rules={[{ required: true, message: 'Vui lòng nhập tên hoạt động' }]}
          >
            <Input placeholder="Nhập tên hoạt động" />
          </Form.Item>

          <Form.Item
            name="time"
            label="Thời gian"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <TimePicker format="HH:mm" placeholder="Chọn thời gian" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <TextArea rows={3} placeholder="Nhập mô tả hoạt động" />
          </Form.Item>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
          >
            <Input placeholder="Nhập địa điểm" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PlanDetails;
