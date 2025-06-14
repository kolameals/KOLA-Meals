import React, { useState, useEffect } from 'react';
import { mealService } from '../../services/meal.service';
import { menuService } from '../../services/menu.service';
import type { MenuItem, CreateMenuItemDto } from '../../types/menu.types';
import type { Meal } from '../../types/meal.types';
import { MealType } from '../../types/meal.types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

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
  }, [isOpen, existingMenuItem, mealType]);

  const fetchMeals = async () => {
    try {
      setLoading(true);
      const response = await mealService.getMeals();
      console.log('Fetched meals:', response);
      
      // Ensure we're working with the data array
      const availableMeals = Array.isArray(response) ? response : response.data || [];
      
      // Filter meals by type, case-insensitive
      const filteredMeals = availableMeals.filter(meal => 
        meal.type?.toUpperCase() === mealType.toUpperCase()
      );
      
      console.log('Filtered meals for type', mealType, ':', filteredMeals);
      setMeals(filteredMeals);
      
      if (filteredMeals.length === 0) {
        setError(`No meals available for ${mealType.toLowerCase()}`);
      } else {
        setError(null);
      }
    } catch (err) {
      console.error('Error fetching meals:', err);
      setError('Failed to load meals');
    } finally {
      setLoading(false);
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
      const selectedMeal = meals.find(m => m.id === selectedMealId);
      if (!selectedMeal) {
        throw new Error('Selected meal not found');
      }

      const menuItemData: CreateMenuItemDto = {
        mealId: selectedMealId,
        dailyMenuId: existingMenuItem?.dailyMenuId || '', // This will be set by the backend
        mealType,
        price: price || selectedMeal.price || 0,
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {existingMenuItem ? 'Edit Menu Item' : `Add ${mealType}`}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={date.toISOString().split('T')[0]}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Meal Type</Label>
            <Input
              type="text"
              value={mealType.charAt(0) + mealType.slice(1).toLowerCase()}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div className="space-y-2">
            <Label>Select Meal</Label>
            <Select
              value={selectedMealId}
              onValueChange={setSelectedMealId}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a meal" />
              </SelectTrigger>
              <SelectContent>
                {meals.map((meal) => (
                  <SelectItem key={meal.id} value={meal.id}>
                    {meal.name} - ₹{meal.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Price (₹)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
              step="0.01"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-red-500">{error}</div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : existingMenuItem ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemModal; 