'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Pin } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  pinned?: boolean;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
};

type PinnedMessagesProps = {
  messages: Message[];
  onUnpin: (messageId: string) => void;
  onScrollToMessage: (messageId: string) => void;
};

export function PinnedMessages({ messages, onUnpin, onScrollToMessage }: PinnedMessagesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pinnedMessages = messages.filter(message => message.pinned);

  if (pinnedMessages.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
      <CardHeader className="py-2 px-4 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium flex items-center">
          <Pin className="h-4 w-4 mr-2 text-purple-600" />
          Tin nhắn đã ghim ({pinnedMessages.length})
        </CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="py-2 px-4">
          <ScrollArea className="max-h-40">
            <div className="space-y-2">
              {pinnedMessages.map((message) => (
                <div 
                  key={message.id} 
                  className="flex items-start gap-2 p-2 rounded-md bg-secondary/50 hover:bg-secondary cursor-pointer"
                  onClick={() => onScrollToMessage(message.id)}
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium">{message.sender.name}</span>
                      <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                    </div>
                    <p className="text-xs truncate">{message.content}</p>
                    
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {message.attachments.length} {message.attachments.length === 1 ? 'tệp đính kèm' : 'tệp đính kèm'}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnpin(message.id);
                    }}
                  >
                    <Pin className="h-3 w-3 fill-current" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  );
}
