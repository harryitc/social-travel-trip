export interface TripGroupMember {
  id: string;
  name: string;
  avatar: string;
  role?: 'admin' | 'member';
}

export interface TripGroup {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  date?: string;
  duration?: string;
  members: {
    count: number;
    max: number;
    list: TripGroupMember[];
  };
  hashtags: string[];
  isPrivate: boolean;
  hasPlan: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTripGroupData {
  title: string;
  description: string;
  location: string;
  startDate?: Date;
  endDate?: Date;
  maxMembers: number;
  isPrivate: boolean;
  image?: string;
}

export interface JoinTripGroupData {
  qrCode: string;
  userId: string;
}
