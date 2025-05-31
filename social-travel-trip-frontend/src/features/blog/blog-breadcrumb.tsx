"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home, Map, Clock, Plus, BookOpen } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/radix-ui/breadcrumb";

interface BlogBreadcrumbProps {
  title?: string;
  customItems?: Array<{
    label: string;
    href?: string;
  }>;
}

export function BlogBreadcrumb({ title, customItems }: BlogBreadcrumbProps) {
  const pathname = usePathname();

  const getBreadcrumbItems = () => {
    if (customItems) {
      return [
        { label: "Trang chủ", href: "/", icon: Home },
        ...customItems.map(item => ({ ...item, icon: BookOpen }))
      ];
    }

    const items = [
      { label: "Trang chủ", href: "/", icon: Home }
    ];

    if (pathname.includes("/blog")) {
      items.push({ label: "Blog", href: "/blog", icon: BookOpen });

      if (pathname.includes("/create")) {
        items.push({ label: "Tạo bài viết", icon: Plus });
      } else if (pathname.match(/\/blog\/[^\/]+$/)) {
        items.push({ label: title || "Chi tiết bài viết", icon: BookOpen });
      }
    }

    return items;
  };

  const breadcrumbItems = getBreadcrumbItems();

  return (
    <div className="mb-6">
      <Breadcrumb>
        <BreadcrumbList className="text-sm">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const Icon = item.icon;

            return (
              <div key={index} className="flex items-center">
                <BreadcrumbItem>
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-medium">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200 transition-colors"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>
                    <ChevronRight className="h-4 w-4 text-purple-400" />
                  </BreadcrumbSeparator>
                )}
              </div>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
