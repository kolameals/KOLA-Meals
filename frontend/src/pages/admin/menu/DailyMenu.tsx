import React, { useState, useEffect } from 'react';
import type { DailyMenu as DailyMenuType, MenuItem, CreateMenuItemDto, UpdateMenuItemDto, MealType } from '../../../types/menu.types';
import { menuService, MenuNotFoundError } from '../../../services/menu.service';
import { format, parseISO } from 'date-fns';

interface DailyMenuProps {
  dailyMenu: DailyMenuType | null;
  onUpdate: (menu: DailyMenuType) => void;
}

const DailyMenu: React.FC<DailyMenuProps> = ({ dailyMenu, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<CreateMenuItemDto>({
    mealId: '',
    price: 0,
    isAvailable: true,
    dayOfWeek: new Date().getDay(),
    mealType: 'LUNCH' as MealType,
    dailyMenuId: dailyMenu?.id || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [menuNotFound, setMenuNotFound] = useState(false);
  const [meals, setMeals] = useState<any[]>([]);

  useEffect(() => {
    const initializeDailyMenu = async () => {
      if (!dailyMenu) {
        try {
          setLoading(true);
          setError(null);
          setMenuNotFound(false);
          const today = new Date();
          const newDailyMenu = await menuService.getDailyMenuByDate(today);
          onUpdate(newDailyMenu);
        } catch (error) {
          console.error('Caught error:', error);
          if (error instanceof MenuNotFoundError) {
            console.log('Menu not found error caught');
            setMenuNotFound(true);
            setError(null);
          } else {
            console.error('Other error caught:', error);
            setError('Failed to fetch daily menu');
            setMenuNotFound(false);
          }
        } finally {
          setLoading(false);
        }
      }
    };

    initializeDailyMenu();
  }, [dailyMenu, onUpdate]);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const mealsData = await menuService.getMeals();
        setMeals(mealsData);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };
    fetchMeals();
  }, []);

  const handleCreateMenu = async () => {
    try {
      setLoading(true);
      setError(null);
      const today = new Date();
      const newDailyMenu = await menuService.createDailyMenu({
        date: today.toISOString(),
        items: [],
      });
      onUpdate(newDailyMenu);
      setMenuNotFound(false);
    } catch (error) {
      console.error('Error creating daily menu:', error);
      setError('Failed to create daily menu');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setMenuNotFound(false);
    const today = new Date();
    menuService.getDailyMenuByDate(today)
      .then(menu => {
        onUpdate(menu);
      })
      .catch(error => {
        console.error('Retry error:', error);
        if (error instanceof MenuNotFoundError) {
          setMenuNotFound(true);
        } else {
          setError('Failed to fetch daily menu');
        }
      });
  };

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        mealId: item.mealId,
        price: item.price,
        isAvailable: item.isAvailable,
        dayOfWeek: item.dayOfWeek,
        mealType: item.mealType,
        dailyMenuId: item.dailyMenuId,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        mealId: '',
        price: 0,
        isAvailable: true,
        dayOfWeek: new Date().getDay(),
        mealType: 'LUNCH' as MealType,
        dailyMenuId: dailyMenu?.id || '',
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  };

  const handleSubmit = async () => {
    try {
      if (!dailyMenu) return;

      if (selectedItem) {
        const updatedItem = await menuService.updateMenuItem(selectedItem.id, formData as UpdateMenuItemDto);
        const updatedMenu = {
          ...dailyMenu,
          items: dailyMenu.items.map(item => item.id === selectedItem.id ? updatedItem : item),
        };
        onUpdate(updatedMenu);
      } else {
        const newItem = await menuService.createMenuItem({
          ...formData as CreateMenuItemDto,
          dailyMenuId: dailyMenu.id,
        });
        const updatedMenu = {
          ...dailyMenu,
          items: [...dailyMenu.items, newItem],
        };
        onUpdate(updatedMenu);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving menu item:', error);
      setError('Failed to save menu item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await menuService.deleteMenuItem(id);
      if (dailyMenu) {
        const updatedMenu = {
          ...dailyMenu,
          items: dailyMenu.items.filter(item => item.id !== id),
        };
        onUpdate(updatedMenu);
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
      setError('Failed to delete menu item');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (menuNotFound) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">No Menu Found</h2>
          <p className="text-gray-600">There is no menu created for today.</p>
          <button
            onClick={handleCreateMenu}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center space-x-2"
          >
            <span>+</span>
            <span>Create Today's Menu</span>
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
          <button
            onClick={handleRetry}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dailyMenu) {
    return null;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Daily Menu</h1>
          <p className="text-gray-600">
            {format(parseISO(dailyMenu.date), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <span className="mr-2">+</span>
          Add Menu Item
        </button>
      </div>

      {dailyMenu.items.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No menu items added yet</p>
          <button
            onClick={() => handleOpenDialog()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Add Your First Menu Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dailyMenu.items.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="mb-4">
                <h3 className="text-lg font-semibold">{item.meal.name}</h3>
                <p className="text-gray-600">₹{item.price}</p>
                <p className="text-gray-600">Type: {item.mealType}</p>
                <p className="text-gray-600">Available: {item.isAvailable ? 'Yes' : 'No'}</p>
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={() => handleOpenDialog(item)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedItem ? 'Edit Menu Item' : 'Add Menu Item'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Meal</label>
                <select
                  value={formData.mealId}
                  onChange={(e) => setFormData({ ...formData, mealId: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={!!selectedItem}
                >
                  <option value="">Select a meal</option>
                  {meals.map((meal) => (
                    <option key={meal.id} value={meal.id}>
                      {meal.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Meal Type</label>
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value as MealType })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="BREAKFAST">Breakfast</option>
                  <option value="LUNCH">Lunch</option>
                  <option value="DINNER">Dinner</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-blue-500"
                />
                <label className="ml-2 text-gray-700">Available</label>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={handleCloseDialog}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {selectedItem ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyMenu; 