import React, { useState, ChangeEvent } from 'react';
import { TravelPlanTemplate, TRAVEL_PLAN_TEMPLATES } from './mock-data';
import EditableTemplateDetailsPageNew from './EditableTemplateDetailsPageNew';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import {
  MapPin,
  Calendar,
  Search as SearchIcon,
  FilterX,
  Heart,
  Download,
  Star
} from 'lucide-react';

const TemplatesList: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<TravelPlanTemplate | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | undefined>(undefined);
  const [selectedDuration, setSelectedDuration] = useState<string | undefined>(undefined);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Filter templates based on search and filters
  const filteredTemplates = TRAVEL_PLAN_TEMPLATES.filter(template => {
    // Search filter
    const searchMatch =
      searchText === '' ||
      template.name.toLowerCase().includes(searchText.toLowerCase()) ||
      template.destination.toLowerCase().includes(searchText.toLowerCase()) ||
      template.description.toLowerCase().includes(searchText.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(searchText.toLowerCase()));

    // Region filter
    const regionMatch = !selectedRegion || template.region === selectedRegion;

    // Duration filter
    const durationMatch = !selectedDuration || template.duration === parseInt(selectedDuration);

    return searchMatch && regionMatch && durationMatch;
  });

  // Toggle favorite
  const toggleFavorite = (templateId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (favorites.includes(templateId)) {
      setFavorites(favorites.filter(id => id !== templateId));
    } else {
      setFavorites([...favorites, templateId]);
    }
  };

  // Reset filters with loading simulation
  const resetFilters = () => {
    simulateLoading(() => {
      setSearchText('');
      setSelectedRegion(undefined);
      setSelectedDuration(undefined);
    });
  };

  // Handle search input change with debounce
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only trigger loading for non-empty searches or when clearing a previous search
    if (value.trim() !== '' || searchText.trim() !== '') {
      setIsLoading(true);

      // Use setTimeout to debounce the search
      const timeoutId = setTimeout(() => {
        setSearchText(value);
        setIsLoading(false);
      }, 500);

      // Clean up the timeout on next render
      return () => clearTimeout(timeoutId);
    } else {
      setSearchText(value);
    }
  };

  // Simulate loading when applying filters or creating a new template
  const simulateLoading = (callback: () => void) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      callback();
    }, 800); // Simulate a short loading time
  };

  // If a template is selected, show its details
  if (selectedTemplate) {
    return (
      <div>
        <EditableTemplateDetailsPageNew
          template={selectedTemplate}
          onBack={() => setSelectedTemplate(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Mẫu kế hoạch du lịch</h2>
          <p className="text-muted-foreground">
            Chọn một mẫu kế hoạch du lịch để áp dụng cho chuyến đi của bạn. Các mẫu này đã được chuẩn bị sẵn với lịch trình chi tiết.
          </p>
        </div>
        <Button
          className="bg-purple-600 hover:bg-purple-700 text-white w-full sm:w-auto"
          onClick={() => {
            // Create a new empty template with loading simulation
            simulateLoading(() => {
              const newTemplate: TravelPlanTemplate = {
                id: `template-${Date.now()}`,
                name: "Mẫu kế hoạch mới",
                destination: "Việt Nam",
                region: "Miền Bắc",
                description: "Mô tả kế hoạch du lịch của bạn",
                image: "https://images.unsplash.com/photo-1528127269322-539801943592",
                duration: 3,
                tags: ["du lịch", "khám phá"],
                authorId: "user-1",
                authorName: "Người dùng",
                rating: 0,
                usageCount: 0,
                isPublic: false,
                days: [
                  {
                    id: "day-1",
                    date: null,
                    activities: []
                  },
                  {
                    id: "day-2",
                    date: null,
                    activities: []
                  },
                  {
                    id: "day-3",
                    date: null,
                    activities: []
                  }
                ]
              };
              setSelectedTemplate(newTemplate);
            });
          }}
        >
          Tạo mẫu mới
        </Button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm mẫu kế hoạch..."
                value={searchText}
                onChange={handleSearchChange}
                className="pl-8"
              />
            </div>
          </div>

          <div>
            <Select
              value={selectedRegion}
              onValueChange={(value) => {
                simulateLoading(() => {
                  setSelectedRegion(value);
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khu vực" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Miền Bắc">Miền Bắc</SelectItem>
                <SelectItem value="Miền Trung">Miền Trung</SelectItem>
                <SelectItem value="Miền Nam">Miền Nam</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select
              value={selectedDuration}
              onValueChange={(value) => {
                simulateLoading(() => {
                  setSelectedDuration(value);
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Số ngày" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 ngày</SelectItem>
                <SelectItem value="3">3 ngày</SelectItem>
                <SelectItem value="4">4 ngày</SelectItem>
                <SelectItem value="5">5 ngày</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(selectedRegion || selectedDuration || searchText) && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="flex items-center gap-1"
          >
            <FilterX className="h-4 w-4" />
            Xóa bộ lọc
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-purple-600 border-r-transparent border-b-purple-600 border-l-transparent animate-spin mb-4"></div>
          <h3 className="text-lg font-medium">Đang tải mẫu kế hoạch...</h3>
          <p className="text-muted-foreground mt-2">Vui lòng đợi trong giây lát</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Không tìm thấy mẫu kế hoạch nào phù hợp</h3>
          <p className="text-muted-foreground mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="relative h-40">
                <Image
                  src={template.image}
                  alt={template.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm h-7 w-7",
                    favorites.includes(template.id) ? "text-red-500" : "text-gray-600"
                  )}
                  onClick={(e) => toggleFavorite(template.id, e)}
                >
                  <Heart className={cn("h-4 w-4", favorites.includes(template.id) && "fill-current")} />
                </Button>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3">
                  <h3 className="text-white font-semibold text-sm line-clamp-1">{template.name}</h3>
                  <div className="flex items-center text-white/90 text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="truncate">{template.destination}</span>
                  </div>
                </div>
              </div>

              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{template.duration} ngày</span>
                  </div>

                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3 w-3",
                          i < Math.floor(template.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-1">
                  {template.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[9px] px-1.5 py-0 h-4">#{tag}</Badge>
                  ))}
                  {template.tags.length > 2 && (
                    <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4">+{template.tags.length - 2}</Badge>
                  )}
                </div>

                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{template.usageCount} lượt sử dụng</span>
                </div>
              </CardContent>

              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-200">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs px-3 bg-white/90 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTemplate(template);
                  }}
                >
                  <Download className="h-3.5 w-3.5 mr-1.5" />
                  Áp dụng
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesList;
