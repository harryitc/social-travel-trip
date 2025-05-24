'use client';

import { useState, useEffect, useCallback } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { Heart } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/radix-ui/dialog';
import { useAuth } from '@/features/auth/hooks/use-auth';
import { notification } from 'antd';
import { FollowButton } from './follow-button';
import { API_ENDPOINT } from '@/config/api.config';

// Reaction types
const REACTION_TYPES = [
  { id: 1, icon: '🚫', label: 'Không like' }, // reaction_id = 1
  { id: 2, icon: '👍', label: 'Thích' },
  { id: 3, icon: '❤️', label: 'Yêu thích' },
  { id: 4, icon: '😄', label: 'Haha' },
  { id: 5, icon: '😮', label: 'Wow' },
  { id: 6, icon: '😢', label: 'Buồn' },
];

export interface LikesData {
  total: number;
  reactions: { reaction_id: number; count: number }[];
  users: (any & { reaction_id: number })[];
}

export interface LikesService {
  getLikes: (id: string) => Promise<LikesData>;
  getReactionUsers: (id: string, reactionId?: number) => Promise<{
    data: (any & { reaction_id: number })[];
    meta: { total: number };
  }>;
}

interface LikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemType: 'post' | 'comment';
  service: LikesService;
  title?: string;
}

export function LikesModal({
  isOpen,
  onClose,
  itemId,
  itemType,
  service,
  title = 'Reactions'
}: LikesModalProps) {
  const { user: currentUser } = useAuth();

  const [likesData, setLikesData] = useState<LikesData>({
    total: 0,
    reactions: [],
    users: []
  });
  const [loading, setLoading] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState<number | null>(null);

  const fetchLikesData = useCallback(async () => {
    try {
      setLoading(true);

      // Get likes summary
      const likesResponse = await service.getLikes(itemId);

      // Get users who reacted
      const usersResponse = await service.getReactionUsers(itemId);

      setLikesData({
        total: likesResponse.total,
        reactions: likesResponse.reactions,
        users: usersResponse.data
      });

      setSelectedReaction(null);
    } catch (error) {
      console.error(`Error fetching ${itemType} likes:`, error);
      notification.error({
        message: 'Lỗi',
        description: `Không thể tải danh sách người thích. Vui lòng thử lại sau.`,
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  }, [itemId, service]);

  // Load likes data when modal opens
  useEffect(() => {
    if (isOpen && itemId) {
      fetchLikesData();
    }
  }, [isOpen, itemId, fetchLikesData]);

  const handleReactionTabClick = async (reactionId: number | null) => {
    try {
      setLoading(true);
      setSelectedReaction(reactionId);

      // Load users for specific reaction or all users
      const usersResponse = await service.getReactionUsers(itemId, reactionId || undefined);

      setLikesData(prev => ({
        ...prev,
        users: usersResponse.data
      }));
    } catch (error) {
      console.error(`Error fetching ${itemType} reaction users:`, error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách người react. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = selectedReaction === null
    ? likesData.users
    : likesData.users.filter(user => user.reaction_id === selectedReaction);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-purple-600" />
            {title} ({likesData.total})
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            <div>
              {/* Reaction Tabs */}
              {likesData.reactions.length > 0 && (
                <div className="flex gap-2 mb-4 border-b overflow-x-auto">
                  <button
                    className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      selectedReaction === null
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleReactionTabClick(null)}
                  >
                    Tất cả ({likesData.total})
                  </button>
                  {likesData.reactions.map((reaction) => {
                    const reactionType = REACTION_TYPES.find(r => r.id === reaction.reaction_id);
                    return (
                      <button
                        key={reaction.reaction_id}
                        className={`px-3 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1 whitespace-nowrap ${
                          selectedReaction === reaction.reaction_id
                            ? 'border-purple-600 text-purple-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                        onClick={() => handleReactionTabClick(reaction.reaction_id)}
                      >
                        <span>{reactionType?.icon}</span>
                        <span>({reaction.count})</span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Users List */}
              {filteredUsers.length > 0 ? (
                <div className="space-y-3">
                  {filteredUsers.map((user) => {
                    const reactionType = REACTION_TYPES.find(r => r.id === user.reaction_id);

                    return (
                      <div
                        key={`${user.user_id}-${user.reaction_id}`}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                      >
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={API_ENDPOINT.file_image_v2 + (user.avatar || user.avatar_url)} alt={user.full_name} />
                          <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.full_name}</span>
                            <span className="text-lg">{reactionType?.icon}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            @{user.username}
                          </div>
                        </div>
                        {user.user_id?.toString() !== currentUser?.user_id?.toString() && (
                          <FollowButton
                            userId={user.user_id?.toString()}
                            username={user.username}
                            fullName={user.full_name}
                            variant="outline"
                            size="sm"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  {selectedReaction === null
                    ? `Chưa có ai thích ${itemType === 'post' ? 'bài viết' : 'bình luận'} này`
                    : 'Không có ai react với loại này'
                  }
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
