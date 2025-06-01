'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/radix-ui/card';
import { Button } from '@/components/ui/radix-ui/button';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Input } from '@/components/ui/radix-ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/radix-ui/select';
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  Users,
  Info,
  Copy,
  Search,
  Globe,
  Lock,
  User,
  PlusIcon,
  Loader2
} from 'lucide-react';
import { planService, Plan } from './services/plan.service';
import { ApplyPlanToGroup } from './ApplyPlanToGroup';
import { toast } from 'sonner';

interface PlansListProps {
  onSelectPlan?: (plan: Plan) => void;
  onCreateNew?: () => void;
  showCreateButton?: boolean;
}

export function PlansList({
  onSelectPlan,
  onCreateNew,
  showCreateButton = true
}: PlansListProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPlanForApply, setSelectedPlanForApply] = useState<Plan | null>(null);

  // Load plans from backend
  const loadPlans = async (reset = false) => {
    try {
      setLoading(true);
      const currentPage = reset ? 1 : page;

      const params = {
        page: currentPage,
        limit: 12,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await planService.getPlans(params);

      if (reset) {
        setPlans(response.data || []);
        setPage(1);
      } else {
        setPlans(prev => [...prev, ...(response.data || [])]);
      }

      setHasMore(response.data?.length === 12);
    } catch (error) {
      console.error('Error loading plans:', error);
      toast.error('Không thể tải danh sách kế hoạch');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadPlans(true);
  }, []);

  // Search and filter
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPlans(true);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, statusFilter]);

  // Load more
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadPlans();
    }
  };

  const handleViewDetails = (plan: Plan) => {
    if (onSelectPlan) {
      onSelectPlan(plan);
    }
  };

  const handleApplyPlan = (plan: Plan) => {
    setSelectedPlanForApply(plan);
  };

  return (
    <div className="space-y-6">
      <Card className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs">
        <CardHeader>
          <CardTitle>Danh sách kế hoạch</CardTitle>
          <CardDescription>
            Khám phá và sử dụng các kế hoạch du lịch được tạo bởi cộng đồng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grow">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Tìm kiếm kế hoạch..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="public">Công khai</SelectItem>
                  <SelectItem value="private">Riêng tư</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showCreateButton && (
              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={onCreateNew}
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Tạo kế hoạch mới
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {loading && plans.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
            <p className="text-muted-foreground">Đang tải kế hoạch...</p>
          </div>
        </div>
      ) : plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Không tìm thấy kế hoạch nào</h3>
          <p className="text-muted-foreground mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <Card key={plan.plan_id} className="border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
                <div className="relative h-48">
                  <img
                    src={plan.thumbnail_url || 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600'}
                    alt={plan.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {plan.status === 'public' ? (
                      <Badge className="bg-green-500 flex items-center gap-1 text-xs">
                        <Globe className="h-3 w-3" />
                        Công khai
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                        <Lock className="h-3 w-3" />
                        Riêng tư
                      </Badge>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-semibold text-lg line-clamp-1">{plan.name}</h3>
                    <div className="flex items-center text-white/90 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="truncate">{plan.location?.name || 'Chưa có địa điểm'}</span>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 space-y-3">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {plan.description || 'Chưa có mô tả'}
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span>{new Date(plan.created_at).toLocaleDateString('vi-VN')}</span>
                    </div>
                    {plan.group_count && (
                      <div className="flex items-center text-muted-foreground">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{plan.group_count} nhóm</span>
                      </div>
                    )}
                  </div>

                  {plan.json_data?.tags && (
                    <div className="flex flex-wrap gap-1">
                      {plan.json_data.tags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {plan.json_data.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{plan.json_data.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>

                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white/90 hover:bg-white"
                    onClick={() => handleViewDetails(plan)}
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Chi tiết
                  </Button>
                  <Button
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                    onClick={() => handleApplyPlan(plan)}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Áp dụng
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang tải...
                  </>
                ) : (
                  'Tải thêm'
                )}
              </Button>
            </div>
          )}
        </>
      )}

      {/* Apply to Group Dialog */}
      {selectedPlanForApply && (
        <ApplyPlanToGroup
          plan={selectedPlanForApply}
          isOpen={!!selectedPlanForApply}
          onClose={() => setSelectedPlanForApply(null)}
          onSuccess={() => {
            toast.success('Kế hoạch đã được áp dụng thành công!');
            setSelectedPlanForApply(null);
          }}
        />
      )}
    </div>
  );
}
