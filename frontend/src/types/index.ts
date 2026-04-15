// ── User & Auth ─────────────────────────────────────────────
export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: 'customer' | 'staff' | 'manager' | 'admin';
  avatar: string | null;
  full_name: string;
  date_joined: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface Address {
  id: number;
  label: string;
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  is_default: boolean;
}

// ── Menu ────────────────────────────────────────────────────
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  display_order: number;
  is_active: boolean;
  item_count: number;
}

export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string | null;
  category: number;
  category_name: string;
  dietary_tags: string[];
  spice_level: number;
  calories: number | null;
  prep_time_minutes: number;
  is_available: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  average_rating: number;
  modifiers?: Modifier[];
}

export interface Modifier {
  id: number;
  name: string;
  price: number;
  is_available: boolean;
}

// ── Cart ────────────────────────────────────────────────────
export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  modifiers: Modifier[];
  specialInstructions: string;
}

// ── Orders ──────────────────────────────────────────────────
export type OrderStatus =
  | 'pending' | 'confirmed' | 'preparing' | 'ready'
  | 'out_for_delivery' | 'delivered' | 'picked_up' | 'cancelled';

export type OrderType = 'delivery' | 'pickup' | 'dine_in';

export interface Order {
  id: string;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  delivery_address: string;
  subtotal: number;
  tax: number;
  tip: number;
  delivery_fee: number;
  discount: number;
  total: number;
  items: OrderItem[];
  created_at: string;
  estimated_ready_time: string | null;
}

export interface OrderItem {
  id: number;
  menu_item: number;
  name: string;
  price: number;
  quantity: number;
  modifiers: { name: string; price: number }[];
  special_instructions: string;
  line_total: number;
}

// ── Reservations ────────────────────────────────────────────
export type ReservationStatus =
  | 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled' | 'no_show';

export interface Reservation {
  id: number;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  party_size: number;
  date: string;
  time: string;
  duration_minutes: number;
  special_requests: string;
  status: ReservationStatus;
  table: number | null;
  table_info: { number: number; capacity: number; location: string } | null;
  created_at: string;
}

export interface Table {
  id: number;
  number: number;
  capacity: number;
  location: string;
  is_active: boolean;
}

// ── Reviews ─────────────────────────────────────────────────
export interface Review {
  id: number;
  user: number;
  user_name: string;
  menu_item: number;
  menu_item_name: string;
  rating: number;
  title: string;
  comment: string;
  is_verified: boolean;
  created_at: string;
}

// ── Analytics ───────────────────────────────────────────────
export interface DashboardData {
  revenue: { total: number; last_30_days: number };
  orders: { today: number; last_7_days: number; pending: number };
  reservations: { today: number; upcoming: number };
  popular_items: { name: string; total_ordered: number }[];
  daily_revenue: { date: string; revenue: number; orders: number }[];
  average_rating: number;
}

// ── API ─────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
