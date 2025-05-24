'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Image as ImageIcon, MapPin, MessageCircle, XIcon, AtSign, Hash, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/radix-ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/radix-ui/command';
import { getUserInfo, isLoggedIn } from '@/features/auth/auth.service';
import { postService } from '../services/post.service';
import { fileService } from '@/features/file/file.service';
import { locationService } from '@/features/explore/services/location.service';
import { useRouter } from 'next/navigation';
import { CreatePostPayload } from '../models/post.model';
import { useWebSocket } from '@/lib/providers/websocket.provider';
import { notification } from 'antd';
import { useEventStore } from '../../stores/event.store';
import { HashtagModel } from '../models/hashtag.model';
import { hashtagService } from '../services/tag.service';
import { UserRelaWithDetails } from '../models/user.model';
import { userService } from '../services/user.service';

export function PostCreator() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [hashtags, setHashtags] = useState<HashtagModel[]>([]);
  const [hashtagsSelected, setHashtagsSelected] = useState<string[]>([]);
  const [searchHashtag, setSearchHashtag] = useState<string>('');
  const [loadingHashtag, setLoadingHashtag] = useState(false);
  // const [location, setLocation] = useState('');
  // const [locationId, setLocationId] = useState('');
  // const [locations, setLocations] = useState<any[]>([]);
  // const [loadingLocations, setLoadingLocations] = useState(false);
  // const [locationPopoverOpen, setLocationPopoverOpen] = useState(false);
  const [currentHashtag, setCurrentHashtag] = useState<string | null>(null);
  const [hashtagPopoverOpen, setHashtagPopoverOpen] = useState(false);
  const [mentionPopoverOpen, setMentionPopoverOpen] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentions, setMentions] = useState<UserRelaWithDetails[]>([]);
  const [mentionsSelected, setMentionsSelected] = useState<UserRelaWithDetails[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { emit } = useEventStore();

  // Load user info
  useEffect(() => {
    const authenticated = isLoggedIn();
    if (authenticated) {
      const userInfo = getUserInfo();
      setUser(userInfo);
    } else {
      // Redirect to login if not authenticated
      router.push('/auth/sign-in?redirect=/');
    }
  }, [router]);

  // Load locations
  // useEffect(() => {
  //   const fetchLocations = async () => {
  //     try {
  //       setLoadingLocations(true);
  //       const response = await locationService.getLocations({ limit: 10 });
  //       setLocations(response.data);
  //     } catch (error) {
  //       console.error('Error fetching locations:', error);
  //     } finally {
  //       setLoadingLocations(false);
  //     }
  //   };

  //   if (locationPopoverOpen) {
  //     fetchLocations();
  //   }
  // }, [locationPopoverOpen]);

  // Load Hashtags
  useEffect(() => {
    const fetchHashtags = async () => {
      try {
        setLoadingHashtag(true);
        const response = await hashtagService.getList(searchHashtag);
        setHashtags(response);
      } catch (error) {
        console.error('Error fetching Hashtags:', error);
      } finally {
        setLoadingHashtag(false);
      }
    };

    if (hashtagPopoverOpen) {
      fetchHashtags();
    }
  }, [hashtagPopoverOpen]);

  // load user following
  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const following = await userService.getFollowing();
        setMentions(following);
      } catch (error) {
        console.error('Error fetching following:', error);
      }
    };

    fetchFollowing();
  }, []);


  const handleAddHashtag = () => {
    if (currentHashtag && !hashtags.map(item => item.slug).includes(currentHashtag)) {
      setHashtagsSelected([...hashtagsSelected, currentHashtag]);
      setCurrentHashtag(null);
    }
  };

  const handleRemoveHashtag = (tag: string) => {
    setHashtagsSelected(hashtagsSelected.filter(t => t !== tag));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      const maxFileSize = 5 * 1024 * 1024; // 5MB

      // Check if too many images
      if (images.length + selectedFiles.length > 6) {
        alert('Bạn chỉ có thể tải lên tối đa 6 ảnh cho một bài viết.');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Process each selected file
      selectedFiles.forEach(file => {
        // Check file size
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" vượt quá kích thước cho phép (5MB).`);
          return;
        }

        // Check file type
        if (!file.type.startsWith('image/')) {
          alert(`File "${file.name}" không phải là ảnh.`);
          return;
        }

        // Add file to imageFiles state
        setImageFiles(prevFiles => [...prevFiles, file]);

        // Create preview
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && event.target.result) {
            setImages(prevImages => [...prevImages, event.target!.result as string]);
          }
        };
        reader.onerror = () => {
          alert(`Không thể đọc file "${file.name}". Vui lòng thử lại.`);
        };
        reader.readAsDataURL(file);
      });

      // Reset input
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
  const handleSelectMention = (userSelected: UserRelaWithDetails) => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const textBeforeCursor = content.substring(0, cursorPosition);
      const atIndex = textBeforeCursor.lastIndexOf('@');

      if (atIndex !== -1) {
        const newContent =
          content.substring(0, atIndex) +
          '@' + userSelected.username + ' ' +
          content.substring(cursorPosition);

        setContent(newContent);
        setMentionsSelected([...mentions, userSelected]);
        setMentionPopoverOpen(false);

        // Set cursor position after the inserted mention
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = atIndex + userSelected.username.length + 2; // +2 for @ and space
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(newPosition, newPosition);
          }
        }, 0);
      }
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;

    try {
      setIsSubmitting(true);

      // Create post payload
      const payload: CreatePostPayload = {
        content,
        hashtags: hashtagsSelected,
        mentions: mentionsSelected.map(m => m.user_id.toString()),
      };

      // Add location if selected
      // if (location) {
      //   payload.location_id = locationId || undefined;
      //   payload.location_name = location;
      // }

      // If files are provided, upload them first
      if (imageFiles && imageFiles.length > 0) {
        console.log('Uploading files:', imageFiles);
        const uploadedFiles = await fileService.uploadMultipleFiles(imageFiles);

        // Add file URLs to payload
        payload.images = uploadedFiles.map(file => file.files[0].file_url);
      }


      // Create post
      const createdPost = await postService.createPost(payload);

      emit('post:created', {
        data: createdPost
      });

      // Reset form
      setContent('');
      setImages([]);
      setImageFiles([]);
      setHashtags([]);
      // setLocation('');
      // setLocationId('');
      setMentions([]);

      // WebSocket event will be emitted by server after post creation
      console.log('Post created successfully, server will emit WebSocket event');

      setIsSubmitting(false);

    } catch (error) {
      console.error('Error creating post:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi đăng bài. Vui lòng thử lại sau.',
        type: 'error',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="relative z-1 border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
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
                      {mentions.filter(user =>
                        user.username.toLowerCase().includes(mentionSearch.toLowerCase())
                      ).map((user) => (
                        <CommandItem
                          key={user.user_id}
                          onSelect={() => handleSelectMention(user)}
                          className="flex items-center"
                        >
                          <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={user.avatar_url} alt={user.full_name} />
                            <AvatarFallback>{user.username[0]}</AvatarFallback>
                          </Avatar>
                          {user.full_name}
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

        {hashtagsSelected.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {hashtagsSelected.map((tag) => (
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
              {/* <Popover open={locationPopoverOpen} onOpenChange={setLocationPopoverOpen}>
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
                      <CommandEmpty>
                        {loadingLocations ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                          </div>
                        ) : (
                          'Không tìm thấy địa điểm'
                        )}
                      </CommandEmpty>
                      <CommandGroup heading="Địa điểm">
                        {locations.map((loc) => (
                          <CommandItem
                            key={loc.location_id || loc.city_id}
                            onSelect={() => {
                              setLocation(loc.name);
                              setLocationId(loc.location_id || loc.city_id);
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
              </Popover> */}
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
                      value={currentHashtag!}
                      onValueChange={setCurrentHashtag}
                    />
                    <CommandList>
                      <CommandEmpty>
                        {loadingHashtag ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                          </div>
                        ) : (
                          'Không tìm thấy hashtags'
                        )}
                        <div className="py-2 px-4">
                          {currentHashtag && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full"
                              onClick={() => {
                                if (currentHashtag && !hashtags.map(item => item.slug).includes(currentHashtag)) {
                                  setHashtagsSelected([...hashtagsSelected, currentHashtag]);
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
                        {hashtags.map((item) => (
                          <CommandItem
                            key={item.tag_id}
                            onSelect={() => {
                              console.log(item);
                              if (!hashtagsSelected.includes(item.slug)) {
                                console.log(item);
                                setHashtagsSelected([...hashtagsSelected, item.slug]);
                              }
                              setHashtagPopoverOpen(false);
                            }}
                          >
                            <Hash className="mr-2 h-4 w-4" />
                            {item.slug}
                            <span className="ml-auto text-xs text-muted-foreground">{item.name}</span>
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
            disabled={!content.trim() || isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Đang đăng...
              </>
            ) : (
              'Đăng'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
