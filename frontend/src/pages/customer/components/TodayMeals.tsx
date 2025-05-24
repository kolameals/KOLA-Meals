import React from 'react';

interface Meal {
  id: string;
  type: 'breakfast' | 'lunch' | 'dinner';
  name: string;
  description: string;
  calories: number;
  image: string;
  status: 'scheduled' | 'delivered' | 'skipped';
  deliveryTime: string;
}

const TodayMeals: React.FC = () => {
  // TODO: Fetch meals from API
  const meals: Meal[] = [
    {
      id: '1',
      type: 'breakfast',
      name: 'Healthy Breakfast Bowl',
      description: 'Oatmeal with fresh fruits and nuts',
      calories: 450,
      image: '/images/breakfast.jpg',
      status: 'scheduled',
      deliveryTime: '08:00 AM',
    },
    {
      id: '2',
      type: 'lunch',
      name: 'Grilled Chicken Salad',
      description: 'Fresh greens with grilled chicken and vinaigrette',
      calories: 550,
      image: '/images/lunch.jpg',
      status: 'scheduled',
      deliveryTime: '12:30 PM',
    },
    {
      id: '3',
      type: 'dinner',
      name: 'Vegetable Pasta',
      description: 'Whole wheat pasta with seasonal vegetables',
      calories: 600,
      image: '/images/dinner.jpg',
      status: 'scheduled',
      deliveryTime: '07:00 PM',
    },
  ];

  const getStatusColor = (status: Meal['status']) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'skipped':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
        {meals.map((meal) => (
          <div key={meal.id} className="border rounded-lg overflow-hidden">
            <div className="aspect-w-16 aspect-h-9 bg-gray-200">
              {/* TODO: Add actual image */}
              <div className="w-full h-48 bg-gray-200" />
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{meal.name}</h3>
                  <p className="text-sm text-gray-500">{meal.description}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(meal.status)}`}>
                  {meal.status}
                </span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <p>Calories: {meal.calories}</p>
                  <p>Delivery: {meal.deliveryTime}</p>
                </div>
                <button
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  onClick={() => console.log('View details:', meal.id)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodayMeals; 