export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  READY_FOR_DELIVERY = 'READY_FOR_DELIVERY',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export interface OrderItem {
  mealId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  amount: number;
  status: OrderStatus;
  deliveryAddress?: string;
  deliveryInstructions?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: {
    mealId: string;
    quantity: number;
  }[];
  deliveryAddress?: string;
  deliveryInstructions?: string;
}

export interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export interface UpdateOrderStatusPayload {
  orderId: string;
  status: OrderStatus;
} 