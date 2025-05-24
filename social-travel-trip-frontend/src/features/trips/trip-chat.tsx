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
import { MessageReactions } from './components/message-reactions';

import { tripGroupService, TripGroupMessage } from './services/trip-group.service';
import { ChatSkeleton } from './components/chat-skeleton';
import { notification } from 'antd';
import { useEventStore } from '@/features/stores/event.store';
import { websocketService } from '@/lib/services/websocket.service';
import { fileService } from '@/features/file/file.service';
import { API_ENDPOINT } from '@/config/api.config';
import { formatMessageTimestamp, formatDetailedTimestamp } from '@/lib/utils';
import { useAuth } from '@/features/auth/hooks/use-auth';

// Transform TripGroupMessage to Message format for UI compatibility
interface Message {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string; // Formatted timestamp for display
  rawTimestamp: string; // Raw timestamp from backend for tooltip
  pinned?: boolean;
  likeCount?: number;
  reactions?: Array<{
    reaction_id: number;
    count: number;
    icon?: string;
    label?: string;
    users?: Array<{
      user_id: number;
      username: string;
      full_name: string;
      avatar_url: string;
      created_at: string;
    }>;
  }>; // Reaction details with full information
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
  // Extract user info from multiple possible sources - prioritize nickname
  const displayName = backendMessage.nickname || backendMessage.username || backendMessage.user?.username || `User ${backendMessage.user_id}`;
  const avatarUrl = backendMessage.avatar_url || backendMessage.user?.avatar_url || 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1';

  // Extract attachments from json_data
  let attachments: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }> = [];

  if (backendMessage.json_data) {
    try {
      const jsonData = typeof backendMessage.json_data === 'string'
        ? JSON.parse(backendMessage.json_data)
        : backendMessage.json_data;

      if (jsonData.attachments && Array.isArray(jsonData.attachments)) {
        attachments = jsonData.attachments;
      }
    } catch (error) {
      console.warn('Failed to parse json_data for attachments:', error);
    }
  }

  // Debug log for user info extraction and timestamp
  console.log('🔄 [TripChat] Transforming message:', {
    messageId: backendMessage.group_message_id,
    userId: backendMessage.user_id,
    nickname: backendMessage.nickname,
    username: backendMessage.username,
    avatar_url: backendMessage.avatar_url,
    finalDisplayName: displayName,
    finalAvatarUrl: avatarUrl,
    rawTimestamp: backendMessage.created_at,
    timestampType: typeof backendMessage.created_at,
    formattedTimestamp: formatMessageTimestamp(backendMessage.created_at),
    attachments: attachments
  });

  return {
    id: backendMessage.group_message_id.toString(),
    content: backendMessage.message,
    sender: {
      id: backendMessage.user_id.toString(),
      name: displayName,
      avatar: avatarUrl,
    },
    timestamp: formatMessageTimestamp(backendMessage.created_at),
    rawTimestamp: backendMessage.created_at, // Store raw timestamp for tooltip
    pinned: backendMessage.is_pinned || false,
    likeCount: backendMessage.like_count || 0,
    reactions: backendMessage.reactions || [], // Populate from backend
    attachments: attachments,
    replyTo: backendMessage.reply_to_message_id ? {
      id: backendMessage.reply_to_message_id.toString(),
      content: backendMessage.reply_to_message || '',
      sender: {
        id: backendMessage.reply_to_message_id.toString(),
        name: backendMessage.reply_to_nickname || backendMessage.reply_to_username || 'Unknown User',
      }
    } : undefined,
  };
};

export function TripChat({ tripId }: TripChatProps) {
  const { user } = useAuth(); // Get current user from auth context
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
  const [newMessageIds, setNewMessageIds] = useState<Set<string>>(new Set());
  const [sendingMessage, setSendingMessage] = useState(false);
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
        const result = await tripGroupService.getMessages(tripId);

        if (result && result.messages) {
          const transformedMessages = result.messages.map(transformMessage);
          setMessages(transformedMessages);

          // Emit event that messages have been loaded
          emit('chat:messages_loaded', {
            groupId: tripId,
            messages: transformedMessages
          });
        } else {
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

    console.log('🔌 [TripChat] Setting up WebSocket for group:', tripId);

    // Set up event listeners first
    const handleNewMessage = (data: { groupId: number; senderId: number; message: any }) => {
      console.log('📨 [TripChat] Received new message:', data);
      console.log('🔍 [TripChat] Message user info:', {
        username: data.message?.username,
        nickname: data.message?.nickname,
        avatar_url: data.message?.avatar_url,
        user_id: data.message?.user_id,
        hasUserInfo: !!(data.message?.username || data.message?.nickname)
      });
      if (data.groupId.toString() == tripId) {
        const transformedMessage = transformMessage(data.message);
        console.log('✅ [TripChat] Adding message to chat:', transformedMessage);

        // Mark as new message for animation
        setNewMessageIds(prev => new Set([...prev, transformedMessage.id]));

        // Remove animation class after animation completes
        setTimeout(() => {
          setNewMessageIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(transformedMessage.id);
            return newSet;
          });
        }, 1000);

        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(msg => msg.id == transformedMessage.id);
          if (exists) {
            console.log('⚠️ [TripChat] Message already exists, skipping:', transformedMessage.id);
            return prev;
          }

          // Also check for potential duplicates by content and timestamp (for edge cases)
          const contentDuplicate = prev.some(msg =>
            msg.content == transformedMessage.content &&
            msg.sender.id == transformedMessage.sender.id &&
            Math.abs(new Date(msg.timestamp).getTime() - new Date(transformedMessage.timestamp).getTime()) < 5000 // Within 5 seconds
          );

          if (contentDuplicate) {
            console.log('⚠️ [TripChat] Potential content duplicate detected, skipping:', transformedMessage);
            return prev;
          }

          return [...prev, transformedMessage];
        });

        // Emit event for other components
        emit('chat:message_received', {
          groupId: tripId,
          message: transformedMessage
        });
      }
    };

    const handleMessageLike = (data: { groupId: number; messageId: number; likerId: number; likeCount: number; isLiked: boolean }) => {
      if (data.groupId.toString() == tripId) {
        setMessages(prev => prev.map(msg =>
          msg.id == data.messageId.toString()
            ? { ...msg, likeCount: data.likeCount }
            : msg
        ));
      }
    };

    const handleMessagePin = (data: { groupId: number; messageId: number; pinnerId: number; isPinned: boolean }) => {
      if (data.groupId.toString() == tripId) {
        setMessages(prev => prev.map(msg =>
          msg.id == data.messageId.toString()
            ? { ...msg, pinned: data.isPinned }
            : msg
        ));
      }
    };

    const handleTyping = (data: { groupId: number; typingUserId: number; isTyping: boolean }) => {
      if (data.groupId.toString() == tripId) {
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

    // Subscribe to events with detailed logging
    console.log('🎧 [TripChat] Subscribing to WebSocket events');

    // Test event listener to verify WebSocket is working
    const handleTestEvent = (data: any) => {
      console.log('🧪 [TripChat] Test event received:', data);
    };

    // Register WebSocket events
    websocketService.on('group:message:sent', handleNewMessage);
    websocketService.on('group:message:liked', handleMessageLike);
    websocketService.on('group:message:unliked', handleMessageLike);
    websocketService.on('group:message:pinned', handleMessagePin);
    websocketService.on('group:message:unpinned', handleMessagePin);
    websocketService.on('group:member:typing', handleTyping);
    websocketService.on('group:member:stop_typing', handleTyping);
    websocketService.on('user:typing', handleTyping);
    websocketService.on('connection_established', handleTestEvent);
    websocketService.on('user:online', handleTestEvent);

    // Connect and join group
    websocketService.connect().then(() => {
      console.log('✅ [TripChat] WebSocket connected, joining group:', tripId);
      websocketService.joinGroup(tripId);
    }).catch(error => {
      console.error('❌ [TripChat] WebSocket connection failed:', error);
    });

    // Cleanup on unmount
    return () => {
      console.log('🧹 [TripChat] Cleaning up WebSocket events for group:', tripId);

      websocketService.off('group:message:sent', handleNewMessage);
      websocketService.off('group:message:liked', handleMessageLike);
      websocketService.off('group:message:unliked', handleMessageLike);
      websocketService.off('group:message:pinned', handleMessagePin);
      websocketService.off('group:message:unpinned', handleMessagePin);
      websocketService.off('group:member:typing', handleTyping);
      websocketService.off('group:member:stop_typing', handleTyping);
      websocketService.off('user:typing', handleTyping);
      websocketService.off('connection_established', handleTestEvent);
      websocketService.off('user:online', handleTestEvent);

      websocketService.leaveGroup(tripId);
    };
  }, [tripId, emit]);

  // Scroll to bottom when messages change with smooth animation
  useEffect(() => {
    if (messageEndRef.current) {
      // Add a small delay to ensure the message is rendered
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'end',
          inline: 'nearest'
        });
      }, 100);
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
      const message = messages.find(m => m.id == messageId);
      if (!message) return;

      if (message.pinned) {
        await tripGroupService.unpinMessage(parseInt(messageId), tripId);
      } else {
        await tripGroupService.pinMessage(parseInt(messageId), tripId);
      }

      // Update local state optimistically
      setMessages(messages.map(msg =>
        msg.id == messageId
          ? { ...msg, pinned: !msg.pinned }
          : msg
      ));
    } catch (error: any) {
      notification.error({
        message: 'Lỗi',
        description: error?.response?.data?.reasons?.message || 'Không thể ghim tin nhắn. Vui lòng thử lại sau.',
        placement: 'topRight',
      })
      console.error('Error toggling pin message:', error);
    }
  };

  const handleReactionUpdate = (messageId: string, newLikeCount: number) => {
    setMessages(prev => prev.map(msg =>
      msg.id === messageId
        ? { ...msg, likeCount: newLikeCount }
        : msg
    ));
  };

  const handleReaction = async (messageId: string, reactionId: number) => {
    try {
      await tripGroupService.toggleMessageLike(parseInt(messageId), reactionId);
      // The WebSocket will handle updating the UI

      const reactionLabels: { [key: number]: string } = {
        2: 'thích',
        3: 'yêu thích',
        4: 'haha',
        5: 'wow',
        6: 'buồn'
      };

      // notification.success({
      //   message: 'Thành công',
      //   description: `Đã ${reactionLabels[reactionId]} tin nhắn`,
      //   placement: 'topRight',
      //   duration: 1,
      // });
    } catch (error: any) {
      console.error('Error reacting to message:', error);
      notification.error({
        message: 'Lỗi',
        description: error?.response?.data?.reasons?.message || 'Không thể thực hiện reaction. Vui lòng thử lại sau.',
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
    // Validate input
    const messageText = newMessage.trim();
    if (!messageText && selectedImages.length == 0 && selectedFiles.length == 0) {
      notification.warning({
        message: 'Thông báo',
        description: 'Vui lòng nhập tin nhắn hoặc chọn tệp để gửi.',
        placement: 'topRight',
        duration: 2,
      });
      return;
    }

    // Set sending state for loading animation
    setSendingMessage(true);

    // Validate group ID
    if (!tripId || isNaN(parseInt(tripId))) {
      notification.error({
        message: 'Lỗi',
        description: 'Không tìm thấy thông tin nhóm. Vui lòng thử lại.',
        placement: 'topRight',
      });
      return;
    }

    try {
      // Upload files first if any
      let attachments: Array<{
        type: 'image' | 'file';
        url: string;
        name: string;
        size?: number;
      }> = [];

      // Upload images
      if (selectedImages.length > 0) {
        notification.info({
          message: 'Đang tải lên hình ảnh...',
          description: `Đang tải lên ${selectedImages.length} hình ảnh`,
          placement: 'topRight',
          duration: 2,
        });

        try {
          const imageUploadResults = await fileService.uploadMultipleFiles(selectedImages);

          for (let i = 0; i < imageUploadResults.length; i++) {
            const result = imageUploadResults[i];
            const originalFile = selectedImages[i];

            if (result.files && result.files.length > 0) {
              attachments.push({
                type: 'image',
                url: result.files[0].file_url,
                name: result.files[0].file_name || originalFile.name,
                size: originalFile.size,
              });
            }
          }
        } catch (uploadError) {
          console.error('Error uploading images:', uploadError);
          notification.error({
            message: 'Lỗi tải lên hình ảnh',
            description: 'Không thể tải lên hình ảnh. Vui lòng thử lại.',
            placement: 'topRight',
          });
          return;
        }
      }

      // Upload files
      if (selectedFiles.length > 0) {
        notification.info({
          message: 'Đang tải lên tệp...',
          description: `Đang tải lên ${selectedFiles.length} tệp`,
          placement: 'topRight',
          duration: 2,
        });

        try {
          const fileUploadResults = await fileService.uploadMultipleFiles(selectedFiles);

          for (let i = 0; i < fileUploadResults.length; i++) {
            const result = fileUploadResults[i];
            const originalFile = selectedFiles[i];

            if (result.files && result.files.length > 0) {
              attachments.push({
                type: 'file',
                url: result.files[0].file_url,
                name: result.files[0].file_name || originalFile.name,
                size: originalFile.size,
              });
            }
          }
        } catch (uploadError: any) {
          console.error('Error uploading files:', uploadError);
          notification.error({
            message: 'Lỗi tải lên tệp',
            description: uploadError?.response?.data?.reasons?.message || 'Không thể tải lên tệp. Vui lòng thử lại.',
            placement: 'topRight',
          });
          return;
        }
      }

      // Prepare message data
      const messageData: any = {
        group_id: parseInt(tripId),
        message: messageText || '', // Ensure message is not undefined
      };

      // Add attachments if any
      if (attachments.length > 0) {
        messageData.attachments = attachments;
      }

      // Add reply information if replying to a message
      if (replyingTo) {
        const replyId = parseInt(replyingTo.id);
        if (!isNaN(replyId)) {
          messageData.reply_to_message_id = replyId;
        }
      }

      // Send message via API
      const sentMessage = await tripGroupService.sendMessage(messageData);

      // Validate response
      if (!sentMessage || !sentMessage.group_message_id) {
        throw new Error('Phản hồi từ server không hợp lệ');
      }

      // Don't add to local state here - let WebSocket handle it
      // This prevents duplicate messages when WebSocket emits the same message
      console.log('✅ [TripChat] Message sent successfully, waiting for WebSocket confirmation');

      // Emit event that message was sent
      const transformedMessage = transformMessage(sentMessage);
      emit('chat:message_sent', {
        groupId: tripId,
        message: transformedMessage
      });

      // Clear input and reset state
      setNewMessage('');
      setSelectedImages([]);
      setSelectedFiles([]);
      setImagePreviewUrls([]);
      setReplyingTo(null);

      // Stop typing indicator
      if (isTyping) {
        setIsTyping(false);
        websocketService.sendTyping(tripId, false);
      }

      // Clear typing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      // Show success notification if files were uploaded
      if (attachments.length > 0) {
        notification.success({
          message: 'Thành công',
          description: `Đã gửi tin nhắn với ${attachments.length} tệp đính kèm`,
          placement: 'topRight',
          duration: 2,
        });
      }

    } catch (error: any) {
      console.error('❌ [TripChat] Error sending message:', error);

      // Show appropriate error message
      let errorMessage = error?.response?.data?.reasons?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.';

      notification.error({
        message: 'Lỗi gửi tin nhắn',
        description: errorMessage,
        placement: 'topRight',
        duration: 4,
      });
    } finally {
      // Always reset sending state
      setSendingMessage(false);
    }
  };

  // Handle input change with typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Only send typing indicator if there's actual content and we have a valid tripId
    if (value.trim() && tripId) {
      // Send typing indicator only if not already typing
      if (!isTyping) {
        setIsTyping(true);
        try {
          websocketService.sendTyping(tripId, true);
        } catch (error) {
          console.warn('Failed to send typing indicator:', error);
        }
      }

      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        try {
          websocketService.sendTyping(tripId, false);
        } catch (error) {
          console.warn('Failed to stop typing indicator:', error);
        }
      }, 2000); // Stop typing after 2 seconds of inactivity
    } else if (isTyping) {
      // Stop typing immediately if input is empty
      setIsTyping(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      try {
        websocketService.sendTyping(tripId, false);
      } catch (error) {
        console.warn('Failed to stop typing indicator:', error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key == 'Enter' && !e.shiftKey) {
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

  // Debug function to test WebSocket
  const handleTestWebSocket = () => {
    console.log('🧪 [TripChat] Testing WebSocket connection...');
    console.log('🔍 [TripChat] Current WebSocket state:', websocketService.getDebugInfo());

    // Try to emit a test event
    websocketService.emit('test:ping', { groupId: tripId, timestamp: Date.now() })
      .then(() => {
        console.log('✅ [TripChat] Test ping sent successfully');
      })
      .catch(error => {
        console.error('❌ [TripChat] Test ping failed:', error);
      });
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
                <div className="space-y-4 px-2">
                  {messages.map((message, index) => {
                    // Compare with user ID from auth context - convert both to string for comparison
                    const isOwnMessage = user?.user_id ? message.sender.id == user.user_id.toString() : false;

                    // Check if this is a new message for animation
                    const isNewMessage = newMessageIds.has(message.id);

                    // Use combination of id and index to ensure unique keys
                    const uniqueKey = `${message.id}-${index}`;
                    return (
                      <div
                        id={`message-${message.id}`}
                        key={uniqueKey}
                        className={`flex gap-3 transition-all duration-500 ease-out ${isOwnMessage ? 'flex-row-reverse' : ''
                          } ${isNewMessage
                            ? 'animate-in slide-in-from-bottom-4 fade-in duration-500'
                            : ''
                          }`}
                      >
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                          <Avatar className="h-9 w-9 border-2 border-white shadow-md">
                            <AvatarImage src={API_ENDPOINT.file_image_v2 + message.sender.avatar} alt={message.sender.name} />
                            <AvatarFallback className="bg-gradient-to-br from-purple-400 to-blue-500 text-white text-sm font-semibold">
                              {message.sender.name[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>

                        {/* Message Content */}
                        <div className={`flex flex-col max-w-[75%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                          {/* Header */}
                          <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : ''}`}>
                            <span className={`text-sm font-semibold ${isOwnMessage
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-700 dark:text-gray-300'
                              }`}>
                              {isOwnMessage ? 'Bạn' : message.sender.name}
                            </span>
                            <span
                              className="text-xs text-gray-500 dark:text-gray-400 cursor-help"
                              title={formatDetailedTimestamp(message.rawTimestamp)}
                            >
                              {message.timestamp}
                            </span>
                            {message.pinned && (
                              <Pin className="h-3.5 w-3.5 text-amber-500" />
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div className={`relative px-4 py-2.5 group shadow-sm transform transition-all duration-300 hover:scale-[1.02] ${isOwnMessage
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl rounded-br-md hover:shadow-lg hover:shadow-purple-500/25'
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md hover:shadow-lg hover:border-gray-300 dark:hover:border-gray-600'
                            } ${isNewMessage ? 'animate-pulse' : ''
                            }`}>
                            {/* Reply indicator */}
                            {message.replyTo && (
                              <div className={`mb-2 p-2 rounded-lg text-xs flex items-start gap-2 ${isOwnMessage
                                  ? 'bg-white/20 text-white/90'
                                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                                }`}>
                                <MessageSquareQuote className="h-3 w-3 shrink-0 mt-0.5" />
                                <div>
                                  <div className="font-medium">{message.replyTo.sender.name}</div>
                                  <div className="truncate message-content">{message.replyTo.content}</div>
                                </div>
                              </div>
                            )}

                            {/* Message text with inline reactions */}
                            <div className="flex items-end gap-1 flex-wrap">
                              <p className="text-sm leading-relaxed message-content">{message.content}</p>
                              {/* Inline Message Reactions */}
                              {message?.likeCount > 0 && (
                                <MessageReactions
                                  messageId={message.id}
                                  likeCount={message.likeCount}
                                  reactions={message.reactions}
                                  onReactionUpdate={handleReactionUpdate}
                                  isOwnMessage={isOwnMessage}
                                />
                              )}
                            </div>

                            {/* Attachments */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="mt-3 space-y-2">
                                {message.attachments.map((attachment, index) => (
                                  attachment.type == 'image' ? (
                                    <div key={index} className="rounded-lg overflow-hidden border border-white/20 cursor-pointer hover:opacity-90 transition-opacity">
                                      {/* eslint-disable-next-line @next/next/no-img-element */}
                                      <img
                                        src={API_ENDPOINT.file_image_v2 + attachment.url}
                                        alt={attachment.name}
                                        className="max-w-sm max-h-64 object-cover rounded-lg"
                                        onClick={() => window.open(API_ENDPOINT.file_image_v2 + attachment.url, '_blank')}
                                        title="Click để xem ảnh full size"
                                      />
                                    </div>
                                  ) : (
                                    <div key={index} className={`flex items-center justify-between gap-2 text-sm p-2 rounded-lg ${isOwnMessage ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'
                                      }`}>
                                      <div className="flex items-center gap-2">
                                        <FileIcon className="h-4 w-4" />
                                        <div className="flex flex-col">
                                          <span className="truncate max-w-[150px]">{attachment.name}</span>
                                          <span className="text-xs opacity-70">
                                            {attachment.size ? `${Math.round(attachment.size / 1024)} KB` : ''}
                                          </span>
                                        </div>
                                      </div>
                                      <a
                                        href={API_ENDPOINT.file_image_v2 + attachment.url}
                                        download={attachment.name}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-1 hover:bg-white/20 rounded"
                                        onClick={(e) => e.stopPropagation()}
                                        title="Tải xuống tệp"
                                      >
                                        <Download className="h-3 w-3" />
                                      </a>
                                    </div>
                                  )
                                ))}
                              </div>
                            )}



                            {/* Message actions */}
                            <div className={`absolute ${isOwnMessage ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 ${isOwnMessage ? '-translate-x-full' : 'translate-x-full'
                              } opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1`}>

                              {/* Quick reaction buttons */}
                              <div className="flex items-center gap-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg rounded-full px-2 py-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                                  onClick={() => handleReaction(message.id, 2)}
                                  title="Thích"
                                >
                                  <span className="text-sm">👍</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-full"
                                  onClick={() => handleReaction(message.id, 3)}
                                  title="Yêu thích"
                                >
                                  <span className="text-sm">❤️</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded-full"
                                  onClick={() => handleReaction(message.id, 4)}
                                  title="Haha"
                                >
                                  <span className="text-sm">😄</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-full"
                                  onClick={() => handleReaction(message.id, 5)}
                                  title="Wow"
                                >
                                  <span className="text-sm">😮</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                  onClick={() => handleReaction(message.id, 6)}
                                  title="Buồn"
                                >
                                  <span className="text-sm">😢</span>
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600"
                                  onClick={() => handleReaction(message.id, 1)}
                                  title="Hủy reaction"
                                >
                                  <span className="text-sm">🚫</span>
                                </Button>
                              </div>

                              {/* More actions menu */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg hover:bg-white dark:hover:bg-gray-700">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align={isOwnMessage ? "end" : "start"}>
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
                    );
                  })}

                  {/* Typing indicator */}
                  {typingUsers.size > 0 && (
                    <div className="flex gap-3 items-center px-2 animate-in slide-in-from-bottom-2 fade-in duration-300">
                      <div className="flex-shrink-0">
                        <div className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center animate-pulse">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                          {typingUsers.size == 1 ? 'Ai đó đang nhập...' : `${typingUsers.size} người đang nhập...`}
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messageEndRef} />
                </div>
              )}
            </ScrollArea>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">{/* Input area */}
              {/* Image preview area */}
              {imagePreviewUrls.length > 0 && (
                <div className="mb-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hình ảnh ({imagePreviewUrls.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {imagePreviewUrls.map((url, index) => (
                      <div key={index} className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm transform transition-all duration-200 hover:scale-105">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="preview" className="w-full h-full object-cover transition-transform duration-200 hover:scale-110" />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 rounded-full shadow-md transition-all duration-200 hover:scale-110"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-3 w-3 text-white" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File preview area */}
              {selectedFiles.length > 0 && (
                <div className="mb-3 animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tệp đính kèm ({selectedFiles.length})
                  </div>
                  <div className="space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transform transition-all duration-200 hover:scale-[1.02] hover:shadow-md">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md transition-colors duration-200">
                            <FileIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(file.size / 1024)} KB</span>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-110"
                          onClick={() => handleRemoveFile(index)}
                        >
                          <X className="h-3 w-3 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply preview */}
              {replyingTo && (
                <div className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between animate-in slide-in-from-bottom-2 fade-in duration-300 transform hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-2">
                    <MessageSquareQuote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <div>
                      <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Đang trả lời {replyingTo.sender.name}
                      </div>
                      <div className="text-sm text-blue-600 dark:text-blue-400 truncate message-content max-w-[250px]">
                        {replyingTo.content}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0 hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-200 hover:scale-110"
                    onClick={cancelReply}
                  >
                    <X className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  </Button>
                </div>
              )}

              {/* Input controls */}
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 border border-gray-200 dark:border-gray-700 transition-all duration-200 focus-within:border-purple-300 focus-within:shadow-lg focus-within:shadow-purple-500/10">
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

                {/* Action buttons */}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => imageInputRef.current?.click()}
                    title="Tải lên hình ảnh"
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    title="Đính kèm tệp"
                    className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-full transition-all duration-200 hover:scale-110"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <EmojiPicker onEmojiSelect={handleEmojiSelect} />

                </div>

                {/* Text input */}
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={newMessage}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="flex-1 h-9 bg-white dark:bg-gray-900 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-xl transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />

                {/* Send button */}
                <Button
                  onClick={handleSendMessage}
                  disabled={(!newMessage.trim() && selectedImages.length == 0 && selectedFiles.length == 0) || sendingMessage}
                  className={`h-8 w-8 p-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${sendingMessage ? 'animate-spin' : 'hover:scale-110'
                    }`}
                  title={
                    sendingMessage
                      ? "Đang gửi..."
                      : newMessage.trim() || selectedImages.length > 0 || selectedFiles.length > 0
                        ? "Gửi tin nhắn"
                        : "Nhập tin nhắn để gửi"
                  }
                >
                  {sendingMessage ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <SendHorizontal className="h-4 w-4" />
                  )}
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