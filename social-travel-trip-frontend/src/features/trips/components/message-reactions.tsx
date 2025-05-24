'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { Heart, Smile } from 'lucide-react';
import { MessageLikesModal } from './message-likes-modal';
import { messageReactionService } from '../services/message-likes-adapter';
import { notification } from 'antd';

// Reaction types matching backend
const REACTION_TYPES = [
  { id: 1, icon: '🚫', label: 'Không like', color: 'text-gray-400' },
  { id: 2, icon: '👍', label: 'Thích', color: 'text-blue-500' },
  { id: 3, icon: '❤️', label: 'Yêu thích', color: 'text-red-500' },
  { id: 4, icon: '😄', label: 'Haha', color: 'text-yellow-500' },
  { id: 5, icon: '😮', label: 'Wow', color: 'text-purple-500' },
  { id: 6, icon: '😢', label: 'Buồn', color: 'text-gray-500' },
];

interface MessageReactionsProps {
  messageId: string;
  likeCount?: number;
  reactions?: Array<{ reaction_id: number; count: number }>;
  onReactionUpdate?: (messageId: string, newLikeCount: number) => void;
}

export function MessageReactions({
  messageId,
  likeCount = 0,
  reactions = [],
  onReactionUpdate
}: MessageReactionsProps) {
  const [showLikesModal, setShowLikesModal] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [isReacting, setIsReacting] = useState(false);

  // Get the most popular reaction for display
  const getMostPopularReaction = () => {
    if (!reactions || reactions.length === 0) return null;

    // Find reaction with highest count (excluding reaction_id = 1 which is "no like")
    const validReactions = reactions.filter(r => r.reaction_id > 1);
    if (validReactions.length === 0) return null;

    return validReactions.reduce((max, current) =>
      current.count > max.count ? current : max
    );
  };

  const handleReaction = async (reactionId: number) => {
    if (isReacting) return;

    setIsReacting(true);
    try {
      await messageReactionService.toggleReaction(parseInt(messageId), reactionId);

      // Get updated reaction data
      const updatedData = await messageReactionService.getMessageReactions(parseInt(messageId));
      const newTotal = updatedData.total || 0;

      // Update parent component
      if (onReactionUpdate) {
        onReactionUpdate(messageId, newTotal);
      }

      setShowReactionPicker(false);

      const reactionType = REACTION_TYPES.find(r => r.id === reactionId);
      notification.success({
        message: 'Thành công',
        description: `Đã ${reactionType?.label.toLowerCase()} tin nhắn`,
        placement: 'topRight',
        duration: 1,
      });
    } catch (error) {
      console.error('Error reacting to message:', error);
      notification.error({
        message: 'Lỗi',
        description: 'Không thể thực hiện reaction. Vui lòng thử lại sau.',
        placement: 'topRight',
      });
    } finally {
      setIsReacting(false);
    }
  };

  const handleQuickLike = () => {
    handleReaction(2); // Quick like with reaction_id = 2
  };

  const mostPopularReaction = getMostPopularReaction();

  return (
    <div className="flex items-center gap-2">
      {/* Like count display - clickable to show modal */}
      {likeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setShowLikesModal(true)}
        >
          <div className="flex items-center gap-1">
            {mostPopularReaction && (
              <span className="text-sm">
                {REACTION_TYPES.find(r => r.id === mostPopularReaction.reaction_id)?.icon}
              </span>
            )}
            <span className="text-gray-600 dark:text-gray-400">{likeCount}</span>
          </div>
        </Button>
      )}

      {/* Quick reaction buttons */}
      <div className="flex items-center gap-1">
        {/* Quick like button */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0 hover:bg-red-100 dark:hover:bg-red-900/30"
          onClick={handleQuickLike}
          disabled={isReacting}
          title="Thích"
        >
          <Heart className="h-3 w-3 text-red-500" />
        </Button>

        {/* Reaction picker toggle */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
            onClick={() => setShowReactionPicker(!showReactionPicker)}
            disabled={isReacting}
            title="Thêm reaction"
          >
            <Smile className="h-3 w-3 text-yellow-500" />
          </Button>

          {/* Reaction picker dropdown */}
          {showReactionPicker && (
            <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-50">
              <div className="flex items-center gap-1">
                {REACTION_TYPES.slice(1).map((reaction) => ( // Skip reaction_id = 1 (no like)
                  <Button
                    key={reaction.id}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => handleReaction(reaction.id)}
                    disabled={isReacting}
                    title={reaction.label}
                  >
                    <span className="text-lg">{reaction.icon}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Likes modal */}
      <MessageLikesModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        messageId={messageId}
      />

      {/* Click outside to close reaction picker */}
      {showReactionPicker && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowReactionPicker(false)}
        />
      )}
    </div>
  );
}
