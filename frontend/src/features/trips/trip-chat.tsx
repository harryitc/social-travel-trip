'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './chat-animations.css';
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
import { chatMotionVariants } from './components/chat-motion-variants';

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
  // System message properties
  isSystemMessage?: boolean;
  systemMessageType?: 'member_joined' | 'member_left';
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
  const [isUserNearBottom, setIsUserNearBottom] = useState(true);
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);

  // Pagination states for load more messages
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [loadingOlderMessages, setLoadingOlderMessages] = useState(false);
  const [oldestMessageId, setOldestMessageId] = useState<number | null>(null);
  const [isUserNearTop, setIsUserNearTop] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial messages from API
  useEffect(() => {
    const loadMessages = async () => {
      if (!tripId) return;

      // Reset pagination states when tripId changes
      setMessages([]);
      setHasMoreMessages(true);
      setOldestMessageId(null);
      setLoadingOlderMessages(false);
      setIsUserNearTop(false);

      try {
        setLoading(true);
        const result = await tripGroupService.getMessages(tripId, 10); // Load latest 50 messages

        if (result && result.messages) {
          const transformedMessages = result.messages.map(transformMessage);
          setMessages(transformedMessages);

          // Set pagination states
          setHasMoreMessages(result.hasMore || false);
          if (transformedMessages.length > 0) {
            // For initial load, oldest message is the first one (chronologically oldest)
            setOldestMessageId(parseInt(transformedMessages[0].id));
          }

          // Emit event that messages have been loaded
          emit('chat:messages_loaded', {
            groupId: tripId,
            messages: transformedMessages
          });

          // Scroll to bottom after initial load
          setTimeout(() => {
            if (messageEndRef.current) {
              messageEndRef.current.scrollIntoView({
                behavior: 'auto', // Use 'auto' for immediate scroll on initial load
                block: 'end',
                inline: 'nearest'
              });
              setIsUserNearBottom(true);
            }
          }, 100);
        } else {
          setMessages([]);
          setHasMoreMessages(false);
          setOldestMessageId(null);

          // Emit event with empty messages
          emit('chat:messages_loaded', {
            groupId: tripId,
            messages: []
          });

          // Ensure scroll is at bottom even for empty state
          setIsUserNearBottom(true);
        }
      } catch (error: any) {
        console.error('❌ [TripChat] Error loading messages:', error);
        notification.error({
          message: 'Lỗi',
          description: error?.message || 'Không thể tải tin nhắn. Vui lòng thử lại sau.',
          placement: 'topRight',
        });
        setMessages([]);
        setHasMoreMessages(false);
        setOldestMessageId(null);

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

  // Ensure scroll to bottom on component mount
  useEffect(() => {
    // Set initial state to be at bottom
    setIsUserNearBottom(true);
    setShowScrollToBottom(false);

    // Scroll to bottom after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (messageEndRef.current) {
        messageEndRef.current.scrollIntoView({
          behavior: 'auto',
          block: 'end',
          inline: 'nearest'
        });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [tripId]); // Re-run when tripId changes

  // Load older messages function
  const loadOlderMessages = useCallback(async () => {
    if (!tripId || !hasMoreMessages || loadingOlderMessages || !oldestMessageId) {
      return;
    }

    try {
      setLoadingOlderMessages(true);

      const result = await tripGroupService.getMessages(tripId, 10, oldestMessageId);

      if (result && result.messages && result.messages.length > 0) {
        const transformedMessages = result.messages.map(transformMessage);

        // Store current scroll position
        const scrollArea = scrollAreaRef.current;
        const viewport = scrollArea?.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
        const previousScrollHeight = viewport?.scrollHeight || 0;
        const previousScrollTop = viewport?.scrollTop || 0;

        // Prepend older messages to the beginning of the array
        setMessages(prev => [...transformedMessages, ...prev]);

        // Update pagination states
        setHasMoreMessages(result.hasMore || false);
        if (transformedMessages.length > 0) {
          // For load more, oldest message is the first one in the new batch (chronologically oldest)
          const newOldestId = parseInt(transformedMessages[0].id);
          setOldestMessageId(newOldestId);
        }

        // Maintain scroll position after new messages are added
        // Use requestAnimationFrame for better timing
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (viewport) {
              const newScrollHeight = viewport.scrollHeight;
              const heightDifference = newScrollHeight - previousScrollHeight;
              const newScrollTop = previousScrollTop + heightDifference;
              viewport.scrollTop = newScrollTop;
            }
          });
        });

      } else {
        setHasMoreMessages(false);
      }
    } catch (error: any) {
      console.error('❌ [TripChat] Error loading older messages:', error);
      // notification.error({
      //   message: 'Lỗi',
      //   description: 'Không thể tải tin nhắn cũ hơn. Vui lòng thử lại.',
      //   placement: 'topRight',
      //   duration: 3,
      // });
    } finally {
      setLoadingOlderMessages(false);
    }
  }, [tripId, hasMoreMessages, loadingOlderMessages, oldestMessageId]);

  // WebSocket integration for real-time messaging
  useEffect(() => {
    if (!tripId) return;


    // Set up event listeners first
    const handleNewMessage = (data: { groupId: number; senderId: number; message: any }) => {
      if (data.groupId.toString() == tripId) {
        const transformedMessage = transformMessage(data.message);

        // Mark as new message for animation
        setNewMessageIds(prev => new Set([...prev, transformedMessage.id]));

        // Remove animation class after animation completes
        setTimeout(() => {
          setNewMessageIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(transformedMessage.id);
            return newSet;
          });

          // Clean up animation optimization
          const messageElement = document.getElementById(`message-${transformedMessage.id}`);
          if (messageElement) {
            messageElement.classList.add('animation-complete');
          }
        }, 1000);

        setMessages(prev => {
          // Check if message already exists to prevent duplicates
          const exists = prev.some(msg => msg.id == transformedMessage.id);
          if (exists) {
            return prev;
          }

          // Also check for potential duplicates by content and timestamp (for edge cases)
          const contentDuplicate = prev.some(msg =>
            msg.content == transformedMessage.content &&
            msg.sender.id == transformedMessage.sender.id &&
            Math.abs(new Date(msg.timestamp).getTime() - new Date(transformedMessage.timestamp).getTime()) < 5000 // Within 5 seconds
          );

          if (contentDuplicate) {
            return prev;
          }

          const newMessages = [...prev, transformedMessage];

          // Update oldest message ID if this is the first message
          if (prev.length === 0) {
            setOldestMessageId(parseInt(transformedMessage.id));
          }

          return newMessages;
        });

        // Emit event for other components
        emit('chat:message_received', {
          groupId: tripId,
          message: transformedMessage
        });
      }
    };

    const handleMessageLike = (data: {
      groupId: number;
      messageId: number;
      likerId: number;
      likeCount: number;
      isLiked: boolean;
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
      }>;
    }) => {
      if (data.groupId.toString() == tripId) {
        setMessages(prev => prev.map(msg =>
          msg.id == data.messageId.toString()
            ? {
              ...msg,
              likeCount: data.likeCount,
              reactions: data.reactions || msg.reactions || []
            }
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

    // Handle member join events
    const handleMemberJoined = (data: { groupId: number; newMemberId: number; member: any }) => {
      if (data.groupId.toString() == tripId) {
        console.log('👥 Member joined group:', data);

        // Create system message for member join
        const systemMessage: Message = {
          id: `system-join-${Date.now()}`,
          content: `${data.member?.username || data.member?.nickname || 'Một thành viên'} đã tham gia nhóm`,
          sender: {
            id: 'system',
            name: 'System',
            avatar: ''
          },
          timestamp: formatMessageTimestamp(new Date().toISOString()),
          rawTimestamp: new Date().toISOString(),
          isSystemMessage: true,
          systemMessageType: 'member_joined'
        };

        setMessages(prev => [...prev, systemMessage]);
      }
    };

    // Handle member leave events
    const handleMemberLeft = (data: { groupId: number; leftMemberId: number }) => {
      if (data.groupId.toString() == tripId) {
        console.log('👥 Member left group:', data);

        // Create system message for member leave
        const systemMessage: Message = {
          id: `system-leave-${Date.now()}`,
          content: `Một thành viên đã rời khỏi nhóm`,
          sender: {
            id: 'system',
            name: 'System',
            avatar: ''
          },
          timestamp: formatMessageTimestamp(new Date().toISOString()),
          rawTimestamp: new Date().toISOString(),
          isSystemMessage: true,
          systemMessageType: 'member_left'
        };

        setMessages(prev => [...prev, systemMessage]);
      }
    };

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
    websocketService.on('group:member:joined', handleMemberJoined);
    websocketService.on('group:member:left', handleMemberLeft);
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
      websocketService.off('group:member:joined', handleMemberJoined);
      websocketService.off('group:member:left', handleMemberLeft);
      websocketService.off('user:typing', handleTyping);
      websocketService.off('connection_established', handleTestEvent);
      websocketService.off('user:online', handleTestEvent);

      websocketService.leaveGroup(tripId);
    };
  }, [tripId, emit]);

  // Smart scroll behavior - auto-scroll to bottom when messages change
  useEffect(() => {
    if (messageEndRef.current) {
      if (isUserNearBottom || messages.length === 0) {
        // Auto-scroll if user is near bottom or no messages yet
        setTimeout(() => {
          messageEndRef.current?.scrollIntoView({
            behavior: messages.length === 0 ? 'auto' : 'smooth', // Immediate scroll for initial load
            block: 'end',
            inline: 'nearest'
          });
        }, 50);
      } else {
        // Show scroll to bottom button when user is not at bottom and new messages arrive
        setShowScrollToBottom(true);
      }
    }
  }, [messages, isUserNearBottom]);

  // Monitor scroll position to determine if user is near bottom or top
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    let scrollTimeout: NodeJS.Timeout | null = null;
    let isScrolling = false;
    let hasUserScrolled = false; // Track if user has manually scrolled

    const handleScroll = () => {
      const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;
      if (!viewport) return;

      const { scrollTop, scrollHeight, clientHeight } = viewport;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100; // 100px threshold
      const isNearTop = scrollTop < 150; // 150px from top for better UX

      setIsUserNearBottom(isNearBottom);
      setIsUserNearTop(isNearTop);

      // Mark that user has scrolled (to prevent auto-load on initial render)
      if (!hasUserScrolled && scrollTop > 0) {
        hasUserScrolled = true;
      }

      // Hide scroll to bottom button when user scrolls to bottom
      if (isNearBottom) {
        setShowScrollToBottom(false);
      }

      // Only trigger load more if user has manually scrolled and we have messages
      if (isNearTop && hasMoreMessages && !loadingOlderMessages && !isScrolling && hasUserScrolled && messages.length > 0) {
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }

        isScrolling = true;
        scrollTimeout = setTimeout(() => {
          console.log('🔄 [TripChat] Triggering load more from scroll detection');
          loadOlderMessages().finally(() => {
            isScrolling = false;
          });
        }, 200); // Reduced debounce for better responsiveness
      }
    };

    const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
    if (viewport) {
      viewport.addEventListener('scroll', handleScroll, { passive: true });

      // Initial check
      handleScroll();

      return () => {
        viewport.removeEventListener('scroll', handleScroll);
        if (scrollTimeout) {
          clearTimeout(scrollTimeout);
        }
      };
    }
  }, [tripId, hasMoreMessages, loadingOlderMessages, loadOlderMessages]); // Re-setup when dependencies change

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
        description: error?.message || 'Không thể ghim tin nhắn. Vui lòng thử lại sau.',
        placement: 'topRight',
      })
      console.error('Error toggling pin message:', error);
    }
  };

  const handleReactionUpdate = async (messageId: string, newLikeCount: number) => {
    // Since reactions data will be updated via WebSocket, we just need to update the count
    // The full reactions data will come from the server via WebSocket events
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
        1: 'hủy reaction',
        2: 'thích',
        3: 'yêu thích',
        4: 'haha',
        5: 'wow',
        6: 'buồn'
      };

      // notification.success({
      //   message: 'Thành công',
      //   description: `Đã ${reactionLabels[reactionId] || 'react'} tin nhắn`,
      //   placement: 'topRight',
      //   duration: 1,
      // });
    } catch (error: any) {
      console.error('Error reacting to message:', error);
      notification.error({
        message: 'Lỗi',
        description: error?.message || 'Không thể thực hiện reaction. Vui lòng thử lại sau.',
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

  const scrollToBottom = () => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest'
      });
      setShowScrollToBottom(false);
      setIsUserNearBottom(true);
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
        } catch (uploadError: any) {
          console.error('Error uploading images:', uploadError);
          notification.error({
            message: 'Lỗi tải lên hình ảnh',
            description: uploadError?.message || 'Không thể tải lên hình ảnh. Vui lòng thử lại.',
            placement: 'topRight',
          });
          return;
        }
      }

      // Upload files
      if (selectedFiles.length > 0) {
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
            description: uploadError?.message || 'Không thể tải lên tệp. Vui lòng thử lại.',
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

      // Ensure user is marked as near bottom when they send a message
      setIsUserNearBottom(true);
      setShowScrollToBottom(false);

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
      // if (attachments.length > 0) {
      //   notification.success({
      //     message: 'Thành công',
      //     description: `Đã gửi tin nhắn với ${attachments.length} tệp đính kèm`,
      //     placement: 'topRight',
      //     duration: 2,
      //   });
      // }

    } catch (error: any) {
      console.error('❌ [TripChat] Error sending message:', error);

      // Show appropriate error message
      let errorMessage = error?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại sau.';

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
            <ScrollArea ref={scrollAreaRef} className={`flex-1 p-3 relative chat-scroll-area`}>
              <PinnedMessages
                messages={messages}
                onUnpin={handlePinMessage}
                onScrollToMessage={scrollToMessage}
              />

              {loading ? (
                <ChatSkeleton />
              ) : (
                <motion.div
                  className={`space-y-4 px-2 message-container ${isTyping ? 'typing-mode' : ''}`}
                  variants={chatMotionVariants.messageContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Loading indicator for older messages */}
                  <AnimatePresence>
                    {loadingOlderMessages && (
                      <motion.div
                        className="flex justify-center py-4"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
                          <div className="flex space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-purple-500 rounded-full"
                              variants={chatMotionVariants.typingDot}
                              animate="animate"
                            />
                            <motion.div
                              className="w-2 h-2 bg-purple-500 rounded-full"
                              variants={chatMotionVariants.typingDot}
                              animate="animate"
                              style={{ animationDelay: '0.1s' }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-purple-500 rounded-full"
                              variants={chatMotionVariants.typingDot}
                              animate="animate"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">Đang tải tin nhắn cũ hơn...</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Load more button (optional - shown when not auto-loading) */}
                  {!loadingOlderMessages && hasMoreMessages && !isUserNearTop && messages.length > 0 && (
                    <div className="flex justify-center py-2">
                      <button
                        onClick={loadOlderMessages}
                        className="px-4 py-2 text-sm bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-full border border-purple-200 dark:border-purple-700 transition-all duration-200 hover:scale-105 shadow-sm hover:shadow-md"
                      >
                        Tải tin nhắn cũ hơn
                      </button>
                    </div>
                  )}

                  {messages.map((message, index) => {
                    // Check if this is a system message
                    if (message.isSystemMessage) {
                      return (
                        <motion.div
                          id={`message-${message.id}`}
                          key={`${message.id}-${index}`}
                          className="flex justify-center my-2"
                          variants={chatMotionVariants.message}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <motion.div
                            className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                          >
                            <span className="flex items-center gap-2">
                              {message.systemMessageType === 'member_joined' && (
                                <motion.span
                                  className="text-green-500"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                                >
                                  👋
                                </motion.span>
                              )}
                              {message.systemMessageType === 'member_left' && (
                                <motion.span
                                  className="text-orange-500"
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
                                >
                                  👋
                                </motion.span>
                              )}
                              {message.content}
                            </span>
                          </motion.div>
                        </motion.div>
                      );
                    }

                    // Compare with user ID from auth context - convert both to string for comparison
                    const isOwnMessage = user?.user_id ? message.sender.id == user.user_id.toString() : false;

                    // Check if this is a new message for animation
                    const isNewMessage = newMessageIds.has(message.id);

                    // Use combination of id and index to ensure unique keys
                    const uniqueKey = `${message.id}-${index}`;
                    return (
                      <motion.div
                        id={`message-${message.id}`}
                        key={uniqueKey}
                        className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
                        variants={isNewMessage ? chatMotionVariants.newMessage : chatMotionVariants.message}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ delay: index * 0.02 }}
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
                          <div
                            className={`relative px-4 py-2.5 group shadow-sm ${isOwnMessage
                              ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-2xl rounded-br-md'
                              : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 rounded-2xl rounded-bl-md'
                              }`}
                          >
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
                              {
                                (message.likeCount || 0) > 0 && (
                                  <MessageReactions
                                    messageId={message.id}
                                    likeCount={message.likeCount || 0}
                                    reactions={message.reactions || []}
                                    onReactionUpdate={handleReactionUpdate}
                                    isOwnMessage={isOwnMessage}
                                  />
                                )
                              }
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
                      </motion.div>
                    );
                  })}

                  <div ref={messageEndRef} />
                </motion.div>
              )}

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollToBottom && (
                  <motion.div
                    className="absolute bottom-4 right-4 z-10"
                    variants={chatMotionVariants.scrollButton}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      animate="bounce"
                    >
                      <Button
                        onClick={scrollToBottom}
                        className="h-10 w-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl"
                        size="icon"
                        title="Cuộn xuống tin nhắn mới"
                      >
                        <svg
                          className="h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Typing indicator */}
              <AnimatePresence>
                {typingUsers.size > 0 && (
                  <motion.div
                    className="absolute bottom-4 left-4 z-10"
                    variants={chatMotionVariants.typingIndicator}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <div className="flex gap-3 items-center px-2">
                      <div className="flex-shrink-0">
                        <motion.div
                          className="h-9 w-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                        >
                          <div className="flex space-x-1">
                            <motion.div
                              className="w-2 h-2 bg-purple-500 rounded-full"
                              variants={chatMotionVariants.typingDot}
                              animate="animate"
                            />
                            <motion.div
                              className="w-2 h-2 bg-purple-500 rounded-full"
                              variants={chatMotionVariants.typingDot}
                              animate="animate"
                              style={{ animationDelay: '0.1s' }}
                            />
                            <motion.div
                              className="w-2 h-2 bg-purple-500 rounded-full"
                              variants={chatMotionVariants.typingDot}
                              animate="animate"
                              style={{ animationDelay: '0.2s' }}
                            />
                          </div>
                        </motion.div>
                      </div>
                      <motion.div
                        className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 border border-gray-200 dark:border-gray-700 shadow-sm"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-sm text-gray-600 dark:text-gray-400 italic">
                          {typingUsers.size == 1 ? 'Ai đó đang nhập...' : `${typingUsers.size} người đang nhập...`}
                        </span>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </ScrollArea>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 chat-input-area">{/* Input area */}
              {/* Image preview area */}
              <AnimatePresence>
                {imagePreviewUrls.length > 0 && (
                  <div
                    className="mb-3"
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Hình ảnh ({imagePreviewUrls.length})
                    </div>
                    <div
                      className="flex flex-wrap gap-2"
                    >
                      {imagePreviewUrls.map((url, index) => (
                        <div
                          key={index}
                          className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={url}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                          <div
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 hover:bg-red-600 rounded-full shadow-md"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X className="h-3 w-3 text-white" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </AnimatePresence>

              {/* File preview area */}
              <AnimatePresence>
                {selectedFiles.length > 0 && (
                  <motion.div
                    className="mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tệp đính kèm ({selectedFiles.length})
                    </div>
                    <motion.div
                      className="space-y-2"
                      variants={chatMotionVariants.messageContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {selectedFiles.map((file, index) => (
                        <motion.div
                          key={index}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                          variants={chatMotionVariants.fileUpload}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <div className="flex items-center gap-2">
                            <motion.div
                              className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.2 }}
                            >
                              <FileIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            </motion.div>
                            <div className="flex flex-col">
                              <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">{Math.round(file.size / 1024)} KB</span>
                            </div>
                          </div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X className="h-3 w-3 text-red-500" />
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Reply preview */}
              <AnimatePresence>
                {replyingTo && (
                  <motion.div
                    className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-center justify-between"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <MessageSquareQuote className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </motion.div>
                      <div>
                        <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
                          Đang trả lời {replyingTo.sender.name}
                        </div>
                        <div className="text-sm text-blue-600 dark:text-blue-400 truncate message-content max-w-[250px]">
                          {replyingTo.content}
                        </div>
                      </div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 p-0 hover:bg-blue-200 dark:hover:bg-blue-800"
                        onClick={cancelReply}
                      >
                        <X className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                      </Button>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Input controls */}
              <div
                className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-2xl p-2 border border-gray-200 dark:border-gray-700 transition-all duration-200 focus-within:border-purple-300 focus-within:shadow-lg focus-within:shadow-purple-500/10"
              >
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
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => imageInputRef.current?.click()}
                      title="Tải lên hình ảnh"
                      className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-full"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => fileInputRef.current?.click()}
                      title="Đính kèm tệp"
                      className="h-8 w-8 text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/20 rounded-full"
                    >
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </motion.div>
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
                <motion.div
                  whileHover={{ scale: sendingMessage ? 1 : 1.1 }}
                  whileTap={{ scale: sendingMessage ? 1 : 0.9 }}
                  animate={sendingMessage ? { rotate: 360 } : { rotate: 0 }}
                  transition={{
                    rotate: { duration: 1, repeat: sendingMessage ? Infinity : 0, ease: "linear" },
                    scale: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                >
                  <Button
                    onClick={handleSendMessage}
                    disabled={(!newMessage.trim() && selectedImages.length == 0 && selectedFiles.length == 0) || sendingMessage}
                    className="h-8 w-8 p-0 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white rounded-full shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    title={
                      sendingMessage
                        ? "Đang gửi..."
                        : newMessage.trim() || selectedImages.length > 0 || selectedFiles.length > 0
                          ? "Gửi tin nhắn"
                          : "Nhập tin nhắn để gửi"
                    }
                  >
                    {sendingMessage ? (
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <SendHorizontal className="h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
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