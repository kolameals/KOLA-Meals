export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  mealsPerDay: number;
  description: string;
}

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  addressId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'cancelled' | 'expired';
  createdAt: Date;
  updatedAt: Date;
} 