import { PageHeader } from '@/components/ui/page-header';
import { ExploreSearch } from '@/components/explore/explore-search';
import { DestinationGrid } from '@/components/explore/destination-grid';

export default function ExplorePage() {
  return (
    <div className="container mx-auto">
      <PageHeader 
        title="Khám phá" 
        description="Tìm kiếm những địa điểm du lịch hấp dẫn"
      />
      
      <ExploreSearch />
      
      <div className="mt-8">
        <DestinationGrid />
      </div>
    </div>
  );
}