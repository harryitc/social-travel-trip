import React, { useState, ChangeEvent } from 'react';
import { TravelPlanTemplate, TRAVEL_PLAN_TEMPLATES } from './mock-data';
import { EditableTemplateDetailsPage } from './EditableTemplateDetailsPage';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

  // Reset filters
  const resetFilters = () => {
    setSearchText('');
    setSelectedRegion(undefined);
    setSelectedDuration(undefined);
  };

  // Handle search input change
  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // If a template is selected, show its details
  if (selectedTemplate) {
    return (
      <div>
        <EditableTemplateDetailsPage
          template={selectedTemplate}
          onBack={() => setSelectedTemplate(null)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Mẫu kế hoạch du lịch</h2>
        <p className="text-muted-foreground">
          Chọn một mẫu kế hoạch du lịch để áp dụng cho chuyến đi của bạn. Các mẫu này đã được chuẩn bị sẵn với lịch trình chi tiết.
        </p>
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
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
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
            <Select value={selectedDuration} onValueChange={setSelectedDuration}>
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

      {filteredTemplates.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <SearchIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">Không tìm thấy mẫu kế hoạch nào phù hợp</h3>
          <p className="text-muted-foreground mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <Card
              key={template.id}
              className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTemplate(template)}
            >
              <div className="relative h-48">
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
                    "absolute top-2 right-2 rounded-full bg-white/80 backdrop-blur-sm",
                    favorites.includes(template.id) ? "text-red-500" : "text-gray-600"
                  )}
                  onClick={(e) => toggleFavorite(template.id, e)}
                >
                  <Heart className={cn("h-5 w-5", favorites.includes(template.id) && "fill-current")} />
                </Button>
              </div>

              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-lg line-clamp-1">{template.name}</h3>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{template.destination}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{template.duration} ngày</span>
                  </div>

                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(template.rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {template.description}
                </p>

                <div className="flex flex-wrap gap-1 pt-1">
                  {template.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
                <span className="text-xs text-muted-foreground">{template.usageCount} lượt sử dụng</span>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        className="gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTemplate(template);
                        }}
                      >
                        <Download className="h-4 w-4" />
                        Áp dụng
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Áp dụng mẫu này</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesList;
