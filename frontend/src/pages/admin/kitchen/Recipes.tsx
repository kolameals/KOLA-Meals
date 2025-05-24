import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import {
  fetchRecipes,
  addRecipe,
  updateRecipe,
  deleteRecipe
} from '../../../store/slices/recipeSlice';
import { fetchRawMaterials } from '../../../store/slices/rawMaterialSlice';
import { fetchMeals } from '../../../store/slices/mealSlice';
import type { Recipe, RecipeItem } from '../../../services/recipe.service';
import type { RawMaterial } from '../../../services/rawMaterial.service';
import type { Meal } from '../../../services/meal.service';

const Recipes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items: recipes, loading, error } = useSelector((state: RootState) => state.recipes);
  const { items: rawMaterials } = useSelector((state: RootState) => state.rawMaterials);
  const { meals } = useSelector((state: RootState) => state.meal);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    instructions: '',
    preparationTime: 0,
    cookingTime: 0,
    servings: 1,
    mealId: '',
    costPerServing: 0,
    recipeItems: [] as Omit<RecipeItem, 'id'>[]
  });
  const [newRecipeItem, setNewRecipeItem] = useState({
    rawMaterialId: '',
    quantity: 0,
    unit: ''
  });

  useEffect(() => {
    console.log('Fetching data...');
    dispatch(fetchRecipes());
    dispatch(fetchRawMaterials());
    dispatch(fetchMeals());
  }, [dispatch]);

  useEffect(() => {
    console.log('Raw Materials:', rawMaterials);
    console.log('Meals:', meals);
  }, [rawMaterials, meals]);

  const handleOpenModal = (recipe?: Recipe) => {
    if (recipe) {
      setCurrentRecipe(recipe);
      setFormData({
        name: recipe.name,
        description: recipe.description,
        instructions: recipe.instructions,
        preparationTime: recipe.preparationTime,
        cookingTime: recipe.cookingTime,
        servings: recipe.servings,
        mealId: recipe.mealId,
        costPerServing: recipe.costPerServing,
        recipeItems: recipe.recipeItems.map(item => ({
          rawMaterialId: item.rawMaterialId,
          quantity: item.quantity,
          unit: item.unit
        }))
      });
    } else {
      setCurrentRecipe(null);
      setFormData({
        name: '',
        description: '',
        instructions: '',
        preparationTime: 0,
        cookingTime: 0,
        servings: 1,
        mealId: '',
        costPerServing: 0,
        recipeItems: []
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentRecipe(null);
  };

  const handleAddRecipeItem = () => {
    if (newRecipeItem.rawMaterialId && newRecipeItem.quantity > 0 && newRecipeItem.unit) {
      setFormData({
        ...formData,
        recipeItems: [...formData.recipeItems, { ...newRecipeItem }]
      });
      setNewRecipeItem({
        rawMaterialId: '',
        quantity: 0,
        unit: ''
      });
    }
  };

  const handleRemoveRecipeItem = (index: number) => {
    setFormData({
      ...formData,
      recipeItems: formData.recipeItems.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentRecipe) {
        await dispatch(updateRecipe({ id: currentRecipe.id, data: formData }));
      } else {
        await dispatch(addRecipe(formData));
      }
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save recipe:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      try {
        await dispatch(deleteRecipe(id));
      } catch (error) {
        console.error('Failed to delete recipe:', error);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Recipe Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Recipe
        </button>
      </div>

      {/* Recipes Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prep Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cook Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servings</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {recipes.map((recipe) => (
              <tr key={recipe.id}>
                <td className="px-6 py-4 whitespace-nowrap">{recipe.name}</td>
                <td className="px-6 py-4">{recipe.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">{recipe.preparationTime} mins</td>
                <td className="px-6 py-4 whitespace-nowrap">{recipe.cookingTime} mins</td>
                <td className="px-6 py-4 whitespace-nowrap">{recipe.servings}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleOpenModal(recipe)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {currentRecipe ? 'Edit Recipe' : 'Add Recipe'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Meal</label>
                  <select
                    value={formData.mealId}
                    onChange={(e) => setFormData({ ...formData, mealId: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                  >
                    <option value="">Select a meal</option>
                    {meals.map((meal) => (
                      <option key={meal.id} value={meal.id}>
                        {meal.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Servings</label>
                <input
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData({ ...formData, servings: Number(e.target.value) })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  min="1"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  rows={2}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Instructions</label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  required
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Preparation Time (mins)</label>
                  <input
                    type="number"
                    value={formData.preparationTime}
                    onChange={(e) => setFormData({ ...formData, preparationTime: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cooking Time (mins)</label>
                  <input
                    type="number"
                    value={formData.cookingTime}
                    onChange={(e) => setFormData({ ...formData, cookingTime: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">Ingredients</h3>
                <div className="grid grid-cols-3 gap-4 mb-2">
                  <select
                    value={newRecipeItem.rawMaterialId}
                    onChange={(e) => setNewRecipeItem({ ...newRecipeItem, rawMaterialId: e.target.value })}
                    className="border p-2 rounded"
                  >
                    <option value="">Select Material</option>
                    {rawMaterials.map((material) => (
                      <option key={material.id} value={material.id}>
                        {material.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={newRecipeItem.quantity}
                    onChange={(e) => setNewRecipeItem({ ...newRecipeItem, quantity: Number(e.target.value) })}
                    placeholder="Quantity"
                    className="border p-2 rounded"
                    min="0"
                    step="0.01"
                  />
                  <input
                    type="text"
                    value={newRecipeItem.unit}
                    onChange={(e) => setNewRecipeItem({ ...newRecipeItem, unit: e.target.value })}
                    placeholder="Unit"
                    className="border p-2 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddRecipeItem}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Add Ingredient
                </button>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Added Ingredients:</h4>
                  <ul className="space-y-2">
                    {formData.recipeItems.map((item, index) => {
                      const material = rawMaterials.find(m => m.id === item.rawMaterialId);
                      return (
                        <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                          <span>
                            {material?.name} - {item.quantity} {item.unit}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveRecipeItem(index)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Remove
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {currentRecipe ? 'Update' : 'Add'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recipes; 