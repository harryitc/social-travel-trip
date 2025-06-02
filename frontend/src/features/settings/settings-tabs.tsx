'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Label } from '@/components/ui/radix-ui/label';
import { Input } from '@/components/ui/radix-ui/input';
import { Textarea } from '@/components/ui/radix-ui/textarea';
import { Button } from '@/components/ui/radix-ui/button';
import { Switch } from '@/components/ui/radix-ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { useState } from 'react';
import { Badge } from '@/components/ui/radix-ui/badge';
import { X } from 'lucide-react';
import { API_ENDPOINT } from '@/config/api.config';

export function SettingsTabs() {
  const user: any = null;
  const [bio, setBio] = useState('Người yêu thích du lịch và khám phá văn hóa.');
  const [interests, setInterests] = useState<string[]>(['DuLich', 'Bien', 'PhuQuoc', 'Camping']);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    trip: true,
    blog: false,
    comment: true,
  });
  
  const handleAddInterest = () => {
    const interest = prompt('Nhập sở thích của bạn:');
    if (interest && !interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };
  
  const handleRemoveInterest = (interest: string) => {
    setInterests(interests.filter(i => i !== interest));
  };
  
  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-3">
        <TabsTrigger value="profile">Hồ sơ</TabsTrigger>
        <TabsTrigger value="account">Tài khoản</TabsTrigger>
        <TabsTrigger value="notifications">Thông báo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="mt-6">
        <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
          <CardHeader>
            <CardTitle>Hồ sơ</CardTitle>
            <CardDescription>
              Quản lý thông tin hồ sơ và cách người khác nhìn thấy bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-start">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={API_ENDPOINT.file_image_v2 + user?.imageUrl} alt={user?.fullName || 'Avatar'} />
                  <AvatarFallback>{user?.fullName?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">Đổi ảnh</Button>
              </div>
              
              <div className="space-y-4 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Tên</Label>
                    <Input id="firstName" defaultValue={user?.firstName || ''} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Họ</Label>
                    <Input id="lastName" defaultValue={user?.lastName || ''} />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user?.primaryEmailAddress?.emailAddress || ''} disabled />
                  <p className="text-xs text-muted-foreground">Email này không thể thay đổi</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Giới thiệu</Label>
              <Textarea 
                id="bio" 
                placeholder="Giới thiệu về bản thân" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Sở thích</Label>
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <Badge key={interest} variant="outline" className="bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800 pr-1">
                    #{interest}
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-4 w-4 ml-1 text-purple-700 dark:text-purple-300" 
                      onClick={() => handleRemoveInterest(interest)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
                <Button variant="outline" size="sm" onClick={handleAddInterest} className="h-7">Thêm</Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Hủy</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Lưu thay đổi</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="account" className="mt-6">
        <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
          <CardHeader>
            <CardTitle>Tài khoản</CardTitle>
            <CardDescription>
              Quản lý thông tin đăng nhập và bảo mật tài khoản của bạn.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
              <Input id="confirm-password" type="password" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="two-factor">Xác thực hai yếu tố</Label>
                <Switch id="two-factor" />
              </div>
              <p className="text-xs text-muted-foreground">Bảo vệ tài khoản của bạn với xác thực hai yếu tố.</p>
            </div>
            
            <div className="pt-4 border-t border-purple-100 dark:border-purple-900">
              <h3 className="text-lg font-medium text-destructive mb-2">Xóa tài khoản</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Một khi bạn xóa tài khoản, tất cả dữ liệu sẽ bị mất vĩnh viễn và không thể khôi phục.
              </p>
              <Button variant="destructive">Xóa tài khoản</Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Hủy</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Lưu thay đổi</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications" className="mt-6">
        <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
          <CardHeader>
            <CardTitle>Thông báo</CardTitle>
            <CardDescription>
              Quản lý cách bạn nhận thông báo từ ứng dụng.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="text-base">Thông báo qua email</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo qua email.</p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="text-base">Thông báo đẩy</Label>
                  <p className="text-sm text-muted-foreground">Nhận thông báo đẩy trên thiết bị của bạn.</p>
                </div>
                <Switch 
                  id="push-notifications" 
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                />
              </div>
            </div>
            
            <div className="space-y-4 border-t border-purple-100 dark:border-purple-900 pt-4">
              <h3 className="text-lg font-medium mb-2">Loại thông báo</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="trip-notifications" className="text-base">Chuyến đi</Label>
                  <p className="text-sm text-muted-foreground">Thông báo về các chuyến đi và lời mời nhóm.</p>
                </div>
                <Switch 
                  id="trip-notifications" 
                  checked={notifications.trip}
                  onCheckedChange={(checked) => setNotifications({...notifications, trip: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="blog-notifications" className="text-base">Blog</Label>
                  <p className="text-sm text-muted-foreground">Thông báo về bài viết mới từ người bạn theo dõi.</p>
                </div>
                <Switch 
                  id="blog-notifications" 
                  checked={notifications.blog}
                  onCheckedChange={(checked) => setNotifications({...notifications, blog: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="comment-notifications" className="text-base">Bình luận</Label>
                  <p className="text-sm text-muted-foreground">Thông báo khi có người bình luận trên bài viết của bạn.</p>
                </div>
                <Switch 
                  id="comment-notifications" 
                  checked={notifications.comment}
                  onCheckedChange={(checked) => setNotifications({...notifications, comment: checked})}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline">Mặc định</Button>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">Lưu thay đổi</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}