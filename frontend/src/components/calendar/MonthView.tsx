import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import type { Event, Calendar } from '../../types';

interface MonthViewProps {
  date: Date;
  events: Event[];
  calendars: Calendar[];
  onEventClick: (event: Event) => void;
  onDateClick: (date: Date) => void;
}

export default function MonthView({ date, events, calendars, onEventClick, onDateClick }: MonthViewProps) {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getCalendarColor = (calendarId: string) => {
    const calendar = calendars.find((c) => c.id === calendarId);
    return calendar?.color || '#6366F1';
  };

  const getEventsForDay = (day: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    }).slice(0, 3); // Limit to 3 events shown
  };

  const getMoreEventsCount = (day: Date) => {
    const dayEvents = events.filter((event) => {
      const eventDate = new Date(event.start);
      return isSameDay(eventDate, day);
    });
    return Math.max(0, dayEvents.length - 3);
  };

  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col h-full">
      {/* Week Day Headers */}
      <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        {weekDays.map((day) => (
          <div key={day} className="py-3 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 grid grid-rows-6">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="grid grid-cols-7 flex-1">
            {week.map((day, dayIndex) => {
              const isCurrentMonth = isSameMonth(day, date);
              const isTodayDate = isToday(day);
              const dayEvents = getEventsForDay(day);
              const moreCount = getMoreEventsCount(day);

              return (
                <div
                  key={dayIndex}
                  onClick={() => onDateClick(day)}
                  className={`
                    min-h-[100px] border-r border-b border-gray-200 p-1 cursor-pointer
                    hover:bg-gray-50 transition-colors
                    ${!isCurrentMonth ? 'bg-gray-50' : 'bg-white'}
                    ${isTodayDate ? 'bg-blue-50' : ''}
                  `}
                >
                  {/* Day Number */}
                  <div className="flex items-center justify-center mb-1">
                    <span
                      className={`
                        w-7 h-7 flex items-center justify-center rounded-full text-sm
                        ${isTodayDate ? 'bg-primary text-white font-semibold' : ''}
                        ${!isCurrentMonth ? 'text-gray-400' : 'text-gray-700'}
                      `}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="space-y-1">
                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="px-2 py-0.5 rounded text-xs text-white truncate cursor-pointer hover:opacity-80"
                        style={{ backgroundColor: getCalendarColor(event.calendarId) }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {moreCount > 0 && (
                      <div className="px-2 text-xs text-gray-500 hover:text-primary cursor-pointer">
                        +{moreCount} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
