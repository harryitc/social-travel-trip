import React, { useState } from 'react';
import { TravelPlanTemplate, Activity } from './mock-data';
import { TripGroup } from './trip-groups-data';
import { format, addDays, parse } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/radix-ui/tabs';
import { Separator } from '@/components/ui/radix-ui/separator';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/radix-ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/radix-ui/form';
import { Input } from '@/components/ui/radix-ui/input';
import { Textarea } from '@/components/ui/radix-ui/textarea';

import {
  Clock,
  MapPin,
  Edit,
  Trash,
  Plus,
  Users,
  Calendar,
  Save,
  FileDown
} from 'lucide-react';
import { API_ENDPOINT } from '@/config/api.config';

/**
 * Form validation schema for activity form
 * - title: Required, must be at least 1 character
 * - time: Required, must be in format HH:MM
 * - description: Optional
 * - location: Required, must be at least 1 character
 */
const formSchema = z.object({
  title: z.string().min(1, { message: 'Vui lòng nhập tên hoạt động' }),
  time: z.string()
    .min(1, { message: 'Vui lòng nhập thời gian' })
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: 'Thời gian phải có định dạng HH:MM (ví dụ: 08:30)'
    }),
  description: z.string().optional(),
  location: z.string().min(1, { message: 'Vui lòng nhập địa điểm' }),
});

interface PlanDetailsProps {
  group: TripGroup;
  template: TravelPlanTemplate;
}

/**
 * PlanDetails Component
 *
 * Displays and manages the detailed plan for a travel group based on a template.
 * Features:
 * - View and edit activities for each day
 * - View group members
 * - Add, edit, and delete activities
 * - Export plan as PDF
 */
const PlanDetails: React.FC<PlanDetailsProps> = ({ group, template }) => {
  // State for managing UI
  const [activeTab, setActiveTab] = useState("schedule");
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form handling with react-hook-form and zod validation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      time: "",
      description: "",
      location: ""
    }
  });

  /**
   * Generate dates for each day in the plan based on the group's start date
   * @returns Array of days with calculated dates
   */
  const generateDates = () => {
    const dateRange = group.date.split(' - ');
    const startDate = parse(dateRange[0], 'dd/MM/yyyy', new Date());

    return template.days.map((day, index) => {
      return {
        ...day,
        date: addDays(startDate, index)
      };
    });
  };

  // Generate days with dates
  const days = generateDates();

  /**
   * Handle editing an existing activity
   * @param activity The activity to edit
   */
  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    form.reset({
      title: activity.title,
      time: activity.time,
      description: activity.description || "",
      location: activity.location
    });
    setIsDialogOpen(true);
  };

  /**
   * Handle saving an activity (new or edited)
   * @param values Form values from the activity form
   */
  const handleSaveActivity = (values: z.infer<typeof formSchema>) => {
    // Xử lý cập nhật hoạt động với values ở đây
    console.log("Saving activity:", values);

    // Thông báo thành công
    const actionText = editingActivity ? "cập nhật" : "thêm mới";
    alert(`Hoạt động đã được ${actionText}: ${values.title} - ${values.time}`);

    setIsDialogOpen(false);
  };

  /**
   * Handle adding a new activity to a specific day
   * @param _dayId The ID of the day to add the activity to
   */
  const handleAddActivity = (_dayId: string) => {
    setEditingActivity(null);
    form.reset({
      title: "",
      time: "",
      description: "",
      location: ""
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">{group.title} - Kế hoạch chi tiết</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1">
              <Save className="h-4 w-4" />
              Lưu thay đổi
            </Button>
            <Button size="sm" className="gap-1">
              <FileDown className="h-4 w-4" />
              Xuất PDF
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{group.location}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{group.date}</span>
              </div>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{group.members.count} thành viên</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Kế hoạch này được tạo dựa trên mẫu &ldquo;{template.name}&rdquo;.
            </p>

            <div className="flex flex-wrap gap-1">
              {group.hashtags.map(tag => (
                <Badge key={tag} variant="secondary">#{tag}</Badge>
              ))}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="schedule">Lịch trình theo ngày</TabsTrigger>
                <TabsTrigger value="members">Thành viên</TabsTrigger>
              </TabsList>

              <TabsContent value="schedule" className="space-y-6 pt-4">
                {days.map((day, index) => (
                  <div key={day.id} className="space-y-4">
                    <div className="flex justify-between items-center rounded-md bg-muted p-3 border-l-4 border-primary">
                      <h3 className="font-medium">
                        Ngày {index + 1}: {format(day.date, 'dd/MM/yyyy')}
                      </h3>
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={() => handleAddActivity(day.id)}
                      >
                        <Plus className="h-4 w-4" />
                        Thêm hoạt động
                      </Button>
                    </div>

                    <div className="pl-6 border-l-2 border-muted space-y-4">
                      {day.activities.map(activity => (
                        <div key={activity.id} className="relative pl-6">
                          <div className="absolute left-[-13px] top-1 h-6 w-6 rounded-full bg-background flex items-center justify-center border-2 border-muted">
                            <Clock className="h-3 w-3 text-primary" />
                          </div>
                          <div className="text-sm font-medium text-primary mb-1">{activity.time}</div>

                          <Card>
                            <CardHeader className="flex flex-row items-center justify-between py-2 px-4">
                              <h4 className="font-medium text-base">{activity.title}</h4>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleEditActivity(activity)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive"
                                  onClick={() => {
                                    if (window.confirm(`Bạn có chắc chắn muốn xóa hoạt động "${activity.title}" không?`)) {
                                      // Xử lý xóa hoạt động ở đây
                                      alert(`Đã xóa hoạt động: ${activity.title}`);
                                    }
                                  }}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="py-2 px-4">
                              {activity.description && (
                                <p className="text-sm text-muted-foreground mb-2">{activity.description}</p>
                              )}
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3 text-blue-500" />
                                <span>{activity.location}</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="members" className="pt-4">
                <div className="space-y-4">
                  {group.members.list.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 p-3 border-b">
                      <Avatar>
                        <AvatarImage src={API_ENDPOINT.file_image_v2 + member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.name}</span>
                          {member.role === 'admin' && (
                            <Badge variant="outline" className="text-blue-500 border-blue-500">Quản trị viên</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">Thành viên nhóm</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
            </DialogTitle>
            <DialogDescription>
              Điền thông tin chi tiết về hoạt động này.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSaveActivity)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên hoạt động</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên hoạt động" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thời gian</FormLabel>
                    <FormControl>
                      <Input placeholder="HH:MM (ví dụ: 08:30)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập mô tả hoạt động"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa điểm</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập địa điểm" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit">Lưu</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanDetails;
