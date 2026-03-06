export interface User {
  username: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  onboardingCompleted?: boolean;
}

export interface OrderItem {
  id: number;
  name: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  username: string;
  items: OrderItem[];
  total: string;
  paymentMethod: 'gcash' | 'cash';
  gcashNumber?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  receiptGenerated: boolean;
  riderInfo?: string; // JSON string
  createdAt: string;
}

export interface Staff {
  id: number;
  name: string;
  role: string;
  phone: string;
  schedule: Record<string, string>;
}

export interface Vendor {
  id: number;
  name: string;
  contactPerson: string;
  phone: string;
  itemsToBuy: { name: string; quantity: number }[];
}

export interface ProductStat {
  id: string; // Name
  category: string;
  totalSales: number;
  totalRevenue: number;
  lastSold: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  stock: number;
  minStock: number;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  category: 'Coffee' | 'Non-Coffee' | 'Refreshers' | 'Sea Salt Series' | 'Matcha Series' | 'Barista Drink' | 'Add-ons' | 'Pastry' | 'Meal';
  imageUrl: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  comment: string;
  avatar: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}