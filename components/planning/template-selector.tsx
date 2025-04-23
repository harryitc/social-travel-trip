'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { TripTemplate, TRIP_TEMPLATES } from './trip-templates';
import { Activity, Day } from './trip-planner';

interface TemplateSelectorProps {
  onSelectTemplate: (template: TripTemplate) => void;
}

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TripTemplate | null>(null);
  const [open, setOpen] = useState(false);

  const handleSelectTemplate = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-dashed border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 font-sans">
          Chọn template mẫu cho chuyến đi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle>Chọn template cho chuyến đi</DialogTitle>
          <DialogDescription>
            Chọn một template mẫu để bắt đầu lập kế hoạch cho chuyến đi của bạn nhanh chóng hơn.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {TRIP_TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`cursor-pointer transition-all hover:border-purple-400 ${
                  selectedTemplate?.id === template.id
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : 'border-border'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  {/* eslint-disable-next-line */}
                  <img
                    src={template.image}
                    alt={template.name}
                    className="object-cover w-full h-full"
                  />
                  {selectedTemplate?.id === template.id && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-purple-500">
                        <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                        Đã chọn
                      </Badge>
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center text-sm text-muted-foreground mb-1">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{template.duration} ngày</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.days.map((day, index) => (
                      <Badge key={index} variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800 font-sans">
                        {day.title}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTemplate(template);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

        {selectedTemplate && (
          <div className="border-t pt-4 mt-4">
            <h4 className="font-medium mb-3 flex items-center text-purple-700 dark:text-purple-400 font-sans">
              <Calendar className="h-4 w-4 mr-2" />
              Chi tiết template: {selectedTemplate.name}
            </h4>
            <div className="max-h-[300px] overflow-y-auto pr-2">
              <div className="space-y-3">
                {selectedTemplate.days.map((day, dayIndex) => (
                  <div key={dayIndex} className="border border-purple-100 dark:border-purple-900 rounded-lg p-3 bg-white/50 dark:bg-gray-950/50">
                    <h5 className="font-medium text-sm mb-2 pb-2 border-b border-purple-100 dark:border-purple-900 flex items-center font-sans">
                      <Badge className="mr-2 bg-purple-100 text-purple-700 border-0 dark:bg-purple-900/50 dark:text-purple-300">
                        Ngày {dayIndex + 1}
                      </Badge>
                      {day.title}
                    </h5>
                    <div className="space-y-2">
                      {day.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="text-sm flex items-start gap-2 mb-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 p-1 rounded-md">
                          <span className="text-purple-600 dark:text-purple-400 font-medium min-w-[50px] font-sans">{activity.time}</span>
                          <div className="font-sans">
                            <span className="font-medium">{activity.title}</span>
                            {activity.location && (
                              <div className="text-xs text-muted-foreground flex items-center mt-0.5 font-sans">
                                <MapPin className="h-3 w-3 mr-1" />
                                {activity.location}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSelectTemplate}
            disabled={!selectedTemplate}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            Áp dụng template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
