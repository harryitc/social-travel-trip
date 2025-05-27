import type { Metadata } from "next"
import ClientForm from "./client-form"
import { BlogBreadcrumb } from "@/features/blog/blog-breadcrumb"
import { Card, CardContent } from "@/components/ui/radix-ui/card"
import { PenTool, MapPin, Camera, Tags } from "lucide-react"

export const metadata: Metadata = {
  title: "Tạo bài viết mới",
  description: "Tạo bài viết mới cho blog du lịch của bạn",
}

export default function CreatePage() {
  return (
    <div className="w-full space-y-6">
      <BlogBreadcrumb
        customItems={[
          { label: "Blog", href: "/blog" },
          { label: "Tạo bài viết" }
        ]}
      />

      {/* Header Section */}
      <div className="bg-gradient-to-br from-purple-100 via-blue-50 to-cyan-100 dark:from-purple-900/30 dark:via-blue-900/20 dark:to-cyan-900/30 rounded-2xl p-6 shadow-lg border border-purple-200/50 dark:border-purple-700/30">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-200/60 to-blue-200/60 dark:from-purple-700/30 dark:to-blue-700/30 rounded-full">
              <PenTool className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Tạo bài viết mới
              </h1>
              <p className="text-purple-600/80 dark:text-purple-300/80 text-lg">
                Thêm địa điểm mới vào bản đồ du lịch của bạn
              </p>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="flex items-center gap-3 bg-white/40 dark:bg-gray-800/40 rounded-lg p-3 backdrop-blur-sm border border-purple-200/30 dark:border-purple-700/20">
              <MapPin className="h-5 w-5 text-purple-500/80 dark:text-purple-400/80" />
              <div>
                <p className="font-medium text-sm text-purple-700/90 dark:text-purple-300/90">Chọn địa điểm</p>
                <p className="text-xs text-purple-600/70 dark:text-purple-400/70">Đánh dấu vị trí trên bản đồ</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/40 dark:bg-gray-800/40 rounded-lg p-3 backdrop-blur-sm border border-blue-200/30 dark:border-blue-700/20">
              <Camera className="h-5 w-5 text-blue-500/80 dark:text-blue-400/80" />
              <div>
                <p className="font-medium text-sm text-blue-700/90 dark:text-blue-300/90">Thêm hình ảnh</p>
                <p className="text-xs text-blue-600/70 dark:text-blue-400/70">Tải lên ảnh đẹp nhất</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/40 dark:bg-gray-800/40 rounded-lg p-3 backdrop-blur-sm border border-cyan-200/30 dark:border-cyan-700/20">
              <Tags className="h-5 w-5 text-cyan-500/80 dark:text-cyan-400/80" />
              <div>
                <p className="font-medium text-sm text-cyan-700/90 dark:text-cyan-300/90">Gắn thẻ</p>
                <p className="text-xs text-cyan-600/70 dark:text-cyan-400/70">Giúp mọi người tìm thấy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-6xl mx-auto">
        <Card className="border-purple-200/30 dark:border-purple-700/20 shadow-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <ClientForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
