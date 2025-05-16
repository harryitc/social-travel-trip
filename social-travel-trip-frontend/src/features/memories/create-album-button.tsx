'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { PlusIcon } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/radix-ui/dialog';
import { Input } from '@/components/ui/radix-ui/input';
import { Label } from '@/components/ui/radix-ui/label';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Switch } from '@/components/ui/radix-ui/switch';

export function CreateAlbumButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  
  const handleCreateAlbum = () => {
    // Handle album creation logic here
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <PlusIcon className="mr-2 h-4 w-4" />
          Tạo album
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tạo album mới</DialogTitle>
          <DialogDescription>
            Tạo album để lưu trữ và sắp xếp ảnh của bạn theo chủ đề.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cover-image" className="text-right">
              Ảnh bìa
            </Label>
            <Input id="cover-image" type="file" accept="image/*" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Tiêu đề
            </Label>
            <Input id="title" placeholder="Nhập tiêu đề album" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              Mô tả
            </Label>
            <Textarea 
              id="description" 
              placeholder="Mô tả về album của bạn" 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="location" className="text-right">
              Địa điểm
            </Label>
            <Input id="location" placeholder="Nhập địa điểm" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="tags" className="text-right">
              Tags
            </Label>
            <Input id="tags" placeholder="Nhập tags (phân cách bằng dấu phẩy)" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">
              Riêng tư
            </Label>
            <div className="flex items-center space-x-2 col-span-3">
              <Switch id="privacy" checked={isPrivate} onCheckedChange={setIsPrivate} />
              <Label htmlFor="privacy" className="font-normal text-sm text-muted-foreground">
                {isPrivate ? 'Chỉ mình tôi' : 'Công khai với mọi người'}
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Hủy</Button>
          <Button onClick={handleCreateAlbum} className="bg-purple-600 hover:bg-purple-700 text-white">
            Tạo album
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}