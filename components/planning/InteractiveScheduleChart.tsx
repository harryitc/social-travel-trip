'use client';

import { useState, useMemo, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
import { Day, Activity, ActivityType } from './mock-data';
import { cn } from '@/lib/utils';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import {
  Trash2,
  Copy,
  Edit,
  Plus,
  Move,
  X,
  Clock,
  MapPin,
  Search,
  PlusCircle,
  Undo
} from 'lucide-react';
import { PopularLocation, searchLocations, getAllCities, getLocationsByCity, suggestLocationsByDestination, POPULAR_LOCATIONS } from './popular-locations';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';


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
const getActivityType = (activity: Activity): ActivityType => {
  // Nếu hoạt động đã có loại, sử dụng loại đó
  if (activity.type) return activity.type;

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

// Hàm chuyển đổi số phút từ 00:00 sang chuỗi "HH:MM"
const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// Hàm lấy thời gian kết thúc từ description
const getEndTimeFromDescription = (description: string): string | null => {
  const match = description.match(/END_TIME:([^;]*);/);
  return match ? match[1] : null;
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

// Kiểu dữ liệu cho hoạt động trong biểu đồ
interface ChartActivity extends Activity {
  startMinutes: number;
  endMinutes: number;
  duration: number;
  mainLocation: string;
  type: ActivityType;
}

interface InteractiveScheduleChartProps {
  days: Day[];
  isEditing?: boolean;
  onUpdateActivities?: (dayIndex: number, activities: Activity[]) => void;
}

export function InteractiveScheduleChart({
  days,
  isEditing = false,
  onUpdateActivities
}: InteractiveScheduleChartProps) {
  const [selectedDay, setSelectedDay] = useState<number>(0);
  const [editingActivity, setEditingActivity] = useState<ChartActivity | null>(null);
  const [isAddingActivity, setIsAddingActivity] = useState<boolean>(false);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    time: '12:00',
    title: '',
    description: '',
    location: '',
    type: 'Khác'
  });
  const timelineRef = useRef<HTMLDivElement>(null);
  const headerScrollRef = useRef<HTMLDivElement>(null);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isCtrlPressed, setIsCtrlPressed] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedActivityForPopup, setSelectedActivityForPopup] = useState<ChartActivity | null>(null);

  // State cho việc thêm địa điểm mới
  const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false);
  const [searchLocationKeyword, setSearchLocationKeyword] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [suggestedLocations, setSuggestedLocations] = useState<PopularLocation[]>([]);

  // State cho việc chỉnh sửa timeline trong popup
  const [editingTimelineColor, setEditingTimelineColor] = useState<string>('');
  const [editingTimelineTitle, setEditingTimelineTitle] = useState<string>('');
  const [editingTimelineTime, setEditingTimelineTime] = useState<string>('');
  const [editingTimelineEndTime, setEditingTimelineEndTime] = useState<string>('');

  // State cho lịch sử thay đổi (undo)
  const [activityHistory, setActivityHistory] = useState<Activity[][]>([]);
  const [canUndo, setCanUndo] = useState<boolean>(false);

  // Hàm xử lý Undo (Ctrl+Z)
  const handleUndo = useCallback(() => {
    if (activityHistory.length > 0 && onUpdateActivities) {
      // Lấy trạng thái trước đó
      const previousActivities = activityHistory[activityHistory.length - 1];

      // Cập nhật lại hoạt động
      onUpdateActivities(selectedDay, previousActivities);

      // Cập nhật lịch sử
      setActivityHistory(prev => prev.slice(0, -1));

      // Kiểm tra xem còn có thể undo nữa không
      setCanUndo(activityHistory.length > 1);
    }
  }, [activityHistory, onUpdateActivities, selectedDay]);

  // Theo dõi phím Ctrl và Ctrl+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(true);
      }

      // Xử lý Ctrl+Z (Undo)
      if (e.key === 'z' && e.ctrlKey && isEditing && onUpdateActivities && canUndo) {
        e.preventDefault();
        handleUndo();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setIsCtrlPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown as any);
    window.addEventListener('keyup', handleKeyUp as any);

    return () => {
      window.removeEventListener('keydown', handleKeyDown as any);
      window.removeEventListener('keyup', handleKeyUp as any);
    };
  }, [isEditing, onUpdateActivities, canUndo, handleUndo]);

  // Tạo dữ liệu cho biểu đồ
  const chartData = useMemo(() => {
    if (!days[selectedDay]) return [];

    // Không sắp xếp lại các hoạt động theo thời gian để giữ nguyên thứ tự
    const activities = days[selectedDay].activities;

    return activities.map((activity, index) => {
      const startMinutes = timeToMinutes(activity.time);

      // Kiểm tra xem có thời gian kết thúc trong description không
      const endTimeStr = getEndTimeFromDescription(activity.description);
      let endMinutes: number;

      if (endTimeStr) {
        // Nếu có thời gian kết thúc, sử dụng nó
        endMinutes = timeToMinutes(endTimeStr);
      } else {
        // Nếu không, tính toán dựa trên hoạt động tiếp theo
        endMinutes = calculateEndTime(activities, index);

        // Lưu thời gian kết thúc vào description
        const endTime = minutesToTime(endMinutes);
        activity.description = `${activity.description} END_TIME:${endTime};`;
      }

      const duration = endMinutes - startMinutes;

      // Lấy tên địa điểm chính (trước dấu phẩy đầu tiên)
      const mainLocation = activity.location.split(',')[0].trim();

      return {
        ...activity,
        startMinutes,
        endMinutes,
        duration,
        mainLocation,
        type: activity.type || getActivityType(activity)
      };
    });
  }, [days, selectedDay]);

  // Tạo danh sách các địa điểm có hoạt động trong ngày đang chọn
  const activeLocations = useMemo(() => {
    const locations = new Set<string>();
    chartData.forEach(activity => {
      locations.add(activity.mainLocation);
    });
    return Array.from(locations);
  }, [chartData]);

  // Tạo các giờ trong ngày (từ 6:00 đến 00:00)
  const startHour = 6; // Giờ bắt đầu của biểu đồ
  const endHour = 24; // Giờ kết thúc của biểu đồ (00:00)
  const hours = Array.from({ length: endHour - startHour + 1 }, (_, i) => i + startHour);

  // Xử lý khi bắt đầu kéo thả hoạt động
  const handleDragStart = (activity: ChartActivity) => {
    setIsDragging(true);
    setSelectedActivityId(activity.id);

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    if (isEditing && onUpdateActivities) {
      setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
      setCanUndo(true);
    }
  };

  // Xử lý khi kéo thả hoạt động
  const handleDrag = (activity: ChartActivity, data: DraggableData, _e: DraggableEvent) => {
    if (!isEditing || !onUpdateActivities) return;

    // Nếu đang giữ phím Ctrl, tạo bản sao của hoạt động
    if (isCtrlPressed && !isDragging) {
      handleCopyActivity(activity);
      return;
    }

    const pixelsPerMinute = 80/60; // 80px = 60 phút

    // Tính toán thời gian mới dựa trên vị trí kéo thả
    const newStartMinutes = startHour * 60 + Math.round(data.x / pixelsPerMinute);

    // Đảm bảo thời gian bắt đầu không âm và không vượt quá 23:45
    const maxStartTime = endHour * 60 - 15; // 23:45
    const adjustedStartMinutes = Math.max(0, Math.min(newStartMinutes, maxStartTime));
    const newTime = minutesToTime(adjustedStartMinutes);

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    if (!isDragging) {
      setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
      setCanUndo(true);
    }

    // Chỉ thay đổi thời gian, không thay đổi địa điểm
    const updatedActivities = days[selectedDay].activities.map(act => {
      if (act.id === activity.id) {
        return {
          ...act,
          time: newTime
        };
      }
      return act;
    });

    // Gọi callback để cập nhật dữ liệu mà không sắp xếp lại
    if (onUpdateActivities) {
      onUpdateActivities(selectedDay, updatedActivities);
    }
  };

  // Xử lý khi kết thúc kéo thả
  const handleDragStop = () => {
    setIsDragging(false);
  };

  // Xử lý khi bắt đầu thay đổi kích thước
  const handleResizeStart = (activity: ChartActivity, edge: 'start' | 'end', event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedActivityId(activity.id);

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
    setCanUndo(true);

    // Lưu vị trí ban đầu của chuột
    const startX = event.clientX;
    const startTime = activity.startMinutes;
    const endTime = activity.endMinutes;

    // Lấy thời gian kết thúc từ description
    const endTimeStr = getEndTimeFromDescription(activity.description);
    const calculatedEndTime = endTimeStr ? timeToMinutes(endTimeStr) : endTime;

    // Hàm xử lý khi di chuyển chuột
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isEditing || !onUpdateActivities) return;

      const deltaX = moveEvent.clientX - startX;
      const pixelsPerMinute = 80/60; // 80px = 60 phút
      const minutesDelta = Math.round(deltaX / pixelsPerMinute);

      let newTime = activity.time;
      let newEndTime = endTimeStr || minutesToTime(endTime);
      let newDuration = activity.duration;

      if (edge === 'start') {
        // Thay đổi thời gian bắt đầu, giữ nguyên thời gian kết thúc
        const newStartMinutes = startTime + minutesDelta;

        // Đảm bảo thời gian bắt đầu không âm và không vượt quá thời gian kết thúc - 15 phút
        const adjustedStartMinutes = Math.max(0, Math.min(newStartMinutes, calculatedEndTime - 15));
        newTime = minutesToTime(adjustedStartMinutes);

        // Tính toán duration mới
        if (calculatedEndTime > adjustedStartMinutes) {
          newDuration = calculatedEndTime - adjustedStartMinutes;
        } else {
          // Trường hợp thời gian kết thúc qua ngày mới
          newDuration = (24 * 60 - adjustedStartMinutes) + calculatedEndTime;
        }

        console.log('Resize start:', {
          startTime,
          endTime: calculatedEndTime,
          newStartMinutes,
          adjustedStartMinutes,
          newTime,
          newDuration
        });
      } else if (edge === 'end') {
        // Thay đổi thời gian kết thúc, giữ nguyên thời gian bắt đầu
        const newEndMinutes = calculatedEndTime + minutesDelta;

        // Đảm bảo thời gian kết thúc không nhỏ hơn thời gian bắt đầu + 15 phút
        // Giới hạn thời gian kết thúc tối đa là 00:00 (24 * 60 phút)
        const maxEndTime = 24 * 60; // 00:00
        const adjustedEndMinutes = Math.min(maxEndTime, Math.max(newEndMinutes, startTime + 15));

        newEndTime = minutesToTime(adjustedEndMinutes);

        // Tính toán duration mới
        if (adjustedEndMinutes > startTime) {
          newDuration = adjustedEndMinutes - startTime;
        } else {
          // Trường hợp thời gian kết thúc qua ngày mới
          newDuration = (24 * 60 - startTime) + adjustedEndMinutes;
        }

        console.log('Resize end:', {
          startTime,
          endTime: calculatedEndTime,
          newEndMinutes,
          adjustedEndMinutes,
          newEndTime,
          newDuration
        });
      }

      // Đảm bảo duration tối thiểu là 15 phút
      if (newDuration < 15) {
        return;
      }

      // Cập nhật hoạt động hiện tại mà không ảnh hưởng đến các hoạt động khác
      const updatedActivities = days[selectedDay].activities.map(act => {
        if (act.id === activity.id) {
          return {
            ...act,
            time: newTime,
            // Lưu thời gian kết thúc vào description để sử dụng sau này
            description: act.description.includes('END_TIME:')
              ? act.description.replace(/END_TIME:[^;]*;/, `END_TIME:${newEndTime};`)
              : `${act.description} END_TIME:${newEndTime};`
          };
        }
        return act;
      });

      // Gọi callback để cập nhật dữ liệu mà không sắp xếp lại
      if (onUpdateActivities) {
        onUpdateActivities(selectedDay, updatedActivities);
      }

      // Cập nhật popup nếu đang hiển thị
      if (selectedActivityForPopup && selectedActivityForPopup.id === activity.id) {
        const updatedActivity = {
          ...selectedActivityForPopup,
          time: newTime,
          description: selectedActivityForPopup.description.includes('END_TIME:')
            ? selectedActivityForPopup.description.replace(/END_TIME:[^;]*;/, `END_TIME:${newEndTime};`)
            : `${selectedActivityForPopup.description} END_TIME:${newEndTime};`
        };

        // Cập nhật state cho popup
        setEditingTimelineTime(newTime);
        setEditingTimelineEndTime(newEndTime);
        setSelectedActivityForPopup(updatedActivity as ChartActivity);
      }
    };

    // Hàm xử lý khi thả chuột
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Lưu lại độ dài của timeline
      if (onUpdateActivities && days[selectedDay]) {
        // Tìm hoạt động hiện tại
        const currentActivity = days[selectedDay].activities.find(act => act.id === activity.id);

        if (currentActivity) {
          // Lấy thời gian kết thúc từ description
          const endTimeStr = getEndTimeFromDescription(currentActivity.description);

          if (endTimeStr) {
            // Cập nhật lại dữ liệu với thông tin END_TIME
            const updatedActivities = days[selectedDay].activities.map(act => {
              if (act.id === activity.id) {
                // Tính toán lại duration dựa trên thời gian bắt đầu và kết thúc
                const startMinutes = timeToMinutes(act.time);
                const endMinutes = timeToMinutes(endTimeStr);
                const duration = endMinutes > startMinutes ? endMinutes - startMinutes : (24 * 60 - startMinutes) + endMinutes;

                console.log('Updated duration:', {
                  time: act.time,
                  endTime: endTimeStr,
                  startMinutes,
                  endMinutes,
                  duration
                });

                return {
                  ...act,
                  // Đảm bảo description vẫn giữ thông tin END_TIME
                  description: act.description.includes('END_TIME:')
                    ? act.description
                    : `${act.description} END_TIME:${endTimeStr};`
                };
              }
              return act;
            });

            // Gọi callback để cập nhật dữ liệu
            onUpdateActivities(selectedDay, updatedActivities);
          }
        }
      }
    };

    // Thêm event listener
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Xử lý khi xóa hoạt động
  const handleDeleteActivity = (activity: ChartActivity) => {
    if (!isEditing || !onUpdateActivities) return;

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
    setCanUndo(true);

    const updatedActivities = days[selectedDay].activities.filter(
      act => act.id !== activity.id
    );

    // Gọi callback để cập nhật dữ liệu
    onUpdateActivities(selectedDay, updatedActivities);
  };

  // Xử lý khi sao chép hoạt động
  const handleCopyActivity = (activity: ChartActivity) => {
    if (!isEditing || !onUpdateActivities) return;

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
    setCanUndo(true);

    // Tạo bản sao của hoạt động với ID mới
    const newActivity: Activity = {
      ...activity,
      id: `activity-${Date.now()}`,
      time: minutesToTime(activity.startMinutes + 30) // Thêm 30 phút vào thời gian bắt đầu
    };

    const updatedActivities = [...days[selectedDay].activities, newActivity];

    // Không sắp xếp lại, để hoạt động sao chép được thêm vào cuối
    // Gọi callback để cập nhật dữ liệu
    onUpdateActivities(selectedDay, updatedActivities);
  };

  // Xử lý khi chọn hoạt động (click hoặc double click)
  const handleSelectActivity = (activity: ChartActivity, event: React.MouseEvent) => {
    event.stopPropagation(); // Ngăn sự kiện lan truyền

    setSelectedActivityId(activity.id);

    // Tính toán vị trí popup
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();

    // Tính toán vị trí để popup hiển thị gần timeline nhưng không che khuất
    const centerX = rect.left + rect.width / 2;
    const topY = rect.top - 10; // Hiển thị popup phía trên timeline

    // Sử dụng vị trí tuyệt đối trên trang
    const x = centerX;
    const y = topY;

    // Đảm bảo popup không vượt quá cạnh của màn hình
    const maxX = window.innerWidth - 140; // Để lại khoảng cách với cạnh phải
    const minX = 140; // Để lại khoảng cách với cạnh trái
    const adjustedX = Math.min(Math.max(x, minX), maxX);

    // Lấy thời gian kết thúc từ description
    const endTimeStr = getEndTimeFromDescription(activity.description) ||
      minutesToTime(activity.startMinutes + 60); // Mặc định 1 giờ nếu không có

    // Cập nhật state cho việc chỉnh sửa timeline
    setEditingTimelineTitle(activity.title);
    setEditingTimelineTime(activity.time);
    setEditingTimelineEndTime(endTimeStr);
    setEditingTimelineColor(activity.type);

    // Hiển thị popup ngay lập tức
    setPopupPosition({ x: adjustedX, y });
    setSelectedActivityForPopup(activity);

    console.log('Popup opened for activity:', activity.title, 'at position:', { x: adjustedX, y });
  };

  // Đóng popup
  const handleClosePopup = () => {
    setSelectedActivityForPopup(null);
    setPopupPosition(null);
  };

  // Xử lý khi cập nhật thông tin timeline từ popup
  const handleUpdateTimelineFromPopup = () => {
    if (!selectedActivityForPopup || !onUpdateActivities) return;

    // Kiểm tra thời gian hợp lệ
    if (!editingTimelineTime || !editingTimelineEndTime || !editingTimelineTitle) {
      return;
    }

    // Kiểm tra thời gian kết thúc phải sau thời gian bắt đầu
    const startMinutes = timeToMinutes(editingTimelineTime);
    let endMinutes = timeToMinutes(editingTimelineEndTime);

    // Giới hạn thời gian kết thúc tối đa là 00:00
    const maxEndTime = 24 * 60; // 00:00
    if (endMinutes > maxEndTime) {
      endMinutes = maxEndTime;
      setEditingTimelineEndTime("00:00");
    }

    // Tính toán duration (phút)
    let duration = 0;
    if (endMinutes > startMinutes) {
      duration = endMinutes - startMinutes;
    } else if (endMinutes === 0) { // 00:00 được coi là cuối ngày
      duration = 24 * 60 - startMinutes;
    } else {
      // Trường hợp thời gian kết thúc qua ngày mới - không cho phép
      alert("Thời gian kết thúc không được qua ngày mới");
      return;
    }

    // Kiểm tra duration tối thiểu
    if (duration < 15) {
      alert("Thời gian hoạt động phải ít nhất 15 phút");
      return;
    }

    console.log('Updating timeline with new duration:', {
      startTime: editingTimelineTime,
      endTime: editingTimelineEndTime,
      duration: duration
    });

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
    setCanUndo(true);

    // Cập nhật hoạt động
    const updatedActivities = days[selectedDay].activities.map(act => {
      if (act.id === selectedActivityForPopup.id) {
        // Tạo bản sao của hoạt động với thông tin mới
        const updatedActivity = {
          ...act,
          title: editingTimelineTitle,
          time: editingTimelineTime,
          type: editingTimelineColor as ActivityType,
          description: act.description.includes('END_TIME:')
            ? act.description.replace(/END_TIME:[^;]*;/, `END_TIME:${editingTimelineEndTime};`)
            : `${act.description} END_TIME:${editingTimelineEndTime};`
        };

        return updatedActivity;
      }
      return act;
    });

    // Gọi callback để cập nhật dữ liệu
    onUpdateActivities(selectedDay, updatedActivities);

    // Đóng popup
    handleClosePopup();
  };

  // Xử lý khi chỉnh sửa hoạt động
  const handleEditActivity = (activity: ChartActivity) => {
    setEditingActivity(activity);
    setNewActivity({
      time: activity.time,
      title: activity.title,
      description: activity.description,
      location: activity.location,
      type: activity.type
    });
  };

  // Xử lý khi thêm hoạt động mới
  const handleAddActivity = (location: string) => {
    setIsAddingActivity(true);
    setNewActivity({
      time: '12:00',
      title: '',
      description: '',
      location: location,
      type: 'Khác'
    });
  };

  // Xử lý khi mở dialog thêm địa điểm mới
  const handleOpenAddLocation = () => {
    setIsAddingLocation(true);
    setSelectedCity('');
    setNewLocation('');
    setSearchLocationKeyword('');

    // Lấy thông tin địa điểm từ các hoạt động hiện tại
    const locations = days[selectedDay].activities.map(act => act.location.split(',')[0].trim());
    const uniqueLocations = Array.from(new Set(locations));

    // Nếu có ít nhất một địa điểm, sử dụng địa điểm đầu tiên làm gợi ý
    if (uniqueLocations.length > 0) {
      const tripDestination = uniqueLocations[0];
      const suggestions = suggestLocationsByDestination(tripDestination);
      setSuggestedLocations(suggestions);

      // Nếu có thành phố phù hợp, chọn thành phố đó
      const matchingCity = Object.keys(POPULAR_LOCATIONS).find(city =>
        tripDestination.toLowerCase().includes(city.toLowerCase())
      );
      if (matchingCity) {
        setSelectedCity(matchingCity);
      }
    } else {
      // Nếu không có địa điểm nào, sử dụng Hà Nội làm mặc định
      const tripDestination = "Hà Nội";
      const suggestions = suggestLocationsByDestination(tripDestination);
      setSuggestedLocations(suggestions);
    }
  };

  // Xử lý khi thêm địa điểm mới
  const handleAddLocation = () => {
    if (!newLocation || !onUpdateActivities) return;

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
    setCanUndo(true);

    // Thêm địa điểm mới vào danh sách địa điểm
    if (!activeLocations.includes(newLocation)) {
      // Tạo hoạt động mới với địa điểm mới
      const newActivityObj: Activity = {
        id: `activity-${Date.now()}`,
        title: `Tham quan ${newLocation}`,
        time: '12:00',
        description: 'END_TIME:13:00;',
        location: newLocation,
        type: 'Tham quan'
      };

      // Thêm hoạt động mới vào danh sách
      const updatedActivities = [...days[selectedDay].activities, newActivityObj];

      // Không sắp xếp lại, để địa điểm mới được thêm vào cuối
      // Gọi callback để cập nhật dữ liệu
      onUpdateActivities(selectedDay, updatedActivities);
    }

    // Đóng dialog
    setIsAddingLocation(false);
  };

  // Xử lý khi tìm kiếm địa điểm
  const handleSearchLocation = (keyword: string) => {
    setSearchLocationKeyword(keyword);

    if (keyword.length > 1) {
      const results = searchLocations(keyword);
      setSuggestedLocations(results.slice(0, 5));
      if (results.length > 0) {
        setNewLocation(results[0].name);
      }
    }
  };

  // Xử lý khi chọn thành phố
  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    const locations = getLocationsByCity(city);
    setSuggestedLocations(locations.slice(0, 5));
    if (locations.length > 0) {
      setNewLocation(locations[0].name);
    }
  };

  // Xử lý khi lưu hoạt động
  const handleSaveActivity = () => {
    if (!isEditing || !onUpdateActivities || !newActivity.title || !newActivity.time || !newActivity.location) return;

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
    setCanUndo(true);

    let updatedActivities: Activity[];

    if (editingActivity) {
      // Cập nhật hoạt động hiện có
      updatedActivities = days[selectedDay].activities.map(act => {
        if (act.id === editingActivity.id) {
          return {
            ...act,
            time: newActivity.time!,
            title: newActivity.title!,
            description: newActivity.description || '',
            location: newActivity.location!,
            type: newActivity.type as ActivityType
          };
        }
        return act;
      });
    } else {
      // Thêm hoạt động mới
      const newActivityObj: Activity = {
        id: `activity-${Date.now()}`,
        time: newActivity.time!,
        title: newActivity.title!,
        description: newActivity.description || '',
        location: newActivity.location!,
        type: newActivity.type as ActivityType
      };

      updatedActivities = [...days[selectedDay].activities, newActivityObj];
    }

    // Không sắp xếp lại, để hoạt động mới được thêm vào cuối
    // Gọi callback để cập nhật dữ liệu
    onUpdateActivities(selectedDay, updatedActivities);

    // Đóng dialog
    setEditingActivity(null);
    setIsAddingActivity(false);
  };

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
      <div className="border rounded-md shadow-sm flex flex-col">
        {/* Header với các giờ */}
        <div className="flex border-b sticky top-0 bg-background z-10 shadow-sm">
          <div className="min-w-[180px] p-2 border-r font-medium text-sm flex justify-between items-center bg-gray-50 dark:bg-gray-900">
            <span className="uppercase text-xs text-gray-500 dark:text-gray-400">Địa điểm</span>
            {isEditing && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleOpenAddLocation}
                  title="Thêm địa điểm mới"
                >
                  <PlusCircle className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => handleAddActivity('')}
                  title="Thêm hoạt động mới"
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={handleUndo}
                  title="Hoàn tác (Ctrl+Z)"
                  disabled={!canUndo}
                >
                  <Undo className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
          <div
            className="flex flex-1 overflow-x-auto bg-gray-50 dark:bg-gray-900"
            ref={headerScrollRef}
            onScroll={(e) => {
              if (timelineRef.current) {
                timelineRef.current.scrollLeft = e.currentTarget.scrollLeft;
              }
            }}
          >
            {hours.map(hour => (
              <div
                key={hour}
                className="w-[80px] flex-shrink-0 p-2 text-center text-xs border-r last:border-r-0 text-gray-500 dark:text-gray-400"
              >
                {hour === 24 ? '00:00' : `${hour}:00`}
              </div>
            ))}
          </div>
        </div>

        {/* Nội dung biểu đồ - chỉ cuộn ngang ở dưới cùng */}
        <div
          className="overflow-x-hidden"
          ref={timelineRef}
          onScroll={(e) => {
            if (headerScrollRef.current) {
              headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
            }
          }}
        >
          {activeLocations.length > 0 ? (
            activeLocations.map(location => (
              <div key={location} className="flex border-b last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 location-row transition-colors group" data-location={location}>
                <div className="min-w-[180px] py-2 px-3 border-r text-sm truncate flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs mr-2 text-gray-700 dark:text-gray-300">
                      {location.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{location}</span>
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                      onClick={() => handleAddActivity(location)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  )}
                </div>
                <div className="flex flex-1 relative h-14">
                  {hours.map(hour => (
                    <div
                      key={hour}
                      className={`w-[80px] flex-shrink-0 border-r last:border-r-0 ${hour % 2 === 0 ? 'bg-gray-50/30 dark:bg-gray-900/30' : ''}`}
                    ></div>
                  ))}

                  {/* Hiển thị các hoạt động */}
                  {chartData
                    .filter(activity => activity.mainLocation === location)
                    .map(activity => {
                      const startHour = 6; // Giờ bắt đầu của biểu đồ
                      const startPosition = (activity.startMinutes - startHour * 60) / 60 * 80; // Vị trí bắt đầu (px) - 80px cho mỗi giờ

                      // Lấy thời gian kết thúc từ description
                      const endTimeStr = getEndTimeFromDescription(activity.description);
                      let duration = activity.duration;

                      // Tính toán duration dựa trên thời gian kết thúc nếu có
                      if (endTimeStr) {
                        const endMinutes = timeToMinutes(endTimeStr);
                        if (endMinutes > activity.startMinutes) {
                          duration = endMinutes - activity.startMinutes;
                        } else {
                          // Trường hợp thời gian kết thúc qua ngày mới
                          duration = (24 * 60 - activity.startMinutes) + endMinutes;
                        }
                      }

                      // Đảm bảo độ rộng tối thiểu là 40px (30 phút) để dễ dàng kéo thả
                      const minWidth = 40;
                      const calculatedWidth = duration / 60 * 80; // Độ rộng (px) - 80px cho mỗi giờ
                      const width = Math.max(calculatedWidth, minWidth);
                      const type = activity.type;
                      const { color, textColor } = ACTIVITY_TYPES[type as keyof typeof ACTIVITY_TYPES] || ACTIVITY_TYPES['Khác'];

                      return (
                        <Draggable
                          key={activity.id}
                          axis="x" // Chỉ cho phép kéo theo chiều ngang
                          disabled={!isEditing}
                          grid={[15, 0]} // Snap theo grid để dễ kéo thả
                          defaultPosition={{ x: startPosition, y: 0 }}
                          position={{ x: startPosition, y: 0 }}
                          onStart={() => handleDragStart(activity)}
                          onDrag={(e, data) => handleDrag(activity, data, e)}
                          onStop={handleDragStop}
                        >
                          <div
                            className={cn(
                              `absolute top-2 h-10 rounded-md border ${color} ${textColor} text-xs flex items-center overflow-hidden group shadow-sm hover:shadow-md transition-shadow`,
                              selectedActivityId === activity.id && "ring-2 ring-purple-500"
                            )}
                            style={{
                              width: `${width}px`,
                            }}
                            title={`${activity.time} - ${activity.title}`}
                            onClick={(e) => handleSelectActivity(activity, e)}
                            onDoubleClick={(e) => handleSelectActivity(activity, e)}
                          >
                            <div className="px-2 truncate flex-1">
                              {activity.time} - {activity.title}
                            </div>

                            {/* Nút resize bên trái */}
                            {isEditing && (
                              <div
                                className="absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize opacity-30 group-hover:opacity-100 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent"
                                onMouseDown={(e) => {
                                  e.stopPropagation(); // Ngăn sự kiện lan truyền
                                  handleResizeStart(activity, 'start', e);
                                }}
                                title="Kéo để thay đổi thời gian bắt đầu"
                              />
                            )}

                            {/* Nút resize bên phải */}
                            {isEditing && (
                              <div
                                className="absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize opacity-50 group-hover:opacity-100 z-10 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700"
                                onMouseDown={(e) => {
                                  e.stopPropagation(); // Ngăn sự kiện lan truyền
                                  handleResizeStart(activity, 'end', e);
                                }}
                                title="Kéo để thay đổi thời gian kết thúc"
                              />
                            )}

                            {/* Hiển thị biểu tượng kéo thả khi được chọn */}
                            {selectedActivityId === activity.id && !selectedActivityForPopup && (
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 bg-purple-500 rounded-full p-0.5">
                                <Move className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                        </Draggable>
                      );
                    })}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400 flex items-center justify-center">
              <div>
                <div className="mb-3 opacity-50">
                  <Clock className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-sm">Không có hoạt động nào trong ngày này</p>
                {isEditing && (
                  <div className="flex flex-col gap-2 mt-5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-gray-900"
                      onClick={() => handleAddActivity('')}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Thêm hoạt động
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="bg-white dark:bg-gray-900"
                      onClick={handleOpenAddLocation}
                    >
                      <MapPin className="h-4 w-4 mr-1" /> Thêm địa điểm
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Thanh cuộn ngang ở dưới cùng */}
        <div className="border-t">
          <div className="flex">
            <div className="min-w-[180px] border-r"></div>
            <div
              className="flex-1 overflow-x-auto"
              onScroll={(e) => {
                if (timelineRef.current) {
                  timelineRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
                if (headerScrollRef.current) {
                  headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
              }}
            >
              <div className="flex" style={{ width: `${(hours.length) * 80}px`, height: '12px' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Popup khi chọn hoạt động */}
      {selectedActivityForPopup && popupPosition && (
        <div
          className="fixed bg-white dark:bg-gray-900 rounded-md shadow-xl border border-gray-200 dark:border-gray-800 z-50 w-64 animate-in fade-in duration-200"
          style={{
            left: `${popupPosition.x}px`,
            top: `${popupPosition.y}px`,
            transform: 'translate(-50%, -110%)', // Đặt popup phía trên timeline với khoảng cách
          }}
        >
          <div className="p-3 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={handleClosePopup}
            >
              <X className="h-4 w-4" />
            </button>

            {isEditing ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="popup-title" className="text-xs">Tiêu đề</Label>
                  <Input
                    id="popup-title"
                    value={editingTimelineTitle}
                    onChange={(e) => setEditingTimelineTitle(e.target.value)}
                    className="h-7 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="popup-start-time" className="text-xs">Bắt đầu</Label>
                    <Input
                      id="popup-start-time"
                      type="time"
                      value={editingTimelineTime}
                      onChange={(e) => setEditingTimelineTime(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="popup-end-time" className="text-xs">Kết thúc</Label>
                    <Input
                      id="popup-end-time"
                      type="time"
                      value={editingTimelineEndTime}
                      onChange={(e) => setEditingTimelineEndTime(e.target.value)}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="popup-color" className="text-xs">Màu sắc</Label>
                  <Select
                    value={editingTimelineColor}
                    onValueChange={setEditingTimelineColor}
                  >
                    <SelectTrigger id="popup-color" className="h-7 text-xs">
                      <SelectValue placeholder="Chọn màu" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ACTIVITY_TYPES).map(([type, { color }]) => (
                        <SelectItem key={type} value={type} className="flex items-center text-xs">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-sm mr-2 ${color}`}></div>
                            <span>{type}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between gap-1 pt-2">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => {
                        handleCopyActivity(selectedActivityForPopup);
                        handleClosePopup();
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-500"
                      onClick={() => {
                        handleDeleteActivity(selectedActivityForPopup);
                        handleClosePopup();
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={handleUpdateTimelineFromPopup}
                  >
                    Lưu
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h3 className="font-medium text-sm mb-1 pr-5">{selectedActivityForPopup.title}</h3>

                <div className="flex items-center text-xs text-muted-foreground mb-2">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>
                    {selectedActivityForPopup.time} - {getEndTimeFromDescription(selectedActivityForPopup.description) || "N/A"}
                  </span>
                </div>

                <div className="flex items-center text-xs text-muted-foreground mb-3">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{selectedActivityForPopup.location}</span>
                </div>

                {isEditing && (
                  <div className="flex justify-end gap-1 border-t pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => {
                        handleEditActivity(selectedActivityForPopup);
                        handleClosePopup();
                      }}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0"
                      onClick={() => {
                        handleCopyActivity(selectedActivityForPopup);
                        handleClosePopup();
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-red-500"
                      onClick={() => {
                        handleDeleteActivity(selectedActivityForPopup);
                        handleClosePopup();
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Dialog chỉnh sửa hoạt động */}
      <Dialog
        open={!!editingActivity || isAddingActivity}
        onOpenChange={(open) => {
          if (!open) {
            setEditingActivity(null);
            setIsAddingActivity(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">
              {editingActivity ? 'Chỉnh sửa hoạt động' : 'Thêm hoạt động mới'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="activity-time" className="text-xs">Thời gian</Label>
              <Input
                id="activity-time"
                type="time"
                value={newActivity.time}
                onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="activity-title" className="text-xs">Tên hoạt động</Label>
              <Input
                id="activity-title"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Nhập tên hoạt động"
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="activity-location" className="text-xs">Địa điểm</Label>
              <Input
                id="activity-location"
                value={newActivity.location}
                onChange={(e) => setNewActivity({ ...newActivity, location: e.target.value })}
                placeholder="Nhập địa điểm"
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="activity-type" className="text-xs">Loại hoạt động</Label>
              <Select
                value={newActivity.type as string}
                onValueChange={(value) => setNewActivity({ ...newActivity, type: value as ActivityType })}
              >
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="Chọn loại hoạt động" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ACTIVITY_TYPES).map(([type, { color }]) => (
                    <SelectItem key={type} value={type} className="flex items-center">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-sm mr-2 ${color}`}></div>
                        <span>{type}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="activity-description" className="text-xs">Mô tả</Label>
              <Textarea
                id="activity-description"
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Nhập mô tả hoạt động"
                className="text-sm min-h-[60px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingActivity(null);
                setIsAddingActivity(false);
              }}
            >
              Hủy
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
              onClick={handleSaveActivity}
              disabled={!newActivity.title || !newActivity.time || !newActivity.location}
            >
              Lưu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog thêm địa điểm mới */}
      <Dialog
        open={isAddingLocation}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddingLocation(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Thêm địa điểm mới</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="location-city" className="text-xs">Thành phố</Label>
              <Select value={selectedCity} onValueChange={handleSelectCity}>
                <SelectTrigger id="location-city" className="h-8 text-sm">
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {getAllCities().map(city => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="location-search" className="text-xs">Tìm kiếm địa điểm</Label>
              <div className="relative">
                <Input
                  id="location-search"
                  value={searchLocationKeyword}
                  onChange={(e) => handleSearchLocation(e.target.value)}
                  placeholder="Nhập tên địa điểm"
                  className="h-8 text-sm pl-8"
                />
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="location-name" className="text-xs">Tên địa điểm</Label>
              <Input
                id="location-name"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Nhập tên địa điểm"
                className="h-8 text-sm"
              />
            </div>

            {suggestedLocations.length > 0 && (
              <div className="border rounded-md p-2 max-h-40 overflow-auto">
                <p className="text-xs text-muted-foreground mb-2">Gợi ý địa điểm:</p>
                <div className="space-y-1">
                  {suggestedLocations.map(location => (
                    <div
                      key={location.id}
                      className="text-xs p-1.5 hover:bg-muted rounded cursor-pointer"
                      onClick={() => setNewLocation(location.name)}
                    >
                      <div className="font-medium">{location.name}</div>
                      <div className="text-muted-foreground">{location.city}, {location.region}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsAddingLocation(false)}
            >
              Hủy
            </Button>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              size="sm"
              onClick={handleAddLocation}
              disabled={!newLocation}
            >
              Thêm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
