# Planning Module

Module này cung cấp các component để hiển thị và quản lý kế hoạch du lịch, bao gồm:
- Danh sách mẫu kế hoạch
- Chi tiết mẫu kế hoạch
- Áp dụng mẫu kế hoạch cho nhóm/chuyến đi
- Quản lý kế hoạch đã tạo

## Cấu trúc thư mục

```
planning/
├── index.ts                  # Export tất cả các component và dữ liệu
├── PlanningPage.tsx          # Component chính của trang Planning
├── TemplatesList.tsx         # Hiển thị danh sách mẫu kế hoạch
├── TemplateDetails.tsx       # Hiển thị chi tiết mẫu kế hoạch
├── ApplyTemplateModal.tsx    # Modal áp dụng mẫu kế hoạch cho nhóm
├── PlanDetails.tsx           # Hiển thị chi tiết kế hoạch sau khi áp dụng
├── mock-data.ts              # Dữ liệu mẫu cho các mẫu kế hoạch
├── mock-data-additional.ts   # Dữ liệu mẫu bổ sung
├── trip-groups-data.ts       # Dữ liệu mẫu cho các nhóm/chuyến đi
└── README.md                 # Tài liệu hướng dẫn
```

## Cách sử dụng

### 1. Import component chính

```tsx
import { PlanningPage } from 'components/planning';

const App = () => {
  return <PlanningPage />;
};
```

### 2. Sử dụng các component riêng lẻ

```tsx
import { TemplatesList, TemplateDetails } from 'components/planning';
import { TRAVEL_PLAN_TEMPLATES } from 'components/planning';

const MyComponent = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  if (selectedTemplate) {
    return <TemplateDetails template={selectedTemplate} />;
  }

  return <TemplatesList onSelectTemplate={setSelectedTemplate} />;
};
```

### 3. Áp dụng mẫu kế hoạch cho nhóm

```tsx
import { ApplyTemplateModal } from 'components/planning';
import { TRAVEL_PLAN_TEMPLATES } from 'components/planning';

const MyComponent = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const template = TRAVEL_PLAN_TEMPLATES[0]; // Lấy mẫu kế hoạch đầu tiên

  return (
    <>
      <Button onClick={() => setIsModalVisible(true)}>
        Áp dụng mẫu kế hoạch
      </Button>
      
      <ApplyTemplateModal 
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        template={template}
      />
    </>
  );
};
```

## Cấu trúc dữ liệu

### Mẫu kế hoạch (TravelPlanTemplate)

```typescript
type TravelPlanTemplate = {
  id: string;
  name: string;
  destination: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  description: string;
  duration: number; // Số ngày
  image: string;
  tags: string[];
  days: Day[];
  authorId?: string;
  authorName?: string;
  isPublic: boolean;
  rating: number;
  usageCount: number;
};
```

### Ngày (Day)

```typescript
type Day = {
  id: string;
  date: Date | null; // Null cho mẫu, sẽ được set khi áp dụng
  activities: Activity[];
};
```

### Hoạt động (Activity)

```typescript
type Activity = {
  id: string;
  time: string;
  title: string;
  description: string;
  location: string;
};
```

### Nhóm/Chuyến đi (TripGroup)

```typescript
type TripGroup = {
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
  hasPlan: boolean; // Chỉ ra nếu nhóm đã có kế hoạch
  planDays?: number; // Số ngày trong kế hoạch hiện tại, nếu có
};
```

### Thành viên nhóm (TripMember)

```typescript
type TripMember = {
  id: string;
  name: string;
  avatar: string;
  role?: 'admin' | 'member'; // Vai trò của thành viên trong nhóm
};
```
