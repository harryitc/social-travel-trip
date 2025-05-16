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
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold text-emerald-700 mb-6">Dòng thời gian du lịch</h2>

      {years.map((year) => (
        <div key={year} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 bg-emerald-100 inline-block px-4 py-1 rounded-full">{year}</h3>

          <div className="timeline-container">
            {locationsByYear[year].map((location) => (
              <div key={location.id} className="timeline-item">
                <Card className="shadow-md">
                  <CardContent className="p-0">
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg">{location.title}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{formatDate(location.date)}</span>
                          </div>
                        </div>
                        <Badge className="capitalize">{location.category}</Badge>
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
                            <Button variant="ghost" size="sm" onClick={() => setExpandedItem(null)}>
                              Thu gọn
                            </Button>
                            <a
                              href={`/blog/${location.slug}`}
                              className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
                            >
                              Đọc thêm →
                            </a>
                          </div>
                        </>
                      ) : (
                        <div className="mt-2">
                          <p className="text-gray-600 text-sm line-clamp-2">{location.description}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="mt-2 text-emerald-600 p-0 h-auto"
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
