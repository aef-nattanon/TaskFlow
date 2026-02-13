import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Task } from '../types';
import { PRIORITY_COLORS } from '../constants';

interface CalendarViewProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onEditTask }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Helper to get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  // Create grid cells
  const blanks = Array(firstDay).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const totalSlots = [...blanks, ...days];

  // Group tasks by date
  const getTasksForDay = (day: number) => {
    if (!day) return [];
    const dateStr = `${year}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter(task => task.dueDate === dateStr);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">
          {monthName} {year}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px">
        {totalSlots.map((day, index) => {
          const dayTasks = day ? getTasksForDay(day) : [];
          
          return (
            <div
              key={index}
              className={`bg-white min-h-[120px] p-2 relative ${!day ? 'bg-slate-50' : ''}`}
            >
              {day && (
                <>
                  <span
                    className={`text-sm font-medium ${
                      new Date().toDateString() === new Date(year, currentDate.getMonth(), day).toDateString()
                        ? 'bg-blue-600 text-white w-7 h-7 flex items-center justify-center rounded-full -ml-1 -mt-1 mb-1'
                        : 'text-slate-700'
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px] custom-scrollbar">
                    {dayTasks.map(task => (
                      <button
                        key={task.id}
                        onClick={() => onEditTask(task)}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium truncate border-l-2 hover:opacity-80 transition-opacity block ${
                           task.status === 'Completed' ? 'opacity-50 line-through' : ''
                        }`}
                        style={{
                           backgroundColor: `${PRIORITY_COLORS[task.priority]}15`, // 15 = hex alpha ~8%
                           borderLeftColor: PRIORITY_COLORS[task.priority],
                           color: '#1e293b'
                        }}
                      >
                        {task.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;