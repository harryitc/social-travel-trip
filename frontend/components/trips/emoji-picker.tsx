'use client';

import { useState, useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';

// Dynamically import the emoji picker to avoid SSR issues
const EmojiPickerComponent = dynamic(
  () => import('emoji-picker-react').then(mod => mod.default),
  { ssr: false }
);

type EmojiPickerProps = {
  onEmojiSelect: (emoji: string) => void;
};

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        buttonRef.current && 
        !buttonRef.current.contains(event.target as Node) && 
        !(event.target as Element).closest('.EmojiPickerReact')
      ) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleEmojiClick = (emojiData: any) => {
    onEmojiSelect(emojiData.emoji);
    setOpen(false);
  };
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          ref={buttonRef}
          variant="ghost" 
          size="icon"
          onClick={() => setOpen(!open)}
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-full p-0 border-none shadow-lg" 
        sideOffset={5}
        align="end"
      >
        <EmojiPickerComponent
          onEmojiClick={handleEmojiClick}
          searchPlaceholder="Tìm emoji..."
          previewConfig={{ showPreview: false }}
          width="100%"
          height="350px"
        />
      </PopoverContent>
    </Popover>
  );
}
