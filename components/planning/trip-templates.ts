// Define types for trip templates
export type TemplateActivity = {
  time: string;
  title: string;
  description: string;
  location: string;
};

export type DayTemplate = {
  title: string;
  activities: TemplateActivity[];
};

export type TripTemplate = {
  id: string;
  name: string;
  description: string;
  image: string;
  duration: number;
  days: DayTemplate[];
};

// Mock data for trip templates
export const TRIP_TEMPLATES: TripTemplate[] = [
  {
    id: 'beach-vacation',
    name: 'Kỳ nghỉ biển',
    description: 'Template cho chuyến đi biển với các hoạt động như tắm biển, lặn biển và thư giãn',
    image: 'https://images.pexels.com/photos/4428272/pexels-photo-4428272.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 3,
    days: [
      {
        title: 'Khám phá bãi biển',
        activities: [
          {
            time: '08:00',
            title: 'Ăn sáng tại khách sạn',
            description: 'Bữa sáng buffet tại nhà hàng của khách sạn',
            location: 'Khách sạn',
          },
          {
            time: '09:30',
            title: 'Tắm biển',
            description: 'Tắm biển và thư giãn trên bãi biển',
            location: 'Bãi biển chính',
          },
          {
            time: '12:00',
            title: 'Ăn trưa',
            description: 'Ăn trưa tại nhà hàng hải sản gần biển',
            location: 'Nhà hàng Hải Sản Biển Xanh',
          },
          {
            time: '14:00',
            title: 'Chèo thuyền kayak',
            description: 'Thuê thuyền kayak và khám phá vùng biển',
            location: 'Trung tâm thể thao biển',
          },
          {
            time: '18:00',
            title: 'Ăn tối',
            description: 'Ăn tối tại nhà hàng địa phương',
            location: 'Nhà hàng Biển Đông',
          },
        ],
      },
      {
        title: 'Lặn biển và khám phá đảo',
        activities: [
          {
            time: '07:30',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại khách sạn',
            location: 'Khách sạn',
          },
          {
            time: '09:00',
            title: 'Tour lặn biển',
            description: 'Tham gia tour lặn biển ngắm san hô',
            location: 'Bến tàu chính',
          },
          {
            time: '12:30',
            title: 'Ăn trưa trên đảo',
            description: 'Ăn trưa tại nhà hàng trên đảo',
            location: 'Đảo Hòn Mun',
          },
          {
            time: '14:00',
            title: 'Khám phá đảo',
            description: 'Đi bộ khám phá đảo và chụp ảnh',
            location: 'Đảo Hòn Mun',
          },
          {
            time: '17:00',
            title: 'Trở về đất liền',
            description: 'Đi tàu trở về đất liền',
            location: 'Bến tàu đảo',
          },
          {
            time: '19:00',
            title: 'Ăn tối và thư giãn',
            description: 'Ăn tối tại nhà hàng và thư giãn tại khách sạn',
            location: 'Khu vực trung tâm',
          },
        ],
      },
      {
        title: 'Thư giãn và mua sắm',
        activities: [
          {
            time: '08:30',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại khách sạn',
            location: 'Khách sạn',
          },
          {
            time: '10:00',
            title: 'Spa và massage',
            description: 'Thư giãn với dịch vụ spa và massage',
            location: 'Spa của khách sạn',
          },
          {
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Ăn trưa tại nhà hàng địa phương',
            location: 'Nhà hàng Hương Biển',
          },
          {
            time: '15:00',
            title: 'Mua sắm đồ lưu niệm',
            description: 'Mua sắm đồ lưu niệm tại chợ địa phương',
            location: 'Chợ đêm',
          },
          {
            time: '18:30',
            title: 'Ăn tối chia tay',
            description: 'Bữa tối chia tay tại nhà hàng sang trọng',
            location: 'Nhà hàng Panorama',
          },
        ],
      },
    ],
  },
  {
    id: 'mountain-exploration',
    name: 'Khám phá núi rừng',
    description: 'Template cho chuyến đi khám phá núi rừng với các hoạt động như leo núi, cắm trại',
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 3,
    days: [
      {
        title: 'Khám phá thị trấn',
        activities: [
          {
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại homestay',
            location: 'Homestay',
          },
          {
            time: '09:30',
            title: 'Tham quan thị trấn',
            description: 'Đi bộ tham quan thị trấn và các cửa hàng địa phương',
            location: 'Thị trấn',
          },
          {
            time: '12:00',
            title: 'Ăn trưa',
            description: 'Ăn trưa tại nhà hàng địa phương',
            location: 'Nhà hàng Đặc Sản Vùng Cao',
          },
          {
            time: '14:00',
            title: 'Tham quan chợ địa phương',
            description: 'Tham quan chợ và mua đặc sản địa phương',
            location: 'Chợ trung tâm',
          },
          {
            time: '18:00',
            title: 'Ăn tối',
            description: 'Ăn tối tại nhà hàng địa phương',
            location: 'Nhà hàng Hương Rừng',
          },
        ],
      },
      {
        title: 'Leo núi',
        activities: [
          {
            time: '06:30',
            title: 'Ăn sáng sớm',
            description: 'Ăn sáng sớm để chuẩn bị cho chuyến leo núi',
            location: 'Homestay',
          },
          {
            time: '07:30',
            title: 'Khởi hành leo núi',
            description: 'Bắt đầu hành trình leo núi với hướng dẫn viên',
            location: 'Điểm xuất phát leo núi',
          },
          {
            time: '12:00',
            title: 'Ăn trưa dã ngoại',
            description: 'Ăn trưa dã ngoại trên đường leo núi',
            location: 'Điểm dừng chân',
          },
          {
            time: '15:00',
            title: 'Đến đỉnh núi',
            description: 'Chinh phục đỉnh núi và ngắm cảnh',
            location: 'Đỉnh núi',
          },
          {
            time: '16:30',
            title: 'Xuống núi',
            description: 'Bắt đầu hành trình xuống núi',
            location: 'Đường xuống núi',
          },
          {
            time: '19:00',
            title: 'Ăn tối và nghỉ ngơi',
            description: 'Ăn tối và nghỉ ngơi sau một ngày leo núi',
            location: 'Nhà hàng địa phương',
          },
        ],
      },
      {
        title: 'Tham quan thác nước và suối nước nóng',
        activities: [
          {
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại homestay',
            location: 'Homestay',
          },
          {
            time: '09:30',
            title: 'Tham quan thác nước',
            description: 'Đi xe đến thác nước và tham quan',
            location: 'Thác Bạc',
          },
          {
            time: '12:30',
            title: 'Ăn trưa',
            description: 'Ăn trưa tại nhà hàng gần thác',
            location: 'Nhà hàng Thác Bạc',
          },
          {
            time: '14:00',
            title: 'Tắm suối nước nóng',
            description: 'Thư giãn tại suối nước nóng tự nhiên',
            location: 'Suối nước nóng',
          },
          {
            time: '17:00',
            title: 'Trở về thị trấn',
            description: 'Trở về thị trấn để chuẩn bị cho bữa tối',
            location: 'Thị trấn',
          },
          {
            time: '19:00',
            title: 'Ăn tối chia tay',
            description: 'Bữa tối chia tay tại nhà hàng địa phương',
            location: 'Nhà hàng Đặc Sản Vùng Cao',
          },
        ],
      },
    ],
  },
  {
    id: 'city-exploration',
    name: 'Khám phá thành phố',
    description: 'Template cho chuyến đi khám phá thành phố với các hoạt động văn hóa và ẩm thực',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 3,
    days: [
      {
        title: 'Tham quan địa điểm lịch sử',
        activities: [
          {
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại khách sạn',
            location: 'Khách sạn',
          },
          {
            time: '09:30',
            title: 'Tham quan bảo tàng',
            description: 'Tham quan bảo tàng lịch sử thành phố',
            location: 'Bảo tàng Lịch sử',
          },
          {
            time: '12:00',
            title: 'Ăn trưa',
            description: 'Ăn trưa tại nhà hàng gần bảo tàng',
            location: 'Nhà hàng Truyền Thống',
          },
          {
            time: '14:00',
            title: 'Tham quan di tích lịch sử',
            description: 'Tham quan các di tích lịch sử trong thành phố',
            location: 'Khu di tích trung tâm',
          },
          {
            time: '18:00',
            title: 'Ăn tối',
            description: 'Ăn tối tại nhà hàng địa phương',
            location: 'Nhà hàng Đặc Sản',
          },
        ],
      },
      {
        title: 'Khám phá văn hóa và mua sắm',
        activities: [
          {
            time: '08:30',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại quán cà phê địa phương',
            location: 'Quán cà phê trung tâm',
          },
          {
            time: '10:00',
            title: 'Tham quan khu phố cổ',
            description: 'Đi bộ tham quan khu phố cổ và các cửa hàng truyền thống',
            location: 'Khu phố cổ',
          },
          {
            time: '12:30',
            title: 'Ăn trưa',
            description: 'Ăn trưa tại nhà hàng trong khu phố cổ',
            location: 'Nhà hàng Phố Cổ',
          },
          {
            time: '14:00',
            title: 'Mua sắm',
            description: 'Mua sắm tại trung tâm thương mại và các cửa hàng địa phương',
            location: 'Trung tâm thương mại',
          },
          {
            time: '18:00',
            title: 'Xem biểu diễn văn hóa',
            description: 'Xem biểu diễn văn hóa truyền thống',
            location: 'Nhà hát thành phố',
          },
          {
            time: '20:30',
            title: 'Ăn tối',
            description: 'Ăn tối tại nhà hàng sang trọng',
            location: 'Nhà hàng Panorama',
          },
        ],
      },
      {
        title: 'Khám phá ẩm thực và giải trí',
        activities: [
          {
            time: '09:00',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại quán ăn địa phương nổi tiếng',
            location: 'Quán ăn sáng truyền thống',
          },
          {
            time: '10:30',
            title: 'Lớp học nấu ăn',
            description: 'Tham gia lớp học nấu các món ăn truyền thống',
            location: 'Trung tâm ẩm thực',
          },
          {
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức các món đã nấu trong lớp học',
            location: 'Trung tâm ẩm thực',
          },
          {
            time: '15:00',
            title: 'Tham quan công viên',
            description: 'Tham quan công viên trung tâm thành phố',
            location: 'Công viên trung tâm',
          },
          {
            time: '18:00',
            title: 'Tour ẩm thực đường phố',
            description: 'Tham gia tour khám phá ẩm thực đường phố buổi tối',
            location: 'Khu ẩm thực đường phố',
          },
          {
            time: '21:00',
            title: 'Thưởng thức đồ uống',
            description: 'Thưởng thức đồ uống tại quán bar trên sân thượng',
            location: 'Skybar trung tâm',
          },
        ],
      },
    ],
  },
  {
    id: 'cultural-experience',
    name: 'Trải nghiệm văn hóa',
    description: 'Template cho chuyến đi trải nghiệm văn hóa địa phương, làng nghề truyền thống',
    image: 'https://images.pexels.com/photos/5739051/pexels-photo-5739051.jpeg?auto=compress&cs=tinysrgb&w=600',
    duration: 2,
    days: [
      {
        title: 'Khám phá làng nghề truyền thống',
        activities: [
          {
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại homestay',
            location: 'Homestay',
          },
          {
            time: '09:30',
            title: 'Tham quan làng gốm',
            description: 'Tham quan làng gốm truyền thống và học cách làm gốm',
            location: 'Làng gốm Bát Tràng',
          },
          {
            time: '12:00',
            title: 'Ăn trưa',
            description: 'Ăn trưa tại nhà hàng địa phương',
            location: 'Nhà hàng Làng Nghề',
          },
          {
            time: '14:00',
            title: 'Tham quan làng lụa',
            description: 'Tham quan làng lụa và tìm hiểu quy trình dệt lụa truyền thống',
            location: 'Làng lụa Vạn Phúc',
          },
          {
            time: '18:00',
            title: 'Ăn tối',
            description: 'Ăn tối tại nhà dân địa phương',
            location: 'Nhà dân địa phương',
          },
        ],
      },
      {
        title: 'Trải nghiệm văn hóa dân tộc',
        activities: [
          {
            time: '07:30',
            title: 'Ăn sáng',
            description: 'Ăn sáng tại homestay',
            location: 'Homestay',
          },
          {
            time: '09:00',
            title: 'Tham quan bản làng',
            description: 'Tham quan bản làng dân tộc thiểu số',
            location: 'Bản làng dân tộc',
          },
          {
            time: '12:00',
            title: 'Ăn trưa',
            description: 'Ăn trưa với các món ăn dân tộc',
            location: 'Nhà sàn trong bản',
          },
          {
            time: '14:00',
            title: 'Học múa dân gian',
            description: 'Học múa dân gian truyền thống',
            location: 'Sân trung tâm bản làng',
          },
          {
            time: '16:00',
            title: 'Tham gia lễ hội địa phương',
            description: 'Tham gia lễ hội truyền thống của người dân địa phương',
            location: 'Khu lễ hội',
          },
          {
            time: '19:00',
            title: 'Ăn tối và xem biểu diễn',
            description: 'Ăn tối và xem biểu diễn văn nghệ dân gian',
            location: 'Nhà văn hóa bản',
          },
        ],
      },
    ],
  },
];
