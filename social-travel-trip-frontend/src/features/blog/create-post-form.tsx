"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import { Icon } from "leaflet"
import { Button } from "@/components/ui/radix-ui/button"
import { Card, CardContent } from "@/components/ui/radix-ui/card"
import { Input } from "@/components/ui/radix-ui/input"
import { Textarea } from "@/components/ui/radix-ui/textarea"
import { CalendarIcon, MapPin, Plus, X, Search, Loader2 } from "lucide-react"
import { Calendar } from "@/components/ui/radix-ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/radix-ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/radix-ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/radix-ui/popover"
import { cn, formatDate } from "@/lib/utils"
// import { addNewLocation } from "@/lib/actions"
import { Badge } from "@/components/ui/radix-ui/badge"
import Image from "next/image"
import { toast } from "@/components/ui/radix-ui/use-toast"

// Form schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Tiêu đề phải có ít nhất 3 ký tự",
  }),
  slug: z
    .string()
    .min(3, {
      message: "Slug phải có ít nhất 3 ký tự",
    })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug chỉ được chứa chữ thường, số và dấu gạch ngang",
    }),
  description: z.string().min(10, {
    message: "Mô tả phải có ít nhất 10 ký tự",
  }),
  date: z.date({
    required_error: "Vui lòng chọn ngày",
  }),
  category: z.string({
    required_error: "Vui lòng chọn danh mục",
  }),
  rating: z.string().transform((val) => Number.parseInt(val)),
  highlights: z.array(z.string()).min(1, {
    message: "Vui lòng thêm ít nhất 1 điểm nổi bật",
  }),
  image: z.any().optional(),
})

// Component to fly to a location on the map
function FlyToLocation({ center }: any) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.flyTo(center, 12, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [center, map])

  return null
}

// Location picker component
function LocationPicker({ onLocationSelect, selectedLocation } : any) {
  const customIcon = new Icon({
    iconUrl: "/marker-icon.png",
    iconSize: [30, 41],
    iconAnchor: [15, 41],
    popupAnchor: [0, -41],
  })

  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        onLocationSelect({
          lat: e.latlng.lat,
          lng: e.latlng.lng,
        })
      },
    })
    return null
  }

  // Thêm state để kiểm tra nếu component đã mount
  const [isMounted, setIsMounted] = useState(false)

  // Thêm useEffect để đánh dấu component đã mount
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Trong phần render của LocationPicker, thêm kiểm tra:
  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border">
      {isMounted ? (
        <MapContainer center={[16.0, 108.0]} zoom={5} style={{ height: "100%", width: "100%" }} className="z-0">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler />
          {selectedLocation && (
            <>
              <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={customIcon} />
              <FlyToLocation center={[selectedLocation.lat, selectedLocation.lng]} />
            </>
          )}
        </MapContainer>
      ) : (
        <div className="h-full w-full flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
        </div>
      )}
    </div>
  )
}

export default function CreatePostForm() {
  const router = useRouter()
  const [selectedLocation, setSelectedLocation] = useState<any>(null)
  const [highlights, setHighlights] = useState<string[]>([])
  const [newHighlight, setNewHighlight] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any>([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef<any>(null)

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      category: "",
      rating: 5,
      highlights: [],
      date: new Date(),
    },
  })

  // Handle location selection
  const handleLocationSelect = (location: any) => {
    setSelectedLocation(location)
  }

  // Search for locations using Nominatim API
  const searchLocations = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`,
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Error searching for locations:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tìm kiếm địa điểm. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Select location from search results
  const selectLocationFromSearch = (result : any) => {
    const location = {
      lat: Number.parseFloat(result.lat),
      lng: Number.parseFloat(result.lon),
      displayName: result.display_name,
    } as any
    setSelectedLocation(location)
    setSearchResults([])
    setSearchQuery(result.display_name)
  }

  // Add highlight
  const addHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      const updatedHighlights = [...highlights, newHighlight.trim()]
      setHighlights(updatedHighlights)
      form.setValue("highlights", updatedHighlights)
      setNewHighlight("")
    }
  }

  // Remove highlight
  const removeHighlight = (highlight : any) => {
    const updatedHighlights = highlights.filter((h) => h !== highlight)
    setHighlights(updatedHighlights)
    form.setValue("highlights", updatedHighlights)
  }

  // Handle image upload
  const handleImageChange = (e : any) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)

      // Create preview
      const reader : any = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)

      form.setValue("image", file)
    }
  }

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!selectedLocation) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn vị trí trên bản đồ hoặc tìm kiếm địa điểm",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Format the date to ISO string
      const formattedDate = values.date.toISOString().split("T")[0]

      // Create new location object
      const newLocation = {
        id: Date.now(), // Generate a temporary ID
        title: values.title,
        slug: values.slug,
        lat: (selectedLocation as any).lat,
        lng: (selectedLocation as any).lng,
        date: formattedDate,
        image: "/placeholder.svg?height=300&width=500", // Placeholder image for now
        description: values.description,
        category: values.category,
        rating: values.rating,
        highlights: values.highlights,
      }

      // Add new location
      // await addNewLocation(newLocation)

      toast({
        title: "Thành công",
        description: "Bài viết đã được tạo và thêm vào bản đồ",
      })

      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo bài viết",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Generate slug from title
  const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()

    form.setValue("slug", slug)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Nhập tiêu đề bài viết"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e)
                            generateSlug(e.target.value)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="ten-bai-viet" {...field} />
                      </FormControl>
                      <FormDescription>URL của bài viết sẽ là /blog/slug</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Mô tả về địa điểm này" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày đi</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? formatDate(field.value.toISOString()) : <span>Chọn ngày</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={(date) => {
                                if (date) field.onChange(date)
                              }}
                              disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="biển">Biển</SelectItem>
                            <SelectItem value="núi">Núi</SelectItem>
                            <SelectItem value="di sản">Di sản</SelectItem>
                            <SelectItem value="sông nước">Sông nước</SelectItem>
                            <SelectItem value="thành phố">Thành phố</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Đánh giá</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn đánh giá" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 sao</SelectItem>
                          <SelectItem value="2">2 sao</SelectItem>
                          <SelectItem value="3">3 sao</SelectItem>
                          <SelectItem value="4">4 sao</SelectItem>
                          <SelectItem value="5">5 sao</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="highlights"
                  render={() => (
                    <FormItem>
                      <FormLabel>Điểm nổi bật</FormLabel>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Thêm điểm nổi bật"
                          value={newHighlight}
                          onChange={(e) => setNewHighlight(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addHighlight()
                            }
                          }}
                        />
                        <Button type="button" onClick={addHighlight} size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {highlights.map((highlight, index) => (
                          <Badge key={index} className="flex items-center gap-1">
                            {highlight}
                            <button
                              type="button"
                              onClick={() => removeHighlight(highlight)}
                              className="ml-1 hover:bg-primary-foreground rounded-full"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div>
                  <FormLabel className="block mb-2">Vị trí</FormLabel>
                  <div className="space-y-4">
                    {/* Thêm trường tìm kiếm địa điểm */}
                    <div className="relative">
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                          <Input
                            type="text"
                            placeholder="Tìm kiếm địa điểm..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                searchLocations()
                              }
                            }}
                          />
                        </div>
                        <Button type="button" onClick={searchLocations} disabled={isSearching || !searchQuery.trim()}>
                          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Tìm"}
                        </Button>
                      </div>

                      {/* Kết quả tìm kiếm */}
                      {searchResults.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                          {searchResults.map((result: any, index: any) => (
                            <div
                              key={index}
                              className="p-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                              onClick={() => selectLocationFromSearch(result)}
                            >
                              <div className="font-medium text-sm">{result.display_name}</div>
                              <div className="text-xs text-gray-500">{result.type}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <FormDescription>Tìm kiếm địa điểm hoặc nhấp vào bản đồ để chọn vị trí</FormDescription>

                    <LocationPicker onLocationSelect={handleLocationSelect} selectedLocation={selectedLocation} />

                    {selectedLocation && (
                      <div className="mt-2 text-sm text-muted-foreground flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>
                          Vị trí đã chọn: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <FormLabel className="block mb-2">Hình ảnh</FormLabel>
                  <FormDescription className="mb-2">Tải lên hình ảnh cho địa điểm của bạn</FormDescription>

                  <div
                    className={`border border-dashed rounded-md p-4 text-center cursor-pointer ${imagePreview ? "border-emerald-300 bg-emerald-50" : ""}`}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {imagePreview ? (
                      <div className="space-y-2">
                        <div className="relative h-40 w-full overflow-hidden rounded-md">
                          <Image
                          width={100}
                          height={100}
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-sm text-emerald-600">Nhấp để thay đổi hình ảnh</p>
                      </div>
                    ) : (
                      <>
                        <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                          <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Kéo và thả hình ảnh vào đây hoặc nhấp để chọn file
                        </div>
                        <div className="mt-2 text-xs text-muted-foreground">PNG, JPG hoặc WEBP (tối đa 4MB)</div>
                      </>
                    )}
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Đang tạo..." : "Tạo bài viết"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
