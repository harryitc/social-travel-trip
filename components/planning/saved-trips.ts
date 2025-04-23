// Define types for saved trips
export type TripActivity = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
};

export type TripDay = {
  id: string;
  date: string; // ISO date string
  activities: TripActivity[];
};

export type SavedTrip = {
  id: string;
  name: string;
  description: string;
  image: string;
  startDate: string;
  endDate: string;
  days: number;
  itinerary: TripDay[];
  createdAt: string;
  updatedAt: string;
};

// Mock data for saved trips
export const SAVED_TRIPS: SavedTrip[] = [
  {
    id: 'trip-1',
    name: 'Khám phá Đà Lạt',
    description: 'Chuyến đi khám phá thành phố sương mù với những địa điểm nổi tiếng',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    startDate: '2023-12-20',
    endDate: '2023-12-23',
    days: 4,
    itinerary: [
      {
        id: 'day-1',
        date: '2023-12-20',
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Ăn sáng tại khách sạn',
            description: 'Bữa sáng buffet tại nhà hàng của khách sạn',
            location: 'Khách sạn',
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan Hồ Xuân Hương',
            description: 'Đi dạo quanh hồ và ngắm cảnh',
            location: 'Hồ Xuân Hương',
          },
          {
            id: 'activity-3',
            time: '12:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức ẩm thực địa phương',
            location: 'Nhà hàng trung tâm',
          },
        ],
      },
      {
        id: 'day-2',
        date: '2023-12-21',
        activities: [
          {
            id: 'activity-4',
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại quán cà phê địa phương',
            location: 'Quán cà phê',
          },
          {
            id: 'activity-5',
            time: '09:30',
            title: 'Tham quan Thung lũng Tình yêu',
            description: 'Khám phá cảnh đẹp của thung lũng',
            location: 'Thung lũng Tình yêu',
          },
        ],
      },
    ],
    createdAt: '2023-11-15T10:30:00Z',
    updatedAt: '2023-11-18T14:20:00Z',
  },
  {
    id: 'trip-2',
    name: 'Kỳ nghỉ biển Nha Trang',
    description: 'Chuyến đi nghỉ dưỡng tại bãi biển Nha Trang xinh đẹp',
    image: 'https://images.pexels.com/photos/4428272/pexels-photo-4428272.jpeg?auto=compress&cs=tinysrgb&w=600',
    startDate: '2024-01-15',
    endDate: '2024-01-20',
    days: 6,
    itinerary: [
      {
        id: 'day-1',
        date: '2024-01-15',
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Ăn sáng tại khách sạn',
            description: 'Bữa sáng buffet tại nhà hàng của khách sạn',
            location: 'Khách sạn',
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tắm biển',
            description: 'Tắm biển và thư giãn trên bãi biển',
            location: 'Bãi biển Nha Trang',
          },
        ],
      },
    ],
    createdAt: '2023-12-01T08:45:00Z',
    updatedAt: '2023-12-05T16:30:00Z',
  },
  {
    id: 'trip-3',
    name: 'Khám phá Hà Giang',
    description: 'Hành trình khám phá vẻ đẹp hùng vĩ của cao nguyên đá Hà Giang',
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg?auto=compress&cs=tinysrgb&w=600',
    startDate: '2024-02-10',
    endDate: '2024-02-15',
    days: 6,
    itinerary: [
      {
        id: 'day-1',
        date: '2024-02-10',
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Khởi hành từ Hà Nội',
            description: 'Bắt đầu hành trình từ Hà Nội đi Hà Giang',
            location: 'Hà Nội',
          },
          {
            id: 'activity-2',
            time: '12:00',
            title: 'Ăn trưa dọc đường',
            description: 'Dừng chân ăn trưa tại quán ăn địa phương',
            location: 'Tuyên Quang',
          },
        ],
      },
    ],
    createdAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-10T11:20:00Z',
  },
  {
    id: 'trip-4',
    name: 'Phố cổ Hội An',
    description: 'Khám phá vẻ đẹp cổ kính và ẩm thực đặc sắc của phố cổ Hội An',
    image: 'https://images.pexels.com/photos/5739051/pexels-photo-5739051.jpeg?auto=compress&cs=tinysrgb&w=600',
    startDate: '2024-03-05',
    endDate: '2024-03-08',
    days: 4,
    itinerary: [
      {
        id: 'day-1',
        date: '2024-03-05',
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Ăn sáng tại khách sạn',
            description: 'Bữa sáng tại khách sạn ở Hội An',
            location: 'Khách sạn',
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan phố cổ',
            description: 'Đi bộ tham quan các điểm du lịch nổi tiếng trong phố cổ',
            location: 'Phố cổ Hội An',
          },
        ],
      },
    ],
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-03T10:45:00Z',
  },
];
