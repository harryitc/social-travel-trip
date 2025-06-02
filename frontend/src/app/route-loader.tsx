"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import FloatingBubblesBackground from "@/components/ui/bubble-loading";

export default function RouteLoader() {
  return null;
  // const pathname = usePathname();
  // const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);

  //   const timeout = setTimeout(() => {
  //     setLoading(false);
  //   }, 500); // fake loading time hoặc có thể dùng AbortSignal nếu cần thực tế

  //   return () => clearTimeout(timeout);
  // }, [pathname]);

  // if (!loading) return null;

  // return (
  //   <FloatingBubblesBackground title="" key={'1'} />
  // );
}
