'use client';

import { useState } from 'react';
import { FloatButton, Drawer, List, Tag, Typography, Button, Tooltip } from 'antd';
import { BugOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLogStore, LogEntry } from '@/stores/log-store';

const { Text } = Typography;

const LogViewer = () => {
  const [open, setOpen] = useState(false);
  const { logs, clearLogs } = useLogStore();

  const getStatusColor = (status: LogEntry['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'pending':
        return 'processing';
      default:
        return 'default';
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString();
  };

  return (
    <>
      <FloatButton
        icon={<BugOutlined />}
        onClick={() => setOpen(true)}
        type="primary"
        style={{ right: 94 }}
        tooltip="View Logs"
      />

      <Drawer
        title={
          <div className="flex justify-between items-center">
            <span>System Logs</span>
            <Tooltip title="Clear Logs">
              <Button 
                icon={<DeleteOutlined />} 
                onClick={clearLogs}
                type="text"
                danger
              />
            </Tooltip>
          </div>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        width={500}
      >
        <List
          dataSource={logs}
          renderItem={(log) => (
            <List.Item>
              <div className="w-full">
                <div className="flex justify-between items-center mb-1">
                  <Tag color={getStatusColor(log.status)}>
                    {log.status.toUpperCase()}
                  </Tag>
                  <Text type="secondary" className="text-xs">
                    {formatTime(log.timestamp)}
                  </Text>
                </div>
                <Text strong className="block">
                  {log.serviceName}
                </Text>
                <Text className="block">{log.message}</Text>
                {log.duration && (
                  <Text type="secondary" className="text-xs">
                    Duration: {log.duration}ms
                  </Text>
                )}
                {log.error && (
                  <Text type="danger" className="block mt-1">
                    Error: {log.error}
                  </Text>
                )}
              </div>
            </List.Item>
          )}
        />
      </Drawer>
    </>
  );
};

export default LogViewer;