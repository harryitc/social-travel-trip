"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/radix-ui/card"
import { Badge } from "@/components/ui/radix-ui/badge"
import { Button } from "@/components/ui/button"
import { formatDate, getYearFromDate } from "@/lib/utils"
import { travelData } from "@/lib/travel-data"
import { MapPin } from "lucide-react"

export default function TravelTimeline() {
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  // Sort locations by date (newest first)
  const sortedLocations = [...travelData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // Group locations by year
  const locationsByYear = sortedLocations.reduce(
    (acc, location) => {
      const year = getYearFromDate(location.date)
      if (!acc[year]) {
        acc[year] = []
      }
      acc[year].push(location)
      return acc
    },
    {} as Record<string, typeof travelData>,
  )

  // Get years in descending order
  const years = Object.keys(locationsByYear).sort((a, b) => Number.parseInt(b) - Number.parseInt(a))

  return (
    <div className="space-y-6">
      {years.map((year) => (
        <div key={year} className="space-y-4">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-purple-800 dark:text-purple-300 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700">
              {year}
            </h3>
            <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent dark:from-purple-700"></div>
          </div>

          <div className="space-y-3">
            {locationsByYear[year].map((location) => (
              <div key={location.id} className="group">
                <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-purple-100 dark:border-purple-900 hover:border-purple-200 dark:hover:border-purple-700">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="font-bold text-lg text-purple-800 dark:text-purple-300 group-hover:text-purple-900 dark:group-hover:text-purple-200 transition-colors">
                            {location.title}
                          </h4>
                          <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{formatDate(location.date)}</span>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="capitalize border-purple-200 text-purple-700 bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:bg-purple-900/30"
                        >
                          {location.category}
                        </Badge>
                      </div>

                      {expandedItem === location.id ? (
                        <>
                          <div className="mt-4">
                            <div className="aspect-video rounded-md overflow-hidden mb-3">
                              <img
                                src={location.image || "/placeholder.svg"}
                                alt={location.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <p className="text-gray-600">{location.description}</p>
                            {location.highlights && (
                              <div className="mt-3">
                                <p className="font-medium text-sm">Điểm nổi bật:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {location.highlights.map((highlight, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {highlight}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-between items-center mt-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setExpandedItem(null)}
                              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300"
                            >
                              Thu gọn
                            </Button>
                            <a
                              href={`/blog/${location.slug}`}
                              className="text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 flex items-center gap-1 group"
                            >
                              Đọc thêm
                              <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className="mt-2">
                          <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{location.description}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:text-purple-400 dark:hover:text-purple-300 p-0 h-auto"
                            onClick={() => setExpandedItem(location.id)}
                          >
                            Xem thêm
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
