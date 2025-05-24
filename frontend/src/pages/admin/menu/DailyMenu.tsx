import React, { useState, useEffect } from 'react';
import type { DailyMenu as DailyMenuType, MenuItem, CreateMenuItemDto, UpdateMenuItemDto } from '../../../types/menu.types';
import { menuService } from '../../../services/menu.service';

interface DailyMenuProps {
  dailyMenu: DailyMenuType | null;
  onUpdate: (menu: DailyMenuType) => void;
}

const DailyMenu: React.FC<DailyMenuProps> = ({ dailyMenu, onUpdate }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [formData, setFormData] = useState<CreateMenuItemDto | UpdateMenuItemDto>({
    mealId: '',
    price: 0,
    isAvailable: true,
    dayOfWeek: new Date().getDay(),
    mealType: 'LUNCH',
  });

  useEffect(() => {
    const initializeDailyMenu = async () => {
      if (!dailyMenu) {
        try {
          const today = new Date();
          const newDailyMenu = await menuService.createDailyMenu({
            date: today.toISOString(),
            items: [],
          });
          onUpdate(newDailyMenu);
        } catch (error) {
          console.error('Error creating daily menu:', error);
        }
      }
    };

    initializeDailyMenu();
  }, [dailyMenu, onUpdate]);

  const handleOpenDialog = (item?: MenuItem) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        price: item.price,
        isAvailable: item.isAvailable,
        dayOfWeek: item.dayOfWeek,
        mealType: item.mealType,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        mealId: '',
        price: 0,
        isAvailable: true,
        dayOfWeek: new Date().getDay(),
        mealType: 'LUNCH',
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
    }
  };

  if (!dailyMenu) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-600">Loading daily menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Daily Menu</h1>
          <p className="text-gray-600">
            {new Date(dailyMenu.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
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
                <p className="text-gray-600">${item.price}</p>
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
                <label className="block text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Meal Type</label>
                <select
                  value={formData.mealType}
                  onChange={(e) => setFormData({ ...formData, mealType: e.target.value as any })}
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