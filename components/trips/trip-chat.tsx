'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
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
  AtSign,
  SmilePlus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PinnedMessages } from './pinned-messages';
import { EmojiPicker } from './emoji-picker';
import { MentionSuggestion } from './mention-suggestion';
import { MessageReactions } from './message-reactions';

type Mention = {
  id: string; // User ID or 'all'
  name: string;
  startIndex: number;
  endIndex: number;
};

type Reaction = {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted with this emoji
};

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
  mentions?: Mention[];
  reactions?: Reaction[];
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
  };
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }[];
};

type Member = {
  id: string;
  name: string;
  avatar: string;
};

type TripChatProps = {
  tripId?: string; // Made optional since it's not used
  members: Member[];
};

export function TripChat({ members }: TripChatProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Mọi người ơi, mình đã book được khách sạn rồi nhé!',
      sender: {
        id: '1',
        name: 'Nguyễn Minh',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '10:30',
      pinned: true,
      attachments: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600',
          name: 'hotel.jpg',
        },
      ],
    },
    {
      id: '2',
      content: 'Tuyệt vời! Khách sạn nhìn đẹp quá.',
      sender: {
        id: '2',
        name: 'Trần Hà',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '10:32',
    },
    {
      id: '3',
      content: 'Mình đã đặt vé máy bay cho cả nhóm rồi đó.',
      sender: {
        id: '3',
        name: 'Lê Hoàng',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '10:45',
    },
    {
      id: '4',
      content: 'Cảm ơn bạn nhiều nhé!',
      sender: {
        id: '2',
        name: 'Trần Hà',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '10:47',
      replyTo: {
        id: '3',
        content: 'Mình đã đặt vé máy bay cho cả nhóm rồi đó.',
        sender: {
          id: '3',
          name: 'Lê Hoàng',
        },
      },
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionPosition, setMentionPosition] = useState({ top: 0, left: 0 });
  const [cursorPosition, setCursorPosition] = useState(0);

  // Removed unused scrollAreaRef
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    const beforeCursor = newMessage.substring(0, cursorPosition);
    const afterCursor = newMessage.substring(cursorPosition);
    const newValue = beforeCursor + emoji + afterCursor;
    setNewMessage(newValue);
    setCursorPosition(cursorPosition + emoji.length);

    // Focus back on input and set cursor position after emoji
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        inputRef.current.setSelectionRange(cursorPosition + emoji.length, cursorPosition + emoji.length);
      }
    }, 0);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    setCursorPosition(cursorPos);
    setNewMessage(value);

    // Check for @ symbol to trigger mention suggestions
    const lastAtSymbolIndex = value.lastIndexOf('@', cursorPos - 1);
    if (lastAtSymbolIndex !== -1 && (lastAtSymbolIndex === 0 || value[lastAtSymbolIndex - 1] === ' ')) {
      const query = value.substring(lastAtSymbolIndex + 1, cursorPos);
      if (!query.includes(' ')) {
        setMentionQuery(query);
        setShowMentionSuggestions(true);

        // Calculate position for suggestion dropdown
        if (inputRef.current) {
          const inputRect = inputRef.current.getBoundingClientRect();
          setMentionPosition({
            top: Math.max(inputRect.top - 250, 10), // Position above the input, but at least 10px from top
            left: inputRect.left + 10,
          });
        }
        return;
      }
    }

    setShowMentionSuggestions(false);
  };

  const handleMentionSelect = (member: Member | { id: 'all'; name: 'all'; avatar: '' }) => {
    if (member.id === '') {
      // This is the escape case - just close the suggestions
      setShowMentionSuggestions(false);
      return;
    }

    const lastAtSymbolIndex = newMessage.lastIndexOf('@', cursorPosition - 1);
    if (lastAtSymbolIndex !== -1) {
      const beforeMention = newMessage.substring(0, lastAtSymbolIndex);
      const afterMention = newMessage.substring(cursorPosition);

      // Use name for display but keep ID in a data attribute for processing
      const displayName = member.id === 'all' ? 'all' : member.name;
      const mentionText = `@${displayName}`;

      // Store the actual ID in a hidden data attribute that will be parsed later
      const newValue = beforeMention + mentionText + ' ' + afterMention;

      setNewMessage(newValue);
      setCursorPosition(lastAtSymbolIndex + mentionText.length + 1); // +1 for the space
      setShowMentionSuggestions(false);

      // Focus back on input and set cursor position after mention
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          inputRef.current.setSelectionRange(
            lastAtSymbolIndex + mentionText.length + 1,
            lastAtSymbolIndex + mentionText.length + 1
          );
        }
      }, 0);
    }
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(message => {
      if (message.id === messageId) {
        const reactions = message.reactions || [];
        const existingReaction = reactions.find(r => r.emoji === emoji);

        if (existingReaction) {
          // User already reacted with this emoji, add them again
          if (!existingReaction.users.includes(user?.id || '')) {
            return {
              ...message,
              reactions: reactions.map(r =>
                r.emoji === emoji
                  ? { ...r, count: r.count + 1, users: [...r.users, user?.id || ''] }
                  : r
              )
            };
          }
          return message; // User already reacted with this emoji
        } else {
          // New reaction
          return {
            ...message,
            reactions: [
              ...reactions,
              { emoji, count: 1, users: [user?.id || ''] }
            ]
          };
        }
      }
      return message;
    }));
  };

  const handleRemoveReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(message => {
      if (message.id === messageId && message.reactions) {
        const reactions = message.reactions;
        const existingReaction = reactions.find(r => r.emoji === emoji);

        if (existingReaction && existingReaction.users.includes(user?.id || '')) {
          if (existingReaction.count === 1) {
            // Last reaction, remove it completely
            return {
              ...message,
              reactions: reactions.filter(r => r.emoji !== emoji)
            };
          } else {
            // Decrease count and remove user
            return {
              ...message,
              reactions: reactions.map(r =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count - 1,
                      users: r.users.filter(id => id !== user?.id)
                    }
                  : r
              )
            };
          }
        }
      }
      return message;
    }));
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

  const handlePinMessage = (messageId: string) => {
    setMessages(messages.map(message =>
      message.id === messageId
        ? { ...message, pinned: !message.pinned }
        : message
    ));
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

  // Parse message content for @mentions
  const parseMentions = (content: string): Mention[] => {
    const mentions: Mention[] = [];
    // Match @name pattern
    const mentionRegex = /@([^\s]+)\b/g;
    let match;

    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedName = match[1]; // The name after @
      const startIndex = match.index;
      const endIndex = startIndex + match[0].length;

      // Handle the special case for @all
      if (mentionedName.toLowerCase() === 'all') {
        mentions.push({
          id: 'all',
          name: 'all',
          startIndex,
          endIndex
        });
        continue;
      }

      // Try to find the member by name first
      let member = members.find(m =>
        m.name.toLowerCase() === mentionedName.toLowerCase() ||
        m.name === mentionedName
      );

      // If not found by name, try by ID as fallback
      if (!member) {
        member = members.find(m => m.id === mentionedName);
      }

      if (member) {
        mentions.push({
          id: member.id,
          name: member.name,
          startIndex,
          endIndex
        });
      }
    }

    return mentions;
  };

  // Render message content with highlighted mentions
  const renderMessageWithMentions = useCallback((message: Message) => {
    if (!message.mentions || message.mentions.length === 0) {
      return <span>{message.content}</span>;
    }

    const parts: JSX.Element[] = [];
    let lastIndex = 0;

    // Sort mentions by startIndex to process them in order
    const sortedMentions = [...message.mentions].sort((a, b) => a.startIndex - b.startIndex);

    sortedMentions.forEach((mention, index) => {
      // Add text before the mention
      if (mention.startIndex > lastIndex) {
        parts.push(
          <span key={`text-${index}`}>
            {message.content.substring(lastIndex, mention.startIndex)}
          </span>
        );
      }

      // Add the mention with special styling
      const mentionText = message.content.substring(mention.startIndex, mention.endIndex);
      parts.push(
        <span
          key={`mention-${index}`}
          className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded px-1 py-0.5"
          title={mention.id === 'all' ? 'Tất cả mọi người' : `@${mention.name} (ID: ${mention.id})`}
        >
          {mentionText}
        </span>
      );

      lastIndex = mention.endIndex;
    });

    // Add any remaining text after the last mention
    if (lastIndex < message.content.length) {
      parts.push(
        <span key="text-end">
          {message.content.substring(lastIndex)}
        </span>
      );
    }

    return <>{parts}</>;
  }, [members]);

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedImages.length === 0 && selectedFiles.length === 0) || !user) return;

    // Create attachments from selected images and files
    let attachments = [];

    // Add images to attachments
    if (selectedImages.length > 0) {
      const imageAttachments = await Promise.all(selectedImages.map(async (file, index) => {
        // In a real app, you would upload the file to a server and get a URL
        // For now, we'll just use the object URL
        return {
          type: 'image' as const,
          url: imagePreviewUrls[index],
          name: file.name,
          size: file.size,
        };
      }));
      attachments.push(...imageAttachments);
    }

    // Add files to attachments
    if (selectedFiles.length > 0) {
      const fileAttachments = selectedFiles.map(file => ({
        type: 'file' as const,
        url: URL.createObjectURL(file), // In a real app, this would be a server URL
        name: file.name,
        size: file.size,
      }));
      attachments.push(...fileAttachments);
    }

    // Parse mentions in the message
    const mentions = parseMentions(newMessage);

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: {
        id: user.id,
        name: user.fullName || 'Người dùng',
        avatar: user.imageUrl,
      },
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      attachments,
      mentions: mentions.length > 0 ? mentions : undefined,
      reactions: [],
      ...(replyingTo && {
        replyTo: {
          id: replyingTo.id,
          content: replyingTo.content,
          sender: {
            id: replyingTo.sender.id,
            name: replyingTo.sender.name,
          },
        },
      }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setSelectedImages([]);
    setSelectedFiles([]);
    setImagePreviewUrls([]);
    setReplyingTo(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[calc(100vh-16rem)] flex flex-col border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
      <ScrollArea className="flex-1 p-4">
        <PinnedMessages
          messages={messages}
          onUnpin={handlePinMessage}
          onScrollToMessage={scrollToMessage}
        />

        <div className="space-y-4">
          {messages.map((message) => (
            <div
              id={`message-${message.id}`}
              key={message.id}
              className={`flex gap-3 transition-colors duration-300 ${
                message.sender.id === user?.id ? 'flex-row-reverse' : ''
              }`}
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
              </Avatar>

              <div className={`flex flex-col gap-1 max-w-[70%] ${
                message.sender.id === user?.id ? 'items-end' : ''
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{message.sender.name}</span>
                  <span className="text-xs text-muted-foreground">{message.timestamp}</span>

                  {message.pinned && (
                    <Pin className="h-3 w-3 text-purple-600" />
                  )}
                </div>

                <div className={`relative rounded-lg p-3 group ${
                  message.sender.id === user?.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-secondary'
                }`}>
                  {message.replyTo && (
                    <div className={`mb-2 p-2 rounded text-xs flex items-start gap-1 ${
                      message.sender.id === user?.id
                        ? 'bg-purple-700/50'
                        : 'bg-secondary-foreground/10'
                    }`}>
                      <MessageSquareQuote className="h-3 w-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium">{message.replyTo.sender.name}</div>
                        <div className="truncate">{message.replyTo.content}</div>
                      </div>
                    </div>
                  )}

                  <p className="text-sm whitespace-pre-wrap">{renderMessageWithMentions(message)}</p>

                  {/* Message reactions */}
                  {((message.reactions && message.reactions.length > 0) || message.sender.id !== user?.id) && (
                    <div id={`reaction-${message.id}`}>
                      <MessageReactions
                        reactions={message.reactions || []}
                        messageId={message.id}
                        currentUserId={user?.id || ''}
                        onAddReaction={handleAddReaction}
                        onRemoveReaction={handleRemoveReaction}
                      />
                    </div>
                  )}

                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {message.attachments.map((attachment, index) => (
                        attachment.type === 'image' ? (
                          <div key={index} className="rounded-md overflow-hidden">
                            {/* eslint-disable-next-line */}
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

                  <div className={`absolute ${message.sender.id === user?.id ? 'left-0' : 'right-0'} top-1/2 -translate-y-1/2 ${message.sender.id === user?.id ? '-translate-x-full' : 'translate-x-full'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={message.sender.id === user?.id ? "end" : "start"}>
                        <DropdownMenuItem onClick={() => handleReplyMessage(message)}>
                          <Reply className="h-4 w-4 mr-2" />
                          Phản hồi
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePinMessage(message.id)}>
                          <Pin className="h-4 w-4 mr-2" />
                          {message.pinned ? 'Bỏ ghim' : 'Ghim tin nhắn'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          // Close dropdown and show reaction bar for this message
                          const reactionComponent = document.getElementById(`reaction-${message.id}`);
                          if (reactionComponent) {
                            const reactionButton = reactionComponent.querySelector('button');
                            if (reactionButton) {
                              reactionButton.click();
                            }
                          }
                        }}>
                          <SmilePlus className="h-4 w-4 mr-2" />
                          Thả cảm xúc
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div ref={messageEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-purple-100 dark:border-purple-900">
        {/* Image preview area */}
        {imagePreviewUrls.length > 0 && (
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Hình ảnh ({imagePreviewUrls.length})</div>
            <div className="flex flex-wrap gap-2">
              {imagePreviewUrls.map((url, index) => (
                <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden bg-secondary">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-5 w-5 p-0 bg-black/50 rounded-full"
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
          <div className="mb-3">
            <div className="text-xs text-muted-foreground mb-1">Tệp đính kèm ({selectedFiles.length})</div>
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-secondary/50">
                  <div className="flex items-center gap-2">
                    <FileIcon className="h-4 w-4 text-muted-foreground" />
                    <div className="flex flex-col">
                      <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                      <span className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 p-0"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply preview */}
        {replyingTo && (
          <div className="mb-3 p-2 rounded-md bg-secondary/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-xs font-medium">
                  Đang trả lời {replyingTo.sender.name}
                </div>
                <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {replyingTo.content}
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 p-0"
              onClick={cancelReply}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
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
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Đính kèm tệp"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <EmojiPicker onEmojiSelect={handleEmojiSelect} />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              if (inputRef.current) {
                const cursorPos = inputRef.current.selectionStart || 0;
                const beforeCursor = newMessage.substring(0, cursorPos);
                const afterCursor = newMessage.substring(cursorPos);
                const newValue = beforeCursor + '@' + afterCursor;

                setNewMessage(newValue);
                setCursorPosition(cursorPos + 1);

                // Focus back on input and set cursor position after @
                setTimeout(() => {
                  if (inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.setSelectionRange(cursorPos + 1, cursorPos + 1);

                    // Show mention suggestions
                    setMentionQuery('');
                    setShowMentionSuggestions(true);

                    // Calculate position for suggestion dropdown
                    const inputRect = inputRef.current.getBoundingClientRect();
                    setMentionPosition({
                      top: Math.max(inputRect.top - 250, 10), // Position above the input, but at least 10px from top
                      left: inputRect.left + 10,
                    });
                  }
                }, 0);
              }
            }}
            title="Nhắc đến (@)"
          >
            <AtSign className="h-5 w-5" />
          </Button>

          <Input
            ref={inputRef}
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={(e) => setCursorPosition((e.target as HTMLInputElement).selectionStart || 0)}
            onClick={(e) => setCursorPosition((e.target as HTMLInputElement).selectionStart || 0)}
            className="flex-1"
          />

          {/* Mention suggestions */}
          {showMentionSuggestions && (
            <MentionSuggestion
              members={members}
              query={mentionQuery}
              position={mentionPosition}
              onSelect={handleMentionSelect}
            />
          )}

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && selectedImages.length === 0 && selectedFiles.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}