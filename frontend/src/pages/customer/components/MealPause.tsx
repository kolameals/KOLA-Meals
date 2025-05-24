import React, { useState } from 'react';

interface PauseRequest {
  id: string;
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  status: 'pending' | 'approved' | 'rejected';
}

const MealPause: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | ''>('');
  const [pauseRequests, setPauseRequests] = useState<PauseRequest[]>([
    {
      id: '1',
      date: '2024-03-20',
      mealType: 'lunch',
      status: 'approved',
    },
    {
      id: '2',
      date: '2024-03-21',
      mealType: 'dinner',
      status: 'pending',
    },
  ]);

  const remainingSkips = 5 - pauseRequests.filter(req => req.status === 'approved').length;

  const handlePauseRequest = async () => {
    if (!selectedDate || !selectedMeal) return;

    try {
      // TODO: API call to request meal pause
      const newRequest: PauseRequest = {
        id: Date.now().toString(),
        date: selectedDate,
        mealType: selectedMeal as 'breakfast' | 'lunch' | 'dinner',
        status: 'pending',
      };

      setPauseRequests([...pauseRequests, newRequest]);
      setSelectedDate('');
      setSelectedMeal('');
    } catch (error) {
      console.error('Error requesting meal pause:', error);
    }
  };

  const getStatusColor = (status: PauseRequest['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900">Skip a Meal</h3>
        <p className="mt-1 text-sm text-gray-500">
          You have {remainingSkips} meal skips remaining this month
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label htmlFor="meal" className="block text-sm font-medium text-gray-700">
            Meal Type
          </label>
          <select
            id="meal"
            value={selectedMeal}
            onChange={(e) => setSelectedMeal(e.target.value as 'breakfast' | 'lunch' | 'dinner')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">Select a meal</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={handlePauseRequest}
            disabled={!selectedDate || !selectedMeal || remainingSkips <= 0}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Request Skip
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Skip Requests</h3>
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
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pauseRequests.map((request) => (
                <tr key={request.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(request.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                    {request.mealType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MealPause; 