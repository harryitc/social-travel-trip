import type { Metadata } from "next"
import ClientForm from "./client-form"

export const metadata: Metadata = {
  title: "Tạo bài viết mới",
  description: "Tạo bài viết mới cho blog du lịch của bạn",
}

export default function CreatePage() {
  return (
    <main className="min-h-screen">
      <header className="bg-emerald-600 text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold">Tạo bài viết mới</h1>
          <p className="text-emerald-100">Thêm địa điểm mới vào bản đồ du lịch của bạn</p>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4">
        <ClientForm />
      </div>
    </main>
  )
}
