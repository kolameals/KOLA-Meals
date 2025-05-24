import { OrderStatus } from '@prisma/client';

export const orderValidation = {
  getOrderById: {
    params: {
      type: 'object',
      required: ['orderId'],
      properties: {
        orderId: { type: 'string', format: 'uuid' }
      }
    }
  },

  createOrder: {
    body: {
      type: 'object',
      required: ['items'],
      properties: {
        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['mealId', 'quantity'],
            properties: {
              mealId: { type: 'string', format: 'uuid' },
              quantity: { type: 'integer', minimum: 1 }
            }
          }
        },
        deliveryAddress: { type: 'string' },
        deliveryInstructions: { type: 'string' }
      }
    }
  },

  updateOrderStatus: {
    params: {
      type: 'object',
      required: ['orderId'],
      properties: {
        orderId: { type: 'string', format: 'uuid' }
      }
    },
    body: {
      type: 'object',
      required: ['status'],
      properties: {
        status: { 
          type: 'string',
          enum: Object.values(OrderStatus)
        }
      }
    }
  },

  cancelOrder: {
    params: {
      type: 'object',
      required: ['orderId'],
      properties: {
        orderId: { type: 'string', format: 'uuid' }
      }
    }
  }
};

export const createOrderSchema = {
  items: {
    type: 'array',
    items: {
      type: 'object',
      required: ['mealId', 'quantity'],
      properties: {
        mealId: { type: 'string', format: 'uuid' },
        quantity: { type: 'integer', minimum: 1 }
      }
    }
  },
  deliveryAddress: { type: 'string' },
  deliveryInstructions: { type: 'string' }
};

export const updateOrderSchema = {
  status: { 
    type: 'string',
    enum: Object.values(OrderStatus)
  }
}; 