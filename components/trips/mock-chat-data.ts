// Mock data cho các tin nhắn chat

export type Message = {
  id: string;
  content: string;
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: string;
  pinned?: boolean;
  replyTo?: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
    };
  };
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
    size?: number;
  }[];
};

export type Member = {
  id: string;
  name: string;
  avatar: string;
  role?: 'admin' | 'member';
};

// Mock messages for each trip group
export const MOCK_CHAT_MESSAGES: Record<string, Message[]> = {
  // Đà Lạt group messages
  '1': [
    {
      id: '1',
      content: 'Mình đã đặt được khách sạn cho chuyến đi Đà Lạt rồi nhé mọi người!',
      sender: {
        id: '1',
        name: 'Nguyễn Minh',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '10:30',
      pinned: true,
      attachments: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=600',
          name: 'hotel-dalat.jpg',
        },
      ],
    },
    {
      id: '2',
      content: 'Tuyệt vời! Khách sạn nhìn đẹp quá.',
      sender: {
        id: '2',
        name: 'Trần Hà',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '10:32',
    },
    {
      id: '3',
      content: 'Mình đã đặt vé xe khách cho cả nhóm rồi đó.',
      sender: {
        id: '3',
        name: 'Lê Hoàng',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '10:45',
    },
    {
      id: '4',
      content: 'Cảm ơn bạn nhiều nhé!',
      sender: {
        id: '2',
        name: 'Trần Hà',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '10:47',
      replyTo: {
        id: '3',
        content: 'Mình đã đặt vé xe khách cho cả nhóm rồi đó.',
        sender: {
          id: '3',
          name: 'Lê Hoàng',
        },
      },
    },
  ],

  // Nha Trang group messages
  '2': [
    {
      id: '1',
      content: 'Chào mọi người, mình đã đặt tour lặn biển cho ngày thứ 2 rồi nhé!',
      sender: {
        id: '4',
        name: 'Ngọc Mai',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '09:15',
      pinned: true,
      attachments: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/3046637/pexels-photo-3046637.jpeg?auto=compress&cs=tinysrgb&w=600',
          name: 'diving-tour.jpg',
        },
      ],
    },
    {
      id: '2',
      content: 'Tuyệt vời! Mình rất háo hức được lặn biển.',
      sender: {
        id: '1',
        name: 'Nguyễn Minh',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '09:20',
    },
    {
      id: '3',
      content: 'Mình đã đặt nhà hàng hải sản cho tối ngày đầu tiên rồi.',
      sender: {
        id: '4',
        name: 'Ngọc Mai',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '09:30',
      attachments: [
        {
          type: 'file',
          url: '#',
          name: 'menu-nha-trang.pdf',
          size: 2048,
        },
      ],
    },
  ],

  // Sapa group messages
  '3': [
    {
      id: '1',
      content: 'Mọi người chuẩn bị áo ấm đầy đủ nhé, Sapa mùa đông rất lạnh!',
      sender: {
        id: '3',
        name: 'Lê Hoàng',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '14:20',
      pinned: true,
    },
    {
      id: '2',
      content: 'Mình đã đặt tour leo Fansipan cho ngày thứ 3 rồi.',
      sender: {
        id: '3',
        name: 'Lê Hoàng',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '14:25',
      attachments: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/2440024/pexels-photo-2440024.jpeg?auto=compress&cs=tinysrgb&w=600',
          name: 'fansipan.jpg',
        },
      ],
    },
    {
      id: '3',
      content: 'Mình sẽ mang theo máy ảnh để chụp cảnh đẹp.',
      sender: {
        id: '4',
        name: 'Ngọc Mai',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '14:30',
    },
  ],

  // Hội An group messages
  '4': [
    {
      id: '1',
      content: 'Chào mọi người, chúng ta sẽ khám phá phố cổ Hội An vào ngày đầu tiên nhé!',
      sender: {
        id: '5',
        name: 'Phạm Tuấn',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '15:10',
      pinned: true,
      attachments: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/5191371/pexels-photo-5191371.jpeg?auto=compress&cs=tinysrgb&w=600',
          name: 'hoian-old-town.jpg',
        },
      ],
    },
    {
      id: '2',
      content: 'Tuyệt vời! Mình rất thích ẩm thực Hội An.',
      sender: {
        id: '1',
        name: 'Nguyễn Minh',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '15:15',
    },
    {
      id: '3',
      content: 'Mình đã đặt lịch học nấu ăn tại Hội An vào ngày thứ 2 rồi đó.',
      sender: {
        id: '5',
        name: 'Phạm Tuấn',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '15:30',
      attachments: [
        {
          type: 'file',
          url: '#',
          name: 'cooking-class-schedule.pdf',
          size: 1536,
        },
      ],
    },
  ],

  // Hạ Long group messages
  '5': [
    {
      id: '1',
      content: 'Mình đã đặt tour du thuyền 2 ngày 1 đêm trên vịnh Hạ Long rồi nhé!',
      sender: {
        id: '2',
        name: 'Trần Hà',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '11:05',
      pinned: true,
      attachments: [
        {
          type: 'image',
          url: 'https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg?auto=compress&cs=tinysrgb&w=600',
          name: 'halong-cruise.jpg',
        },
      ],
    },
    {
      id: '2',
      content: 'Tuyệt vời! Mình sẽ mang theo máy ảnh để chụp cảnh đẹp.',
      sender: {
        id: '4',
        name: 'Ngọc Mai',
        avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '11:10',
    },
    {
      id: '3',
      content: 'Mình đã chuẩn bị danh sách các hang động đẹp nhất để khám phá.',
      sender: {
        id: '3',
        name: 'Lê Hoàng',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=120&h=120&dpr=1',
      },
      timestamp: '11:20',
      attachments: [
        {
          type: 'file',
          url: '#',
          name: 'halong-caves-list.pdf',
          size: 1024,
        },
      ],
    },
  ],
};
