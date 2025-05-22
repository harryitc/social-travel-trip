export interface PostCreatedEvent {
  authorId: number;
  post: {
    id: number;
    content: string;
    createdAt: Date;
    images?: string[];
    location?: {
      id: number;
      name: string;
    };
    hashtags?: string[];
    mentions?: {
      id: number;
      username: string;
    }[];
  };
}

export interface PostLikedEvent {
  postId: number;
  likerId: number;
  likerData: {
    id: number;
    username: string;
    avatar?: string;
  };
}

export interface CommentCreatedEvent {
  postId: number;
  commenterId: number;
  commenterData: {
    id: number;
    username: string;
    avatar?: string;
  };
  comment: {
    id: number;
    content: string;
    createdAt: Date;
  };
}

export interface UserFollowedEvent {
  followerId: number;
  followerData: {
    id: number;
    username: string;
    avatar?: string;
  };
}

export interface NotificationEvent {
  id: number;
  type: string;
  userId: number;
  actorId: number;
  actorData: {
    id: number;
    username: string;
    avatar?: string;
  };
  entityId?: number;
  entityType?: string;
  content?: string;
  createdAt: Date;
  isRead: boolean;
}
