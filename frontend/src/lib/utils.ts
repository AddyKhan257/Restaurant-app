import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export function formatTime(timeStr: string): string {
  const [h, m] = timeStr.split(':');
  const date = new Date();
  date.setHours(+h, +m);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  preparing: 'Preparing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  picked_up: 'Picked Up',
  cancelled: 'Cancelled',
};

export const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-orange-100 text-orange-800',
  ready: 'bg-green-100 text-green-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  picked_up: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export const DIETARY_ICONS: Record<string, string> = {
  vegetarian: '🥬',
  vegan: '🌱',
  gluten_free: 'GF',
  halal: '☪️',
  nut_free: '🥜✕',
  dairy_free: '🥛✕',
};

export const SPICE_LABELS = ['Not Spicy', 'Mild 🌶️', 'Medium 🌶️🌶️', 'Hot 🌶️🌶️🌶️', 'Extra Hot 🔥'];
