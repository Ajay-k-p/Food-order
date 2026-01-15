export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: number;
  featured?: boolean;
  description?: string;
  address?: string;
  isActive?: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string | string[];
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  category: string;
  isVeg?: boolean;
  isBestseller?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending_payment' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered';
  createdAt: string;
  deliveryAddress: string;
  phoneNumber?: string;
  expectedDeliveryDate?: string;
  expectedDeliveryTime?: string;
  isRead?: boolean;
}
