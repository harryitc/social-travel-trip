'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/radix-ui/avatar';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/radix-ui/button';
import { Skeleton } from '@/components/ui/radix-ui/skeleton';
import Link from 'next/link';
import { tripService, Trip } from './services/trip.service';

export function UpcomingTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUpcomingTrips = async () => {
      try {
        setLoading(true);
        const upcomingTrips = await tripService.getUpcomingTrips(3);
        setTrips(upcomingTrips);
        setError(null);
      } catch (error) {
        console.error('Error fetching upcoming trips:', error);
        setError('Không thể tải dữ liệu chuyến đi sắp tới');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingTrips();
  }, []);

  // Format date range
  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const formatDate = (date: Date) => {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  };

  return (
    <Card className="overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-purple-800 dark:text-purple-400">
          Chuyến đi sắp tới
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-3 pb-3 border-b border-purple-100 dark:border-purple-900 last:border-0 last:pb-0">
                <div className="flex flex-col flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-2/3" />
                  <div className="flex -space-x-2 mt-1">
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                    <Skeleton className="h-6 w-6 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>{error}</p>
            <Button
              variant="link"
              className="mt-2 text-purple-600 dark:text-purple-400"
              onClick={() => window.location.reload()}
            >
              Thử lại
            </Button>
          </div>
        ) : trips.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <p>Không có chuyến đi sắp tới</p>
          </div>
        ) : (
          <div className="space-y-4">
            {trips.map((trip) => (
              <div key={trip.plan_id} className="flex items-start space-x-3 pb-3 border-b border-purple-100 dark:border-purple-900 last:border-0 last:pb-0">
                <div className="flex flex-col flex-1 space-y-1">
                  <Link href={`/trips/${trip.plan_id}`}>
                    <h4 className="font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                      {trip.title}
                    </h4>
                  </Link>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{trip.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 mr-1" />
                    <span>{formatDateRange(trip.start_date, trip.end_date)}</span>
                  </div>
                  {trip.members && trip.members.length > 0 && (
                    <div className="flex -space-x-2 mt-1">
                      {trip.members.slice(0, 3).map((member, i) => (
                        <Avatar key={i} className="h-6 w-6 border-2 border-background">
                          <AvatarImage src={member.avatar} alt={member.full_name} />
                          <AvatarFallback>{member.full_name[0]}</AvatarFallback>
                        </Avatar>
                      ))}
                      {trip.members.length > 3 && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background">
                          +{trip.members.length - 3}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}

            <Link href="/trips">
              <Button variant="link" size="sm" className="text-purple-600 dark:text-purple-400 p-0 h-auto w-full flex justify-center">
                <span>Xem tất cả chuyến đi</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}