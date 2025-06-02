'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import TripPlanEditor from './TripPlanEditor';
import { TripPlan } from './types';

// Mock data for demo
const mockTripPlan: TripPlan = {
  id: 'trip-plan-1',
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
          mainLocation: 'Chợ Đà Lạt'
        },
        {
          id: 'activity-2',
          time: '09:30',
          title: 'Tham quan Nhà thờ Con Gà',
          description: 'Tham quan nhà thờ mang kiến trúc Pháp nổi tiếng với chiếc chuông hình con gà.',
          location: 'Nhà thờ Con Gà',
          mainLocation: 'Nhà thờ Con Gà'
        },
        {
          id: 'activity-3',
          time: '11:30',
          title: 'Ăn trưa tại quán Bún Bò Huế',
          description: 'Thưởng thức bún bò Huế nổi tiếng tại Đà Lạt.',
          location: 'Quán Bún Bò Huế',
          mainLocation: 'Quán Bún Bò Huế'
        }
      ]
    },
    {
      id: 'day-2',
      date: null,
      activities: [
        {
          id: 'activity-4',
          time: '08:00',
          title: 'Ăn sáng tại khách sạn',
          description: 'Thưởng thức bữa sáng tại khách sạn.',
          location: 'Khách sạn',
          mainLocation: 'Khách sạn'
        },
        {
          id: 'activity-5',
          time: '09:30',
          title: 'Tham quan Thung lũng Tình Yêu',
          description: 'Khám phá cảnh đẹp của Thung lũng Tình Yêu.',
          location: 'Thung lũng Tình Yêu',
          mainLocation: 'Thung lũng Tình Yêu'
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
          title: 'Ăn sáng tại khách sạn',
          description: 'Thưởng thức bữa sáng tại khách sạn.',
          location: 'Khách sạn',
          mainLocation: 'Khách sạn'
        },
        {
          id: 'activity-7',
          time: '09:30',
          title: 'Tham quan Đồi Robin',
          description: 'Khám phá cảnh đẹp của Đồi Robin.',
          location: 'Đồi Robin',
          mainLocation: 'Đồi Robin'
        }
      ]
    }
  ],
  authorId: 'user-1',
  authorName: 'Nguyễn Văn A',
  isPublic: true,
  groupId: 'group-1',
  createdAt: new Date(),
  updatedAt: new Date()
};

export default function TripPlanEditorDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [plan, setPlan] = useState<TripPlan>(mockTripPlan);

  const handleSave = async (updatedPlan: TripPlan) => {
    console.log('Saving plan:', updatedPlan);
    setPlan(updatedPlan);
    return Promise.resolve();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">TripPlanEditor Demo</h1>
      <Button onClick={() => setIsOpen(true)}>Mở TripPlanEditor</Button>

      <TripPlanEditor
        plan={plan}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
