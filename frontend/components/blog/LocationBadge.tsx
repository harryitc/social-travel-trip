import { MapPin } from "lucide-react";

interface LocationBadgeProps {
  locationName: string;
}

export function LocationBadge({ locationName }: LocationBadgeProps) {
  return (
    <div className="flex items-center text-xs text-gray-500 space-x-1">
      <MapPin className="h-4 w-4 text-travel-blue" />
      <span>{locationName}</span>
    </div>
  );
}
