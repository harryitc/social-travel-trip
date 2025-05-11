'use client';

import { useState } from 'react';
// import Map, { Marker, Popup } from 'react-map-gl';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/radix-ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

type MemoryLocation = {
  id: string;
  title: string;
  image: string;
  location: string;
  coordinates: [number, number];
  date: Date;
  tags: string[];
  isFavorite: boolean;
};

const DEMO_LOCATIONS: MemoryLocation[] = [
  {
    id: '1',
    title: 'Hoàng hôn Đà Lạt',
    image: 'https://images.pexels.com/photos/5746250/pexels-photo-5746250.jpeg',
    location: 'Đà Lạt, Lâm Đồng',
    coordinates: [108.4583, 11.9404], // Đà Lạt coordinates
    date: new Date('2024-03-15'),
    tags: ['DaLat', 'HoangHon', 'ThienNhien'],
    isFavorite: true,
  },
  {
    id: '2',
    title: 'Sapa mùa đông',
    image: 'https://images.pexels.com/photos/4350383/pexels-photo-4350383.jpeg',
    location: 'Sapa, Lào Cai',
    coordinates: [103.8437, 22.3364], // Sapa coordinates
    date: new Date('2024-02-20'),
    tags: ['Sapa', 'PhuongBac', 'MuaDong'],
    isFavorite: false,
  },
  {
    id: '3',
    title: 'Biển Phú Quốc',
    image: 'https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg',
    location: 'Phú Quốc, Kiên Giang',
    coordinates: [103.9567, 10.2896], // Phú Quốc coordinates
    date: new Date('2024-01-10'),
    tags: ['PhuQuoc', 'Bien', 'MuaHe'],
    isFavorite: true,
  },
];

export function MapView() {
  const [viewState, setViewState] = useState({
    longitude: 106.6297,
    latitude: 10.8231,
    zoom: 5,
  });
  const [selectedLocation, setSelectedLocation] = useState<MemoryLocation | null>(null);
  const [locations] = useState<MemoryLocation[]>(DEMO_LOCATIONS);

  return (
    <>
      map view ne
    </>
    // <div className="h-[calc(100vh-20rem)] rounded-lg overflow-hidden border border-purple-100 dark:border-purple-900">
    //   <Map
    //     {...viewState}
    //     onMove={evt => setViewState(evt.viewState)}
    //     mapStyle="mapbox://styles/mapbox/streets-v11"
    //     mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    //   >
    //     {locations.map((location) => (
    //       <Marker
    //         key={location.id}
    //         longitude={location.coordinates[0]}
    //         latitude={location.coordinates[1]}
    //         anchor="bottom"
    //         onClick={e => {
    //           e.originalEvent.stopPropagation();
    //           setSelectedLocation(location);
    //         }}
    //       >
    //         <div className="cursor-pointer transform transition-transform hover:scale-110">
    //           <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-lg">
    //             {/* eslint-disable-next-line */}
    //             <img
    //               src={location.image}
    //               alt={location.title}
    //               className="w-full h-full object-cover"
    //             />
    //           </div>
    //         </div>
    //       </Marker>
    //     ))}

    //     {selectedLocation && (
    //       <Popup
    //         longitude={selectedLocation.coordinates[0]}
    //         latitude={selectedLocation.coordinates[1]}
    //         anchor="bottom"
    //         onClose={() => setSelectedLocation(null)}
    //         closeButton={true}
    //         closeOnClick={false}
    //       >
    //         <Card className="w-64 border-none shadow-none">
    //           <div className="aspect-video rounded-t-lg overflow-hidden">
    //             {/* eslint-disable-next-line */}
    //             <img
    //               src={selectedLocation.image}
    //               alt={selectedLocation.title}
    //               className="w-full h-full object-cover"
    //             />
    //           </div>
    //           <CardContent className="p-3">
    //             <h3 className="font-medium mb-1">{selectedLocation.title}</h3>
    //             <div className="text-sm text-muted-foreground mb-2">
    //               <div className="flex items-center">
    //                 <Calendar className="h-4 w-4 mr-1" />
    //                 {format(selectedLocation.date, 'dd/MM/yyyy', { locale: vi })}
    //               </div>
    //             </div>
    //             <div className="flex flex-wrap gap-1 mb-2">
    //               {selectedLocation.tags.map((tag) => (
    //                 <Badge 
    //                   key={tag} 
    //                   variant="outline"
    //                   className="text-xs bg-purple-100/50 hover:bg-purple-200/50 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-800/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
    //                 >
    //                   #{tag}
    //                 </Badge>
    //               ))}
    //             </div>
    //             <Button 
    //               variant="ghost" 
    //               size="sm" 
    //               className={`w-full ${selectedLocation.isFavorite ? 'text-red-500' : ''}`}
    //             >
    //               <Heart className={`h-4 w-4 mr-1 ${selectedLocation.isFavorite ? 'fill-red-500' : ''}`} />
    //               {selectedLocation.isFavorite ? 'Đã thích' : 'Thích'}
    //             </Button>
    //           </CardContent>
    //         </Card>
    //       </Popup>
    //     )}
    //   </Map>
    // </div>
  );
}