'use client';

import { useState, useRef, useEffect } from 'react';
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
  Smile,
  MoreVertical,
  Pin,
  Reply,
  X,
  MessageSquareQuote
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PinnedMessages } from './pinned-messages';

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
  }[];
};

type Member = {
  id: string;
  name: string;
  avatar: string;
};

type TripChatProps = {
  tripId: string;
  members: Member[];
};

export function TripChat({ tripId, members }: TripChatProps) {
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
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

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

  const handleSendMessage = async () => {
    if ((!newMessage.trim() && selectedImages.length === 0) || !user) return;

    // Create attachments from selected images
    const attachments = selectedImages.length > 0
      ? await Promise.all(selectedImages.map(async (file, index) => {
          // In a real app, you would upload the file to a server and get a URL
          // For now, we'll just use the object URL
          return {
            type: 'image' as const,
            url: imagePreviewUrls[index],
            name: file.name,
          };
        }))
      : undefined;

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
    setImagePreviewUrls([]);
    setReplyingTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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

                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>

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
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <Paperclip className="h-4 w-4" />
                            <span>{attachment.name}</span>
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
          <div className="mb-3 flex flex-wrap gap-2">
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
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Smile className="h-5 w-5" />
          </Button>

          <Input
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />

          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() && selectedImages.length === 0}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}