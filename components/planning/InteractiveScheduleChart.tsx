'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback, KeyboardEvent } from 'react';
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
  Undo,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Store,
  Utensils,
  Landmark,
  Trees,
  Hotel,
  Coffee,
  ShoppingBag,
  Church,
  Building
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { debounce } from '@/lib/debounce';
import { toast } from 'sonner';


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

// Hàm xác định biểu tượng dựa trên tên địa điểm
const getLocationIcon = (location: string) => {
  const locationLower = location.toLowerCase();

  // Nhà hàng, quán ăn
  if (
    locationLower.includes('nhà hàng') ||
    locationLower.includes('quán ăn') ||
    locationLower.includes('quán cơm') ||
    locationLower.includes('ẩm thực') ||
    locationLower.includes('restaurant')
  ) {
    return Utensils;
  }

  // Chợ, market
  if (
    locationLower.includes('chợ') ||
    locationLower.includes('market') ||
    locationLower.includes('siêu thị')
  ) {
    return Store;
  }

  // Địa điểm tham quan, du lịch
  if (
    locationLower.includes('tham quan') ||
    locationLower.includes('du lịch') ||
    locationLower.includes('danh lam') ||
    locationLower.includes('thắng cảnh') ||
    locationLower.includes('bảo tàng') ||
    locationLower.includes('museum') ||
    locationLower.includes('tourist')
  ) {
    return Landmark;
  }

  // Công viên, vườn
  if (
    locationLower.includes('công viên') ||
    locationLower.includes('vườn') ||
    locationLower.includes('park') ||
    locationLower.includes('garden')
  ) {
    return Trees;
  }

  // Khách sạn, nhà nghỉ
  if (
    locationLower.includes('khách sạn') ||
    locationLower.includes('nhà nghỉ') ||
    locationLower.includes('hotel') ||
    locationLower.includes('resort') ||
    locationLower.includes('homestay')
  ) {
    return Hotel;
  }

  // Quán cà phê
  if (
    locationLower.includes('cà phê') ||
    locationLower.includes('cafe') ||
    locationLower.includes('coffee')
  ) {
    return Coffee;
  }

  // Trung tâm mua sắm
  if (
    locationLower.includes('trung tâm mua sắm') ||
    locationLower.includes('shopping') ||
    locationLower.includes('mall')
  ) {
    return ShoppingBag;
  }

  // Nhà thờ
  if (
    locationLower.includes('nhà thờ') ||
    locationLower.includes('church') ||
    locationLower.includes('cathedral')
  ) {
    return Church;
  }

  // Chùa, đền, miếu
  if (
    locationLower.includes('chùa') ||
    locationLower.includes('đền') ||
    locationLower.includes('miếu') ||
    locationLower.includes('temple') ||
    locationLower.includes('pagoda')
  ) {
    return Building;
  }

  // Mặc định là MapPin
  return MapPin;
};

// Constants for time calculations
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const MINUTES_PER_DAY = HOURS_PER_DAY * MINUTES_PER_HOUR;
const MIN_ACTIVITY_DURATION = 15; // Minimum activity duration in minutes
const DEFAULT_ACTIVITY_DURATION = 60; // Default activity duration in minutes
const CHART_START_HOUR = 6; // Chart starts at 6:00 AM
const CHART_END_HOUR = 24; // Chart ends at 00:00 (midnight)
const PIXELS_PER_HOUR = 80; // 80px represents 1 hour on the chart
const PIXELS_PER_MINUTE = PIXELS_PER_HOUR / MINUTES_PER_HOUR; // 80px / 60min = 1.33px per minute

/**
 * Converts time string in "HH:MM" format to minutes from 00:00
 * @param time Time string in "HH:MM" format
 * @returns Number of minutes from 00:00
 */
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * MINUTES_PER_HOUR + minutes;
};

/**
 * Converts minutes from 00:00 to time string in "HH:MM" format
 * @param minutes Number of minutes from 00:00
 * @returns Time string in "HH:MM" format
 */
const minutesToTime = (minutes: number): string => {
  // Handle negative minutes or minutes > 24 hours
  minutes = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const mins = Math.floor(minutes % MINUTES_PER_HOUR);
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

/**
 * Extracts end time from activity description
 * @param description Activity description text
 * @returns End time string in "HH:MM" format or null if not found
 */
const getEndTimeFromDescription = (description: string): string | null => {
  const match = description.match(/END_TIME:([^;]*);/);
  return match ? match[1] : null;
};

/**
 * Calculates the end time of an activity based on the next activity or default duration
 * @param activities List of activities
 * @param index Index of the current activity
 * @returns End time in minutes from 00:00
 */
const calculateEndTime = (activities: Activity[], index: number): number => {
  if (index === activities.length - 1) {
    // Last activity of the day, use default duration
    const startMinutes = timeToMinutes(activities[index].time);
    return startMinutes + DEFAULT_ACTIVITY_DURATION * 2; // Last activity gets 2 hours by default
  }

  return timeToMinutes(activities[index + 1].time);
};

/**
 * Converts pixel position to minutes on the timeline with snapping to 5-minute intervals
 * @param pixelPosition X position in pixels
 * @returns Minutes from the start of the chart (6:00 AM)
 */
const pixelsToMinutes = (pixelPosition: number): number => {
  // Convert pixels to exact minutes
  const exactMinutes = pixelPosition / PIXELS_PER_MINUTE;

  // Snap to 5-minute intervals for better grid alignment
  const snappedMinutes = Math.round(exactMinutes / 5) * 5;

  return snappedMinutes;
};

/**
 * Converts minutes to pixel position on the timeline with precise calculation
 * @param minutes Minutes from the start of the chart (6:00 AM)
 * @returns X position in pixels
 */
const minutesToPixels = (minutes: number): number => {
  // Ensure we're working with a multiple of 5 minutes for grid alignment
  const snappedMinutes = Math.round(minutes / 5) * 5;

  // Calculate exact pixel position
  return Math.round(snappedMinutes * PIXELS_PER_MINUTE);
};

/**
 * Validates and adjusts time to ensure it's within the valid range (6:00 - 00:00)
 * @param minutes Minutes from 00:00
 * @returns Adjusted minutes within valid range
 */
const validateTimeRange = (minutes: number): number => {
  const minTime = CHART_START_HOUR * MINUTES_PER_HOUR; // 6:00 AM
  const maxTime = CHART_END_HOUR * MINUTES_PER_HOUR; // 00:00 (midnight)

  return Math.max(minTime, Math.min(minutes, maxTime - 1));
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

  // State cho visual feedback khi kéo thả
  const [dragFeedback, setDragFeedback] = useState<{
    currentTime: string;
    isValidPosition: boolean;
    activityId: string | null;
    position: { x: number, y: number } | null;
    edge?: 'start' | 'end' | null;
  }>({
    currentTime: '',
    isValidPosition: true,
    activityId: null,
    position: null,
    edge: null
  });

  // State cho vị trí chuột hiện tại (used in event handlers)
  const [, setMousePosition] = useState<{ x: number, y: number } | null>(null);

  // State for toggling location column on mobile
  const [isLocationColumnVisible, setIsLocationColumnVisible] = useState<boolean>(true);

  // We don't need this ref anymore since we're using the debounce function directly
  // const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

      // Xử lý phím tắt để ẩn/hiện cột địa điểm (Alt+L)
      if (e.key === 'l' && e.altKey) {
        e.preventDefault();
        setIsLocationColumnVisible(prev => !prev);
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

  // Đếm số hoạt động cho mỗi địa điểm
  const locationActivityCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    chartData.forEach(activity => {
      const location = activity.mainLocation;
      counts[location] = (counts[location] || 0) + 1;
    });
    return counts;
  }, [chartData]);

  // Cache biểu tượng cho mỗi địa điểm để tránh tính toán lại
  const locationIcons = useMemo(() => {
    const icons: Record<string, React.ReactElement> = {};
    activeLocations.forEach(location => {
      const IconComponent = getLocationIcon(location);
      icons[location] = React.createElement(IconComponent, { size: 14 });

      // Tạo thêm biểu tượng lớn hơn cho tooltip
      icons[`${location}-large`] = React.createElement(IconComponent, { size: 18 });
    });
    return icons;
  }, [activeLocations]);

  // Tạo các giờ trong ngày (từ 6:00 đến 00:00)
  const hours = Array.from({ length: CHART_END_HOUR - CHART_START_HOUR + 1 }, (_, i) => i + CHART_START_HOUR);

  // Create debounce function outside of useCallback
  const debounceSave = debounce((dayIndex: number, updatedActivities: Activity[], callback?: (dayIndex: number, activities: Activity[]) => void) => {
    if (callback) {
      callback(dayIndex, updatedActivities);
      toast.success('Lịch trình đã được lưu', {
        duration: 1500,
        position: 'bottom-right',
      });
    }
  }, 500); // 500ms debounce time

  // Debounced function to save activities
  // We don't need to include debounceSave in the dependency array because it's defined outside and doesn't change
  const debouncedSaveActivities = useCallback(
    (dayIndex: number, updatedActivities: Activity[]) => {
      debounceSave(dayIndex, updatedActivities, onUpdateActivities);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onUpdateActivities]
  );

  // Track mouse movement for visual feedback
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setMousePosition({ x: e.clientX, y: e.clientY });
      }
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging]);

  // Xử lý khi bắt đầu kéo thả hoạt động
  const handleDragStart = (activity: ChartActivity) => {
    setIsDragging(true);
    setSelectedActivityId(activity.id);

    // Initialize drag feedback
    setDragFeedback({
      currentTime: activity.time,
      isValidPosition: true,
      activityId: activity.id,
      position: null,
      edge: null
    });

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    if (isEditing && onUpdateActivities) {
      setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
      setCanUndo(true);
    }
  };

  // Xử lý khi kéo thả hoạt động
  const handleDrag = (activity: ChartActivity, data: DraggableData, e: DraggableEvent) => {
    if (!isEditing || !onUpdateActivities) return;

    // Nếu đang giữ phím Ctrl, tạo bản sao của hoạt động
    if (isCtrlPressed && !isDragging) {
      handleCopyActivity(activity);
      return;
    }

    // Get mouse position from the event
    const mouseEvent = e as unknown as React.MouseEvent;
    const currentMousePosition = { x: mouseEvent.clientX, y: mouseEvent.clientY };

    // Calculate new time based on drag position with improved precision
    // Snap to 5-minute intervals for better grid alignment
    const dragMinutes = pixelsToMinutes(data.x);
    const newStartMinutes = CHART_START_HOUR * MINUTES_PER_HOUR + dragMinutes;

    // Validate time range
    const validatedStartMinutes = validateTimeRange(newStartMinutes);
    const newTime = minutesToTime(validatedStartMinutes);

    // Update drag feedback
    setDragFeedback({
      currentTime: newTime,
      isValidPosition: validatedStartMinutes === newStartMinutes,
      activityId: activity.id,
      position: currentMousePosition
    });

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi (only once at the start)
    if (!isDragging) {
      setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
      setCanUndo(true);
    }

    // Update activities with new time
    const updatedActivities = days[selectedDay].activities.map(act => {
      if (act.id === activity.id) {
        // Update the activity with the new time
        const updatedActivity = {
          ...act,
          time: newTime
        };

        // If there's an end time in the description, we need to maintain the duration
        const endTimeStr = getEndTimeFromDescription(act.description);
        if (endTimeStr) {
          const oldStartMinutes = timeToMinutes(act.time);
          const oldEndMinutes = timeToMinutes(endTimeStr);
          const duration = oldEndMinutes > oldStartMinutes
            ? oldEndMinutes - oldStartMinutes
            : (24 * 60 - oldStartMinutes) + oldEndMinutes;

          // Calculate new end time based on the same duration
          const newEndMinutes = (validatedStartMinutes + duration) % (24 * 60);
          const newEndTime = minutesToTime(newEndMinutes);

          // Update the end time in the description
          updatedActivity.description = act.description.replace(
            /END_TIME:[^;]*;/,
            `END_TIME:${newEndTime};`
          );
        }

        return updatedActivity;
      }
      return act;
    });

    // Update UI immediately
    if (onUpdateActivities) {
      onUpdateActivities(selectedDay, updatedActivities);
    }
  };

  // Xử lý khi kết thúc kéo thả
  const handleDragStop = (activity: ChartActivity, data: DraggableData) => {
    setIsDragging(false);
    setDragFeedback({
      currentTime: '',
      isValidPosition: true,
      activityId: null,
      position: null
    });

    if (!isEditing || !onUpdateActivities) return;

    // Calculate final position and time with improved precision
    // Snap to 5-minute intervals for better grid alignment
    const dragMinutes = pixelsToMinutes(data.x);
    const newStartMinutes = CHART_START_HOUR * MINUTES_PER_HOUR + dragMinutes;
    const validatedStartMinutes = validateTimeRange(newStartMinutes);
    const newTime = minutesToTime(validatedStartMinutes);

    // Update activities with final position
    const updatedActivities = days[selectedDay].activities.map(act => {
      if (act.id === activity.id) {
        // Update the activity with the new time
        const updatedActivity = {
          ...act,
          time: newTime
        };

        // If there's an end time in the description, we need to maintain the duration
        const endTimeStr = getEndTimeFromDescription(act.description);
        if (endTimeStr) {
          const oldStartMinutes = timeToMinutes(act.time);
          const oldEndMinutes = timeToMinutes(endTimeStr);
          const duration = oldEndMinutes > oldStartMinutes
            ? oldEndMinutes - oldStartMinutes
            : (24 * 60 - oldStartMinutes) + oldEndMinutes;

          // Calculate new end time based on the same duration
          const newEndMinutes = (validatedStartMinutes + duration) % (24 * 60);
          const newEndTime = minutesToTime(newEndMinutes);

          // Update the end time in the description
          updatedActivity.description = act.description.replace(
            /END_TIME:[^;]*;/,
            `END_TIME:${newEndTime};`
          );
        }

        return updatedActivity;
      }
      return act;
    });

    // Save to database with debounce
    debouncedSaveActivities(selectedDay, updatedActivities);
  };

  // Xử lý khi bắt đầu thay đổi kích thước
  const handleResizeStart = (activity: ChartActivity, edge: 'start' | 'end', event: React.MouseEvent) => {
    event.stopPropagation();
    setSelectedActivityId(activity.id);

    // Lưu trạng thái hiện tại vào lịch sử trước khi thay đổi
    setActivityHistory(prev => [...prev, [...days[selectedDay].activities]]);
    setCanUndo(true);

    // Initialize drag feedback
    setDragFeedback({
      currentTime: edge === 'start' ? activity.time : getEndTimeFromDescription(activity.description) || minutesToTime(activity.endMinutes),
      isValidPosition: true,
      activityId: activity.id,
      position: { x: event.clientX, y: event.clientY },
      edge: edge
    });

    setIsDragging(true);

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
      const minutesDelta = pixelsToMinutes(deltaX);

      // Update mouse position for visual feedback
      setDragFeedback(prev => ({
        ...prev,
        position: { x: moveEvent.clientX, y: moveEvent.clientY }
      }));

      let newTime = activity.time;
      let newEndTime = endTimeStr || minutesToTime(endTime);
      let newDuration = activity.duration;
      let isValid = true;

      if (edge === 'start') {
        // Thay đổi thời gian bắt đầu, giữ nguyên thời gian kết thúc
        const newStartMinutes = startTime + minutesDelta;

        // Validate time range
        const minStartTime = CHART_START_HOUR * MINUTES_PER_HOUR; // 6:00 AM
        const maxStartTime = calculatedEndTime - MIN_ACTIVITY_DURATION; // End time - 15 minutes

        // Check if position is valid
        isValid = newStartMinutes >= minStartTime && newStartMinutes <= maxStartTime;

        // Đảm bảo thời gian bắt đầu không âm và không vượt quá thời gian kết thúc - 15 phút
        const adjustedStartMinutes = Math.max(minStartTime, Math.min(newStartMinutes, maxStartTime));
        newTime = minutesToTime(adjustedStartMinutes);

        // Tính toán duration mới
        newDuration = calculatedEndTime - adjustedStartMinutes;

        // Update visual feedback
        setDragFeedback(prev => ({
          ...prev,
          currentTime: newTime,
          isValidPosition: isValid
        }));
      } else if (edge === 'end') {
        // Thay đổi thời gian kết thúc, giữ nguyên thời gian bắt đầu
        const newEndMinutes = calculatedEndTime + minutesDelta;

        // Validate time range
        const minEndTime = startTime + MIN_ACTIVITY_DURATION; // Start time + 15 minutes
        const maxEndTime = CHART_END_HOUR * MINUTES_PER_HOUR; // 00:00 (midnight)

        // Check if position is valid
        isValid = newEndMinutes >= minEndTime && newEndMinutes <= maxEndTime;

        // Đảm bảo thời gian kết thúc không nhỏ hơn thời gian bắt đầu + 15 phút và không vượt quá 00:00
        const adjustedEndMinutes = Math.min(maxEndTime, Math.max(newEndMinutes, minEndTime));
        newEndTime = minutesToTime(adjustedEndMinutes);

        // Tính toán duration mới
        newDuration = adjustedEndMinutes - startTime;

        // Update visual feedback
        setDragFeedback(prev => ({
          ...prev,
          currentTime: newEndTime,
          isValidPosition: isValid
        }));
      }

      // Đảm bảo duration tối thiểu là 15 phút
      if (newDuration < MIN_ACTIVITY_DURATION) {
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

      setIsDragging(false);
      setDragFeedback({
        currentTime: '',
        isValidPosition: true,
        activityId: null,
        position: null
      });

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
                // We don't need to calculate these values here as they're already in the description

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

            // Save to database with debounce
            debouncedSaveActivities(selectedDay, updatedActivities);
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
        mainLocation: newLocation,
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
        mainLocation: newActivity.location!, // Set mainLocation to the same as location
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
          <div
            className={cn(
              "p-2 border-r font-medium text-sm flex justify-between items-center bg-gray-50 dark:bg-gray-900 transition-all duration-200",
              isLocationColumnVisible ? "w-[200px] flex-shrink-0" : "w-[40px] flex-shrink-0"
            )}
          >
            <div className="flex items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "h-6 w-6 p-0 mr-1 transition-colors",
                        isLocationColumnVisible ? "hover:bg-gray-200 dark:hover:bg-gray-800" : "bg-gray-200/50 dark:bg-gray-800/50"
                      )}
                      onClick={() => setIsLocationColumnVisible(!isLocationColumnVisible)}
                    >
                      {isLocationColumnVisible ? (
                        <ChevronLeft className="h-3 w-3" />
                      ) : (
                        <ChevronRight className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs">
                    <div className="flex flex-col">
                      <span>{isLocationColumnVisible ? "Ẩn cột địa điểm" : "Hiện cột địa điểm"}</span>
                      <span className="text-muted-foreground text-[10px] mt-0.5">Phím tắt: Alt+L</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {isLocationColumnVisible && (
                <div className="flex items-center">
                  <span className="uppercase text-xs text-gray-500 dark:text-gray-400">Địa điểm</span>
                  <Badge variant="outline" className="ml-2 text-[9px] px-1 py-0 h-4">
                    {activeLocations.length}
                  </Badge>
                </div>
              )}
            </div>
            {isEditing && isLocationColumnVisible && (
              <div className="flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={handleOpenAddLocation}
                      >
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Thêm địa điểm mới
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={() => handleAddActivity('')}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Thêm hoạt động mới
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
                        onClick={handleUndo}
                        disabled={!canUndo}
                      >
                        <Undo className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs">
                      Hoàn tác (Ctrl+Z)
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>
          <div
            className="flex flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900 relative"
            ref={headerScrollRef}
          >
            {/* Grid Background - Light Mode */}
            <div
              className="absolute inset-0 grid-background dark:hidden"
              style={{
                backgroundSize: `${PIXELS_PER_HOUR}px 100%`,
                backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                backgroundPosition: '0 0',
                backgroundRepeat: 'repeat',
                width: `${hours.length * PIXELS_PER_HOUR}px`,
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
            {/* Grid Background - Dark Mode */}
            <div
              className="absolute inset-0 grid-background hidden dark:block"
              style={{
                backgroundSize: `${PIXELS_PER_HOUR}px 100%`,
                backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                backgroundPosition: '0 0',
                backgroundRepeat: 'repeat',
                width: `${hours.length * PIXELS_PER_HOUR}px`,
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0
              }}
            />
            {hours.map(hour => (
              <div
                key={hour}
                className="w-[80px] flex-shrink-0 p-2 text-center text-xs text-gray-500 dark:text-gray-400 relative z-10"
              >
                {hour === 24 ? '00:00' : `${hour}:00`}
              </div>
            ))}
          </div>
        </div>

        {/* Nội dung biểu đồ - không có thanh cuộn ngang */}
        <div
          className="overflow-x-hidden"
          ref={timelineRef}
        >
          {activeLocations.length > 0 ? (
            activeLocations.map(location => (
              <div key={location} className="flex border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 location-row transition-colors group" data-location={location}>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "py-2 px-3 border-r text-sm flex justify-between items-center transition-all duration-200 cursor-default",
                          isLocationColumnVisible ? "w-[200px] flex-shrink-0" : "w-[40px] flex-shrink-0"
                        )}
                      >
                        <div className={cn(
                          "flex items-center min-w-0",
                          isLocationColumnVisible ? "max-w-full" : "hidden"
                        )}>
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-2 flex-shrink-0 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                            {locationIcons[location]}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">{location}</span>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className="truncate">{locationActivityCounts[location] || 0} hoạt động</span>
                            </div>
                          </div>
                        </div>
                        {!isLocationColumnVisible && (
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700">
                            {locationIcons[location]}
                          </div>
                        )}
                        {isEditing && isLocationColumnVisible && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 flex-shrink-0 ml-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddActivity(location);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="p-3 max-w-xs">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 text-gray-500 dark:text-gray-400">
                            {locationIcons[`${location}-large`]}
                          </div>
                          <div>
                            <h4 className="font-medium">{location}</h4>
                            <p className="text-xs text-muted-foreground">
                              {locationActivityCounts[location] || 0} hoạt động
                            </p>
                          </div>
                        </div>

                        <div className="text-xs">
                          <div className="grid grid-cols-2 gap-1">
                            {chartData
                              .filter(activity => activity.mainLocation === location)
                              .slice(0, 4)
                              .map(activity => {
                                const { color } = ACTIVITY_TYPES[activity.type as keyof typeof ACTIVITY_TYPES] || ACTIVITY_TYPES['Khác'];
                                return (
                                  <div key={activity.id} className="flex items-center gap-1">
                                    <div className={cn("w-2 h-2 rounded-full", color)}></div>
                                    <span className="truncate">{activity.time} - {activity.title}</span>
                                  </div>
                                );
                              })}
                          </div>
                          {locationActivityCounts[location] > 4 && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              + {locationActivityCounts[location] - 4} hoạt động khác
                            </div>
                          )}
                        </div>

                        {isEditing && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full h-7 mt-1 text-xs"
                            onClick={() => handleAddActivity(location)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Thêm hoạt động
                          </Button>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <div className="flex flex-1 relative h-14">
                  {/* Grid Background - Light Mode */}
                  <div
                    className="absolute inset-0 grid-background dark:hidden"
                    style={{
                      backgroundSize: `${PIXELS_PER_HOUR}px 100%`,
                      backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                      backgroundPosition: '0 0',
                      backgroundRepeat: 'repeat',
                      width: `${hours.length * PIXELS_PER_HOUR}px`,
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  />

                  {/* Grid Background - Dark Mode */}
                  <div
                    className="absolute inset-0 grid-background hidden dark:block"
                    style={{
                      backgroundSize: `${PIXELS_PER_HOUR}px 100%`,
                      backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                      backgroundPosition: '0 0',
                      backgroundRepeat: 'repeat',
                      width: `${hours.length * PIXELS_PER_HOUR}px`,
                      height: '100%',
                      pointerEvents: 'none',
                      zIndex: 0
                    }}
                  />

                  {/* Hiển thị các hoạt động */}
                  {chartData
                    .filter(activity => activity.mainLocation === location)
                    .map(activity => {
                      // Calculate start position with precise alignment to grid
                      const startMinutesFromChartStart = activity.startMinutes - (CHART_START_HOUR * MINUTES_PER_HOUR);
                      const startPosition = minutesToPixels(startMinutesFromChartStart);

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

                      // Calculate width with precise alignment to grid
                      // First convert duration to pixels precisely
                      const durationInPixels = minutesToPixels(duration);
                      const width = Math.max(durationInPixels, minWidth);
                      const type = activity.type;
                      const { color, textColor } = ACTIVITY_TYPES[type as keyof typeof ACTIVITY_TYPES] || ACTIVITY_TYPES['Khác'];

                      return (
                        <Draggable
                          key={activity.id}
                          axis="x" // Chỉ cho phép kéo theo chiều ngang
                          disabled={!isEditing}
                          grid={[PIXELS_PER_MINUTE * 5, 0]} // Snap to 5-minute intervals for better alignment
                          defaultPosition={{ x: startPosition, y: 0 }}
                          position={{ x: startPosition, y: 0 }}
                          onStart={() => handleDragStart(activity)}
                          onDrag={(e, data) => handleDrag(activity, data, e)}
                          onStop={(_, data) => handleDragStop(activity, data)}
                          bounds={{
                            left: 0, // Minimum position (6:00 AM)
                            right: (CHART_END_HOUR - CHART_START_HOUR) * PIXELS_PER_HOUR // Maximum position (00:00)
                          }}
                        >
                          <div
                            className={cn(
                              `absolute top-2 h-10 rounded-md border ${color} ${textColor} text-xs flex items-center overflow-hidden group shadow-sm hover:shadow-md transition-all`,
                              selectedActivityId === activity.id && "ring-2 ring-purple-500",
                              isDragging && dragFeedback.activityId === activity.id && !dragFeedback.isValidPosition && "opacity-50 border-red-500 ring-1 ring-red-500",
                              isDragging && dragFeedback.activityId === activity.id && dragFeedback.isValidPosition && "ring-1 ring-green-500"
                            )}
                            style={{
                              width: `${width}px`,
                              zIndex: 10, // Ensure activities appear above grid lines
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
                                className={cn(
                                  "absolute left-0 top-0 bottom-0 w-3 cursor-ew-resize opacity-30 group-hover:opacity-100 bg-gradient-to-r from-gray-300 dark:from-gray-700 to-transparent",
                                  isDragging && dragFeedback.activityId === activity.id && dragFeedback.edge === 'start' && !dragFeedback.isValidPosition && "from-red-300 dark:from-red-700",
                                  isDragging && dragFeedback.activityId === activity.id && dragFeedback.edge === 'start' && dragFeedback.isValidPosition && "from-green-300 dark:from-green-700"
                                )}
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
                                className={cn(
                                  "absolute right-0 top-0 bottom-0 w-4 cursor-ew-resize opacity-50 group-hover:opacity-100 z-10 bg-gradient-to-r from-transparent to-gray-300 dark:to-gray-700",
                                  isDragging && dragFeedback.activityId === activity.id && dragFeedback.edge === 'end' && !dragFeedback.isValidPosition && "to-red-300 dark:to-red-700",
                                  isDragging && dragFeedback.activityId === activity.id && dragFeedback.edge === 'end' && dragFeedback.isValidPosition && "to-green-300 dark:to-green-700"
                                )}
                                onMouseDown={(e) => {
                                  e.stopPropagation(); // Ngăn sự kiện lan truyền
                                  handleResizeStart(activity, 'end', e);
                                }}
                                title="Kéo để thay đổi thời gian kết thúc"
                              />
                            )}

                            {/* Hiển thị biểu tượng kéo thả khi được chọn */}
                            {selectedActivityId === activity.id && !selectedActivityForPopup && !isDragging && (
                              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-3 bg-purple-500 rounded-full p-0.5">
                                <Move className="h-3 w-3 text-white" />
                              </div>
                            )}

                            {/* Time indicator */}
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 opacity-30">
                              <div className="absolute top-0 left-0 h-full bg-current opacity-50" style={{ width: '2px' }}></div>
                              <div className="absolute top-0 right-0 h-full bg-current opacity-50" style={{ width: '2px' }}></div>
                            </div>
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
            <div className={cn(
              "border-r transition-all duration-200",
              isLocationColumnVisible ? "w-[200px] flex-shrink-0" : "w-[40px] flex-shrink-0"
            )}></div>
            <div
              className="flex-1 overflow-x-auto"
              onScroll={(e) => {
                // Đồng bộ cả header và nội dung theo thanh cuộn duy nhất này
                if (timelineRef.current) {
                  timelineRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
                if (headerScrollRef.current) {
                  headerScrollRef.current.scrollLeft = e.currentTarget.scrollLeft;
                }
              }}
            >
              <div className="flex" style={{ width: `${hours.length * PIXELS_PER_HOUR}px`, height: '12px' }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Visual feedback for drag operations */}
      {isDragging && dragFeedback.position && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${dragFeedback.position.x}px`,
            top: `${dragFeedback.position.y - 40}px`, // Position above cursor
            transform: 'translateX(-50%)',
          }}
        >
          <div className={`px-2 py-1 rounded-md text-xs font-medium shadow-md ${
            dragFeedback.isValidPosition
              ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800'
              : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800'
          }`}>
            {dragFeedback.currentTime}
            {!dragFeedback.isValidPosition && (
              <span className="ml-1 inline-flex items-center">
                <AlertCircle className="h-3 w-3 ml-0.5" />
              </span>
            )}
          </div>
        </div>
      )}

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
