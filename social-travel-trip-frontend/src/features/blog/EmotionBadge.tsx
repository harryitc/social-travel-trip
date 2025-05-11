import { cn } from "@/lib/utils";
import { Emotion } from "../const";

interface EmotionBadgeProps {
  emotion: Emotion;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
}

export function EmotionBadge({
  emotion,
  size = "md",
  withLabel = false,
}: EmotionBadgeProps) {
  const emotionConfig = {
    happy: {
      icon: "😊",
      label: "Happy",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    excited: {
      icon: "🤩",
      label: "Excited",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    peaceful: {
      icon: "😌",
      label: "Peaceful",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    amazed: {
      icon: "😲",
      label: "Amazed",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    nostalgic: {
      icon: "🥹",
      label: "Nostalgic",
      className: "bg-green-100 text-green-700 border-green-200",
    },
  };

  const config = emotionConfig[emotion];

  const sizeClasses = {
    sm: "text-sm px-2 py-0.5",
    md: "text-base px-2.5 py-1",
    lg: "text-lg px-3 py-1.5",
  };

  return (
    <div
      className={cn(
        "flex items-center rounded-full border",
        config.className,
        sizeClasses[size]
      )}
    >
      <span className="mr-1">{config.icon}</span>
      {withLabel && <span className="font-medium">{config.label}</span>}
    </div>
  );
}
