import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay, addMonths } from 'date-fns';
import { enUS } from 'date-fns/locale';
import { menuService } from '../../../../services/menu.service';
import { mealService, type Meal } from '../../../../services/meal.service';
import type { MenuCalendar as MenuCalendarType, DailyMenu, MenuItem } from '../../../../types/menu.types';
import { MealType } from '../../../../types/meal.types';
import MenuItemModal from '../../../../components/menu/MenuItemModal';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  mealType: MealType;
  menuItem?: MenuItem;
}

const MenuCalendar: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(() => addMonths(new Date(), 1)); // Set to next month

  useEffect(() => {
    fetchData();
  }, [currentDate]); // Refetch when currentDate changes

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

      const [calendarData, mealsData] = await Promise.all([
        menuService.getMenuCalendarByDateRange(startDate, endDate),
        mealService.getMeals(),
      ]);

      setMeals(mealsData.data);
      const calendarEvents = convertToCalendarEvents(calendarData);
      setEvents(calendarEvents);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      if (error.response?.data?.error === 'Menu calendar not found') {
        // Create empty events for the current month
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const emptyEvents = createEmptyEvents(startDate, endDate);
        setEvents(emptyEvents);
      } else {
        setError('Failed to load menu calendar data');
      }
    } finally {
      setLoading(false);
    }
  };

  const createEmptyEvents = (startDate: Date, endDate: Date): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      Object.values(MealType).forEach(mealType => {
        const eventDate = new Date(currentDate);
        events.push({
          id: `empty-${eventDate.toISOString()}-${mealType}`,
          title: `Add ${mealType}`,
          start: new Date(eventDate.setHours(getMealTypeHour(mealType), 0, 0)),
          end: new Date(eventDate.setHours(getMealTypeHour(mealType) + 1, 0, 0)),
          mealType,
        });
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return events;
  };

  const convertToCalendarEvents = (calendar: MenuCalendarType): CalendarEvent[] => {
    const events: CalendarEvent[] = [];
    
    calendar.dailyMenus.forEach(dailyMenu => {
      const date = new Date(dailyMenu.date);
      
      // Create events for each meal type
      Object.values(MealType).forEach(mealType => {
        const items = dailyMenu.items.filter(item => item.mealType === mealType);
        
        if (items.length > 0) {
          items.forEach(item => {
            const meal = meals.find(m => m.id === item.mealId);
            const eventDate = new Date(date);
            events.push({
              id: item.id,
              title: meal?.name || 'Unknown Meal',
              start: new Date(eventDate.setHours(getMealTypeHour(mealType), 0, 0)),
              end: new Date(eventDate.setHours(getMealTypeHour(mealType) + 1, 0, 0)),
              mealType,
              menuItem: item,
            });
          });
        } else {
          // Add placeholder event for empty meal slots
          const eventDate = new Date(date);
          events.push({
            id: `empty-${date.toISOString()}-${mealType}`,
            title: `Add ${mealType}`,
            start: new Date(eventDate.setHours(getMealTypeHour(mealType), 0, 0)),
            end: new Date(eventDate.setHours(getMealTypeHour(mealType) + 1, 0, 0)),
            mealType,
          });
        }
      });
    });

    return events;
  };

  const getMealTypeHour = (mealType: MealType): number => {
    switch (mealType) {
      case MealType.BREAKFAST:
        return 8; // 8 AM
      case MealType.LUNCH:
        return 12; // 12 PM
      case MealType.DINNER:
        return 18; // 6 PM
      default:
        return 0;
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleMenuItemUpdate = async (updatedMenuItem: MenuItem) => {
    try {
      setLoading(true);
      setError(null);
      await menuService.updateMenuItem(updatedMenuItem.id, updatedMenuItem);
      await fetchData(); // Refresh the calendar data
      handleModalClose();
    } catch (error) {
      console.error('Error updating menu item:', error);
      setError('Failed to update menu item');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigate = (newDate: Date) => {
    setCurrentDate(newDate);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-[800px] p-4">
      {error && (
        <div className="mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
          <button
            onClick={fetchData}
            className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      )}

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        onSelectEvent={handleEventClick}
        views={['month', 'week', 'day']}
        defaultView="month"
        date={currentDate}
        onNavigate={handleNavigate}
        eventPropGetter={(event) => ({
          className: `bg-${getMealTypeColor(event.mealType)}-500 hover:bg-${getMealTypeColor(event.mealType)}-600`,
        })}
      />

      {isModalOpen && selectedEvent && (
        <MenuItemModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          date={selectedEvent.start}
          mealType={selectedEvent.mealType}
          existingMenuItem={selectedEvent.menuItem}
          onSave={handleMenuItemUpdate}
        />
      )}
    </div>
  );
};

const getMealTypeColor = (mealType: MealType): string => {
  switch (mealType) {
    case MealType.BREAKFAST:
      return 'yellow';
    case MealType.LUNCH:
      return 'green';
    case MealType.DINNER:
      return 'blue';
    default:
      return 'gray';
  }
};

export default MenuCalendar; 