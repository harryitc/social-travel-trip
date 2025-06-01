'use client';

import React, { useState } from 'react';
import { Badge, Tooltip, Popover, Space, Typography, Button, Divider } from 'antd';
import { 
  WifiOutlined, 
  DisconnectOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { useWebSocketConnectionStatus, useWebSocketErrors } from '@/lib/hooks/use-websocket-monitor';

const { Text } = Typography;

interface WebSocketStatusProps {
  showDetails?: boolean;
  size?: 'small' | 'default' | 'large';
  placement?: 'top' | 'bottom' | 'left' | 'right';
}

const WebSocketStatus: React.FC<WebSocketStatusProps> = ({
  showDetails = true,
  size = 'default',
  placement = 'bottom',
}) => {
  const { isConnected, connectionSummary, refresh } = useWebSocketConnectionStatus();
  const { errors, hasNewErrors, markErrorsAsRead } = useWebSocketErrors(3);
  const [popoverVisible, setPopoverVisible] = useState(false);

  const getStatusIcon = () => {
    if (isConnected) {
      return <WifiOutlined style={{ color: '#52c41a' }} />;
    }
    return <DisconnectOutlined style={{ color: '#ff4d4f' }} />;
  };

  const getStatusColor = () => {
    if (!isConnected) return 'red';
    if (hasNewErrors) return 'orange';
    return 'green';
  };

  const getTooltipTitle = () => {
    if (!isConnected) return 'WebSocket Disconnected';
    if (hasNewErrors) return 'WebSocket Connected (with recent errors)';
    return 'WebSocket Connected';
  };

  const handlePopoverVisibleChange = (visible: boolean) => {
    setPopoverVisible(visible);
    if (visible && hasNewErrors) {
      markErrorsAsRead();
    }
  };

  const popoverContent = (
    <div style={{ width: 300 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Connection Status */}
        <div>
          <Space>
            {getStatusIcon()}
            <Text strong>{isConnected ? 'Connected' : 'Disconnected'}</Text>
          </Space>
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {connectionSummary}
            </Text>
          </div>
        </div>

        <Divider style={{ margin: '8px 0' }} />

        {/* Recent Errors */}
        {errors.length > 0 && (
          <div>
            <Text strong style={{ fontSize: '12px' }}>Recent Errors:</Text>
            <div style={{ marginTop: 4, maxHeight: 120, overflowY: 'auto' }}>
              {errors.map((error, index) => (
                <div key={index} style={{ marginBottom: 4 }}>
                  <Space size="small">
                    <ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '10px' }} />
                    <Text style={{ fontSize: '11px' }} type="secondary">
                      {new Date(error.timestamp).toLocaleTimeString()}
                    </Text>
                  </Space>
                  <div style={{ fontSize: '11px', marginLeft: 16 }}>
                    <Text type="danger">{error.type}:</Text> {error.message}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {errors.length === 0 && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            No recent errors
          </Text>
        )}

        <Divider style={{ margin: '8px 0' }} />

        {/* Actions */}
        <Space>
          <Button 
            size="small" 
            icon={<ReloadOutlined />} 
            onClick={refresh}
          >
            Refresh
          </Button>
          <Button 
            size="small" 
            icon={<SettingOutlined />} 
            onClick={() => {
              // Open debug dashboard in new tab
              window.open('/debug/websocket', '_blank');
            }}
          >
            Debug
          </Button>
        </Space>
      </Space>
    </div>
  );

  if (!showDetails) {
    // Simple icon only
    return (
      <Tooltip title={getTooltipTitle()} placement={placement}>
        <Badge 
          status={getStatusColor() as any} 
          dot={hasNewErrors}
        >
          {getStatusIcon()}
        </Badge>
      </Tooltip>
    );
  }

  // Full status with popover
  return (
    <Popover
      content={popoverContent}
      title="WebSocket Status"
      trigger="click"
      placement={placement}
      open={popoverVisible}
      onOpenChange={handlePopoverVisibleChange}
    >
      <div style={{ cursor: 'pointer' }}>
        <Badge 
          count={hasNewErrors ? errors.length : 0}
          size="small"
          offset={[2, -2]}
        >
          <Tooltip title="Click for WebSocket details" placement={placement}>
            <Space size="small">
              {getStatusIcon()}
              {size !== 'small' && (
                <Text style={{ fontSize: size === 'large' ? '14px' : '12px' }}>
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Text>
              )}
            </Space>
          </Tooltip>
        </Badge>
      </div>
    </Popover>
  );
};

/**
 * Compact WebSocket status indicator for headers/toolbars
 */
export const WebSocketStatusCompact: React.FC = () => {
  const { isConnected } = useWebSocketConnectionStatus();
  const { hasNewErrors } = useWebSocketErrors(1);

  return (
    <WebSocketStatus 
      showDetails={false} 
      size="small" 
      placement="bottom"
    />
  );
};

/**
 * Detailed WebSocket status for sidebars/panels
 */
export const WebSocketStatusDetailed: React.FC = () => {
  return (
    <WebSocketStatus 
      showDetails={true} 
      size="default" 
      placement="right"
    />
  );
};

export default WebSocketStatus;
