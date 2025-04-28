import { ForumFeed } from '@/components/forum/forum-feed';
import { TrendingDestinations } from '@/components/explore/trending-destinations';
import { UpcomingTrips } from '@/components/trips/upcoming-trips';
import { PageHeader } from '@/components/ui/page-header';

export default function Home() {
  return (
    <div className="container mx-auto">
      <PageHeader
        title="Diễn đàn"
        description="Khám phá và chia sẻ trải nghiệm du lịch của bạn"
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ForumFeed />
        </div>
        <div className="space-y-6">
          <UpcomingTrips />
          <TrendingDestinations />
        </div>
      </div>
    </div>
  );
}