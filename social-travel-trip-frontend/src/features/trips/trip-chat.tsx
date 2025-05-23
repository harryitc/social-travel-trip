'use client';

import { useState, useRef, useEffect } from 'react';
import { ScrollArea } from '@/components/ui/radix-ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Input } from '@/components/ui/radix-ui/input';
import { Button } from '@/components/ui/radix-ui/button';
import {
  SendHorizontal,
  Image as ImageIcon,
  Paperclip,
  MoreVertical,
  Pin,
  Reply,
  X,
  MessageSquareQuote,
  Download,
  File as FileIcon
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/radix-ui/dropdown-menu';
import { PinnedMessages } from './pinned-messages';
import { EmojiPicker } from './emoji-picker';
import { TripGroupMember } from './models/trip-group.model';
import { tripGroupService, TripGroupMessage } from './services/trip-group.service';
import { ChatSkeleton } from './components/chat-skeleton';
import { notification } from 'antd';

// Transform TripGroupMessage to Message format for UI compatibility
interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  pinned?: boolean;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }>;
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
  };
}

type TripChatProps = {
  tripId: string;
  members?: TripGroupMember[];
  isTablet?: boolean;
  isVerticalLayout?: boolean;
};

// Helper function to transform backend message to UI message
const transformMessage = (backendMessage: TripGroupMessage): Message => {
  return {
    id: backendMessage.group_message_id.toString(),
    content: backendMessage.message,
    sender: {
      id: backendMessage.user_id.toString(),
      name: backendMessage.user?.username || 'Unknown User',
      avatar: backendMessage.user?.avatar_url || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
    },
    timestamp: new Date(backendMessage.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    pinned: backendMessage.is_pinned || false,
    attachments: [], // TODO: Handle attachments from backend
  };
};

export function TripChat({ tripId, isTablet = false, isVerticalLayout = false }: TripChatProps) {
  const user: any = null; // TODO: Get from auth context
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Load messages from API
  useEffect(() => {
    const loadMessages = async () => {
      if (!tripId) return;

      try {
        setLoading(true);
        console.log('Loading messages for tripId:', tripId);
        const result = await tripGroupService.getMessages(tripId);
        console.log('Messages API response:', result);

        if (result && result.messages) {
          const transformedMessages = result.messages.map(transformMessage);
          console.log('Transformed messages:', transformedMessages);
          setMessages(transformedMessages);
        } else {
          console.warn('No messages found in response:', result);
          setMessages([]);
        }
      } catch (error: any) {
        console.error('Error loading messages:', error);
        notification.error({
          message: 'Lỗi',
          description:  error.response?.data?.message || 'Không thể tải tin nhắn. Vui lòng thử lại sau.',
          placement: 'topRight',
        });
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [tripId]);

  // TODO: Add real-time message updates using events if needed

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImagePreviewUrls = filesArray.map(file => URL.createObjectURL(file));

      setSelectedImages([...selectedImages, ...filesArray]);
      setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles([...selectedFiles, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const newSelectedFiles = [...selectedFiles];
    newSelectedFiles.splice(index, 1);
    setSelectedFiles(newSelectedFiles);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleRemoveImage = (index: number) => {
    const newSelectedImages = [...selectedImages];
    const newImagePreviewUrls = [...imagePreviewUrls];

    // Revoke the object URL to avoid memory leaks
    URL.revokeObjectURL(newImagePreviewUrls[index]);

    newSelectedImages.splice(index, 1);
    newImagePreviewUrls.splice(index, 1);

    setSelectedImages(newSelectedImages);
    setImagePreviewUrls(newImagePreviewUrls);
  };

  const handlePinMessage = async (messageId: string) => {
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      if (message.pinned) {
        await tripGroupService.unpinMessage(parseInt(messageId), tripId);
      } else {
        await tripGroupService.pinMessage(parseInt(messageId), tripId);
      }

      // Update local state optimistically
      setMessages(messages.map(msg =>
        msg.id === messageId
          ? { ...msg, pinned: !msg.pinned }
          : msg
      ));
    } catch (error) {
      console.error('Error toggling pin message:', error);
    }
  };

  const handleReplyMessage = (message: Message) => {
    setReplyingTo(message);
  };

  const cancelReply = () => {
    setReplyingTo(null);
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: 'smooth' });
      // Add a highlight effect
      messageElement.classList.add('bg-purple-100', 'dark:bg-purple-900/30');
      setTimeout(() => {
        messageElement.classList.remove('bg-purple-100', 'dark:bg-purple-900/30');
      }, 2000);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      // Send message via API
      const sentMessage = await tripGroupService.sendMessage({
        group_id: parseInt(tripId),
        message: newMessage,
      });

      // Transform and add to local state
      const transformedMessage = transformMessage(sentMessage);
      setMessages(prev => [...prev, transformedMessage]);

      // Clear input
      setNewMessage('');
      setSelectedImages([]);
      setSelectedFiles([]);
      setImagePreviewUrls([]);
      setReplyingTo(null);

      // TODO: Stop typing indicator if needed
    } catch (error) {
      console.error('Error sending message:', error);
      // TODO: Show error toast
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    // TODO: Add typing indicator logic if needed
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className={`flex-1 ${isTablet ? 'p-2' : 'p-3'} ${isVerticalLayout ? 'pt-1' : ''}`}>
        <PinnedMessages
          messages={messages}
          onUnpin={handlePinMessage}
          onScrollToMessage={scrollToMessage}
          isTablet={isTablet}
        />

        {loading ? (
          <ChatSkeleton />
        ) : (
          <div className={`${isTablet ? 'space-y-2' : 'space-y-3'}`}>
          {messages.map((message) => (
            <div
              id={`message-${message.id}`}
              key={message.id}
              className={`flex ${isTablet ? 'gap-1.5' : 'gap-2'} transition-colors duration-300 ${
                message.sender.id === (user?.id || '1') ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className={`${isTablet ? 'h-6 w-6' : 'h-8 w-8'} shrink-0 border border-white shadow-xs`}>
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
              </Avatar>

              <div className={`flex flex-col ${isTablet ? 'gap-0.5' : 'gap-1'} max-w-[80%] ${
                message.sender.id === (user?.id || '1') ? 'items-end' : ''
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>

                  {message.pinned && (
                    <Pin className="h-3 w-3 text-purple-600" />
                  )}
                </div>

                <div className={`relative rounded-lg ${isTablet ? 'p-2' : 'p-2.5'} group ${
                  message.sender.id === (user?.id || '1')
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-secondary shadow-xs'
                }`}>
                  {message.replyTo && (
                    <div className={`${isTablet ? 'mb-1.5 p-1.5' : 'mb-2 p-2'} rounded text-xs flex items-start gap-1 ${
                      message.sender.id === (user?.id || '1')
                        ? 'bg-purple-700/50'
                        : 'bg-secondary-foreground/10'
                    }`}>
                      <MessageSquareQuote className="h-3 w-3 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{message.replyTo.sender.name}</div>
                        <div className="truncate message-content">{message.replyTo.content}</div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm message-content">{message.content}</p>

                  {message.attachments && message.attachments.length > 0 && (
                    <div className={`${isTablet ? 'mt-1.5 space-y-1.5' : 'mt-2 space-y-2'}`}>
                      {message.attachments.map((attachment, index) => (
                        attachment.type === 'image' ? (
                          <div key={index} className="rounded-md overflow-hidden border border-white/20">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={attachment.url}
                              alt={attachment.name}
                              className={`${isTablet ? 'max-w-[200px]' : 'max-w-sm'} object-cover`}
                            />
                          </div>
                        ) : (
                          <div key={index} className={`flex items-center justify-between gap-2 text-sm bg-secondary-foreground/10 ${isTablet ? 'p-1.5' : 'p-2'} rounded`}>
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-4 w-4" />
                              <div className="flex flex-col">
                                <span className={`truncate ${isTablet ? 'max-w-[120px]' : 'max-w-[150px]'}`}>{attachment.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : ''}
                                </span>
                              </div>
                            </div>
                            <a
                              href={attachment.url}
                              download={attachment.name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1 hover:bg-secondary-foreground/20 rounded"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Download className="h-3 w-3" />
                            </a>
                          </div>
                        )
                      ))}
                    </div>
                  )}

                  <div className={`absolute ${message.sender.id === (user?.id || '1') ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 ${message.sender.id === (user?.id || '1') ? '-translate-x-full' : 'translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className={`${isTablet ? 'h-6 w-6' : 'h-8 w-8'} rounded-full bg-background/80 backdrop-blur-xs shadow-xs`}>
                          <MoreVertical className={`${isTablet ? 'h-3 w-3' : 'h-4 w-4'}`} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={message.sender.id === (user?.id || '1') ? "end" : "start"}>
                        <DropdownMenuItem onClick={() => handleReplyMessage(message)}>
                          <Reply className="h-4 w-4 mr-2" />
                          Phản hồi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePinMessage(message.id)}>
                          <Pin className="h-4 w-4 mr-2" />
                          {message.pinned ? 'Bỏ ghim' : 'Ghim tin nhắn'}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 items-center">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
              <span className="text-xs text-muted-foreground">Ai đó đang nhập...</span>
            </div>
          )}

          <div ref={messageEndRef} />
          </div>
        )}
      </ScrollArea>

      <div className={`${isTablet ? 'p-1.5' : 'p-2'} ${isVerticalLayout ? 'border-t-0' : 'border-t'} border-purple-100 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-900/10`}>
        {/* Image preview area */}
        {imagePreviewUrls.length > 0 && (
          <div className={`${isTablet ? 'mb-1' : 'mb-1.5'}`}>
            <div className="text-xs text-muted-foreground mb-1">Hình ảnh ({imagePreviewUrls.length})</div>
            <div className="flex flex-wrap gap-1.5">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className={`relative ${isTablet ? 'w-10 h-10' : 'w-12 h-12'} rounded-md overflow-hidden bg-secondary border border-purple-100 dark:border-purple-800`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-4 w-4 p-0 bg-black/50 rounded-full"
                    onClick={() => handleRemoveImage(index)}
                  >
                    <X className="h-2.5 w-2.5 text-white" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File preview area */}
        {selectedFiles.length > 0 && (
          <div className={`${isTablet ? 'mb-1' : 'mb-1.5'}`}>
            <div className="text-xs text-muted-foreground mb-1">Tệp đính kèm ({selectedFiles.length})</div>
            <div className="space-y-1">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-1 rounded bg-secondary/50 border border-purple-100 dark:border-purple-800">
                  <div className="flex items-center gap-1.5">
                    <FileIcon className="h-3 w-3 text-purple-500" />
                    <div className="flex flex-col">
                      <span className={`text-xs truncate ${isTablet ? 'max-w-[150px]' : 'max-w-[180px]'}`}>{file.name}</span>
                      <span className="text-[10px] text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-2.5 w-2.5" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply preview */}
        {replyingTo && (
          <div className={`${isTablet ? 'mb-1 p-1' : 'mb-1.5 p-1'} rounded-md bg-secondary/50 border border-purple-100 dark:border-purple-800 flex items-center justify-between`}>
            <div className="flex items-center gap-1.5">
              <MessageSquareQuote className="h-3 w-3 text-purple-500" />
              <div>
                <div className="text-xs font-medium">
                  Đang trả lời {replyingTo.sender.name}
                </div>
                <div className={`text-xs text-muted-foreground truncate message-content ${isTablet ? 'max-w-[150px]' : 'max-w-[180px]'}`}>
                  {replyingTo.content}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0"
              onClick={cancelReply}
            >
              <X className="h-2.5 w-2.5" />
            </Button>
          </div>
        )}

        <div className={`flex items-center ${isTablet ? 'gap-0.5' : 'gap-1'}`}>
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            ref={imageInputRef}
            onChange={handleImageChange}
          />
          <input
            type="file"
            multiple
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => imageInputRef.current?.click()}
            title="Tải lên hình ảnh"
            className={`${isTablet ? 'h-6 w-6' : 'h-7 w-7'} text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20`}
          >
            <ImageIcon className={`${isTablet ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Đính kèm tệp"
            className={`${isTablet ? 'h-6 w-6' : 'h-7 w-7'} text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20`}
          >
            <Paperclip className={`${isTablet ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
          </Button>
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />

          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className={`flex-1 ${isTablet ? 'h-6 text-xs' : 'h-7'} bg-white dark:bg-gray-900 border-purple-100 dark:border-purple-800 focus-visible:ring-purple-500`}
          />

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && selectedImages.length === 0 && selectedFiles.length === 0}
            className={`${isTablet ? 'h-6' : 'h-7'} bg-purple-600 hover:bg-purple-700 text-white`}
          >
            <SendHorizontal className={`${isTablet ? 'h-3 w-3' : 'h-3.5 w-3.5'}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}