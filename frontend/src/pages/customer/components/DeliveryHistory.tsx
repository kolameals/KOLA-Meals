import React from 'react';

interface DeliveryHistoryItem {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  status: 'delivered' | 'cancelled';
  partner: {
    name: string;
    rating: number;
  };
  rating: number | null;
}

const DeliveryHistory: React.FC = () => {
  // TODO: Fetch delivery history from API
  const deliveryHistory: DeliveryHistoryItem[] = [
    {
      id: '1',
      date: '2024-03-19',
      mealType: 'lunch',
      status: 'delivered',
      partner: {
        name: 'John Doe',
        rating: 4.8,
      },
      rating: 5,
    },
    {
      id: '2',
      date: '2024-03-19',
      mealType: 'dinner',
      status: 'delivered',
      partner: {
        name: 'Jane Smith',
        rating: 4.9,
      },
      rating: 4,
    },
    {
      id: '3',
      date: '2024-03-18',
      mealType: 'breakfast',
      status: 'cancelled',
      partner: {
        name: 'Mike Johnson',
        rating: 4.7,
      },
      rating: null,
    },
  ];

  const getStatusColor = (status: DeliveryHistoryItem['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Meal
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Partner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {deliveryHistory.map((delivery) => (
              <tr key={delivery.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(delivery.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {delivery.mealType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{delivery.partner.name}</div>
                      <div className="text-sm text-gray-500">
                        Rating: {delivery.partner.rating}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                    {delivery.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {delivery.rating ? (
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < delivery.rating! ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  ) : (
                    <button
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      onClick={() => console.log('Rate delivery:', delivery.id)}
                    >
                      Rate Delivery
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DeliveryHistory; 