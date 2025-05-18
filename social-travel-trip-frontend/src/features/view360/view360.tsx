'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';
// Bỏ import CSS vì nó không tồn tại trong package
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Maximize, Minimize, RotateCcw, ChevronLeft, ChevronRight, MapPin, ArrowRight } from 'lucide-react';

export interface PanoramaScene {
  id: string;
  name: string;
  image: string;
  description?: string;
  position?: {
    lat?: number;
    lng?: number;
  };
  // Các điểm liên kết đến các scene khác
  hotspots?: {
    id: string; // ID của scene đích
    name: string;
    position: { yaw: string; pitch: string }; // Vị trí của hotspot trên ảnh 360
    tooltip?: string;
  }[];
}

interface View360Props {
  scenes: PanoramaScene[];
  initialSceneId?: string;
  className?: string;
  height?: string;
  width?: string;
  fullscreenButton?: boolean;
  resetButton?: boolean;
  showSceneSelector?: boolean;
}

export const View360: React.FC<View360Props> = ({
  scenes,
  initialSceneId,
  className = '',
  height = '400px',
  width = '100%',
  fullscreenButton = true,
  resetButton = true,
  showSceneSelector = true,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(
    initialSceneId
      ? scenes.findIndex(scene => scene.id === initialSceneId)
      : 0
  );
  const viewerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Xử lý khi component unmount
  useEffect(() => {
    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch (error) {
          console.error('Error destroying viewer:', error);
        }
      }
    };
  }, []);

  // Xử lý khi nhấn nút fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Xử lý khi nhấn nút reset
  const handleReset = () => {
    if (viewerRef.current) {
      viewerRef.current.animate({
        yaw: 0,
        pitch: 0,
        zoom: 50,
        speed: '10rpm',
      });
    }
  };

  // Xử lý sự kiện fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Chuyển đến scene trước đó
  const goToPreviousScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    } else {
      setCurrentSceneIndex(scenes.length - 1);
    }
  };

  // Chuyển đến scene tiếp theo
  const goToNextScene = () => {
    if (currentSceneIndex < scenes.length - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    } else {
      setCurrentSceneIndex(0);
    }
  };

  // Chuyển đến scene cụ thể theo index
  const goToScene = (index: number) => {
    if (index >= 0 && index < scenes.length) {
      setCurrentSceneIndex(index);
    }
  };

  // Chuyển đến scene cụ thể theo ID
  const goToSceneById = (sceneId: string) => {
    const sceneIndex = scenes.findIndex(scene => scene.id === sceneId);
    if (sceneIndex !== -1) {
      setCurrentSceneIndex(sceneIndex);
    }
  };

  // Xử lý khi nhấp vào hotspot
  const handleHotspotClick = (hotspotId: string) => {
    // Chuyển đến scene khác trong cùng địa điểm
    goToSceneById(hotspotId);
  };

  // Lấy scene hiện tại
  const currentScene = scenes[currentSceneIndex];

  return (
    <Card className={`overflow-hidden border-purple-100 dark:border-purple-900 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xs ${className}`}>
      <CardContent className="p-0">
        <div ref={containerRef} className="relative">
          <div style={{ height, width }}>
            <ReactPhotoSphereViewer
              key={currentScene.id} // Quan trọng: key thay đổi khi scene thay đổi để re-render component
              ref={viewerRef}
              src={currentScene.image}
              height={isFullscreen ? '100vh' : height}
              width={width}
              littlePlanet={false}
              container={containerRef.current || undefined}
              plugins={[
                [MarkersPlugin, {
                  markers: currentScene.hotspots?.map(hotspot => ({
                    id: hotspot.id,
                    position: hotspot.position,
                    tooltip: {
                      content: hotspot.tooltip || hotspot.name,
                      position: 'bottom'
                    },
                    html: `
                      <div style="
                        display: flex;
                        align-items: center;
                        background-color: rgba(255, 255, 255, 0.8);
                        padding: 5px 10px;
                        border-radius: 20px;
                        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                        cursor: pointer;
                        transition: all 0.2s ease;
                      ">
                        <div style="
                          margin-right: 5px;
                          color: rgb(147, 51, 234);
                        ">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="m12 5 7 7-7 7"></path>
                          </svg>
                        </div>
                        <div style="
                          font-weight: 500;
                          font-size: 14px;
                        ">${hotspot.name}</div>
                      </div>
                    `,
                    data: { sceneId: hotspot.id }
                  })) || []
                }]
              ]}
              onReady={(instance) => {
                // Xử lý sự kiện click vào marker
                if (currentScene.hotspots && currentScene.hotspots.length > 0) {
                  const markersPlugin = instance.getPlugin(MarkersPlugin);
                  if (markersPlugin) {
                    markersPlugin.addEventListener('select-marker', (e: any) => {
                      if (e.marker && e.marker.data && e.marker.data.sceneId) {
                        handleHotspotClick(e.marker.data.sceneId);
                      }
                    });
                  }
                }
              }}
            />
          </div>



          {/* Scene Info */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-md flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-purple-600" />
              <span className="font-medium text-sm">{currentScene.name}</span>
            </div>

            {currentScene.description && (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1.5 rounded-md">
                <span className="text-sm">{currentScene.description}</span>
              </div>
            )}
          </div>

          {/* Scene Navigation */}
          {scenes.length > 1 && (
            <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 flex justify-between">
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={goToPreviousScene}
                title="Cảnh trước đó"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={goToNextScene}
                title="Cảnh tiếp theo"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {resetButton && (
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={handleReset}
                title="Đặt lại góc nhìn"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}

            {fullscreenButton && (
              <Button
                variant="outline"
                size="icon"
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                onClick={toggleFullscreen}
                title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
              >
                {isFullscreen ? (
                  <Minimize className="h-4 w-4" />
                ) : (
                  <Maximize className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          {/* Scene Selector */}
          {showSceneSelector && scenes.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {scenes.map((scene, index) => (
                <Button
                  key={scene.id}
                  variant={index === currentSceneIndex ? "default" : "outline"}
                  size="sm"
                  className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${
                    index === currentSceneIndex ? "bg-purple-600 text-white" : ""
                  }`}
                  onClick={() => goToScene(index)}
                >
                  {scene.name}
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default View360;
