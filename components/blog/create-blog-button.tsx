'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
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

export function CreateBlogButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  
  const handleCreateBlog = () => {
    // In a real application, create the blog post
    // For demo, we just close the dialog and redirect
    setIsOpen(false);
    router.push('/blog/new');
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tiêu đề
            </Label>
            <Input id="title" placeholder="Nhập tiêu đề bài viết" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="excerpt" className="text-right pt-2">
              Mô tả ngắn
            </Label>
            <Textarea 
              id="excerpt" 
              placeholder="Mô tả ngắn về bài viết của bạn" 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cover-image" className="text-right">
              Ảnh bìa
            </Label>
            <Input id="cover-image" type="file" accept="image/*" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Hashtag
            </Label>
            <Input id="tags" placeholder="DuLich, Bien, PhuQuoc,..." className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
          <Button onClick={handleCreateBlog} className="bg-purple-600 hover:bg-purple-700 text-white">Tiếp tục</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}