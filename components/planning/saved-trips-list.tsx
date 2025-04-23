'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Edit, Trash2, ExternalLink, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import { SavedTrip } from './saved-trips';
import { useTrips } from './trip-context';
import { TripDetails } from './trip-details';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';

interface SavedTripsListProps {
  onEditTrip?: (trip: SavedTrip) => void;
}

export function SavedTripsList({ onEditTrip }: SavedTripsListProps) {
  const { savedTrips, deleteTrip } = useTrips();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingTrip, setViewingTrip] = useState<SavedTrip | null>(null);

  // Force component to re-render when localStorage changes
  const [, forceUpdate] = useState({});

  // Listen for storage events to update the component when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      forceUpdate({});
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const filteredTrips = savedTrips.filter(trip =>
    trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    trip.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteTrip = (tripId: string) => {
    deleteTrip(tripId);

    // Dispatch a storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  };

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), 'dd/MM/yyyy', { locale: vi });
  };

  // If viewing a trip, show the trip details
  if (viewingTrip) {
    return (
      <TripDetails
        trip={viewingTrip}
        onBack={() => setViewingTrip(null)}
        onEdit={(trip) => {
          if (onEditTrip) {
            onEditTrip(trip);
            setViewingTrip(null);
          }
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Kế hoạch đã lưu</h2>
        <div className="w-1/3">
          <Input
            placeholder="Tìm kiếm kế hoạch..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <Card className="border-dashed border-purple-200 dark:border-purple-800 bg-white/50 dark:bg-gray-950/50">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Không tìm thấy kế hoạch nào</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTrips.map((trip) => (
            <Card
              key={trip.id}
              className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-video relative">
                {/* eslint-disable-next-line */}
                <img
                  src={trip.image}
                  alt={trip.name}
                  className="object-cover w-full h-full"
                />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/30 to-transparent"></div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-purple-500 text-white">
                    {trip.days} ngày
                  </Badge>
                </div>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{trip.name}</CardTitle>
                <CardDescription className="line-clamp-2">{trip.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center text-sm text-muted-foreground mb-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1" />
                  <span>Cập nhật: {formatDate(trip.updatedAt)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                    onClick={() => onEditTrip && onEditTrip(trip)}
                  >
                    <Edit className="h-3.5 w-3.5 mr-1" />
                    Chỉnh sửa
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3.5 w-3.5 mr-1" />
                        Xóa
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc chắn muốn xóa kế hoạch "{trip.name}"? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTrip(trip.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                  onClick={() => setViewingTrip(trip)}
                >
                  <Eye className="h-3.5 w-3.5 mr-1" />
                  Xem chi tiết
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
