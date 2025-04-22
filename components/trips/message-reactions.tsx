'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ThumbsUp, Heart, SmilePlus } from 'lucide-react';

// Define the specific emoji reactions (Facebook Messenger style)
const REACTIONS = [
  { emoji: '👍', name: 'Like' },
  { emoji: '❤️', name: 'Heart' },
  { emoji: '😄', name: 'Laugh' },
  { emoji: '😢', name: 'Sad' },
  { emoji: '😠', name: 'Angry' }
];

type Reaction = {
  emoji: string;
  count: number;
  users: string[]; // User IDs who reacted with this emoji
};

type MessageReactionsProps = {
  reactions: Reaction[];
  messageId: string;
  currentUserId: string;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRemoveReaction: (messageId: string, emoji: string) => void;
};

export function MessageReactions({
  reactions,
  messageId,
  currentUserId,
  onAddReaction,
  onRemoveReaction
}: MessageReactionsProps) {
  const [showReactionBar, setShowReactionBar] = useState(false);

  const handleReactionClick = (emoji: string, hasReacted: boolean) => {
    if (hasReacted) {
      onRemoveReaction(messageId, emoji);
    } else {
      onAddReaction(messageId, emoji);
    }
    setShowReactionBar(false);
  };

  // Quick reaction with thumbs up when clicking the main button
  const handleQuickReaction = () => {
    const hasThumbsUp = reactions.some(r => r.emoji === '👍' && r.users.includes(currentUserId));
    if (hasThumbsUp) {
      onRemoveReaction(messageId, '👍');
    } else {
      onAddReaction(messageId, '👍');
    }
  };

  // If no reactions, just show the reaction button
  if (reactions.length === 0 && !showReactionBar) {
    return (
      <div className="flex items-center gap-1 mt-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-secondary"
          onClick={handleQuickReaction}
          onMouseEnter={() => setShowReactionBar(true)}
        >
          <ThumbsUp className="h-3.5 w-3.5 text-muted-foreground" />
        </Button>
      </div>
    );
  }

  // Get the emoji that the current user has reacted with, if any
  const userReaction = reactions.find(r => r.users.includes(currentUserId))?.emoji;

  return (
    <div className="relative">
      {/* Reaction bar */}
      {showReactionBar && (
        <div
          className="absolute bottom-full mb-2 flex items-center bg-background border rounded-full p-1 shadow-lg z-10"
          onMouseLeave={() => setShowReactionBar(false)}
        >
          {REACTIONS.map((reaction) => {
            const existingReaction = reactions.find(r => r.emoji === reaction.emoji);
            const hasReacted = existingReaction?.users.includes(currentUserId) || false;

            return (
              <TooltipProvider key={reaction.emoji} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 rounded-full p-0 ${hasReacted ? 'bg-secondary' : ''}`}
                      onClick={() => handleReactionClick(reaction.emoji, hasReacted)}
                    >
                      <span className="text-lg">{reaction.emoji}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs p-1">
                    {reaction.name}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      )}

      {/* Displayed reactions */}
      <div className="flex items-center gap-1 mt-2">
        {reactions.map((reaction) => {
          const hasReacted = reaction.users.includes(currentUserId);

          return (
            <TooltipProvider key={reaction.emoji} delayDuration={300}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-6 px-1.5 py-0.5 rounded-full text-xs flex items-center gap-1 ${
                      hasReacted ? 'bg-secondary' : 'hover:bg-secondary/50'
                    }`}
                    onClick={() => handleReactionClick(reaction.emoji, hasReacted)}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs p-2">
                  {reaction.users.length > 3
                    ? `${reaction.users.length} người đã thả cảm xúc`
                    : reaction.users.join(', ')}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        })}

        {/* Reaction button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded-full hover:bg-secondary"
          onClick={userReaction ? () => handleReactionClick(userReaction, true) : handleQuickReaction}
          onMouseEnter={() => setShowReactionBar(true)}
        >
          {userReaction ? (
            <span className="text-xs">{userReaction}</span>
          ) : (
            <SmilePlus className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </Button>
      </div>
    </div>
  );
}
