"use client";

import { useState, useEffect, useMemo } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  useMap,
} from "react-leaflet";
import { Icon, divIcon } from "leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Map, Calendar, Tag } from "lucide-react";
import { Badge } from "@/components/ui/radix-ui/badge";
import { travelData } from "@/lib/travel-data";
import { formatDate } from "@/lib/utils";

// Leaflet CSS needs to be imported on the client side
import "leaflet/dist/leaflet.css";
import Image from "next/image";

// Component to fly to a location
function FlyToLocation({ center }: any) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, {
        animate: true,
        duration: 1.5,
      });
    }
  }, [center, map]);
  return null;
}

export default function TravelMap() {
  const [isMounted, setIsMounted] = useState<any>(false);
  const [searchTerm, setSearchTerm] = useState<any>("");
  const [selectedCategory, setSelectedCategory] = useState<any>("all");
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<any>([16.0, 108.0]);
  const [activeYear, setActiveYear] = useState<any>("all");

  // Extract unique categories and years from travel data
  const categories = useMemo(() => {
    const cats = new Set(travelData.map((location) => location.category));
    return ["all", ...Array.from(cats)];
  }, []);

  const years = useMemo(() => {
    const yrs = new Set(
      travelData.map((location) =>
        new Date(location.date).getFullYear().toString()
      )
    );
    return ["all", ...Array.from(yrs)];
  }, []);

  // Filter locations based on search term, category, and year
  const filteredLocations = useMemo(() => {
    return travelData.filter((location) => {
      const matchesSearch =
        location.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || location.category === selectedCategory;
      const locationYear = new Date(location.date).getFullYear().toString();
      const matchesYear = activeYear === "all" || locationYear === activeYear;

      return matchesSearch && matchesCategory && matchesYear;
    });
  }, [searchTerm, selectedCategory, activeYear]);

  // Custom marker icon
  const customIcon = new Icon({
    iconUrl: "/marker-icon.png",
    iconSize: [30, 41],
    iconAnchor: [15, 41],
    popupAnchor: [0, -41],
  });

  // Create custom cluster icon
  const createClusterCustomIcon = (cluster: any) =>
    divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: [40, 40],
    });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle location selection from the sidebar
  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location);
    setMapCenter([location.lat, location.lng]);
  };

  if (!isMounted) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-emerald-600">Đang tải bản đồ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-full">
      {/* Sidebar for search and filters */}
      <div className="w-full md:w-80 bg-white border-r p-4 overflow-y-auto">
        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Tìm kiếm địa điểm..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-1.5">
              <Tag className="h-4 w-4" />
              Danh mục
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? "default" : "outline"
                  }
                  className="cursor-pointer capitalize"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2 flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              Năm
            </h3>
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <Badge
                  key={year}
                  variant={activeYear === year ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setActiveYear(year)}
                >
                  {year === "all" ? "Tất cả" : year}
                </Badge>
              ))}
            </div>
          </div>

          {/* Location list */}
          <div>
            <h3 className="font-medium mb-2 flex items-center gap-1.5">
              <Map className="h-4 w-4" />
              Địa điểm ({filteredLocations.length})
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
              {filteredLocations.length > 0 ? (
                filteredLocations.map((location) => (
                  <div
                    key={location.id}
                    className={`p-2 rounded-md cursor-pointer transition-colors ${
                      selectedLocation?.id === location.id
                        ? "bg-emerald-100 border-emerald-300 border"
                        : "hover:bg-gray-100 border border-transparent"
                    }`}
                    onClick={() => handleLocationSelect(location)}
                  >
                    <div className="font-medium text-sm">{location.title}</div>
                    <div className="text-xs text-gray-500">
                      {formatDate(location.date)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Không tìm thấy địa điểm nào
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={mapCenter}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          className="z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />

          {/* Fly to selected location */}
          {selectedLocation && (
            <FlyToLocation
              center={[selectedLocation.lat, selectedLocation.lng]}
            />
          )}

          {/* Marker cluster group */}
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
          >
            {filteredLocations.map((location) => (
              <Marker
                key={location.id}
                position={[location.lat, location.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => {
                    setSelectedLocation(location);
                  },
                }}
              >
                <Popup className="leaflet-popup-custom">
                  <Card className="border-0 shadow-none">
                    <CardContent className="p-0">
                      <div className="relative h-40 w-full overflow-hidden">
                        <Image
                          width={100}
                          height={100}
                          src={location.image || "/placeholder.svg"}
                          alt={location.title}
                          className="object-cover w-full h-full"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/70 to-transparent p-3">
                          <h3 className="text-white font-bold text-lg">
                            {location.title}
                          </h3>
                          <p className="text-white/80 text-sm">
                            {formatDate(location.date)}
                          </p>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-center gap-1 mb-2">
                          <Badge className="capitalize">
                            {location.category}
                          </Badge>
                          {location.rating && (
                            <div className="flex items-center text-amber-500 text-xs">
                              {"★".repeat(location.rating)}
                              {"☆".repeat(5 - location.rating)}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {location.description}
                        </p>
                        <div className="flex justify-between items-center mt-3">
                          <a
                            href={`/blog/${location.slug}`}
                            className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                          >
                            Đọc thêm →
                          </a>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(
                                `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`,
                                "_blank"
                              );
                            }}
                          >
                            Chỉ đường
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}
