'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WeatherThemeComponent from '@/components/ui/theme-animation/weather';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
  }, []);

  return (
    <WeatherThemeComponent />
  );
}
