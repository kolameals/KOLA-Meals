import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Meal {
  id: string;
  name: string;
  type: 'veg' | 'non-veg';
  category: string;
  price: number;
}

const DailyMenu: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [meals, setMeals] = useState<Meal[]>([]);

  const addMeal = (type: 'veg' | 'non-veg') => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: '',
      type,
      category: '',
      price: 0
    };
    setMeals([...meals, newMeal]);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Daily Menu</h2>
        <Input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-48"
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Vegetarian Section */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-green-600">Vegetarian Menu</h3>
            <Button onClick={() => addMeal('veg')} variant="outline">
              Add Veg Meal
            </Button>
          </div>
          <div className="space-y-4">
            {meals
              .filter(meal => meal.type === 'veg')
              .map(meal => (
                <div key={meal.id} className="flex items-center gap-4 p-2 border rounded">
                  <Input placeholder="Meal name" className="flex-1" />
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Price" className="w-24" />
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              ))}
          </div>
        </Card>

        {/* Non-Vegetarian Section */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-red-600">Non-Vegetarian Menu</h3>
            <Button onClick={() => addMeal('non-veg')} variant="outline">
              Add Non-Veg Meal
            </Button>
          </div>
          <div className="space-y-4">
            {meals
              .filter(meal => meal.type === 'non-veg')
              .map(meal => (
                <div key={meal.id} className="flex items-center gap-4 p-2 border rounded">
                  <Input placeholder="Meal name" className="flex-1" />
                  <Select>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input type="number" placeholder="Price" className="w-24" />
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DailyMenu; 