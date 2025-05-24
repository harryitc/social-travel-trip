'use client';

import { LikesModal } from '../../forum/components/likes-modal';
import { messageLikesAdapter } from '../services/message-likes-adapter';

interface MessageLikesModalProps {
  isOpen: boolean;
  onClose: () => void;
  messageId: string;
}

export function MessageLikesModal({ isOpen, onClose, messageId }: MessageLikesModalProps) {
  return (
    <LikesModal
      isOpen={isOpen}
      onClose={onClose}
      itemId={messageId}
      itemType="comment" // Use comment type as it's similar to messages
      service={messageLikesAdapter}
      title="Reactions cho tin nhắn"
    />
  );
}
