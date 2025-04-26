'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock, Check, AlertCircle, RefreshCw } from 'lucide-react';

type SaveState = 'idle' | 'saving' | 'saved' | 'error';

interface AutoSaveIndicatorProps {
  state: SaveState;
  lastSaved: Date | null;
  error: Error | null;
  onRetry?: () => void;
  className?: string;
}

export function AutoSaveIndicator({
  state,
  lastSaved,
  error,
  onRetry,
  className
}: AutoSaveIndicatorProps) {
  // Format the last saved time
  const formatLastSaved = () => {
    if (!lastSaved) return '';
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    
    if (diffSec < 60) {
      return 'vừa xong';
    } else if (diffMin < 60) {
      return `${diffMin} phút trước`;
    } else {
      const hours = lastSaved.getHours().toString().padStart(2, '0');
      const minutes = lastSaved.getMinutes().toString().padStart(2, '0');
      return `lúc ${hours}:${minutes}`;
    }
  };

  return (
    <div className={cn("flex items-center text-xs gap-1.5", className)}>
      {state === 'saving' && (
        <>
          <Clock className="h-3 w-3 animate-spin text-muted-foreground" />
          <span className="text-muted-foreground">Đang lưu...</span>
        </>
      )}
      
      {state === 'saved' && (
        <>
          <Check className="h-3 w-3 text-green-500" />
          <span className="text-muted-foreground">
            Đã lưu {lastSaved ? formatLastSaved() : ''}
          </span>
        </>
      )}
      
      {state === 'error' && (
        <>
          <AlertCircle className="h-3 w-3 text-red-500" />
          <span className="text-red-500">
            Lỗi khi lưu
          </span>
          {onRetry && (
            <Button
              variant="ghost"
              size="sm"
              className="h-5 px-1 text-xs"
              onClick={onRetry}
            >
              <RefreshCw className="h-3 w-3 mr-1" />
              Thử lại
            </Button>
          )}
        </>
      )}
    </div>
  );
}
