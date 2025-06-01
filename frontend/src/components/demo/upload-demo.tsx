'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { 
  ImageUploadWithCrop, 
  SimpleImageUpload, 
  AvatarUpload, 
  UserAvatarUpload, 
  GroupAvatarUpload 
} from '@/components/ui/upload';

export function UploadDemo() {
  const [simpleImage, setSimpleImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  const [groupAvatar, setGroupAvatar] = useState<string | null>(null);
  const [multipleImages, setMultipleImages] = useState<string | null>(null);

  // Mock upload function
  const mockUpload = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return a mock URL (in real app, this would be the uploaded file URL)
    return URL.createObjectURL(file);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Upload Components Demo</h1>
        <p className="text-gray-600">Test all upload components with different configurations</p>
      </div>

      <Tabs defaultValue="simple" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="simple">Simple Upload</TabsTrigger>
          <TabsTrigger value="crop">Crop Upload</TabsTrigger>
          <TabsTrigger value="avatar">Avatar Upload</TabsTrigger>
          <TabsTrigger value="presets">Preset Avatars</TabsTrigger>
          <TabsTrigger value="multiple">Multiple Upload</TabsTrigger>
        </TabsList>

        {/* Simple Image Upload */}
        <TabsContent value="simple" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simple Image Upload</CardTitle>
              <CardDescription>
                Basic image upload with preview and drag & drop support
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimpleImageUpload
                value={simpleImage}
                onChange={setSimpleImage}
                placeholder="Upload your image here"
                uploadConfig={{
                  maxSize: 5,
                  allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
                }}
              />
              
              {simpleImage && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Uploaded URL:</p>
                  <p className="text-xs text-gray-600 break-all">{simpleImage}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Image Upload with Crop */}
        <TabsContent value="crop" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Image Upload with Crop</CardTitle>
              <CardDescription>
                Advanced image upload with crop, resize, and rotation features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ImageUploadWithCrop
                value={croppedImage}
                onChange={(file, preview) => setCroppedImage(preview)}
                onUpload={mockUpload}
                aspectRatio={16/9} // 16:9 aspect ratio
                outputWidth={800}
                outputHeight={450}
                placeholder="Upload and crop your image"
              />
              
              {croppedImage && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Cropped Image:</p>
                  <img 
                    src={croppedImage} 
                    alt="Cropped" 
                    className="mt-2 max-w-full h-auto rounded border"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Avatar Upload */}
        <TabsContent value="avatar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Avatar Upload</CardTitle>
              <CardDescription>
                Circular avatar upload with automatic cropping
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Small Avatar</p>
                  <AvatarUpload
                    value={avatar}
                    onChange={setAvatar}
                    name="John Doe"
                    size="sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Medium Avatar</p>
                  <AvatarUpload
                    value={avatar}
                    onChange={setAvatar}
                    name="John Doe"
                    size="md"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Large Avatar</p>
                  <AvatarUpload
                    value={avatar}
                    onChange={setAvatar}
                    name="John Doe"
                    size="lg"
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Extra Large Avatar</p>
                  <AvatarUpload
                    value={avatar}
                    onChange={setAvatar}
                    name="John Doe"
                    size="xl"
                  />
                </div>
              </div>
              
              {avatar && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Avatar URL:</p>
                  <p className="text-xs text-gray-600 break-all">{avatar}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preset Avatars */}
        <TabsContent value="presets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preset Avatar Components</CardTitle>
              <CardDescription>
                Pre-configured avatar uploads for different use cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">User Avatar</h3>
                  <p className="text-sm text-gray-600">
                    Optimized for user profile pictures (2MB max, 200x200px)
                  </p>
                  <UserAvatarUpload
                    value={userAvatar}
                    onChange={setUserAvatar}
                    name="Jane Smith"
                  />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Group Avatar</h3>
                  <p className="text-sm text-gray-600">
                    Larger size for group/organization pictures
                  </p>
                  <GroupAvatarUpload
                    value={groupAvatar}
                    onChange={setGroupAvatar}
                    name="Travel Group"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Multiple Upload */}
        <TabsContent value="multiple" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multiple Image Upload</CardTitle>
              <CardDescription>
                Upload multiple images with preview grid
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SimpleImageUpload
                value={multipleImages}
                onChange={setMultipleImages}
                placeholder="Upload multiple images"
                multiple={true}
                maxFiles={6}
                previewSize="sm"
                uploadConfig={{
                  maxSize: 3,
                  allowedTypes: ['image/jpeg', 'image/png']
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
