'use client';

import { useState, useMemo } from 'react';
import { Day, Activity } from './mock-data';
import { cn } from '@/lib/utils';

// Định nghĩa các loại hoạt động và màu sắc tương ứng
const ACTIVITY_TYPES = {
  'Ăn sáng': { color: 'bg-red-200 dark:bg-red-900/50', textColor: 'text-red-800 dark:text-red-300' },
  'Ăn trưa': { color: 'bg-red-200 dark:bg-red-900/50', textColor: 'text-red-800 dark:text-red-300' },
  'Ăn tối': { color: 'bg-red-200 dark:bg-red-900/50', textColor: 'text-red-800 dark:text-red-300' },
  'Cà phê': { color: 'bg-amber-200 dark:bg-amber-900/50', textColor: 'text-amber-800 dark:text-amber-300' },
  'Tham quan': { color: 'bg-blue-200 dark:bg-blue-900/50', textColor: 'text-blue-800 dark:text-blue-300' },
  'Mua sắm': { color: 'bg-purple-200 dark:bg-purple-900/50', textColor: 'text-purple-800 dark:text-purple-300' },
  'Nghỉ ngơi': { color: 'bg-green-200 dark:bg-green-900/50', textColor: 'text-green-800 dark:text-green-300' },
  'Di chuyển': { color: 'bg-orange-200 dark:bg-orange-900/50', textColor: 'text-orange-800 dark:text-orange-300' },
  'Khác': { color: 'bg-gray-200 dark:bg-gray-800/50', textColor: 'text-gray-800 dark:text-gray-300' },
};

// Hàm phân loại hoạt động dựa trên tiêu đề
const getActivityType = (activity: Activity) => {
  const title = activity.title.toLowerCase();
  
  if (title.includes('ăn sáng') || title.includes('bữa sáng')) return 'Ăn sáng';
  if (title.includes('ăn trưa') || title.includes('bữa trưa')) return 'Ăn trưa';
  if (title.includes('ăn tối') || title.includes('bữa tối')) return 'Ăn tối';
  if (title.includes('cà phê') || title.includes('cafe')) return 'Cà phê';
  if (title.includes('tham quan') || title.includes('thăm') || title.includes('khám phá') || title.includes('ngắm')) return 'Tham quan';
  if (title.includes('mua sắm') || title.includes('mua')) return 'Mua sắm';
  if (title.includes('nghỉ ngơi') || title.includes('thư giãn') || title.includes('nghỉ')) return 'Nghỉ ngơi';
  if (title.includes('di chuyển') || title.includes('đi') || title.includes('đến')) return 'Di chuyển';
  
  return 'Khác';
};

// Hàm chuyển đổi thời gian từ chuỗi "HH:MM" sang số phút từ 00:00
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Hàm tính thời gian kết thúc của hoạt động (giả định mỗi hoạt động kéo dài đến hoạt động tiếp theo)
const calculateEndTime = (activities: Activity[], index: number) => {
  if (index === activities.length - 1) {
    // Hoạt động cuối cùng trong ngày, giả định kéo dài 2 giờ
    const startMinutes = timeToMinutes(activities[index].time);
    return startMinutes + 120;
  }
  
  return timeToMinutes(activities[index + 1].time);
};

interface ScheduleChartProps {
  days: Day[];
}

export function ScheduleChart({ days }: ScheduleChartProps) {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  
  // Tạo danh sách các địa điểm duy nhất từ tất cả các hoạt động
  const locations = useMemo(() => {
    const allLocations = new Set<string>();
    days.forEach(day => {
      day.activities.forEach(activity => {
        // Lấy tên địa điểm chính (trước dấu phẩy đầu tiên)
        const mainLocation = activity.location.split(',')[0].trim();
        allLocations.add(mainLocation);
      });
    });
    return Array.from(allLocations);
  }, [days]);
  
  // Tạo dữ liệu cho biểu đồ
  const chartData = useMemo(() => {
    if (!days[selectedDay]) return [];
    
    const activities = days[selectedDay].activities.sort((a, b) => 
      timeToMinutes(a.time) - timeToMinutes(b.time)
    );
    
    return activities.map((activity, index) => {
      const startMinutes = timeToMinutes(activity.time);
      const endMinutes = calculateEndTime(activities, index);
      const duration = endMinutes - startMinutes;
      
      // Lấy tên địa điểm chính (trước dấu phẩy đầu tiên)
      const mainLocation = activity.location.split(',')[0].trim();
      
      return {
        ...activity,
        startMinutes,
        endMinutes,
        duration,
        mainLocation,
        type: getActivityType(activity)
      };
    });
  }, [days, selectedDay]);
  
  // Tạo các giờ trong ngày (từ 6:00 đến 22:00)
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);
  
  return (
    <div className="w-full overflow-hidden">
      {/* Tabs cho các ngày */}
      <div className="flex mb-4 border-b">
        {days.map((day, index) => (
          <button
            key={day.id}
            className={cn(
              "px-4 py-2 text-sm font-medium",
              selectedDay === index
                ? "border-b-2 border-purple-500 text-purple-600 dark:text-purple-400"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setSelectedDay(index)}
          >
            Ngày {index + 1}
          </button>
        ))}
      </div>
      
      {/* Chú thích màu sắc */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(ACTIVITY_TYPES).map(([type, { color, textColor }]) => (
          <div key={type} className="flex items-center">
            <div className={`w-3 h-3 rounded-sm mr-1 ${color}`}></div>
            <span className={`text-xs ${textColor}`}>{type}</span>
          </div>
        ))}
      </div>
      
      {/* Biểu đồ */}
      <div className="border rounded-md overflow-auto">
        {/* Header với các giờ */}
        <div className="flex border-b sticky top-0 bg-background z-10">
          <div className="min-w-[180px] p-2 border-r font-medium text-sm">Địa điểm</div>
          <div className="flex flex-1">
            {hours.map(hour => (
              <div 
                key={hour} 
                className="w-[60px] shrink-0 p-2 text-center text-xs border-r last:border-r-0"
              >
                {hour}:00
              </div>
            ))}
          </div>
        </div>
        
        {/* Nội dung biểu đồ */}
        <div className="max-h-[500px] overflow-auto">
          {locations.map(location => (
            <div key={location} className="flex border-b last:border-b-0 hover:bg-muted/30">
              <div className="min-w-[180px] p-2 border-r text-sm truncate">
                {location}
              </div>
              <div className="flex flex-1 relative h-12">
                {hours.map(hour => (
                  <div 
                    key={hour} 
                    className="w-[60px] shrink-0 border-r last:border-r-0"
                  ></div>
                ))}
                
                {/* Hiển thị các hoạt động */}
                {chartData
                  .filter(activity => activity.mainLocation === location)
                  .map(activity => {
                    const startHour = 6; // Giờ bắt đầu của biểu đồ
                    const startPosition = (activity.startMinutes - startHour * 60) / 60 * 60; // Vị trí bắt đầu (px)
                    const width = activity.duration / 60 * 60; // Độ rộng (px)
                    const type = activity.type;
                    const { color, textColor } = ACTIVITY_TYPES[type as keyof typeof ACTIVITY_TYPES] || ACTIVITY_TYPES['Khác'];
                    
                    return (
                      <div
                        key={activity.id}
                        className={`absolute top-1 h-10 rounded-md border ${color} ${textColor} text-xs flex items-center overflow-hidden`}
                        style={{
                          left: `${startPosition}px`,
                          width: `${width}px`,
                        }}
                        title={`${activity.time} - ${activity.title}`}
                      >
                        <div className="px-2 truncate">
                          {activity.time} - {activity.title}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
