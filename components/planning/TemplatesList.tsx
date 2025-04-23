import React, { useState } from 'react';
import { TravelPlanTemplate, TRAVEL_PLAN_TEMPLATES } from './mock-data';
import { Card, Typography, Tag, Button, Row, Col, Rate, Tooltip, Input, Select, Empty } from 'antd';
import { 
  EnvironmentOutlined, 
  CalendarOutlined,
  SearchOutlined,
  FilterOutlined,
  HeartOutlined,
  HeartFilled,
  DownloadOutlined
} from '@ant-design/icons';
import TemplateDetails from './TemplateDetails';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

const TemplatesList: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TravelPlanTemplate | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  // Filter templates based on search and filters
  const filteredTemplates = TRAVEL_PLAN_TEMPLATES.filter(template => {
    // Search filter
    const searchMatch = 
      searchText === '' || 
      template.name.toLowerCase().includes(searchText.toLowerCase()) ||
      template.destination.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));
    
    // Region filter
    const regionMatch = selectedRegion === null || template.region === selectedRegion;
    
    // Duration filter
    const durationMatch = selectedDuration === null || template.duration === selectedDuration;
    
    return searchMatch && regionMatch && durationMatch;
  });
  
  // Toggle favorite
  const toggleFavorite = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (favorites.includes(templateId)) {
      setFavorites(favorites.filter(id => id !== templateId));
    } else {
      setFavorites([...favorites, templateId]);
    }
  };
  
  // Reset filters
  const resetFilters = () => {
    setSearchText('');
    setSelectedRegion(null);
    setSelectedDuration(null);
  };
  
  // If a template is selected, show its details
  if (selectedTemplate) {
    return (
      <div>
        <Button 
          onClick={() => setSelectedTemplate(null)} 
          className="mb-4"
          style={{ marginBottom: '16px' }}
        >
          ← Quay lại danh sách
        </Button>
        <TemplateDetails template={selectedTemplate} />
      </div>
    );
  }
  
  return (
    <div className="templates-list">
      <div className="mb-6">
        <Title level={3}>Mẫu kế hoạch du lịch</Title>
        <Paragraph>
          Chọn một mẫu kế hoạch du lịch để áp dụng cho chuyến đi của bạn. Các mẫu này đã được chuẩn bị sẵn với lịch trình chi tiết.
        </Paragraph>
      </div>
      
      <div className="filters mb-6" style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={8}>
            <Search
              placeholder="Tìm kiếm mẫu kế hoạch..."
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={12} md={5}>
            <Select
              placeholder="Chọn khu vực"
              style={{ width: '100%' }}
              value={selectedRegion}
              onChange={value => setSelectedRegion(value)}
              allowClear
            >
              <Option value="Miền Bắc">Miền Bắc</Option>
              <Option value="Miền Trung">Miền Trung</Option>
              <Option value="Miền Nam">Miền Nam</Option>
            </Select>
          </Col>
          <Col xs={12} md={5}>
            <Select
              placeholder="Số ngày"
              style={{ width: '100%' }}
              value={selectedDuration}
              onChange={value => setSelectedDuration(value)}
              allowClear
            >
              <Option value={2}>2 ngày</Option>
              <Option value={3}>3 ngày</Option>
              <Option value={4}>4 ngày</Option>
              <Option value={5}>5 ngày</Option>
            </Select>
          </Col>
          <Col xs={24} md={6}>
            <Button onClick={resetFilters} icon={<FilterOutlined />}>
              Xóa bộ lọc
            </Button>
          </Col>
        </Row>
      </div>
      
      {filteredTemplates.length === 0 ? (
        <Empty description="Không tìm thấy mẫu kế hoạch nào phù hợp" />
      ) : (
        <Row gutter={[16, 16]}>
          {filteredTemplates.map(template => (
            <Col xs={24} sm={12} lg={8} key={template.id}>
              <Card
                hoverable
                cover={
                  <div className="relative" style={{ position: 'relative' }}>
                    <img 
                      alt={template.name} 
                      src={template.image} 
                      className="w-full h-48 object-cover"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Button
                      shape="circle"
                      icon={favorites.includes(template.id) ? 
                        <HeartFilled style={{ color: '#ff4d4f' }} /> : 
                        <HeartOutlined />
                      }
                      className="absolute top-2 right-2"
                      style={{ position: 'absolute', top: '8px', right: '8px' }}
                      onClick={(e) => toggleFavorite(template.id, e)}
                    />
                  </div>
                }
                onClick={() => setSelectedTemplate(template)}
              >
                <Title level={5}>{template.name}</Title>
                
                <div className="flex items-center gap-2 mb-2">
                  <EnvironmentOutlined />
                  <Text>{template.destination}</Text>
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <CalendarOutlined />
                  <Text>{template.duration} ngày</Text>
                  <Rate disabled defaultValue={template.rating} allowHalf style={{ fontSize: '14px' }} />
                </div>
                
                <Paragraph ellipsis={{ rows: 2 }}>
                  {template.description}
                </Paragraph>
                
                <div className="flex flex-wrap gap-1 mt-2 mb-3">
                  {template.tags.slice(0, 3).map(tag => (
                    <Tag key={tag}>#{tag}</Tag>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <Text type="secondary">{template.usageCount} lượt sử dụng</Text>
                  <Tooltip title="Áp dụng mẫu này">
                    <Button 
                      type="primary" 
                      icon={<DownloadOutlined />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template);
                      }}
                    >
                      Áp dụng
                    </Button>
                  </Tooltip>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default TemplatesList;
