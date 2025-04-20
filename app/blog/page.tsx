import { PageHeader } from '@/components/ui/page-header';
import { BlogFeed } from '@/components/blog/blog-feed';
import { CreateBlogButton } from '@/components/blog/create-blog-button';

export default function BlogPage() {
  return (
    <div className="container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <PageHeader 
          title="Blog Mini" 
          description="Đọc và chia sẻ trải nghiệm của bạn"
        />
        <CreateBlogButton />
      </div>
      
      <BlogFeed />
    </div>
  );
}