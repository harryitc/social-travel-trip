'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/radix-ui/button';
import { MessageLikesModal } from './message-likes-modal';

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
  isOwnMessage?: boolean;
}

export function MessageReactions({
  messageId,
  likeCount = 0,
  reactions = [],
  onReactionUpdate,
  isOwnMessage = false
}: MessageReactionsProps) {
  const [showLikesModal, setShowLikesModal] = useState(false);

  console.log("likeCount = ", likeCount)

  // Get the most popular reactions for display (top 3)
  const getTopReactions = () => {
    if (!reactions || reactions.length === 0) return [];

    // Filter out reaction_id = 1 (no like) and sort by count
    const validReactions = reactions
      .filter(r => r.reaction_id > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Take top 3

    return validReactions;
  };

  const topReactions = getTopReactions();

  // Don't show anything if no reactions
  if (!likeCount || likeCount === 0) {
    return null;
  }

  return (
    <>
      {/* Reaction summary - clickable to show modal - positioned inline with message */}
      <Button
        variant="ghost"
        size="sm"
        className={`h-5 px-2 text-xs rounded-full transition-all duration-200 ml-2 inline-flex ${
          isOwnMessage
            ? 'bg-white/20 hover:bg-white/30 text-white/90'
            : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300'
        }`}
        onClick={() => setShowLikesModal(true)}
      >
        <div className="flex items-center gap-1">
          {/* Show top reaction icons */}
          <div className="flex items-center -space-x-1">
            {topReactions.map((reaction, index) => {
              const reactionType = REACTION_TYPES.find(r => r.id === reaction.reaction_id);
              return (
                <span
                  key={reaction.reaction_id}
                  className="text-xs"
                  style={{ zIndex: topReactions.length - index }}
                >
                  {reactionType?.icon}
                </span>
              );
            })}
          </div>

          {/* Total count */}
          <span className="text-xs font-medium ml-1">{likeCount}</span>
        </div>
      </Button>

      {/* Likes modal */}
      <MessageLikesModal
        isOpen={showLikesModal}
        onClose={() => setShowLikesModal(false)}
        messageId={messageId}
      />
    </>
  );
}
