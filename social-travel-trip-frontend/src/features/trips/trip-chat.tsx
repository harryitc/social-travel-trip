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
  File as FileIcon,
  Heart,
  Search,
  Plus,
  Users
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
import { useEventStore } from '@/features/stores/event.store';
import { websocketService, WebsocketEvent } from '@/lib/services/websocket.service';

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
  likeCount?: number;
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
    likeCount: backendMessage.like_count || 0,
    attachments: [], // TODO: Handle attachments from backend
  };
};

export function TripChat({ tripId }: TripChatProps) {
  const user: any = null; // TODO: Get from auth context
  const { emit } = useEventStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<number>>(new Set());
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load messages from API
  useEffect(() => {
    const loadMessages = async () => {
      if (!tripId) return;

      try {
        setLoading(true);
        console.log('💬 [TripChat] Loading messages for tripId:', tripId);
        const result = await tripGroupService.getMessages(tripId);
        console.log('💬 [TripChat] Messages API response:', result);

        if (result && result.messages) {
          const transformedMessages = result.messages.map(transformMessage);
          console.log('💬 [TripChat] Transformed messages:', transformedMessages);
          setMessages(transformedMessages);

          // Emit event that messages have been loaded
          emit('chat:messages_loaded', {
            groupId: tripId,
            messages: transformedMessages
          });
        } else {
          console.warn('💬 [TripChat] No messages found in response:', result);
          setMessages([]);

          // Emit event with empty messages
          emit('chat:messages_loaded', {
            groupId: tripId,
            messages: []
          });
        }
      } catch (error: any) {
        console.error('❌ [TripChat] Error loading messages:', error);
        notification.error({
          message: 'Lỗi',
          description: error?.response?.data?.reasons?.message || 'Không thể tải tin nhắn. Vui lòng thử lại sau.',
          placement: 'topRight',
        });
        setMessages([]);

        // Emit event with empty messages on error
        emit('chat:messages_loaded', {
          groupId: tripId,
          messages: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [tripId]);

  // WebSocket integration for real-time messaging
  useEffect(() => {
    if (!tripId) return;

    // Connect to WebSocket
    websocketService.connect();

    // Join group room
    websocketService.joinGroup(tripId);

    // Set up event listeners
    const handleNewMessage = (data: { groupId: number; senderId: number; message: any }) => {
      if (data.groupId.toString() === tripId) {
        const transformedMessage = transformMessage(data.message);
        setMessages(prev => [...prev, transformedMessage]);

        // Emit event for other components
        emit('chat:message_received', {
          groupId: tripId,
          message: transformedMessage
        });
      }
    };

    const handleMessageLike = (data: { groupId: number; messageId: number; likerId: number; likeCount: number; isLiked: boolean }) => {
      if (data.groupId.toString() === tripId) {
        setMessages(prev => prev.map(msg =>
          msg.id === data.messageId.toString()
            ? { ...msg, likeCount: data.likeCount }
            : msg
        ));
      }
    };

    const handleMessagePin = (data: { groupId: number; messageId: number; pinnerId: number; isPinned: boolean }) => {
      if (data.groupId.toString() === tripId) {
        setMessages(prev => prev.map(msg =>
          msg.id === data.messageId.toString()
            ? { ...msg, pinned: data.isPinned }
            : msg
        ));
      }
    };

    const handleTyping = (data: { groupId: number; typingUserId: number; isTyping: boolean }) => {
      if (data.groupId.toString() === tripId) {
        setTypingUsers(prev => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.typingUserId);
          } else {
            newSet.delete(data.typingUserId);
          }
          return newSet;
        });
      }
    };

    // Subscribe to events
    websocketService.onEvent('group:message:sent', handleNewMessage);
    websocketService.onEvent('group:message:liked', handleMessageLike);
    websocketService.onEvent('group:message:unliked', handleMessageLike);
    websocketService.onEvent('group:message:pinned', handleMessagePin);
    websocketService.onEvent('group:message:unpinned', handleMessagePin);
    websocketService.onEvent('group:member:typing', handleTyping);
    websocketService.onEvent('group:member:stop_typing', handleTyping);

    // Cleanup on unmount
    return () => {
      websocketService.offEvent('group:message:sent', handleNewMessage);
      websocketService.offEvent('group:message:liked', handleMessageLike);
      websocketService.offEvent('group:message:unliked', handleMessageLike);
      websocketService.offEvent('group:message:pinned', handleMessagePin);
      websocketService.offEvent('group:message:unpinned', handleMessagePin);
      websocketService.offEvent('group:member:typing', handleTyping);
      websocketService.offEvent('group:member:stop_typing', handleTyping);

      websocketService.leaveGroup(tripId);
    };
  }, [tripId, emit]);

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

  const handleLikeMessage = async (messageId: string) => {
    try {
      await tripGroupService.toggleMessageLike(parseInt(messageId));
      // The WebSocket will handle updating the UI
    } catch (error) {
      console.error('Error liking message:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thích tin nhắn. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
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
      console.log('💬 [TripChat] Sending message:', newMessage);

      // Send message via API
      const sentMessage = await tripGroupService.sendMessage({
        group_id: parseInt(tripId),
        message: newMessage,
      });

      // Transform and add to local state
      const transformedMessage = transformMessage(sentMessage);
      setMessages(prev => [...prev, transformedMessage]);

      // Emit event that message was sent
      emit('chat:message_sent', {
        groupId: tripId,
        message: transformedMessage
      });

      // Clear input
      setNewMessage('');
      setSelectedImages([]);
      setSelectedFiles([]);
      setImagePreviewUrls([]);
      setReplyingTo(null);

      console.log('✅ [TripChat] Message sent successfully');
    } catch (error: any) {
      console.error('❌ [TripChat] Error sending message:', error);
      notification.error({
        message: 'Lỗi',
        description: error?.response?.data?.reasons?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true);
      websocketService.sendTyping(tripId, true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      websocketService.sendTyping(tripId, false);
    }, 2000); // Stop typing after 2 seconds of inactivity
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Handle create group from empty state
  const handleCreateGroupFromEmpty = () => {
    // Trigger create group dialog from GroupChatList component
    const createButton = document.querySelector('[data-create-group-trigger]') as HTMLButtonElement;
    if (createButton) {
      createButton.click();
    }
  };

  // Handle search from empty state
  const handleSearchFromEmpty = () => {
    // Focus on search input
    const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };

  return (
    <>
      {
        tripId ? (
          <div className="flex flex-col h-full">
            <ScrollArea className={`flex-1 p-3`}>
              <PinnedMessages
                messages={messages}
                onUnpin={handlePinMessage}
                onScrollToMessage={scrollToMessage}
              />

              {loading ? (
                <ChatSkeleton />
              ) : (
                <div className={`space-y-3`}>
                  {messages.map((message) => (
                    <div
                      id={`message-${message.id}`}
                      key={message.id}
                      className={`gap-2 transition-colors duration-300 ${message.sender.id === (user?.id || '1') ? 'flex-row-reverse' : ''
                        }`}
                    >
                      <Avatar className="h-8 w-8 shrink-0 border border-white shadow-xs">
                        <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                        <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col gap-1 max-w-[80%] ${
                message.sender.id === (user?.id || '1') ? 'items-end' : ''
              }">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium">{message.sender.name}</span>
                          <span className="text-xs text-muted-foreground">{message.timestamp}</span>

                          {message.pinned && (
                            <Pin className="h-3 w-3 text-purple-600" />
                          )}
                        </div>

                        <div className="relative rounded-lg p-2.5 group ${
                  message.sender.id === (user?.id || '1')
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-secondary shadow-xs'
                }">
                          {message.replyTo && (
                            <div className="mb-2 p-2 rounded text-xs flex items-start gap-1 ${
                      message.sender.id === (user?.id || '1')
                        ? 'bg-purple-700/50'
                        : 'bg-secondary-foreground/10'
                    }">
                              <MessageSquareQuote className="h-3 w-3 shrink-0 mt-0.5" />
                              <div>
                                <div className="font-medium">{message.replyTo.sender.name}</div>
                                <div className="truncate message-content">{message.replyTo.content}</div>
                              </div>
                            </div>
                          )}

                          <p className="text-sm message-content">{message.content}</p>

                          {/* Like count */}
                          {message.likeCount && message.likeCount > 0 && (
                            <div className="flex items-center gap-1 mt-1">
                              <Heart className="h-3 w-3 text-red-500 fill-current" />
                              <span className="text-xs text-muted-foreground">{message.likeCount}</span>
                            </div>
                          )}

                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attachments.map((attachment, index) => (
                                attachment.type === 'image' ? (
                                  <div key={index} className="rounded-md overflow-hidden border border-white/20">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={attachment.url}
                                      alt={attachment.name}
                                      className="max-w-sm object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div key={index} className="flex items-center justify-between gap-2 text-sm bg-secondary-foreground/10 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                      <FileIcon className="h-4 w-4" />
                                      <div className="flex flex-col">
                                        <span className="truncate max-w-[150px]">{attachment.name}</span>
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

                          <div className="absolute ${message.sender.id === (user?.id || '1') ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 ${message.sender.id === (user?.id || '1') ? '-translate-x-full' : 'translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-xs shadow-xs">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align={message.sender.id === (user?.id || '1') ? "end" : "start"}>
                                <DropdownMenuItem onClick={() => handleLikeMessage(message.id)}>
                                  <Heart className="h-4 w-4 mr-2" />
                                  Thích
                                </DropdownMenuItem>
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
                  {typingUsers.size > 0 && (
                    <div className="flex gap-2 items-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {typingUsers.size === 1 ? 'Ai đó đang nhập...' : `${typingUsers.size} người đang nhập...`}
                      </span>
                    </div>
                  )}

                  <div ref={messageEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="p-2 ${isVerticalLayout ? 'border-t-0' : 'border-t'} border-purple-100 dark:border-purple-900 bg-purple-50/30 dark:bg-purple-900/10">
              {/* Image preview area */}
              {imagePreviewUrls.length > 0 && (
                <div className="mb-1.5">
                  <div className="text-xs text-muted-foreground mb-1">Hình ảnh ({imagePreviewUrls.length})</div>
                  <div className="flex flex-wrap gap-1.5">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative w-12 h-12 rounded-md overflow-hidden bg-secondary border border-purple-100 dark:border-purple-800">
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
                <div className="mb-1.5">
                  <div className="text-xs text-muted-foreground mb-1">Tệp đính kèm ({selectedFiles.length})</div>
                  <div className="space-y-1">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-1 rounded bg-secondary/50 border border-purple-100 dark:border-purple-800">
                        <div className="flex items-center gap-1.5">
                          <FileIcon className="h-3 w-3 text-purple-500" />
                          <div className="flex flex-col">
                            <span className="text-xs truncate max-w-[180px]">{file.name}</span>
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
                <div className="mb-1.5 p-1 rounded-md bg-secondary/50 border border-purple-100 dark:border-purple-800 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <MessageSquareQuote className="h-3 w-3 text-purple-500" />
                    <div>
                      <div className="text-xs font-medium">
                        Đang trả lời {replyingTo.sender.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate message-content max-w-[180px]">
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

              <div className="flex items-center gap-1">
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
                  className="h-7 w-7 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                  <ImageIcon className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => fileInputRef.current?.click()}
                  title="Đính kèm tệp"
                  className="h-7 w-7 text-purple-600 hover:text-purple-700 hover:bg-purple-100 dark:text-purple-400 dark:hover:bg-purple-900/20"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                </Button>
                <EmojiPicker onEmojiSelect={handleEmojiSelect} />

                <Input
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-7 bg-white dark:bg-gray-900 border-purple-100 dark:border-purple-800 focus-visible:ring-purple-500"
                />

                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() && selectedImages.length === 0 && selectedFiles.length === 0}
                  className="h-7 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <SendHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex h-full items-center justify-center">
              <div className="text-center space-y-6 max-w-md mx-auto px-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-12 w-12 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                    Chào mừng đến với Nhóm chuyến đi
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Chọn một nhóm từ danh sách bên trái để bắt đầu trò chuyện và lên kế hoạch cho chuyến đi của bạn
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button
                    variant="outline"
                    className="border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                    onClick={handleSearchFromEmpty}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Tìm nhóm
                  </Button>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCreateGroupFromEmpty}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo nhóm mới
                  </Button>
                </div>
              </div>
            </div>
          </>
        )
      }
    </>
  );
}