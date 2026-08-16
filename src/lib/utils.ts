import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDistanceToNow, isToday, isYesterday, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatLastTouched(iso: string): string {
  const date = new Date(iso);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatFullDate(iso: string): string {
  return format(new Date(iso), 'MMM d, yyyy · h:mm a');
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}
