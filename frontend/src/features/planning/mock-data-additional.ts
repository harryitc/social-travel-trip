// Define the types to match the ones in mock-data.ts
type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
};

type Day = {
  id: string;
  date: null; // Null for template, will be set when applied
  activities: Activity[];
};

type TravelPlanTemplate = {
  id: string;
  name: string;
  destination: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  description: string;
  duration: number; // Number of days
  image: string;
  tags: string[];
  days: Day[];
  authorId?: string;
  authorName?: string;
  isPublic: boolean;
  rating: number;
  usageCount: number;
};

// Additional travel plan templates for Vietnamese destinations
export const ADDITIONAL_TEMPLATES: TravelPlanTemplate[] = [
  {
    id: 'template-halong',
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
            location: 'Hà Nội'
          },
          {
            id: 'activity-2',
            time: '12:00',
            title: 'Đến cảng Tuần Châu',
            description: 'Làm thủ tục lên du thuyền và nhận phòng.',
            location: 'Cảng Tuần Châu, Hạ Long'
          },
          {
            id: 'activity-3',
            time: '13:00',
            title: 'Ăn trưa trên du thuyền',
            description: 'Thưởng thức bữa trưa hải sản tươi ngon trong khi du thuyền bắt đầu hành trình.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-4',
            time: '15:00',
            title: 'Tham quan hang Sửng Sốt',
            description: 'Khám phá một trong những hang động đẹp nhất Vịnh Hạ Long với nhiều nhũ đá kỳ thú.',
            location: 'Hang Sửng Sốt'
          },
          {
            id: 'activity-5',
            time: '17:00',
            title: 'Chèo thuyền kayak',
            description: 'Khám phá vịnh bằng thuyền kayak, len lỏi qua các hòn đảo nhỏ.',
            location: 'Vịnh Hạ Long'
          },
          {
            id: 'activity-6',
            time: '19:00',
            title: 'Ăn tối trên du thuyền',
            description: 'Thưởng thức bữa tối hải sản và ngắm hoàng hôn trên vịnh.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-7',
            time: '21:00',
            title: 'Câu mực đêm',
            description: 'Tham gia hoạt động câu mực đêm cùng thủy thủ đoàn.',
            location: 'Du thuyền'
          }
        ]
      },
      {
        id: 'day-2',
        date: null,
        activities: [
          {
            id: 'activity-8',
            time: '06:00',
            title: 'Ngắm bình minh và tập Tai Chi',
            description: 'Dậy sớm ngắm bình minh trên vịnh và tham gia lớp Tai Chi buổi sáng.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-9',
            time: '07:30',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng trên du thuyền.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-10',
            time: '09:00',
            title: 'Tham quan làng chài Cửa Vạn',
            description: 'Tham quan làng chài nổi lớn nhất Vịnh Hạ Long và tìm hiểu cuộc sống của ngư dân.',
            location: 'Làng chài Cửa Vạn'
          },
          {
            id: 'activity-11',
            time: '11:30',
            title: 'Tham quan hang Tiên Ông',
            description: 'Khám phá hang động với nhiều truyền thuyết thú vị.',
            location: 'Hang Tiên Ông'
          },
          {
            id: 'activity-12',
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức bữa trưa trên du thuyền.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-13',
            time: '15:00',
            title: 'Tắm biển tại Bãi Tắm Titop',
            description: 'Tắm biển và leo núi ngắm toàn cảnh Vịnh Hạ Long từ trên cao.',
            location: 'Đảo Titop'
          },
          {
            id: 'activity-14',
            time: '18:00',
            title: 'Lớp học nấu ăn',
            description: 'Tham gia lớp học nấu các món ăn truyền thống Việt Nam trên du thuyền.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-15',
            time: '19:30',
            title: 'Ăn tối',
            description: 'Thưởng thức bữa tối với các món ăn vừa học nấu.',
            location: 'Du thuyền'
          }
        ]
      },
      {
        id: 'day-3',
        date: null,
        activities: [
          {
            id: 'activity-16',
            time: '07:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng nhẹ trên du thuyền.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-17',
            time: '08:30',
            title: 'Tham quan hang Luồn',
            description: 'Chèo thuyền kayak qua hang Luồn để khám phá vùng nước yên bình bên trong.',
            location: 'Hang Luồn'
          },
          {
            id: 'activity-18',
            time: '10:30',
            title: 'Trả phòng',
            description: 'Làm thủ tục trả phòng và chuẩn bị rời du thuyền.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-19',
            time: '11:30',
            title: 'Ăn trưa',
            description: 'Thưởng thức bữa trưa muộn trên du thuyền trước khi về đất liền.',
            location: 'Du thuyền'
          },
          {
            id: 'activity-20',
            time: '12:30',
            title: 'Về đến cảng Tuần Châu',
            description: 'Kết thúc hành trình du thuyền và lên bờ.',
            location: 'Cảng Tuần Châu'
          },
          {
            id: 'activity-21',
            time: '13:30',
            title: 'Tham quan Bảo tàng Quảng Ninh',
            description: 'Tham quan bảo tàng hiện đại với kiến trúc độc đáo và tìm hiểu về lịch sử, văn hóa của Quảng Ninh.',
            location: 'Bảo tàng Quảng Ninh'
          },
          {
            id: 'activity-22',
            time: '16:00',
            title: 'Khởi hành về Hà Nội',
            description: 'Kết thúc chuyến đi và di chuyển về Hà Nội.',
            location: 'Hạ Long'
          }
        ]
      }
    ],
    authorId: '2',
    authorName: 'Trần Hà',
    isPublic: true,
    rating: 4.9,
    usageCount: 1356
  },
  {
    id: 'template-hoian',
    name: 'Khám phá Hội An',
    destination: 'Hội An, Quảng Nam',
    region: 'Miền Trung',
    description: 'Kế hoạch 3 ngày khám phá phố cổ Hội An - Di sản văn hóa thế giới với kiến trúc cổ, ẩm thực đặc sắc và các làng nghề truyền thống.',
    duration: 3,
    image: 'https://images.pexels.com/photos/5191371/pexels-photo-5191371.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['HoiAn', 'PhoCo', 'DiSanVanHoa'],
    days: [
      {
        id: 'day-1',
        date: null,
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng với món Cao lầu - đặc sản Hội An.',
            location: 'Quán Cao lầu Bà Bé, 16 Thái Phiên'
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan phố cổ Hội An',
            description: 'Dạo bộ tham quan các điểm di tích nổi tiếng trong phố cổ như Chùa Cầu, Hội quán Phúc Kiến, nhà cổ Tấn Ký.',
            location: 'Phố cổ Hội An'
          },
          {
            id: 'activity-3',
            time: '12:30',
            title: 'Ăn trưa',
            description: 'Thưởng thức bánh mì Phượng - một trong những tiệm bánh mì ngon nhất Việt Nam.',
            location: 'Bánh mì Phượng, 2B Phan Châu Trinh'
          },
          {
            id: 'activity-4',
            time: '14:00',
            title: 'Tham quan Bảo tàng Gốm sứ Mậu dịch',
            description: 'Tìm hiểu về lịch sử thương mại và gốm sứ cổ của Hội An.',
            location: 'Bảo tàng Gốm sứ Mậu dịch'
          },
          {
            id: 'activity-5',
            time: '16:00',
            title: 'Trải nghiệm may áo dài',
            description: 'Ghé thăm một trong những tiệm may nổi tiếng để đặt may áo dài truyền thống.',
            location: 'Tiệm may A Dong Silk'
          },
          {
            id: 'activity-6',
            time: '18:00',
            title: 'Ngắm hoàng hôn trên sông Thu Bồn',
            description: 'Đi thuyền trên sông Thu Bồn và ngắm cảnh hoàng hôn tuyệt đẹp.',
            location: 'Bến thuyền Bạch Đằng'
          },
          {
            id: 'activity-7',
            time: '19:30',
            title: 'Ăn tối',
            description: 'Thưởng thức các món hải sản tươi ngon và đặc sản Hội An.',
            location: 'Nhà hàng Morning Glory'
          },
          {
            id: 'activity-8',
            time: '21:00',
            title: 'Dạo phố đêm và thả đèn hoa đăng',
            description: 'Tham quan phố cổ về đêm với ánh sáng lung linh từ hàng nghìn chiếc đèn lồng và thả đèn hoa đăng trên sông.',
            location: 'Phố cổ Hội An'
          }
        ]
      },
      {
        id: 'day-2',
        date: null,
        activities: [
          {
            id: 'activity-9',
            time: '07:30',
            title: 'Ăn sáng',
            description: 'Thưởng thức mì Quảng - đặc sản của vùng Quảng Nam.',
            location: 'Mì Quảng Bà Mua, 20 Trần Phú'
          },
          {
            id: 'activity-10',
            time: '09:00',
            title: 'Tham quan làng gốm Thanh Hà',
            description: 'Tìm hiểu về nghề làm gốm truyền thống và trải nghiệm làm gốm.',
            location: 'Làng gốm Thanh Hà'
          },
          {
            id: 'activity-11',
            time: '11:30',
            title: 'Tham quan làng mộc Kim Bồng',
            description: 'Khám phá làng nghề mộc truyền thống với các sản phẩm chạm khắc tinh xảo.',
            location: 'Làng mộc Kim Bồng'
          },
          {
            id: 'activity-12',
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức cơm gà Hội An - một món ăn nổi tiếng của vùng đất này.',
            location: 'Cơm gà Bà Buội, 22 Phan Chu Trinh'
          },
          {
            id: 'activity-13',
            time: '15:00',
            title: 'Tham quan Rừng dừa Bảy Mẫu',
            description: 'Trải nghiệm đi thuyền thúng trong rừng dừa nước và tham gia các hoạt động thú vị.',
            location: 'Rừng dừa Bảy Mẫu, Cẩm Thanh'
          },
          {
            id: 'activity-14',
            time: '18:00',
            title: 'Lớp học nấu ăn',
            description: 'Tham gia lớp học nấu các món ăn đặc trưng của Hội An.',
            location: 'Trường dạy nấu ăn Gioan Cookery'
          },
          {
            id: 'activity-15',
            time: '20:00',
            title: 'Ăn tối',
            description: 'Thưởng thức các món ăn do chính tay mình nấu trong lớp học.',
            location: 'Trường dạy nấu ăn Gioan Cookery'
          }
        ]
      },
      {
        id: 'day-3',
        date: null,
        activities: [
          {
            id: 'activity-16',
            time: '07:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bánh vạc (White Rose) - đặc sản Hội An.',
            location: 'Nhà hàng White Rose, 533 Hai Bà Trưng'
          },
          {
            id: 'activity-17',
            time: '08:30',
            title: 'Tham quan Thánh địa Mỹ Sơn',
            description: 'Khám phá khu di tích đền tháp Chăm Pa - Di sản văn hóa thế giới.',
            location: 'Thánh địa Mỹ Sơn'
          },
          {
            id: 'activity-18',
            time: '12:30',
            title: 'Ăn trưa',
            description: 'Thưởng thức ẩm thực địa phương tại nhà hàng gần Mỹ Sơn.',
            location: 'Nhà hàng gần Mỹ Sơn'
          },
          {
            id: 'activity-19',
            time: '14:30',
            title: 'Tham quan bãi biển An Bàng',
            description: 'Thư giãn và tắm biển tại một trong những bãi biển đẹp nhất Việt Nam.',
            location: 'Bãi biển An Bàng'
          },
          {
            id: 'activity-20',
            time: '17:00',
            title: 'Mua sắm đồ lưu niệm',
            description: 'Mua sắm các sản phẩm thủ công mỹ nghệ, đèn lồng và các món quà lưu niệm.',
            location: 'Chợ Hội An'
          },
          {
            id: 'activity-21',
            time: '19:00',
            title: 'Ăn tối chia tay',
            description: 'Thưởng thức bữa tối với các món đặc sản Hội An để kết thúc chuyến đi.',
            location: 'Nhà hàng Cargo Club'
          },
          {
            id: 'activity-22',
            time: '21:00',
            title: 'Xem biểu diễn nghệ thuật',
            description: 'Thưởng thức show diễn "Ký ức Hội An" - show diễn thực cảnh ngoài trời lớn nhất Việt Nam.',
            location: 'Công viên Ấn tượng Hội An'
          }
        ]
      }
    ],
    authorId: '1',
    authorName: 'Nguyễn Minh',
    isPublic: true,
    rating: 4.8,
    usageCount: 1024
  }
];
