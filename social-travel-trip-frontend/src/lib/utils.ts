import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/vi';

// Configure dayjs
dayjs.extend(relativeTime);
dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.locale('vi');

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString('vi-VN', options);
}

export function getYearFromDate(dateString: string) {
  return new Date(dateString).getFullYear();
}

/**
 * Format message timestamp using dayjs
 * @param dateString - The timestamp string from database
 * @returns Formatted time string
 */
export function formatMessageTimestamp(dateString: string): string {
  if (!dateString) {
    return '';
  }

  try {
    // Parse the timestamp - dayjs handles various formats automatically
    const messageTime = dayjs.tz(dateString, 'Asia/Ho_Chi_Minh');
    const now = dayjs().tz('Asia/Ho_Chi_Minh');

    // If invalid date, return empty string
    if (!messageTime.isValid()) {
      console.warn('Invalid timestamp received:', dateString);
      return '';
    }

    // If message is from today, show only time
    if (messageTime.isSame(now, 'day')) {
      return messageTime.format('HH:mm');
    }

    // If message is from yesterday
    if (messageTime.isSame(now.subtract(1, 'day'), 'day')) {
      return `Hôm qua ${messageTime.format('HH:mm')}`;
    }

    // If message is from this week (within 7 days)
    if (messageTime.isAfter(now.subtract(7, 'day'))) {
      return messageTime.format('ddd HH:mm');
    }

    // If message is from this year
    if (messageTime.isSame(now, 'year')) {
      return messageTime.format('DD/MM HH:mm');
    }

    // For older messages, show full date
    return messageTime.format('DD/MM/YYYY HH:mm');
  } catch (error) {
    console.error('Error formatting timestamp:', dateString, error);
    return '';
  }
}

/**
 * Get relative time (e.g., "2 giờ trước")
 * @param dateString - The timestamp string from database
 * @returns Relative time string
 */
export function getRelativeTime(dateString: string): string {
  if (!dateString) {
    return '';
  }

  try {
    const messageTime = dayjs.tz(dateString, 'Asia/Ho_Chi_Minh');

    if (!messageTime.isValid()) {
      return '';
    }

    return messageTime.fromNow();
  } catch (error) {
    console.error('Error getting relative time:', dateString, error);
    return '';
  }
}

/**
 * Format timestamp for detailed view
 * @param dateString - The timestamp string from database
 * @returns Detailed formatted time string
 */
export function formatDetailedTimestamp(dateString: string): string {
  if (!dateString) {
    return '';
  }

  try {
    const messageTime = dayjs.tz(dateString, 'Asia/Ho_Chi_Minh');

    if (!messageTime.isValid()) {
      return '';
    }

    return messageTime.format('dddd, DD/MM/YYYY lúc HH:mm');
  } catch (error) {
    console.error('Error formatting detailed timestamp:', dateString, error);
    return '';
  }
}

/**
 * Check if timestamp is today
 * @param dateString - The timestamp string from database
 * @returns Boolean indicating if the date is today
 */
export function isToday(dateString: string): boolean {
  if (!dateString) {
    return false;
  }

  try {
    const messageTime = dayjs.tz(dateString, 'Asia/Ho_Chi_Minh');
    const now = dayjs().tz('Asia/Ho_Chi_Minh');

    return messageTime.isValid() && messageTime.isSame(now, 'day');
  } catch (error) {
    return false;
  }
}

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d);
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
