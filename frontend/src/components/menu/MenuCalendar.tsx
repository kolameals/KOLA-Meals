import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface MenuItem {
  id: string;
  date: Date;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
  };
}

const MenuCalendar: React.FC = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(start);
      newDate.setDate(start.getDate() + i);
      dates.push(newDate);
    }
    return dates;
  };

  const renderWeekView = () => {
    if (!date) return null;
    const weekDates = getWeekDates(date);

    return (
      <div className="grid grid-cols-7 gap-4">
        {weekDates.map((day) => (
          <Card key={day.toISOString()} className="p-4">
            <div className="text-center font-semibold mb-2">
              {day.toLocaleDateString('en-US', { weekday: 'short' })}
            </div>
            <div className="text-center text-sm mb-4">
              {day.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Breakfast</div>
              <div className="text-sm font-medium">Lunch</div>
              <div className="text-sm font-medium">Dinner</div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderMonthView = () => {
    if (!date) return null;
    return (
      <div className="space-y-4">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Selected Date Menu</h3>
          <div className="space-y-2">
            <div className="text-sm font-medium">Breakfast</div>
            <div className="text-sm font-medium">Lunch</div>
            <div className="text-sm font-medium">Dinner</div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Menu Calendar</h2>
        <div className="flex gap-2">
          <Button
            variant={view === 'week' ? 'default' : 'outline'}
            onClick={() => setView('week')}
          >
            Week View
          </Button>
          <Button
            variant={view === 'month' ? 'default' : 'outline'}
            onClick={() => setView('month')}
          >
            Month View
          </Button>
        </div>
      </div>

      {view === 'week' ? renderWeekView() : renderMonthView()}
    </div>
  );
};

export default MenuCalendar; 