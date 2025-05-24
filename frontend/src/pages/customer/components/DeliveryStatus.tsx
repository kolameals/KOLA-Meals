import React from 'react';

interface DeliveryPartner {
  id: string;
  name: string;
  phone: string;
  rating: number;
  currentLocation: string;
  estimatedArrival: string;
}

interface DeliveryStatus {
  id: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  status: 'preparing' | 'out_for_delivery' | 'delivered';
  partner: DeliveryPartner;
  trackingNumber: string;
}

const DeliveryStatus: React.FC = () => {
  // TODO: Fetch delivery status from API
  const currentDelivery: DeliveryStatus = {
    id: '1',
    mealType: 'lunch',
    status: 'out_for_delivery',
    partner: {
      id: '1',
      name: 'John Doe',
      phone: '+91 98765 43210',
      rating: 4.8,
      currentLocation: 'Near City Center',
      estimatedArrival: '12:45 PM',
    },
    trackingNumber: 'DEL123456',
  };

  const getStatusColor = (status: DeliveryStatus['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: DeliveryStatus['status']) => {
    switch (status) {
      case 'preparing':
        return 'Preparing your meal';
      case 'out_for_delivery':
        return 'Out for delivery';
      case 'delivered':
        return 'Delivered';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 capitalize">{currentDelivery.mealType} Delivery</h3>
          <p className="text-sm text-gray-500">Tracking Number: {currentDelivery.trackingNumber}</p>
        </div>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(currentDelivery.status)}`}>
          {getStatusText(currentDelivery.status)}
        </span>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-sm font-medium text-gray-900 mb-4">Delivery Partner</h4>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">{currentDelivery.partner.name}</p>
            <p className="text-sm text-gray-500">{currentDelivery.partner.phone}</p>
            <div className="flex items-center mt-1">
              <span className="text-sm text-gray-500 mr-2">Rating:</span>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(currentDelivery.partner.rating)
                        ? 'text-yellow-400'
                        : 'text-gray-300'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-1 text-sm text-gray-500">
                  {currentDelivery.partner.rating}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Current Location</p>
            <p className="text-sm font-medium text-gray-900">{currentDelivery.partner.currentLocation}</p>
            <p className="text-sm text-gray-500 mt-1">
              ETA: {currentDelivery.partner.estimatedArrival}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button
          className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => console.log('Contact delivery partner')}
        >
          Contact Delivery Partner
        </button>
      </div>
    </div>
  );
};

export default DeliveryStatus; 