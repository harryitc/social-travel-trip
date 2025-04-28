// Mock data for trip groups

export type TripMember = {
  id: string;
  name: string;
  avatar: string;
  role?: 'admin' | 'member'; // Role of the member in the group
};

export type TripGroup = {
  id: string;
  title: string;
  image: string;
  description: string;
  location: string;
  date: string;
  duration: string;
  members: {
    count: number;
    max: number;
    list: TripMember[];
  };
  hashtags: string[];
  isPrivate: boolean;
  hasPlan: boolean; // Indicates if the group already has a travel plan
  planDays?: number; // Number of days in the current plan, if any
};

// Mock trip groups data
export const TRIP_GROUPS: TripGroup[] = [
  {
    id: '1',
    title: 'Khám phá Đà Lạt',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Cùng nhau khám phá thành phố sương mù với những địa điểm nổi tiếng và ẩm thực đặc sắc.',
    location: 'Đà Lạt, Lâm Đồng',
    date: '15/06/2025 - 18/06/2025',
    duration: '4 ngày 3 đêm',
    members: {
      count: 5,
      max: 10,
      list: [
        { id: '1', name: 'Nguyễn Minh', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'admin' },
        { id: '2', name: 'Trần Hà', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'member' },
        { id: '3', name: 'Lê Hoàng', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'member' },
      ],
    },
    hashtags: ['DaLat', 'DuLich', 'NhomDuLich'],
    isPrivate: false,
    hasPlan: true,
    planDays: 4
  },
  {
    id: '2',
    title: 'Biển Nha Trang',
    image: 'https://images.pexels.com/photos/4428272/pexels-photo-4428272.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Chuyến đi biển Nha Trang cùng các hoạt động lặn biển, tham quan đảo và nghỉ dưỡng.',
    location: 'Nha Trang, Khánh Hòa',
    date: '22/07/2025 - 26/07/2025',
    duration: '5 ngày 4 đêm',
    members: {
      count: 8,
      max: 12,
      list: [
        { id: '1', name: 'Nguyễn Minh', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'member' },
        { id: '4', name: 'Ngọc Mai', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'admin' },
        { id: '2', name: 'Trần Hà', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'member' },
      ],
    },
    hashtags: ['NhaTrang', 'Bien', 'DuLich'],
    isPrivate: false,
    hasPlan: false
  },
  {
    id: '3',
    title: 'Sapa mùa đông',
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Chinh phục đỉnh Fansipan và khám phá các bản làng dân tộc thiểu số ở Sapa trong mùa đông.',
    location: 'Sapa, Lào Cai',
    date: '20/12/2025 - 24/12/2025',
    duration: '5 ngày 4 đêm',
    members: {
      count: 6,
      max: 15,
      list: [
        { id: '3', name: 'Lê Hoàng', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'admin' },
        { id: '4', name: 'Ngọc Mai', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'member' },
      ],
    },
    hashtags: ['Sapa', 'MuaDong', 'Fansipan'],
    isPrivate: false,
    hasPlan: false
  },
  {
    id: '4',
    title: 'Khám phá Hội An',
    image: 'https://images.pexels.com/photos/5191371/pexels-photo-5191371.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Tham quan phố cổ Hội An, trải nghiệm văn hóa và ẩm thực đặc sắc của miền Trung.',
    location: 'Hội An, Quảng Nam',
    date: '10/08/2025 - 13/08/2025',
    duration: '4 ngày 3 đêm',
    members: {
      count: 4,
      max: 8,
      list: [
        { id: '1', name: 'Nguyễn Minh', avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'member' },
        { id: '5', name: 'Phạm Tuấn', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'admin' },
      ],
    },
    hashtags: ['HoiAn', 'PhoCoHoiAn', 'DuLich'],
    isPrivate: true,
    hasPlan: false
  },
  {
    id: '5',
    title: 'Vịnh Hạ Long',
    image: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Khám phá kỳ quan thiên nhiên thế giới với tour du thuyền ngắm cảnh và khám phá các hang động.',
    location: 'Hạ Long, Quảng Ninh',
    date: '05/09/2025 - 07/09/2025',
    duration: '3 ngày 2 đêm',
    members: {
      count: 10,
      max: 20,
      list: [
        { id: '2', name: 'Trần Hà', avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'admin' },
        { id: '3', name: 'Lê Hoàng', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'member' },
        { id: '4', name: 'Ngọc Mai', avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1', role: 'member' },
      ],
    },
    hashtags: ['HaLong', 'VinhHaLong', 'DiSan'],
    isPrivate: false,
    hasPlan: true,
    planDays: 3
  }
];

// Current user ID (for demo purposes)
export const CURRENT_USER_ID = '1';

// Function to get groups that the current user is a member of
export const getUserGroups = () => {
  return TRIP_GROUPS.filter(group =>
    group.members.list.some(member => member.id === CURRENT_USER_ID)
  );
};

// Function to get groups that the current user is an admin of
export const getUserAdminGroups = () => {
  return TRIP_GROUPS.filter(group =>
    group.members.list.some(member => member.id === CURRENT_USER_ID && member.role === 'admin')
  );
};