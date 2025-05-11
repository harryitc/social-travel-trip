import React, { useState } from 'react';
import { Pin, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/radix-ui/button';
import { Message } from './mock-chat-data';

interface PinnedMessagesProps {
  messages: Message[];
  onUnpin: (messageId: string) => void;
  onScrollToMessage: (messageId: string) => void;
}

export function PinnedMessages({ messages, onUnpin, onScrollToMessage }: PinnedMessagesProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Lọc ra các tin nhắn đã ghim
  const pinnedMessages = messages.filter(message => message.pinned);
  
  // Nếu không có tin nhắn nào được ghim, không hiển thị gì cả
  if (pinnedMessages.length === 0) {
    return null;
  }
  
  return (
    <div className="sticky top-0 z-10 mb-4">
      <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 rounded-md shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-2 bg-purple-100/50 dark:bg-purple-900/30 border-b border-purple-100 dark:border-purple-800">
          <div className="flex items-center gap-1.5">
            <Pin className="h-3.5 w-3.5 text-purple-600" />
            <span className="text-xs font-medium text-purple-700 dark:text-purple-300">
              {pinnedMessages.length} tin nhắn đã ghim
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 hover:bg-purple-200/50 dark:hover:bg-purple-800/50"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? (
                <ChevronDown className="h-3 w-3 text-purple-600" />
              ) : (
                <ChevronUp className="h-3 w-3 text-purple-600" />
              )}
            </Button>
          </div>
        </div>
        
        {!isCollapsed && (
          <div className="max-h-[120px] overflow-y-auto p-2 space-y-2">
            {pinnedMessages.map(message => (
              <div 
                key={message.id} 
                className="flex items-start gap-2 p-2 rounded-md bg-white dark:bg-gray-900 border border-purple-100 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/10 cursor-pointer transition-colors"
                onClick={() => onScrollToMessage(message.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-medium">{message.sender.name}</span>
                    <span className="text-[10px] text-muted-foreground">{message.timestamp}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{message.content}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/20 flex-shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnpin(message.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
