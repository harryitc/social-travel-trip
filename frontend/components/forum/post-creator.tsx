'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image as ImageIcon, MapPin, MessageCircle, XIcon, AtSign, Hash } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { POPULAR_LOCATIONS, USERS, POPULAR_HASHTAGS, SAMPLE_IMAGES } from './mock-data';

type PostCreatorProps = {
  onPostCreated: (newPost: any) => void;
};

export function PostCreator({ onPostCreated }: PostCreatorProps) {
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [location, setLocation] = useState('');
  const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [currentHashtag, setCurrentHashtag] = useState('');
  const [hashtagPopoverOpen, setHashtagPopoverOpen] = useState(false);
  const [mentionPopoverOpen, setMentionPopoverOpen] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentions, setMentions] = useState<{id: string, name: string}[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleAddHashtag = () => {
    if (currentHashtag && !hashtags.includes(currentHashtag)) {
      setHashtags([...hashtags, currentHashtag]);
      setCurrentHashtag('');
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      // Kiểm tra số lượng ảnh
      if (images.length + selectedFiles.length > 6) {
        alert('Bạn chỉ có thể tải lên tối đa 6 ảnh cho một bài viết.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Xử lý từng file được chọn
      selectedFiles.forEach(file => {
        // Kiểm tra kích thước file
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" vượt quá kích thước cho phép (5MB).`);
          return;
        }

        // Kiểm tra loại file
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" không phải là ảnh.`);
          return;
        }

        // Sử dụng FileReader để chuyển file thành Data URL
        // Data URL sẽ được lưu trữ trong bài đăng và không bị mất khi refresh trang
        const reader = new FileReader();

        reader.onload = (event) => {
          if (event.target && event.target.result) {
            // Thêm ảnh vào danh sách ảnh
            setImages(prevImages => [...prevImages, event.target!.result as string]);
          }
        };

        // Xử lý lỗi khi đọc file
        reader.onerror = () => {
          alert(`Không thể đọc file "${file.name}". Vui lòng thử lại.`);
        };

        // Đọc file dưới dạng Data URL
        reader.readAsDataURL(file);
      });

      // Reset input để có thể chọn cùng một file nhiều lần
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle content changes and detect @ mentions
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Check if user is typing @ to show mention popup
    const cursorPosition = e.target.selectionStart;
    const textBeforeCursor = newContent.substring(0, cursorPosition);
    const atIndex = textBeforeCursor.lastIndexOf('@');

    if (atIndex !== -1 && (atIndex === 0 || /\s/.test(textBeforeCursor[atIndex - 1]))) {
      const searchText = textBeforeCursor.substring(atIndex + 1);
      if (!searchText.includes(' ')) {
        setMentionSearch(searchText);
        setMentionPopoverOpen(true);
        return;
      }
    }

    setMentionPopoverOpen(false);
  };

  // Handle selecting a user to mention
  const handleSelectMention = (userName: string) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPosition);
      const atIndex = textBeforeCursor.lastIndexOf('@');

      if (atIndex !== -1) {
        const newContent =
          content.substring(0, atIndex) +
          '@' + userName + ' ' +
          content.substring(cursorPosition);

        setContent(newContent);
        setMentions([...mentions, {id: Date.now().toString(), name: userName}]);
        setMentionPopoverOpen(false);

        // Set cursor position after the inserted mention
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = atIndex + userName.length + 2; // +2 for @ and space
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    }
  };

  const handleSubmit = () => {
    if (content.trim()) {
      const newPost = {
        id: Date.now().toString(),
        author: {
          name: user?.fullName || 'Người dùng',
          avatar: user?.imageUrl || 'https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
        },
        content,
        images: images.length > 0 ? [...images] : undefined,
        likes: 0,
        comments: 0,
        shares: 0,
        createdAt: 'Vừa xong',
        hashtags,
        location,
        mentions: mentions.length > 0 ? mentions : undefined,
      };

      onPostCreated(newPost);

      // Không giải phóng URL object ngay lập tức để ảnh có thể hiển thị trong bài đăng
      // Chúng ta sẽ để trình duyệt tự giải phóng khi trang được làm mới hoặc đóng

      // Reset các trạng thái
      setContent('');
      setImages([]);
      setHashtags([]);
      setLocation('');
      setMentions([]);
    }
  };

  return (
    <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src={user?.imageUrl} alt={user?.fullName || 'Avatar'} />
            <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
          </Avatar>
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              placeholder="Chia sẻ trải nghiệm du lịch của bạn..."
              value={content}
              onChange={handleContentChange}
              className="resize-none w-full focus-visible:ring-purple-500 min-h-[80px]"
            />
            {mentionPopoverOpen && (
              <div className="absolute z-10 w-64 mt-1 bg-popover rounded-md border shadow-md">
                <Command>
                  <CommandInput placeholder="Tìm người dùng..." value={mentionSearch} onValueChange={setMentionSearch} />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy người dùng</CommandEmpty>
                    <CommandGroup heading="Gợi ý">
                      {USERS.filter(user =>
                        user.name.toLowerCase().includes(mentionSearch.toLowerCase())
                      ).map((user) => (
                        <CommandItem
                          key={user.id}
                          onSelect={() => handleSelectMention(user.name)}
                          className="flex items-center"
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          {user.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </div>
            )}
          </div>
        </div>

        {images.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">Ảnh đã chọn ({images.length}/6)</h4>
                <p className="text-xs text-muted-foreground">Tối đa 5MB mỗi ảnh</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20 h-8 px-2"
                onClick={() => {
                  // Chỉ xóa danh sách ảnh, không giải phóng URL
                  setImages([]);
                }}
              >
                Xóa tất cả
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {images.map((img, index) => (
                <div key={index} className="relative rounded-md overflow-hidden group border border-purple-100 dark:border-purple-900 aspect-square">
                  {/* eslint-disable-next-line */}
                  <img src={img} alt={`Ảnh ${index + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="h-8 w-8"
                      onClick={() => {
                        // Chỉ xóa ảnh khỏi mảng, không giải phóng URL để tránh lỗi hiển thị
                        setImages(images.filter((_, i) => i !== index));
                      }}
                    >
                      <XIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {images.length < 6 && (
                <Button
                  variant="outline"
                  className="border-dashed border-2 border-purple-200 dark:border-purple-800 flex flex-col items-center justify-center h-full aspect-square"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-6 w-6 mb-1 text-purple-500" />
                  <span className="text-xs text-center text-muted-foreground">Thêm ảnh</span>
                </Button>
              )}
            </div>
          </div>
        )}

        {hashtags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtags.map((tag) => (
              <div key={tag} className="bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 px-2 py-1 rounded-md text-sm flex items-center">
                #{tag}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-5 w-5 ml-1 text-purple-700 dark:text-purple-300"
                  onClick={() => handleRemoveHashtag(tag)}
                >
                  <XIcon className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className={`text-muted-foreground ${images.length > 0 ? 'text-purple-600 dark:text-purple-400' : ''}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Ảnh {images.length > 0 ? `(${images.length})` : ''}
              </Button>
              <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className={`text-muted-foreground ${location ? 'text-purple-600 dark:text-purple-400' : ''}`}
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {location ? location.split(',')[0] : 'Địa điểm'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start" alignOffset={-40}>
                  <Command>
                    <CommandInput placeholder="Tìm địa điểm..." />
                    <CommandList>
                      <CommandEmpty>Không tìm thấy địa điểm</CommandEmpty>
                      <CommandGroup heading="Địa điểm phổ biến">
                        {POPULAR_LOCATIONS.map((loc) => (
                          <CommandItem
                            key={loc.id}
                            onSelect={() => {
                              setLocation(loc.name);
                              setLocationPopoverOpen(false);
                            }}
                          >
                            <MapPin className="mr-2 h-4 w-4" />
                            {loc.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => {
                  if (textareaRef.current) {
                    const cursorPosition = textareaRef.current.selectionStart;
                    const newContent = content.substring(0, cursorPosition) + '@' + content.substring(cursorPosition);
                    setContent(newContent);
                    textareaRef.current.focus();
                    setTimeout(() => {
                      if (textareaRef.current) {
                        const newPosition = cursorPosition + 1;
                        textareaRef.current.setSelectionRange(newPosition, newPosition);
                      }
                    }, 0);
                  }
                }}
              >
                <AtSign className="h-4 w-4 mr-2" />
                Đề cập
              </Button>

              <Popover open={hashtagPopoverOpen} onOpenChange={setHashtagPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    <Hash className="h-4 w-4 mr-2" />
                    Hashtag
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0" side="bottom" align="start" alignOffset={-40}>
                  <Command>
                    <CommandInput
                      placeholder="Tìm hoặc tạo hashtag..."
                      value={currentHashtag}
                      onValueChange={setCurrentHashtag}
                    />
                    <CommandList>
                      <CommandEmpty>
                        <div className="py-2 px-4">
                          <p className="text-sm">Không tìm thấy hashtag</p>
                          {currentHashtag && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full"
                              onClick={() => {
                                if (currentHashtag && !hashtags.includes(currentHashtag)) {
                                  setHashtags([...hashtags, currentHashtag]);
                                  setCurrentHashtag('');
                                  setHashtagPopoverOpen(false);
                                }
                              }}
                            >
                              Tạo #{currentHashtag}
                            </Button>
                          )}
                        </div>
                      </CommandEmpty>
                      <CommandGroup heading="Hashtag phổ biến">
                        {POPULAR_HASHTAGS.map((item) => (
                          <CommandItem
                            key={item.tag}
                            onSelect={() => {
                              if (!hashtags.includes(item.tag)) {
                                setHashtags([...hashtags, item.tag]);
                              }
                              setHashtagPopoverOpen(false);
                            }}
                          >
                            <Hash className="mr-2 h-4 w-4" />
                            {item.tag}
                            <span className="ml-auto text-xs text-muted-foreground">{item.posts} bài viết</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Đăng
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}