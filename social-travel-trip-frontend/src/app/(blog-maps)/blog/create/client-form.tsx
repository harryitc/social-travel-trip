"use client"

import dynamic from "next/dynamic"

// Sử dụng dynamic import để đảm bảo CreatePostForm chỉ được tải ở client
const CreatePostFormWithNoSSR = dynamic(() => import("@/features/blog/create-post-form"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto"></div>
        <p className="mt-4 text-emerald-600">Đang tải form...</p>
      </div>
    </div>
  ),
})

export default function ClientForm() {
  return <CreatePostFormWithNoSSR />
}
