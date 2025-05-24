import { DeliveryStatusEnum, OldTiffinStatusEnum, OrderStatus } from '@prisma/client';

export {
  DeliveryStatusEnum,
  OldTiffinStatusEnum,
  OrderStatus
};

export const DELIVERY_STATUS = {
  PENDING: DeliveryStatusEnum.PENDING,
  ASSIGNED: DeliveryStatusEnum.ASSIGNED,
  PICKED_UP: DeliveryStatusEnum.PICKED_UP,
  DELIVERED: DeliveryStatusEnum.DELIVERED,
  FAILED: DeliveryStatusEnum.FAILED
} as const;

export const OLD_TIFFIN_STATUS = {
  NEW: OldTiffinStatusEnum.NEW,
  USED: OldTiffinStatusEnum.USED,
  DAMAGED: OldTiffinStatusEnum.DAMAGED,
  LOST: OldTiffinStatusEnum.LOST
} as const;

export const ORDER_STATUS = {
  PENDING: OrderStatus.PENDING,
  CONFIRMED: OrderStatus.CONFIRMED,
  PREPARING: OrderStatus.PREPARING,
  READY_FOR_DELIVERY: OrderStatus.READY_FOR_DELIVERY,
  OUT_FOR_DELIVERY: OrderStatus.OUT_FOR_DELIVERY,
  DELIVERED: OrderStatus.DELIVERED,
  CANCELLED: OrderStatus.CANCELLED
} as const; 