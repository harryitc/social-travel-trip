'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Tag, Space, Typography, Divider, Row, Col, Progress } from 'antd';
import { 
  ReloadOutlined, 
  DeleteOutlined, 
  DownloadOutlined,
  WifiOutlined,
  DisconnectOutlined,
  ExclamationCircleOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import websocketService from '@/lib/services/websocket.service';

const { Title, Text, Paragraph } = Typography;

interface WebSocketDebugDashboardProps {
  autoRefresh?: boolean;
  refreshInterval?: number;
}

const WebSocketDebugDashboard: React.FC<WebSocketDebugDashboardProps> = ({
  autoRefresh = true,
  refreshInterval = 2000,
}) => {
  const [stats, setStats] = useState<any>(null);
  const [connectionSummary, setConnectionSummary] = useState<string>('');
  const [eventsSummary, setEventsSummary] = useState<any[]>([]);
  const [recentErrors, setRecentErrors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      const [statsData, connSummary, eventsSummaryData, errorsData] = await Promise.all([
        websocketService.getMonitorStats(),
        websocketService.getConnectionSummary(),
        websocketService.getEventsSummary(),
        websocketService.getRecentErrors(10),
      ]);

      setStats(statsData);
      setConnectionSummary(connSummary);
      setEventsSummary(eventsSummaryData);
      setRecentErrors(errorsData);
    } catch (error) {
      console.error('Error refreshing WebSocket debug data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();

    if (autoRefresh) {
      const interval = setInterval(refreshData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const handleClearStats = () => {
    websocketService.clearMonitorStats();
    refreshData();
  };

  const handleExportStats = () => {
    const exportData = websocketService.exportMonitorStats();
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `websocket-stats-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getConnectionIcon = () => {
    if (stats?.connection?.isConnected) {
      return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
    }
    return <DisconnectOutlined style={{ color: '#ff4d4f' }} />;
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return '#52c41a';
    if (rate >= 70) return '#faad14';
    return '#ff4d4f';
  };

  const eventsColumns = [
    {
      title: 'Event',
      dataIndex: 'event',
      key: 'event',
      width: '30%',
    },
    {
      title: 'Success Rate',
      dataIndex: 'successRate',
      key: 'successRate',
      width: '25%',
      render: (rate: number) => (
        <Progress
          percent={rate}
          size="small"
          strokeColor={getSuccessRateColor(rate)}
          format={(percent) => `${percent}%`}
        />
      ),
    },
    {
      title: 'Total',
      dataIndex: 'total',
      key: 'total',
      width: '15%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '30%',
      render: (status: string) => {
        let color = 'green';
        if (status.includes('❌')) color = 'red';
        else if (status.includes('⚠️')) color = 'orange';
        
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const errorsColumns = [
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '25%',
      render: (timestamp: string) => new Date(timestamp).toLocaleTimeString(),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
      render: (type: string) => {
        const colors: Record<string, string> = {
          CONNECTION: 'blue',
          AUTHENTICATION: 'red',
          NETWORK: 'orange',
          EVENT: 'purple',
          SERVER: 'volcano',
        };
        return <Tag color={colors[type] || 'default'}>{type}</Tag>;
      },
    },
    {
      title: 'Message',
      dataIndex: 'message',
      key: 'message',
      width: '55%',
      ellipsis: true,
    },
  ];

  if (!stats) {
    return (
      <Card loading={true} title="WebSocket Debug Dashboard">
        Loading WebSocket statistics...
      </Card>
    );
  }

  return (
    <div style={{ padding: '16px' }}>
      <Card
        title={
          <Space>
            <WifiOutlined />
            WebSocket Debug Dashboard
          </Space>
        }
        extra={
          <Space>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={refreshData}
              loading={isLoading}
            >
              Refresh
            </Button>
            <Button 
              icon={<DeleteOutlined />} 
              onClick={handleClearStats}
              danger
            >
              Clear Stats
            </Button>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleExportStats}
            >
              Export
            </Button>
          </Space>
        }
      >
        {/* Connection Status */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card size="small" title="Connection Status">
              <Space>
                {getConnectionIcon()}
                <Text strong>{connectionSummary}</Text>
              </Space>
              {stats.connection.isConnected && (
                <div style={{ marginTop: 8 }}>
                  <Text type="secondary">
                    Connected for: {Math.round(stats.connection.connectionDuration / 1000)}s
                  </Text>
                </div>
              )}
            </Card>
          </Col>
        </Row>

        {/* Overall Statistics */}
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ margin: 0, color: getSuccessRateColor(stats.successRate) }}>
                  {stats.successRate.toFixed(1)}%
                </Title>
                <Text type="secondary">Success Rate</Text>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ margin: 0 }}>
                  {stats.totalEvents}
                </Title>
                <Text type="secondary">Total Events</Text>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ margin: 0 }}>
                  {stats.connection.reconnectAttempts}
                </Title>
                <Text type="secondary">Reconnect Attempts</Text>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small">
              <div style={{ textAlign: 'center' }}>
                <Title level={3} style={{ margin: 0 }}>
                  {Math.round(stats.uptime / 1000)}s
                </Title>
                <Text type="secondary">Uptime</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Events Summary */}
        <Card size="small" title="Events Summary" style={{ marginTop: 16 }}>
          <Table
            columns={eventsColumns}
            dataSource={eventsSummary.map((item, index) => ({ ...item, key: index }))}
            pagination={false}
            size="small"
            locale={{ emptyText: 'No events recorded yet' }}
          />
        </Card>

        {/* Recent Errors */}
        <Card size="small" title="Recent Errors" style={{ marginTop: 16 }}>
          <Table
            columns={errorsColumns}
            dataSource={recentErrors.map((item, index) => ({ ...item, key: index }))}
            pagination={false}
            size="small"
            locale={{ emptyText: 'No errors recorded' }}
          />
        </Card>

        {/* Debug Info */}
        <Card size="small" title="Debug Information" style={{ marginTop: 16 }}>
          <Row gutter={[16, 8]}>
            <Col span={12}>
              <Text strong>Socket ID:</Text> {stats.connection.socketId || 'N/A'}
            </Col>
            <Col span={12}>
              <Text strong>Events Tracked:</Text> {stats.events.size}
            </Col>
            <Col span={12}>
              <Text strong>Last Error:</Text> {stats.connection.lastError?.message || 'None'}
            </Col>
            <Col span={12}>
              <Text strong>Auto Refresh:</Text> {autoRefresh ? 'Enabled' : 'Disabled'}
            </Col>
          </Row>
        </Card>
      </Card>
    </div>
  );
};

export default WebSocketDebugDashboard;
