import React, { useState } from 'react';
import { TravelPlanTemplate } from './mock-data';
import Image from 'next/image';
import ApplyTemplateModal from './ApplyTemplateModal';
import { Card, CardContent, CardFooter } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/radix-ui/tooltip';
import { Separator } from '@/components/ui/radix-ui/separator';
import { cn } from '../../lib/utils';
import {
  MapPin,
  Calendar,
  Share,
  Heart,
  Download,
  Star
} from 'lucide-react';

interface TemplateDetailsProps {
  template: TravelPlanTemplate;
}

const TemplateDetails: React.FC<TemplateDetailsProps> = ({ template }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className="template-details space-y-6">
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="relative w-full h-[300px]">
            <Image
              alt={template.name}
              src={template.image}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-4 left-4 text-white">
            <h2 className="text-2xl font-bold text-white">{template.name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4" />
              <span>{template.destination}</span>
              <Separator orientation="vertical" className="h-4 bg-white/50" />
              <Calendar className="h-4 w-4" />
              <span>{template.duration} ngày</span>
            </div>
          </div>
        </div>

        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="schedule">Lịch trình chi tiết</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-4 w-4",
                        i < Math.floor(template.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      )}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({template.usageCount} lượt sử dụng)</span>
              </div>

              <p className="text-sm">{template.description}</p>

              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1" />
                  <AvatarFallback>{template.authorName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-sm">Tạo bởi {template.authorName || 'Người dùng ẩn danh'}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="secondary">#{tag}</Badge>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="mt-4">
              <div className="bg-muted rounded-md p-4">
                <Tabs
                  value={`day-${activeDay}`}
                  onValueChange={(value) => setActiveDay(parseInt(value.replace('day-', '')))}
                >
                  <TabsList className="mb-4">
                    {template.days.map((_, index) => (
                      <TabsTrigger key={`day-tab-${index}`} value={`day-${index}`}>
                        Ngày {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {template.days.map((day, dayIndex) => (
                    <TabsContent key={`day-content-${dayIndex}`} value={`day-${dayIndex}`}>
                      <div className="space-y-4">
                        {day.activities.map((activity, activityIndex) => (
                          <div
                            key={`activity-${dayIndex}-${activityIndex}`}
                            className="flex bg-white rounded-md border p-4 gap-4"
                          >
                            <div className="min-w-[80px] text-center border-r pr-4">
                              <span className="text-lg font-medium text-purple-600">{activity.time}</span>
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium mb-2">{activity.title}</h5>
                              <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                                <span>{activity.location}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFavorite(!isFavorite)}
                  >
                    <Heart className={cn("mr-2 h-4 w-4", isFavorite ? "fill-red-500 text-red-500" : "")} />
                    Yêu thích
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isFavorite ? "Bỏ yêu thích" : "Yêu thích"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Share className="mr-2 h-4 w-4" />
                    Chia sẻ
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Chia sẻ mẫu kế hoạch</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Button
            variant="default"
            size="sm"
            onClick={() => setIsModalVisible(true)}
          >
            <Download className="mr-2 h-4 w-4" />
            Áp dụng mẫu
          </Button>
        </CardFooter>
      </Card>

      <ApplyTemplateModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        template={template}
      />
    </div>
  );
};

export default TemplateDetails;
