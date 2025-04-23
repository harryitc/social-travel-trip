'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon, MapPin, Smile } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { useDropzone } from 'react-dropzone';
import EmojiPicker from 'emoji-picker-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function CreateBlogButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [content, setContent] = useState('');
  const [location, setLocation] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [images, setImages] = useState<string[]>([]);
  
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': []
    },
    maxFiles: 3,
    onDrop: (acceptedFiles) => {
      // In a real app, you would upload these files to a server
      // For demo, we'll use URLs directly
      const newImages = acceptedFiles.slice(0, 3).map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...newImages].slice(0, 3));
    }
  });

  const handleCreateBlog = () => {
    // In a real application, create the blog post
    // For demo, we just close the dialog and redirect
    setIsOpen(false);
    router.push('/blog/new');
  };

  const handleAddHashtag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value) {
      const newTag = e.currentTarget.value.replace(/\s+/g, '');
      if (!hashtags.includes(newTag)) {
        setHashtags([...hashtags, newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  const removeHashtag = (tagToRemove: string) => {
    setHashtags(hashtags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Tạo bài viết
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
          <DialogDescription>
            Chia sẻ trải nghiệm du lịch của bạn với cộng đồng.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Nội dung</Label>
            <Textarea 
              placeholder="Chia sẻ trải nghiệm của bạn..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px]"
              maxLength={500}
            />
            <div className="text-xs text-muted-foreground text-right">
              {content.length}/500 ký tự
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Hình ảnh</Label>
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-purple-500 transition-colors">
              <input {...getInputProps()} />
              <p className="text-sm text-muted-foreground">Kéo thả hoặc click để chọn ảnh (tối đa 3 ảnh)</p>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {images.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    {/* eslint-disable-next-line */}
                    <img
                      src={image}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => setImages(images.filter((_, i) => i !== index))}
                    >
                      <PlusIcon className="h-4 w-4 rotate-45" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-2">
            <Label>Địa điểm</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Thêm vị trí"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label>Cảm xúc</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    {selectedEmoji || <Smile className="h-4 w-4" />}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <EmojiPicker
                    onEmojiClick={(emojiData) => setSelectedEmoji(emojiData.emoji)}
                    width="100%"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label>Hashtag</Label>
            <Input
              placeholder="Nhập hashtag và nhấn Enter"
              onKeyPress={handleAddHashtag}
            />
            {hashtags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {hashtags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                    onClick={() => removeHashtag(tag)}
                  >
                    #{tag}
                    <PlusIcon className="h-3 w-3 ml-1 rotate-45 cursor-pointer" />
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
          <Button 
            onClick={handleCreateBlog} 
            className="bg-purple-600 hover:bg-purple-700 text-white"
            disabled={!content.trim() || images.length === 0}
          >
            Đăng bài
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}