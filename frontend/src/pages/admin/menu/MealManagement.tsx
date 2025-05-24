import React, { useState, useEffect } from 'react';
import { mealService } from '../../../services/meal.service';
import type { Meal, CreateMealDto, UpdateMealDto } from '../../../types/meal.types';
import { MealType } from '../../../types/meal.types';

interface MealFormData extends Omit<CreateMealDto, 'allergens'> {
  allergens: string;
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const defaultNutritionalInfo = {
  calories: 0,
  protein: 0,
  carbs: 0,
  fat: 0,
};

const MealManagement: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [formData, setFormData] = useState<MealFormData>({
    name: '',
    description: '',
    price: 0,
    imageUrl: '',
    type: MealType.LUNCH,
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    allergens: '',
    nutritionalInfo: defaultNutritionalInfo,
  });

  useEffect(() => {
    fetchMeals();
  }, []);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await mealService.getMeals();
      if (!response.success || !Array.isArray(response.data)) {
        console.error('Invalid response format:', response);
        setError('Invalid data format received from server');
        setMeals([]);
        return;
      }
      setMeals(response.data);
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to fetch meals');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (meal?: Meal) => {
    if (meal) {
      setSelectedMeal(meal);
      setFormData({
        name: meal.name,
        description: meal.description,
        price: meal.price,
        imageUrl: meal.imageUrl || '',
        type: meal.type,
        isVegetarian: meal.isVegetarian,
        isVegan: meal.isVegan,
        isGlutenFree: meal.isGlutenFree,
        allergens: meal.allergens.join(', '),
        nutritionalInfo: meal.nutritionalInfo || defaultNutritionalInfo,
      });
    } else {
      setSelectedMeal(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        type: MealType.LUNCH,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        allergens: '',
        nutritionalInfo: defaultNutritionalInfo,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMeal(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      type: MealType.LUNCH,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      allergens: '',
      nutritionalInfo: defaultNutritionalInfo,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const mealData: CreateMealDto = {
        ...formData,
        allergens: formData.allergens.split(',').map(a => a.trim()).filter(Boolean),
      };

      if (selectedMeal) {
        await mealService.updateMeal(selectedMeal.id, mealData);
      } else {
        await mealService.createMeal(mealData);
      }
      await fetchMeals();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving meal:', error);
      setError('Failed to save meal');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        setLoading(true);
        setError(null);
        await mealService.deleteMeal(id);
        await fetchMeals();
      } catch (error) {
        console.error('Error deleting meal:', error);
        setError('Failed to delete meal');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNutritionalInfoChange = (field: keyof typeof defaultNutritionalInfo, value: string) => {
    setFormData({
      ...formData,
      nutritionalInfo: {
        ...formData.nutritionalInfo,
        [field]: parseInt(value) || 0,
      },
    });
  };

  if (loading && !meals.length) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meal Management</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          onClick={() => handleOpenDialog()}
        >
          Add Meal
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dietary Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(meals) && meals.length > 0 ? (
              meals.map((meal) => (
                <tr key={meal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{meal.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{meal.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{meal.price.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {meal.isVegetarian && <span className="mr-2">🥬</span>}
                    {meal.isVegan && <span className="mr-2">🌱</span>}
                    {meal.isGlutenFree && <span className="mr-2">🌾</span>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                      onClick={() => handleOpenDialog(meal)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                      onClick={() => handleDelete(meal.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  {loading ? 'Loading meals...' : 'No meals found'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {selectedMeal ? 'Edit Meal' : 'Add Meal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as MealType })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {Object.values(MealType).map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Dietary Information</label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVegetarian}
                      onChange={(e) => setFormData({ ...formData, isVegetarian: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">Vegetarian</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isVegan}
                      onChange={(e) => setFormData({ ...formData, isVegan: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">Vegan</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isGlutenFree}
                      onChange={(e) => setFormData({ ...formData, isGlutenFree: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2">Gluten Free</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Allergens (comma-separated)</label>
                <input
                  type="text"
                  value={formData.allergens}
                  onChange={(e) => setFormData({ ...formData, allergens: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., nuts, dairy, soy"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Nutritional Information</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500">Calories</label>
                    <input
                      type="number"
                      value={formData.nutritionalInfo.calories}
                      onChange={(e) => handleNutritionalInfoChange('calories', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Protein (g)</label>
                    <input
                      type="number"
                      value={formData.nutritionalInfo.protein}
                      onChange={(e) => handleNutritionalInfoChange('protein', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Carbs (g)</label>
                    <input
                      type="number"
                      value={formData.nutritionalInfo.carbs}
                      onChange={(e) => handleNutritionalInfoChange('carbs', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Fat (g)</label>
                    <input
                      type="number"
                      value={formData.nutritionalInfo.fat}
                      onChange={(e) => handleNutritionalInfoChange('fat', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                  onClick={handleCloseDialog}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : selectedMeal ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealManagement; 