// Mock data for travel plan templates

export type ActivityType =
  | 'Ăn sáng'
  | 'Ăn trưa'
  | 'Ăn tối'
  | 'Cà phê'
  | 'Tham quan'
  | 'Mua sắm'
  | 'Nghỉ ngơi'
  | 'Di chuyển'
  | 'Khác';

export type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
  mainLocation: string; // For chart display
  type?: ActivityType; // Loại hoạt động (tùy chọn)
};

export type Day = {
  id: string;
  date: Date | null; // Null for template, will be set when applied
  activities: Activity[];
};

export type TravelPlanTemplate = {
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

// Mock travel plan templates for Vietnamese destinations
export const TRAVEL_PLAN_TEMPLATES: TravelPlanTemplate[] = [
  {
    id: 'template-dalat',
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
            location: 'Chợ Đà Lạt, 66 Nguyễn Thị Minh Khai',
            mainLocation: 'Chợ Đà Lạt'
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan Quảng trường Lâm Viên',
            description: 'Check-in tại công trình hoa dã quỳ và bông atiso khổng lồ.',
            location: 'Quảng trường Lâm Viên'
          ,
            mainLocation: 'Quảng trường Lâm Viên'
          },
          {
            id: 'activity-3',
            time: '11:00',
            title: 'Thăm Nhà thờ Con Gà',
            description: 'Tham quan nhà thờ mang kiến trúc Pháp nổi tiếng với chiếc chuông và chú gà trên đỉnh.',
            location: 'Nhà thờ Chính tòa Đà Lạt'
          ,
            mainLocation: 'Nhà thờ Chính tòa Đà Lạt'
          },
          {
            id: 'activity-4',
            time: '12:30',
            title: 'Ăn trưa',
            description: 'Thưởng thức bánh ướt lòng gà - đặc sản Đà Lạt.',
            location: 'Bánh ướt lòng gà Trang, 15 Tăng Bạt Hổ'
          ,
            mainLocation: 'Bánh ướt lòng gà Trang'
          },
          {
            id: 'activity-5',
            time: '14:00',
            title: 'Tham quan Crazy House',
            description: 'Khám phá công trình kiến trúc độc đáo như trong truyện cổ tích.',
            location: 'Crazy House, 3 Đường Huỳnh Thúc Kháng'
          ,
            mainLocation: 'Crazy House'
          },
          {
            id: 'activity-6',
            time: '16:30',
            title: 'Hồ Xuân Hương',
            description: 'Đạp xe quanh hồ hoặc thuê thuyền đạp vịt trên hồ.',
            location: 'Hồ Xuân Hương'
          ,
            mainLocation: 'Hồ Xuân Hương'
          },
          {
            id: 'activity-7',
            time: '18:30',
            title: 'Ăn tối tại chợ đêm',
            description: 'Thưởng thức các món ăn đường phố như bánh tráng nướng, sữa đậu nành nóng.',
            location: 'Chợ đêm Đà Lạt'
          ,
            mainLocation: 'Chợ đêm Đà Lạt'
          }
        ]
      },
      {
        id: 'day-2',
        date: null,
        activities: [
          {
            id: 'activity-8',
            time: '07:00',
            title: 'Ngắm bình minh tại đồi Đa Phú',
            description: 'Ngắm cảnh bình minh và biển mây tuyệt đẹp.',
            location: 'Đồi Đa Phú'
          ,
            mainLocation: 'Đồi Đa Phú'
          },
          {
            id: 'activity-9',
            time: '09:00',
            title: 'Tham quan Thung lũng Tình Yêu',
            description: 'Tham quan khu du lịch với khung cảnh lãng mạn và nhiều hoạt động giải trí.',
            location: 'Thung lũng Tình Yêu'
          ,
            mainLocation: 'Thung lũng Tình Yêu'
          },
          {
            id: 'activity-10',
            time: '11:30',
            title: 'Tham quan Thiền viện Trúc Lâm',
            description: 'Tham quan thiền viện và ngắm cảnh Hồ Tuyền Lâm từ trên cao.',
            location: 'Thiền viện Trúc Lâm'
          ,
            mainLocation: 'Thiền viện Trúc Lâm'
          },
          {
            id: 'activity-11',
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức ẩm thực chay tại nhà hàng gần thiền viện.',
            location: 'Nhà hàng chay An Nhiên'
          ,
            mainLocation: 'Nhà hàng chay An Nhiên'
          },
          {
            id: 'activity-12',
            time: '15:00',
            title: 'Tham quan Thác Datanla',
            description: 'Trải nghiệm máng trượt Alpine Coaster và ngắm thác.',
            location: 'Thác Datanla'
          ,
            mainLocation: 'Thác Datanla'
          },
          {
            id: 'activity-13',
            time: '18:00',
            title: 'Ăn tối',
            description: 'Thưởng thức lẩu bò Đà Lạt.',
            location: 'Nhà hàng Lẩu Bò Ngọc Dung'
          ,
            mainLocation: 'Nhà hàng Lẩu Bò Ngọc Dung'
          },
          {
            id: 'activity-14',
            time: '20:00',
            title: 'Cà phê đêm',
            description: 'Thưởng thức cà phê và ngắm cảnh đêm Đà Lạt.',
            location: 'Cà phê Tùng, 10 Phù Đổng Thiên Vương'
          ,
            mainLocation: 'Cà phê Tùng'
          }
        ]
      },
      {
        id: 'day-3',
        date: null,
        activities: [
          {
            id: 'activity-15',
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức phở và bánh mì nóng.',
            location: 'Phở 75, Đường 3 tháng 2'
          ,
            mainLocation: 'Phở 75'
          },
          {
            id: 'activity-16',
            time: '09:30',
            title: 'Tham quan Vườn hoa thành phố',
            description: 'Ngắm nhìn và chụp ảnh với hàng trăm loài hoa đẹp.',
            location: 'Vườn hoa thành phố Đà Lạt'
          ,
            mainLocation: 'Vườn hoa thành phố Đà Lạt'
          },
          {
            id: 'activity-17',
            time: '11:30',
            title: 'Tham quan Ga Đà Lạt',
            description: 'Tham quan nhà ga cổ và có thể đi tàu hỏa leo núi đến Trại Mát.',
            location: 'Ga Đà Lạt'
          ,
            mainLocation: 'Ga Đà Lạt'
          },
          {
            id: 'activity-18',
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức nem nướng Đà Lạt.',
            location: 'Nem nướng Bà Hùng, 254 Phan Đình Phùng'
          ,
            mainLocation: 'Nem nướng Bà Hùng'
          },
          {
            id: 'activity-19',
            time: '14:30',
            title: 'Tham quan Làng Cù Lần',
            description: 'Trải nghiệm không gian làng quê và các hoạt động ngoài trời.',
            location: 'Làng Cù Lần'
          ,
            mainLocation: 'Làng Cù Lần'
          },
          {
            id: 'activity-20',
            time: '17:30',
            title: 'Mua đồ lưu niệm',
            description: 'Mua sắm đặc sản và quà lưu niệm Đà Lạt.',
            location: 'Chợ Đà Lạt'
          ,
            mainLocation: 'Chợ Đà Lạt'
          },
          {
            id: 'activity-21',
            time: '19:00',
            title: 'Ăn tối chia tay',
            description: 'Thưởng thức bữa tối với các món đặc sản Đà Lạt.',
            location: 'Nhà hàng Ẩm thực Đà Lạt, 15 Nguyễn Chí Thanh'
          ,
            mainLocation: 'Nhà hàng Ẩm thực Đà Lạt'
          }
        ]
      }
    ],
    authorId: '1',
    authorName: 'Nguyễn Minh',
    isPublic: true,
    rating: 4.8,
    usageCount: 1245
  },
  {
    id: 'template-phuquoc',
    name: 'Khám phá Phú Quốc',
    destination: 'Phú Quốc, Kiên Giang',
    region: 'Miền Nam',
    description: 'Kế hoạch 4 ngày tận hưởng thiên đường biển đảo Phú Quốc với các bãi biển đẹp, hoạt động thú vị và ẩm thực hải sản tươi ngon.',
    duration: 4,
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=600',
    tags: ['PhuQuoc', 'Bien', 'DaoNgoc'],
    days: [
      {
        id: 'day-1',
        date: null,
        activities: [
          {
            id: 'activity-1',
            time: '08:00',
            title: 'Ăn sáng tại khách sạn',
            description: 'Thưởng thức bữa sáng tại khách sạn để chuẩn bị cho ngày khám phá đầu tiên.',
            location: 'Khách sạn'
          ,
            mainLocation: 'Khách sạn'
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan Bãi Sao',
            description: 'Tắm biển và thư giãn tại một trong những bãi biển đẹp nhất Phú Quốc với cát trắng mịn và nước biển trong xanh.',
            location: 'Bãi Sao, Phú Quốc'
          ,
            mainLocation: 'Bãi Sao'
          },
          {
            id: 'activity-3',
            time: '12:30',
            title: 'Ăn trưa',
            description: 'Thưởng thức hải sản tươi sống tại nhà hàng ven biển.',
            location: 'Nhà hàng Bãi Sao'
          ,
            mainLocation: 'Nhà hàng Bãi Sao'
          },
          {
            id: 'activity-4',
            time: '14:30',
            title: 'Tham quan Nhà thùng nước mắm',
            description: 'Tìm hiểu về quy trình sản xuất nước mắm truyền thống của Phú Quốc.',
            location: 'Nhà thùng nước mắm Khải Hoàn'
          ,
            mainLocation: 'Nhà thùng nước mắm Khải Hoàn'
          },
          {
            id: 'activity-5',
            time: '16:30',
            title: 'Tham quan Dinh Cậu',
            description: 'Tham quan ngôi đền linh thiêng nằm trên những tảng đá lớn nhô ra biển.',
            location: 'Dinh Cậu, Phú Quốc'
          ,
            mainLocation: 'Dinh Cậu'
          },
          {
            id: 'activity-6',
            time: '18:30',
            title: 'Ăn tối tại chợ đêm Dinh Cậu',
            description: 'Thưởng thức các món hải sản tươi ngon và đặc sản địa phương.',
            location: 'Chợ đêm Dinh Cậu'
          ,
            mainLocation: 'Chợ đêm Dinh Cậu'
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
            title: 'Ăn sáng',
            description: 'Thưởng thức bún quậy - đặc sản Phú Quốc.',
            location: 'Bún quậy Kiến Xây'
          ,
            mainLocation: 'Bún quậy Kiến Xây'
          },
          {
            id: 'activity-8',
            time: '09:00',
            title: 'Tour câu cá & lặn ngắm san hô',
            description: 'Tham gia tour câu cá và lặn ngắm san hô tại các hòn đảo phía Nam Phú Quốc.',
            location: 'Cảng An Thới'
          ,
            mainLocation: 'Cảng An Thới'
          },
          {
            id: 'activity-9',
            time: '12:00',
            title: 'Ăn trưa trên tàu',
            description: 'Thưởng thức bữa trưa với hải sản tươi ngon được chế biến ngay trên tàu.',
            location: 'Trên tàu'
          ,
            mainLocation: 'Trên tàu'
          },
          {
            id: 'activity-10',
            time: '15:00',
            title: 'Tham quan Hòn Thơm',
            description: 'Đi cáp treo vượt biển dài nhất thế giới và tham gia các hoạt động giải trí tại Hòn Thơm.',
            location: 'Hòn Thơm, Phú Quốc'
          ,
            mainLocation: 'Hòn Thơm'
          },
          {
            id: 'activity-11',
            time: '18:30',
            title: 'Ăn tối',
            description: 'Thưởng thức hải sản tươi ngon tại nhà hàng địa phương.',
            location: 'Nhà hàng Biển Xanh'
          ,
            mainLocation: 'Nhà hàng Biển Xanh'
          },
          {
            id: 'activity-12',
            time: '20:30',
            title: 'Dạo biển đêm',
            description: 'Dạo bộ dọc bãi biển và thưởng thức không khí trong lành của biển đêm.',
            location: 'Bãi biển Dương Đông'
          ,
            mainLocation: 'Bãi biển Dương Đông'
          }
        ]
      },
      {
        id: 'day-3',
        date: null,
        activities: [
          {
            id: 'activity-13',
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bánh canh ghẹ - đặc sản Phú Quốc.',
            location: 'Quán bánh canh ghẹ Phú Quốc'
          ,
            mainLocation: 'Quán bánh canh ghẹ Phú Quốc'
          },
          {
            id: 'activity-14',
            time: '09:30',
            title: 'Tham quan Vinpearl Safari',
            description: 'Khám phá vườn thú bán hoang dã đầu tiên của Việt Nam với nhiều loài động vật quý hiếm.',
            location: 'Vinpearl Safari, Phú Quốc'
          ,
            mainLocation: 'Vinpearl Safari'
          },
          {
            id: 'activity-15',
            time: '12:30',
            title: 'Ăn trưa',
            description: 'Thưởng thức bữa trưa tại nhà hàng trong khu Safari.',
            location: 'Nhà hàng Vinpearl Safari'
          ,
            mainLocation: 'Nhà hàng Vinpearl Safari'
          },
          {
            id: 'activity-16',
            time: '14:30',
            title: 'Tham quan Vườn tiêu Phú Quốc',
            description: 'Tìm hiểu về quy trình trồng và chế biến tiêu Phú Quốc nổi tiếng.',
            location: 'Vườn tiêu Phú Quốc'
          ,
            mainLocation: 'Vườn tiêu Phú Quốc'
          },
          {
            id: 'activity-17',
            time: '16:30',
            title: 'Tham quan Suối Tranh',
            description: 'Tham quan và tắm suối tại một trong những thác nước đẹp nhất Phú Quốc.',
            location: 'Suối Tranh, Phú Quốc'
          ,
            mainLocation: 'Suối Tranh'
          },
          {
            id: 'activity-18',
            time: '19:00',
            title: 'Ăn tối',
            description: 'Thưởng thức các món đặc sản Phú Quốc như gỏi cá trích, nhum biển, ghẹ hấp.',
            location: 'Nhà hàng Quán Ăn Ngon'
          ,
            mainLocation: 'Nhà hàng Quán Ăn Ngon'
          }
        ]
      },
      {
        id: 'day-4',
        date: null,
        activities: [
          {
            id: 'activity-19',
            time: '08:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng tại khách sạn.',
            location: 'Khách sạn'
          ,
            mainLocation: 'Khách sạn'
          },
          {
            id: 'activity-20',
            time: '09:30',
            title: 'Tham quan Làng chài Hàm Ninh',
            description: 'Tham quan làng chài cổ và thưởng thức hải sản tươi sống.',
            location: 'Làng chài Hàm Ninh'
          ,
            mainLocation: 'Làng chài Hàm Ninh'
          },
          {
            id: 'activity-21',
            time: '11:30',
            title: 'Mua sắm đặc sản',
            description: 'Mua sắm các đặc sản Phú Quốc như nước mắm, tiêu, rượu sim, mật ong.',
            location: 'Chợ Dương Đông'
          ,
            mainLocation: 'Chợ Dương Đông'
          },
          {
            id: 'activity-22',
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức bữa trưa với các món đặc sản địa phương.',
            location: 'Nhà hàng Vườn Táo'
          ,
            mainLocation: 'Nhà hàng Vườn Táo'
          },
          {
            id: 'activity-23',
            time: '15:00',
            title: 'Tham quan Bãi Dài',
            description: 'Tắm biển và thư giãn tại bãi biển hoang sơ với cát trắng mịn và nước biển trong xanh.',
            location: 'Bãi Dài, Phú Quốc'
          ,
            mainLocation: 'Bãi Dài'
          },
          {
            id: 'activity-24',
            time: '18:00',
            title: 'Ăn tối chia tay',
            description: 'Thưởng thức bữa tối hải sản tươi ngon để kết thúc chuyến đi.',
            location: 'Nhà hàng Biển Xanh'
          ,
            mainLocation: 'Nhà hàng Biển Xanh'
          }
        ]
      }
    ],
    authorId: '3',
    authorName: 'Lê Hoàng',
    isPublic: true,
    rating: 4.9,
    usageCount: 987
  },
  {
    id: 'template-sapa',
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
            location: 'Khách sạn'
          ,
            mainLocation: 'Khách sạn'
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan thị trấn Sapa',
            description: 'Dạo quanh thị trấn, tham quan nhà thờ đá cổ và quảng trường trung tâm.',
            location: 'Thị trấn Sapa'
          ,
            mainLocation: 'Thị trấn Sapa'
          },
          {
            id: 'activity-3',
            time: '11:30',
            title: 'Tham quan Cổng Trời',
            description: 'Ngắm nhìn toàn cảnh Sapa từ trên cao với khung cảnh hùng vĩ.',
            location: 'Cổng Trời, Sapa'
          ,
            mainLocation: 'Cổng Trời'
          },
          {
            id: 'activity-4',
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức các món đặc sản vùng núi như thắng cố, cá suối, rau rừng.',
            location: 'Nhà hàng A Quỳnh'
          ,
            mainLocation: 'Nhà hàng A Quỳnh'
          },
          {
            id: 'activity-5',
            time: '14:30',
            title: 'Tham quan bản Cát Cát',
            description: 'Khám phá đời sống và văn hóa của người H\'Mông tại bản làng cổ.',
            location: 'Bản Cát Cát',
            mainLocation: 'Bản Cát Cát'
          },
          {
            id: 'activity-6',
            time: '17:30',
            title: 'Tham quan thác Cát Cát',
            description: 'Ngắm nhìn thác nước tuyệt đẹp và các công trình thủy điện cổ.',
            location: 'Thác Cát Cát'
          ,
            mainLocation: 'Thác Cát Cát'
          },
          {
            id: 'activity-7',
            time: '19:00',
            title: 'Ăn tối',
            description: 'Thưởng thức các món lẩu và nướng đặc trưng vùng núi Tây Bắc.',
            location: 'Nhà hàng Sapa Moment'
          ,
            mainLocation: 'Nhà hàng Sapa Moment'
          }
        ]
      },
      {
        id: 'day-2',
        date: null,
        activities: [
          {
            id: 'activity-8',
            time: '07:00',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng tại khách sạn.',
            location: 'Khách sạn'
          ,
            mainLocation: 'Khách sạn'
          },
          {
            id: 'activity-9',
            time: '08:30',
            title: 'Chinh phục đỉnh Fansipan',
            description: 'Đi cáp treo lên đỉnh Fansipan - "Nóc nhà Đông Dương" và tham quan quần thể tâm linh.',
            location: 'Đỉnh Fansipan'
          ,
            mainLocation: 'Đỉnh Fansipan'
          },
          {
            id: 'activity-10',
            time: '12:30',
            title: 'Ăn trưa',
            description: 'Thưởng thức bữa trưa tại nhà hàng trên đỉnh Fansipan.',
            location: 'Nhà hàng Fansipan'
          ,
            mainLocation: 'Nhà hàng Fansipan'
          },
          {
            id: 'activity-11',
            time: '14:00',
            title: 'Tham quan Vườn hoa Hàm Rồng',
            description: 'Khám phá khu vườn với nhiều loài hoa đẹp và ngắm toàn cảnh Sapa.',
            location: 'Vườn hoa Hàm Rồng'
          ,
            mainLocation: 'Vườn hoa Hàm Rồng'
          },
          {
            id: 'activity-12',
            time: '17:00',
            title: 'Mua sắm tại chợ Sapa',
            description: 'Mua sắm các sản phẩm thổ cẩm, đồ lưu niệm và đặc sản địa phương.',
            location: 'Chợ Sapa'
          ,
            mainLocation: 'Chợ Sapa'
          },
          {
            id: 'activity-13',
            time: '19:00',
            title: 'Ăn tối và xem biểu diễn văn nghệ',
            description: 'Thưởng thức bữa tối kèm chương trình biểu diễn văn nghệ dân tộc.',
            location: 'Nhà hàng Anh Dũng'
          ,
            mainLocation: 'Nhà hàng Anh Dũng'
          }
        ]
      },
      {
        id: 'day-3',
        date: null,
        activities: [
          {
            id: 'activity-14',
            time: '07:30',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng tại khách sạn.',
            location: 'Khách sạn'
          ,
            mainLocation: 'Khách sạn'
          },
          {
            id: 'activity-15',
            time: '08:30',
            title: 'Tham quan ruộng bậc thang Lao Chải - Tả Van',
            description: 'Đi bộ trekking và ngắm nhìn những thửa ruộng bậc thang tuyệt đẹp.',
            location: 'Lao Chải - Tả Van'
          ,
            mainLocation: 'Lao Chải - Tả Van'
          },
          {
            id: 'activity-16',
            time: '12:00',
            title: 'Ăn trưa tại bản làng',
            description: 'Thưởng thức bữa trưa đơn giản tại nhà người dân địa phương.',
            location: 'Bản Tả Van'
          ,
            mainLocation: 'Bản Tả Van'
          },
          {
            id: 'activity-17',
            time: '13:30',
            title: 'Tham quan bản Tả Phìn',
            description: 'Khám phá văn hóa của người Dao Đỏ và tham quan các xưởng thổ cẩm.',
            location: 'Bản Tả Phìn'
          ,
            mainLocation: 'Bản Tả Phìn'
          },
          {
            id: 'activity-18',
            time: '16:00',
            title: 'Tắm lá thuốc người Dao',
            description: 'Trải nghiệm tắm lá thuốc truyền thống của người Dao để thư giãn.',
            location: 'Bản Tả Phìn'
          ,
            mainLocation: 'Bản Tả Phìn'
          },
          {
            id: 'activity-19',
            time: '18:30',
            title: 'Ăn tối chia tay',
            description: 'Thưởng thức bữa tối với các món đặc sản vùng núi để kết thúc chuyến đi.',
            location: 'Nhà hàng Sapa Moment'
          ,
            mainLocation: 'Nhà hàng Sapa Moment'
          }
        ]
      }
    ],
    authorId: '2',
    authorName: 'Trần Thu Hà',
    isPublic: true,
    rating: 4.7,
    usageCount: 856
  },
  // Hạ Long template
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
          ,
            mainLocation: 'Hà Nội'
          },
          {
            id: 'activity-2',
            time: '12:00',
            title: 'Đến cảng Tuần Châu',
            description: 'Làm thủ tục lên du thuyền và nhận phòng.',
            location: 'Cảng Tuần Châu, Hạ Long'
          ,
            mainLocation: 'Cảng Tuần Châu'
          },
          {
            id: 'activity-3',
            time: '13:00',
            title: 'Ăn trưa trên du thuyền',
            description: 'Thưởng thức bữa trưa hải sản tươi ngon trong khi du thuyền bắt đầu hành trình.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-4',
            time: '15:00',
            title: 'Tham quan hang Sửng Sốt',
            description: 'Khám phá một trong những hang động đẹp nhất Vịnh Hạ Long với nhiều nhũ đá có hình thù độc đáo.',
            location: 'Hang Sửng Sốt'
          ,
            mainLocation: 'Hang Sửng Sốt'
          },
          {
            id: 'activity-5',
            time: '17:00',
            title: 'Chèo thuyền kayak',
            description: 'Trải nghiệm chèo thuyền kayak quanh các đảo đá và khám phá vẻ đẹp của vịnh.',
            location: 'Vịnh Hạ Long'
          ,
            mainLocation: 'Vịnh Hạ Long'
          },
          {
            id: 'activity-6',
            time: '19:00',
            title: 'Ăn tối trên du thuyền',
            description: 'Thưởng thức bữa tối hải sản tươi ngon với view hoàng hôn tuyệt đẹp.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-7',
            time: '20:30',
            title: 'Câu mực đêm',
            description: 'Tham gia hoạt động câu mực đêm thú vị hoặc thư giãn trên boong tàu ngắm sao.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
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
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-9',
            time: '07:30',
            title: 'Ăn sáng',
            description: 'Thưởng thức bữa sáng trên du thuyền.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-10',
            time: '09:00',
            title: 'Tham quan hang Tiên Ông',
            description: 'Khám phá hang động với nhiều truyền thuyết thú vị và hệ thống nhũ đá đẹp mắt.',
            location: 'Hang Tiên Ông'
          ,
            mainLocation: 'Hang Tiên Ông'
          },
          {
            id: 'activity-11',
            time: '11:30',
            title: 'Tham quan làng chài Cửa Vạn',
            description: 'Tìm hiểu về cuộc sống của ngư dân trên làng nổi giữa vịnh Hạ Long.',
            location: 'Làng chài Cửa Vạn'
          ,
            mainLocation: 'Làng chài Cửa Vạn'
          },
          {
            id: 'activity-12',
            time: '13:00',
            title: 'Ăn trưa trên du thuyền',
            description: 'Thưởng thức bữa trưa hải sản tươi ngon trong khi du thuyền di chuyển.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-13',
            time: '15:00',
            title: 'Tắm biển tại Bãi Tắm Ti Tốp',
            description: 'Tắm biển và thư giãn tại bãi biển đẹp hoặc leo lên đỉnh núi Ti Tốp để ngắm toàn cảnh vịnh.',
            location: 'Đảo Ti Tốp'
          ,
            mainLocation: 'Đảo Ti Tốp'
          },
          {
            id: 'activity-14',
            time: '18:00',
            title: 'Ăn tối trên du thuyền',
            description: 'Thưởng thức bữa tối với các món hải sản tươi ngon.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-15',
            time: '20:00',
            title: 'Hoạt động buổi tối',
            description: 'Tham gia các hoạt động giải trí trên du thuyền như xem phim, hát karaoke hoặc thư giãn ngắm sao.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
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
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-17',
            time: '08:30',
            title: 'Tham quan hang Luồn',
            description: 'Chèo thuyền kayak qua hang Luồn để khám phá vùng nước yên bình bên trong.',
            location: 'Hang Luồn'
          ,
            mainLocation: 'Hang Luồn'
          },
          {
            id: 'activity-18',
            time: '10:30',
            title: 'Lớp học nấu ăn',
            description: 'Tham gia lớp học nấu các món ăn truyền thống Việt Nam trên du thuyền.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-19',
            time: '12:00',
            title: 'Ăn trưa và trả phòng',
            description: 'Thưởng thức bữa trưa nhẹ trên du thuyền và làm thủ tục trả phòng.',
            location: 'Du thuyền'
          ,
            mainLocation: 'Du thuyền'
          },
          {
            id: 'activity-20',
            time: '13:30',
            title: 'Về đến cảng Tuần Châu',
            description: 'Kết thúc hành trình du thuyền và quay về đất liền.',
            location: 'Cảng Tuần Châu'
          ,
            mainLocation: 'Cảng Tuần Châu'
          },
          {
            id: 'activity-21',
            time: '14:30',
            title: 'Tham quan Bảo tàng Quảng Ninh',
            description: 'Tìm hiểu về lịch sử, văn hóa và địa chất của vùng đất Quảng Ninh.',
            location: 'Bảo tàng Quảng Ninh'
          ,
            mainLocation: 'Bảo tàng Quảng Ninh'
          },
          {
            id: 'activity-22',
            time: '16:30',
            title: 'Mua sắm đặc sản',
            description: 'Mua sắm các đặc sản Quảng Ninh như hải sản khô, chả mực, ngọc trai.',
            location: 'Chợ Hạ Long'
          ,
            mainLocation: 'Chợ Hạ Long'
          },
          {
            id: 'activity-23',
            time: '18:00',
            title: 'Ăn tối chia tay',
            description: 'Thưởng thức bữa tối hải sản tươi ngon để kết thúc chuyến đi.',
            location: 'Nhà hàng Hương Biển'
          ,
            mainLocation: 'Nhà hàng Hương Biển'
          },
          {
            id: 'activity-24',
            time: '20:00',
            title: 'Khởi hành về Hà Nội',
            description: 'Di chuyển từ Hạ Long về Hà Nội bằng xe limousine.',
            location: 'Hạ Long'
          ,
            mainLocation: 'Hạ Long'
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
  // Hội An template
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
          ,
            mainLocation: 'Quán Cao lầu Bà Bé'
          },
          {
            id: 'activity-2',
            time: '09:30',
            title: 'Tham quan phố cổ Hội An',
            description: 'Dạo bộ tham quan các điểm di tích nổi tiếng trong phố cổ như Chùa Cầu, Hội quán Phúc Kiến, nhà cổ Tấn Ký.',
            location: 'Phố cổ Hội An'
          ,
            mainLocation: 'Phố cổ Hội An'
          },
          {
            id: 'activity-3',
            time: '12:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức các món đặc sản Hội An như Cao lầu, Hoành thánh.',
            location: 'Nhà hàng Morning Glory, 106 Nguyễn Thái Học'
          ,
            mainLocation: 'Nhà hàng Morning Glory'
          },
          {
            id: 'activity-4',
            time: '14:00',
            title: 'Tham quan làng dệt lụa Tăng Thanh Hà',
            description: 'Tìm hiểu về nghề dệt lụa truyền thống và mua sắm các sản phẩm lụa chất lượng cao.',
            location: 'Làng lụa Tăng Thanh Hà'
          ,
            mainLocation: 'Làng lụa Tăng Thanh Hà'
          },
          {
            id: 'activity-5',
            time: '16:30',
            title: 'Tham quan Bảo tàng Văn hóa dân gian Hội An',
            description: 'Tìm hiểu về lịch sử và văn hóa của Hội An qua các hiện vật và tài liệu quý.',
            location: 'Bảo tàng Văn hóa dân gian Hội An'
          ,
            mainLocation: 'Bảo tàng Văn hóa dân gian Hội An'
          },
          {
            id: 'activity-6',
            time: '18:00',
            title: 'Ngắm hoàng hôn trên sông Hoài',
            description: 'Dạo bộ dọc bờ sông Hoài, thả đèn hoa đăng và ngắm cảnh hoàng hôn tuyệt đẹp.',
            location: 'Sông Hoài'
          ,
            mainLocation: 'Sông Hoài'
          },
          {
            id: 'activity-7',
            time: '19:30',
            title: 'Ăn tối và xem biểu diễn nhạc truyền thống',
            description: 'Thưởng thức bữa tối với các món đặc sản và xem biểu diễn nhạc truyền thống.',
            location: 'Nhà hàng Cargo Club, 107-109 Nguyễn Thái Học'
          ,
            mainLocation: 'Nhà hàng Cargo Club'
          },
          {
            id: 'activity-8',
            time: '21:00',
            title: 'Khám phá phố cổ về đêm',
            description: 'Dạo bộ trong phố cổ về đêm với ánh đèn lồng và không khí lãng mạn.',
            location: 'Phố cổ Hội An'
          ,
            mainLocation: 'Phố cổ Hội An'
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
          ,
            mainLocation: 'Mì Quảng Bà Mua'
          },
          {
            id: 'activity-10',
            time: '09:00',
            title: 'Tham quan làng gốm Thanh Hà',
            description: 'Tìm hiểu về nghề làm gốm truyền thống và trải nghiệm làm gốm.',
            location: 'Làng gốm Thanh Hà'
          ,
            mainLocation: 'Làng gốm Thanh Hà'
          },
          {
            id: 'activity-11',
            time: '11:30',
            title: 'Tham quan rừng dừa Bảy Mẫu',
            description: 'Chèo thuyền thùng qua rừng dừa Bảy Mẫu và trải nghiệm cuộc sống của ngư dân địa phương.',
            location: 'Rừng dừa Bảy Mẫu'
          ,
            mainLocation: 'Rừng dừa Bảy Mẫu'
          },
          {
            id: 'activity-12',
            time: '13:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức bữa trưa với các món hải sản tươi ngon.',
            location: 'Nhà hàng Bé Thân, Cẩm An'
          ,
            mainLocation: 'Nhà hàng Bé Thân'
          },
          {
            id: 'activity-13',
            time: '15:00',
            title: 'Tắm biển An Bàng',
            description: 'Thư giãn và tắm biển tại bãi biển An Bàng - một trong những bãi biển đẹp nhất Việt Nam.',
            location: 'Bãi biển An Bàng'
          ,
            mainLocation: 'Bãi biển An Bàng'
          },
          {
            id: 'activity-14',
            time: '18:00',
            title: 'Lớp học nấu ăn',
            description: 'Tham gia lớp học nấu các món ăn đặc trưng của Hội An.',
            location: 'Trường dạy nấu ăn Red Bridge'
          ,
            mainLocation: 'Trường dạy nấu ăn Red Bridge'
          },
          {
            id: 'activity-15',
            time: '20:00',
            title: 'Ăn tối',
            description: 'Thưởng thức bữa tối với các món ăn tự tay mình nấu.',
            location: 'Trường dạy nấu ăn Red Bridge'
          ,
            mainLocation: 'Trường dạy nấu ăn Red Bridge'
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
          ,
            mainLocation: 'Nhà hàng White Rose'
          },
          {
            id: 'activity-17',
            time: '08:30',
            title: 'Tham quan Thánh địa Mỹ Sơn',
            description: 'Khám phá khu di tích đền tháp Chăm Pa - Di sản văn hóa thế giới.',
            location: 'Thánh địa Mỹ Sơn'
          ,
            mainLocation: 'Thánh địa Mỹ Sơn'
          },
          {
            id: 'activity-18',
            time: '12:00',
            title: 'Ăn trưa',
            description: 'Thưởng thức bữa trưa với các món ăn đặc sản địa phương.',
            location: 'Nhà hàng gần Thánh địa Mỹ Sơn'
          ,
            mainLocation: 'Nhà hàng gần Thánh địa Mỹ Sơn'
          },
          {
            id: 'activity-19',
            time: '14:00',
            title: 'Tham quan làng rau Trà Quế',
            description: 'Tham quan làng rau hữu cơ nổi tiếng và tìm hiểu về kỹ thuật canh tác truyền thống.',
            location: 'Làng rau Trà Quế'
          ,
            mainLocation: 'Làng rau Trà Quế'
          },
          {
            id: 'activity-20',
            time: '16:00',
            title: 'Mua sắm đồ lưu niệm',
            description: 'Mua sắm các sản phẩm thủ công mỹ nghệ, quần áo may đo và các đặc sản địa phương.',
            location: 'Chợ Hội An'
          ,
            mainLocation: 'Chợ Hội An'
          },
          {
            id: 'activity-21',
            time: '18:00',
            title: 'Tham dự đêm Hội An - Đêm rằm tháng 7 âm lịch',
            description: 'Trải nghiệm lễ hội truyền thống của Hội An với đèn lồng, ánh nến và các hoạt động văn hóa.',
            location: 'Phố cổ Hội An'
          ,
            mainLocation: 'Phố cổ Hội An'
          },
          {
            id: 'activity-22',
            time: '20:00',
            title: 'Ăn tối chia tay',
            description: 'Thưởng thức bữa tối với các món đặc sản Hội An để kết thúc chuyến đi.',
            location: 'Nhà hàng Mango Mango, 45 Nguyễn Phúc Chu'
          ,
            mainLocation: 'Nhà hàng Mango Mango'
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
