import React, { useState, useEffect } from 'react';
import { mealService } from '../../services/meal.service';
import { menuService } from '../../services/menu.service';
import type { MenuItem, CreateMenuItemDto } from '../../types/menu.types';
import type { Meal } from '../../types/meal.types';
import { MealType } from '../../types/meal.types';

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
  mealType: MealType;
  existingMenuItem?: MenuItem;
  onSave: (menuItem: MenuItem) => void;
}

const MenuItemModal: React.FC<MenuItemModalProps> = ({
  isOpen,
  onClose,
  date,
  mealType,
  existingMenuItem,
  onSave,
}) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedMealId, setSelectedMealId] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMeals();
      if (existingMenuItem) {
        setSelectedMealId(existingMenuItem.mealId);
        setPrice(existingMenuItem.price);
      } else {
        setSelectedMealId('');
        setPrice(0);
      }
    }
  }, [isOpen, existingMenuItem]);

  const fetchMeals = async () => {
    try {
      const availableMeals = await mealService.getMeals();
      // Filter meals by type
      const filteredMeals = availableMeals.filter(meal => meal.type === mealType);
      setMeals(filteredMeals);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to load meals');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMealId) {
      setError('Please select a meal');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const menuItemData: CreateMenuItemDto = {
        mealId: selectedMealId,
        dailyMenuId: existingMenuItem?.dailyMenuId || '', // This will be set by the backend
        mealType,
        price,
      };

      let savedMenuItem: MenuItem;
      if (existingMenuItem) {
        savedMenuItem = await menuService.updateMenuItem(existingMenuItem.id, menuItemData);
      } else {
        savedMenuItem = await menuService.createMenuItem(menuItemData);
      }

      onSave(savedMenuItem);
      onClose();
    } catch (err) {
      console.error('Error saving menu item:', err);
      setError('Failed to save menu item');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {existingMenuItem ? 'Edit Menu Item' : 'Add Menu Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={date.toISOString().split('T')[0]}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Meal Type</label>
            <input
              type="text"
              value={mealType.charAt(0) + mealType.slice(1).toLowerCase()}
              disabled
              className="w-full px-3 py-2 border rounded-lg bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Select Meal</label>
            <select
              value={selectedMealId}
              onChange={(e) => setSelectedMealId(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a meal</option>
              {meals.map((meal) => (
                <option key={meal.id} value={meal.id}>
                  {meal.name} - ${meal.price}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Saving...' : existingMenuItem ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MenuItemModal; 