// Mock data cho các kế hoạch chuyến đi

import { TripPlan } from './types';

// Mock trip plans data
export const MOCK_TRIP_PLANS: Record<string, TripPlan> = {
  'plan-dalat': {
    id: 'plan-dalat',
    name: 'Khám phá Đà Lạt',
    destination: 'Đà Lạt, Lâm Đồng',
    region: 'Miền Trung',
    description: 'Kế hoạch 3 ngày khám phá thành phố ngàn hoa Đà Lạt với các điểm tham quan nổi tiếng và ẩm thực đặc sắc.',
    duration: 3,
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['DaLat', 'ThanhPhoNganHoa', 'MienNui'],
    days: [
      {
        id: 'day-1',
        date: null,
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Ăn sáng tại chợ Đà Lạt',
            description: 'Thưởng thức bánh căn, bánh mì xíu mại và cà phê Đà Lạt tại chợ trung tâm.',
            location: 'Chợ Đà Lạt',
            mainLocation: 'Chợ Đà Lạt',
            type: 'Ăn sáng'
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan Nhà thờ Con Gà',
            description: 'Tham quan nhà thờ mang kiến trúc Pháp nổi tiếng với chiếc chuông hình con gà.',
            location: 'Nhà thờ Con Gà',
            mainLocation: 'Nhà thờ Con Gà',
            type: 'Tham quan'
          },
          {
            id: 'activity-3',
            time: '11:30',
            title: 'Ăn trưa tại quán Bún Bò Huế',
            description: 'Thưởng thức bún bò Huế nổi tiếng tại Đà Lạt.',
            location: 'Quán Bún Bò Huế',
            mainLocation: 'Quán Bún Bò Huế',
            type: 'Ăn trưa'
          },
          {
            id: 'activity-4',
            time: '13:00',
            title: 'Tham quan Hồ Xuân Hương',
            description: 'Dạo quanh hồ Xuân Hương, ngắm cảnh đẹp và thuê xe đạp đôi.',
            location: 'Hồ Xuân Hương',
            mainLocation: 'Hồ Xuân Hương',
            type: 'Tham quan'
          },
          {
            id: 'activity-5',
            time: '16:00',
            title: 'Cà phê tại Cà Phê Túi',
            description: 'Thưởng thức cà phê trong không gian độc đáo của quán cà phê túi.',
            location: 'Cà Phê Túi',
            mainLocation: 'Cà Phê Túi',
            type: 'Cà phê'
          },
          {
            id: 'activity-6',
            time: '18:30',
            title: 'Ăn tối tại chợ đêm Đà Lạt',
            description: 'Khám phá ẩm thực đường phố tại chợ đêm Đà Lạt.',
            location: 'Chợ đêm Đà Lạt',
            mainLocation: 'Chợ đêm Đà Lạt',
            type: 'Ăn tối'
          }
        ]
      },
      {
        id: 'day-2',
        date: null,
        activities: [
          {
            id: 'activity-7',
            time: '07:30',
            title: 'Ăn sáng tại khách sạn',
            description: 'Thưởng thức bữa sáng tại khách sạn.',
            location: 'Khách sạn',
            mainLocation: 'Khách sạn',
            type: 'Ăn sáng'
          },
          {
            id: 'activity-8',
            time: '09:00',
            title: 'Tham quan Thung lũng Tình Yêu',
            description: 'Khám phá cảnh đẹp của Thung lũng Tình Yêu.',
            location: 'Thung lũng Tình Yêu',
            mainLocation: 'Thung lũng Tình Yêu',
            type: 'Tham quan'
          },
          {
            id: 'activity-9',
            time: '12:00',
            title: 'Ăn trưa tại nhà hàng Leguda',
            description: 'Thưởng thức ẩm thực Đà Lạt tại nhà hàng nổi tiếng.',
            location: 'Nhà hàng Leguda',
            mainLocation: 'Nhà hàng Leguda',
            type: 'Ăn trưa'
          },
          {
            id: 'activity-10',
            time: '14:00',
            title: 'Tham quan Làng Cù Lần',
            description: 'Khám phá làng Cù Lần với kiến trúc độc đáo và hoạt động thú vị.',
            location: 'Làng Cù Lần',
            mainLocation: 'Làng Cù Lần',
            type: 'Tham quan'
          },
          {
            id: 'activity-11',
            time: '18:00',
            title: 'Ăn tối tại nhà hàng Ấn Độ',
            description: 'Thưởng thức ẩm thực Ấn Độ tại Đà Lạt.',
            location: 'Nhà hàng Ấn Độ',
            mainLocation: 'Nhà hàng Ấn Độ',
            type: 'Ăn tối'
          }
        ]
      },
      {
        id: 'day-3',
        date: null,
        activities: [
          {
            id: 'activity-12',
            time: '07:00',
            title: 'Ăn sáng tại khách sạn',
            description: 'Thưởng thức bữa sáng tại khách sạn.',
            location: 'Khách sạn',
            mainLocation: 'Khách sạn',
            type: 'Ăn sáng'
          },
          {
            id: 'activity-13',
            time: '08:30',
            title: 'Tham quan Đồi Robin',
            description: 'Khám phá cảnh đẹp của Đồi Robin.',
            location: 'Đồi Robin',
            mainLocation: 'Đồi Robin',
            type: 'Tham quan'
          },
          {
            id: 'activity-14',
            time: '11:30',
            title: 'Ăn trưa tại quán Bánh Căn',
            description: 'Thưởng thức bánh căn Đà Lạt truyền thống.',
            location: 'Quán Bánh Căn',
            mainLocation: 'Quán Bánh Căn',
            type: 'Ăn trưa'
          },
          {
            id: 'activity-15',
            time: '13:30',
            title: 'Mua sắm đặc sản',
            description: 'Mua sắm đặc sản Đà Lạt làm quà.',
            location: 'Chợ Đà Lạt',
            mainLocation: 'Chợ Đà Lạt',
            type: 'Mua sắm'
          },
          {
            id: 'activity-16',
            time: '16:00',
            title: 'Cà phê tại Cà phê Mê Linh',
            description: 'Thưởng thức cà phê chồn tại đồi Mê Linh.',
            location: 'Cà phê Mê Linh',
            mainLocation: 'Cà phê Mê Linh',
            type: 'Cà phê'
          }
        ]
      }
    ],
    authorId: 'user-1',
    authorName: 'Nguyễn Văn A',
    isPublic: true,
    groupId: '1', // ID of the group this plan belongs to
    createdAt: new Date('2023-05-15'),
    updatedAt: new Date('2023-05-20')
  },
  'plan-sapa': {
    id: 'plan-sapa',
    name: 'Khám phá Sapa',
    destination: 'Sapa, Lào Cai',
    region: 'Miền Bắc',
    description: 'Kế hoạch 3 ngày khám phá Sapa với những ruộng bậc thang tuyệt đẹp, văn hóa dân tộc đặc sắc và chinh phục đỉnh Fansipan.',
    duration: 3,
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['Sapa', 'RuongBacThang', 'Fansipan'],
    days: [
      {
        id: 'day-1',
        date: null,
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng tại khách sạn với các món đặc sản vùng núi.',
            location: 'Khách sạn',
            mainLocation: 'Khách sạn',
            type: 'Ăn sáng'
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan Bản Cát Cát',
            description: 'Khám phá văn hóa dân tộc H\'Mông tại bản Cát Cát.',
            location: 'Bản Cát Cát',
            mainLocation: 'Bản Cát Cát',
            type: 'Tham quan'
          },
          {
            id: 'activity-3',
            time: '12:30',
            title: 'Ăn trưa tại nhà hàng địa phương',
            description: 'Thưởng thức các món ăn đặc sản của người dân tộc.',
            location: 'Nhà hàng địa phương',
            mainLocation: 'Nhà hàng địa phương',
            type: 'Ăn trưa'
          }
        ]
      },
      {
        id: 'day-2',
        date: null,
        activities: [
          {
            id: 'activity-4',
            time: '07:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng tại khách sạn.',
            location: 'Khách sạn',
            mainLocation: 'Khách sạn',
            type: 'Ăn sáng'
          },
          {
            id: 'activity-5',
            time: '08:30',
            title: 'Chinh phục đỉnh Fansipan',
            description: 'Đi cáp treo lên đỉnh Fansipan - "Nóc nhà Đông Dương".',
            location: 'Fansipan',
            mainLocation: 'Fansipan',
            type: 'Tham quan'
          }
        ]
      },
      {
        id: 'day-3',
        date: null,
        activities: [
          {
            id: 'activity-6',
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng tại khách sạn.',
            location: 'Khách sạn',
            mainLocation: 'Khách sạn',
            type: 'Ăn sáng'
          },
          {
            id: 'activity-7',
            time: '09:30',
            title: 'Tham quan ruộng bậc thang',
            description: 'Ngắm nhìn ruộng bậc thang tuyệt đẹp tại Sapa.',
            location: 'Ruộng bậc thang',
            mainLocation: 'Ruộng bậc thang',
            type: 'Tham quan'
          }
        ]
      }
    ],
    authorId: 'user-2',
    authorName: 'Trần Thị B',
    isPublic: true,
    groupId: '2',
    createdAt: new Date('2023-06-10'),
    updatedAt: new Date('2023-06-15')
  },
  'plan-halong': {
    id: 'plan-halong',
    name: 'Khám phá Vịnh Hạ Long',
    destination: 'Hạ Long, Quảng Ninh',
    region: 'Miền Bắc',
    description: 'Kế hoạch 3 ngày khám phá kỳ quan thiên nhiên thế giới Vịnh Hạ Long với tour du thuyền, khám phá hang động và các hoạt động thú vị trên biển.',
    duration: 3,
    image: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['HaLong', 'DiSanThienNhien', 'KyQuan'],
    days: [
      {
        id: 'day-1',
        date: null,
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Khởi hành từ Hà Nội',
            description: 'Di chuyển từ Hà Nội đến Hạ Long bằng xe limousine.',
            location: 'Hà Nội',
            mainLocation: 'Hà Nội',
            type: 'Di chuyển'
          },
          {
            id: 'activity-2',
            time: '12:00',
            title: 'Ăn trưa trên du thuyền',
            description: 'Thưởng thức bữa trưa hải sản trên du thuyền.',
            location: 'Du thuyền',
            mainLocation: 'Du thuyền',
            type: 'Ăn trưa'
          }
        ]
      },
      {
        id: 'day-2',
        date: null,
        activities: [
          {
            id: 'activity-3',
            time: '06:00',
            title: 'Ngắm bình minh trên vịnh',
            description: 'Dậy sớm ngắm cảnh bình minh tuyệt đẹp trên vịnh Hạ Long.',
            location: 'Vịnh Hạ Long',
            mainLocation: 'Vịnh Hạ Long',
            type: 'Tham quan'
          },
          {
            id: 'activity-4',
            time: '08:00',
            title: 'Ăn sáng trên du thuyền',
            description: 'Thưởng thức bữa sáng trên du thuyền.',
            location: 'Du thuyền',
            mainLocation: 'Du thuyền',
            type: 'Ăn sáng'
          }
        ]
      },
      {
        id: 'day-3',
        date: null,
        activities: [
          {
            id: 'activity-5',
            time: '07:30',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng trên du thuyền.',
            location: 'Du thuyền',
            mainLocation: 'Du thuyền',
            type: 'Ăn sáng'
          },
          {
            id: 'activity-6',
            time: '09:00',
            title: 'Tham quan hang Sửng Sốt',
            description: 'Khám phá hang động lớn nhất và đẹp nhất vịnh Hạ Long.',
            location: 'Hang Sửng Sốt',
            mainLocation: 'Hang Sửng Sốt',
            type: 'Tham quan'
          }
        ]
      }
    ],
    authorId: 'user-3',
    authorName: 'Lê Văn C',
    isPublic: true,
    groupId: '3',
    createdAt: new Date('2023-07-05'),
    updatedAt: new Date('2023-07-10')
  }
};

// Hàm lấy kế hoạch chuyến đi theo ID
export const getTripPlanById = (id: string): TripPlan | undefined => {
  return MOCK_TRIP_PLANS[id];
};

// Hàm lấy kế hoạch chuyến đi theo ID nhóm
export const getTripPlanByGroupId = (groupId: string): TripPlan | undefined => {
  return Object.values(MOCK_TRIP_PLANS).find(plan => plan.groupId === groupId);
};

// Hàm cập nhật kế hoạch chuyến đi
export const updateTripPlan = (plan: TripPlan): TripPlan => {
  MOCK_TRIP_PLANS[plan.id] = {
    ...plan,
    updatedAt: new Date()
  };
  return MOCK_TRIP_PLANS[plan.id];
};
