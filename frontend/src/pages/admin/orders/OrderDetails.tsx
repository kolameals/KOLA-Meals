import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import type { Order, OrderStatus } from '../../../types/order.types';
import { fetchOrderById, updateOrderStatus } from '../../../store/slices/orderSlice';

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder: order, loading, error } = useSelector((state: RootState) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (orderId) {
      try {
        await dispatch(updateOrderStatus({ orderId, status: newStatus })).unwrap();
      } catch (error) {
        console.error('Failed to update order status:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      CONFIRMED: 'bg-blue-100 text-blue-800',
      PREPARING: 'bg-purple-100 text-purple-800',
      READY_FOR_DELIVERY: 'bg-indigo-100 text-indigo-800',
      OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-600">Error: {error || 'Order not found'}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
        <button
          onClick={() => navigate('/admin/orders')}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Back to Orders
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Order Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Order ID:</span> {order.id}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </p>
              <p><span className="font-medium">Amount:</span> ₹{order.amount}</p>
              <p><span className="font-medium">Date:</span> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
              <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
              <p><span className="font-medium">Phone:</span> {order.customerPhone}</p>
              {order.deliveryAddress && (
                <p><span className="font-medium">Delivery Address:</span> {order.deliveryAddress}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Update Order Status</h2>
        <div className="flex space-x-4">
          {Object.values(OrderStatus).map((status) => (
            <button
              key={status}
              onClick={() => handleStatusChange(status)}
              disabled={order.status === status}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                order.status === status
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Order Items</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {order.items.map((item) => (
              <tr key={item.mealId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails; 