import { useState, useEffect } from 'react';
import { useEvents } from '../contexts/EventContext';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  category: string;
};

const Calendar = () => {
  const { events } = useEvents();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState<{ [key: string]: CalendarEvent[] }>({});
  
  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  // Get first day of the month
  const firstDay = new Date(currentYear, currentMonth, 1);
  const firstDayIndex = firstDay.getDay(); // 0 is Sunday, 1 is Monday, etc.
  
  // Get days in month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  
  // Get days from previous month
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  
  // Days array for the calendar
  const days = [];
  
  // Previous month days
  for (let x = firstDayIndex - 1; x >= 0; x--) {
    days.push({
      day: prevMonthDays - x,
      currentMonth: false,
      date: new Date(currentYear, currentMonth - 1, prevMonthDays - x)
    });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      day: i,
      currentMonth: true,
      date: new Date(currentYear, currentMonth, i),
      today: new Date().setHours(0, 0, 0, 0) === new Date(currentYear, currentMonth, i).setHours(0, 0, 0, 0)
    });
  }
  
  // Next month days
  const remainingDays = 42 - days.length;
  for (let j = 1; j <= remainingDays; j++) {
    days.push({
      day: j,
      currentMonth: false,
      date: new Date(currentYear, currentMonth + 1, j)
    });
  }
  
  // Month names
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };
  
  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  // Format events for calendar
  useEffect(() => {
    const eventsByDate: { [key: string]: CalendarEvent[] } = {};
    
    events.forEach(event => {
      if (event.date) {
        const eventDate = new Date(event.date);
        const dateKey = eventDate.toISOString().split('T')[0];
        
        if (!eventsByDate[dateKey]) {
          eventsByDate[dateKey] = [];
        }
        
        eventsByDate[dateKey].push({
          id: event.id,
          title: event.title,
          date: eventDate,
          category: event.category,
        });
      }
    });
    
    setCalendarEvents(eventsByDate);
  }, [events]);
  
  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return calendarEvents[dateKey] || [];
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Events Calendar</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-[#5b9bd5] text-white flex justify-between items-center">
          <button
            onClick={prevMonth}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-semibold flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            {monthNames[currentMonth]} {currentYear}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-100 py-2 text-center text-sm font-medium text-gray-700">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const dayEvents = getEventsForDay(day.date);
            
            return (
              <div 
                key={index} 
                className={`min-h-[100px] p-2 ${
                  day.currentMonth 
                    ? 'bg-white' 
                    : 'bg-gray-50 text-gray-400'
                } ${
                  day.today 
                    ? 'bg-blue-50' 
                    : ''
                }`}
              >
                <div className={`text-right ${day.today ? 'font-bold text-[#5b9bd5]' : ''}`}>
                  {day.day}
                </div>
                
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <Link 
                      key={event.id}
                      to={`/event/${event.id}`}
                      className="block text-xs p-1 rounded bg-[#5b9bd5] bg-opacity-10 text-[#5b9bd5] truncate"
                    >
                      {event.title}
                    </Link>
                  ))}
                  
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 pl-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;