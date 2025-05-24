import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { menuService } from '../../../services/menu.service';
import { mealService } from '../../../services/meal.service';
import type { MenuCalendar as MenuCalendarType, DailyMenu, MenuItem } from '../../../types/menu.types';
import type { Meal } from '../../../types/meal.types';
import { MealType } from '../../../types/meal.types';
import MenuItemModal from '../../../components/menu/MenuItemModal';

const MenuCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendar, setCalendar] = useState<MenuCalendarType | null>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<{ menuItem: MenuItem; date: Date } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const startDate = startOfMonth(selectedDate);
        const endDate = endOfMonth(selectedDate);
        const [calendarData, mealsData] = await Promise.all([
          menuService.getMenuCalendarByDateRange(startDate, endDate),
          mealService.getMeals(),
        ]);
        setCalendar(calendarData);
        setMeals(mealsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load menu calendar data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleCreateCalendar = async () => {
    try {
      setLoading(true);
      setError(null);
      const startDate = startOfMonth(selectedDate);
      const endDate = endOfMonth(selectedDate);
      const newCalendar = await menuService.createMenuCalendar({
        startDate,
        endDate,
        dailyMenus: eachDayOfInterval({ start: startDate, end: endDate }).map(date => ({
          date,
          items: [],
        })),
      });
      setCalendar(newCalendar);
    } catch (error) {
      console.error('Error creating calendar:', error);
      setError('Failed to create menu calendar');
    } finally {
      setLoading(false);
    }
  };

  const handleMenuItemClick = (menuItem: MenuItem, date: Date) => {
    setSelectedMenuItem({ menuItem, date });
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedMenuItem(null);
    setIsModalOpen(false);
  };

  const handleMenuItemUpdate = async (updatedMenuItem: MenuItem) => {
    try {
      setLoading(true);
      setError(null);
      const updatedCalendar = await menuService.updateMenuCalendar(calendar!.id, {
        dailyMenus: calendar!.dailyMenus.map(dailyMenu => {
          if (format(new Date(dailyMenu.date), 'yyyy-MM-dd') === format(selectedMenuItem!.date, 'yyyy-MM-dd')) {
            return {
              ...dailyMenu,
              items: dailyMenu.items.map(item =>
                item.id === updatedMenuItem.id ? updatedMenuItem : item
              ),
            };
          }
          return dailyMenu;
        }),
      });
      setCalendar(updatedCalendar);
      handleModalClose();
    } catch (error) {
      console.error('Error updating menu item:', error);
      setError('Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  const getDailyMenu = (date: Date): DailyMenu | undefined => {
    return calendar?.dailyMenus.find(menu =>
      format(new Date(menu.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  const getMenuItemsByType = (dailyMenu: DailyMenu, type: MealType): MenuItem[] => {
    return dailyMenu.items.filter(item => item.mealType === type);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <button
          onClick={handleCreateCalendar}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Calendar
        </button>
      </div>
    );
  }

  if (!calendar) {
    return (
      <div className="text-center p-4">
        <p className="mb-4">No menu calendar found for this month.</p>
        <button
          onClick={handleCreateCalendar}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Create Calendar
        </button>
      </div>
    );
  }

  const days = eachDayOfInterval({
    start: startOfMonth(selectedDate),
    end: endOfMonth(selectedDate),
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">
          {format(selectedDate, 'MMMM yyyy')}
        </h2>
        <div className="space-x-2">
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-bold p-2">
            {day}
          </div>
        ))}
        {days.map(day => {
          const dailyMenu = getDailyMenu(day);
          return (
            <div
              key={day.toISOString()}
              className={`p-4 border rounded ${
                isToday(day) ? 'bg-blue-50' : ''
              } ${!isSameMonth(day, selectedDate) ? 'opacity-50' : ''}`}
            >
              <div className="font-bold mb-2">{format(day, 'd')}</div>
              {dailyMenu ? (
                <div className="space-y-2">
                  {Object.values(MealType).map(type => {
                    const items = getMenuItemsByType(dailyMenu, type);
                    return (
                      <div key={type} className="text-sm">
                        <div className="font-semibold text-gray-600">{type}</div>
                        {items.map(item => (
                          <div
                            key={item.id}
                            onClick={() => handleMenuItemClick(item, day)}
                            className="cursor-pointer hover:bg-gray-100 p-1 rounded"
                          >
                            {meals.find(m => m.id === item.mealId)?.name || 'Unknown Meal'}
                          </div>
                        ))}
                        <button
                          onClick={() => handleMenuItemClick({} as MenuItem, day)}
                          className="text-blue-500 hover:text-blue-600 text-xs"
                        >
                          Add {type}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <button
                  onClick={() => handleMenuItemClick({} as MenuItem, day)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  Add Menu
                </button>
              )}
            </div>
          );
        })}
      </div>

      {isModalOpen && selectedMenuItem && (
        <MenuItemModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          date={selectedMenuItem.date}
          mealType={selectedMenuItem.menuItem.mealType || MealType.BREAKFAST}
          existingMenuItem={selectedMenuItem.menuItem}
          onSave={handleMenuItemUpdate}
        />
      )}
    </div>
  );
};

export default MenuCalendar; 