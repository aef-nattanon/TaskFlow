import React from 'react';
import { Check, Clock, Edit2, Trash2, CalendarDays } from 'lucide-react';
import { Task, Category } from '../types';
import { PRIORITY_COLORS } from '../constants';
import { useAppStore } from '../store';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { state, dispatch } = useAppStore();
  const category = state.categories.find((c) => c.id === task.categoryId);

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'DELETE_TASK', payload: task.id });
    }
  };

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_TASK_STATUS', payload: task.id });
  };

  const priorityColor = PRIORITY_COLORS[task.priority];
  const isCompleted = task.status === 'Completed';

  // Format due date logic
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Reset date hours for comparison
    const compareDate = new Date(dateString);
    compareDate.setHours(0, 0, 0, 0); 
    
    // Manual YYYY-MM-DD parsing to avoid timezone shifts
    const [y, m, d] = dateString.split('-').map(Number);
    const localDate = new Date(y, m - 1, d);

    if (localDate.getTime() === today.getTime()) return 'Today';
    if (localDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    
    return localDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const formattedDueDate = formatDate(task.dueDate);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0,0,0,0)) && !isCompleted;

  return (
    <div
      className={`group relative flex flex-col sm:flex-row items-start sm:items-center bg-white border border-slate-200 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-all duration-200 ${
        isCompleted ? 'opacity-60 bg-slate-50' : ''
      }`}
      style={{ borderLeftWidth: '4px', borderLeftColor: priorityColor }}
    >
      {/* Checkbox */}
      <div className="flex-shrink-0 mr-4 mt-1 sm:mt-0">
        <button
          onClick={handleToggle}
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200 ${
            isCompleted
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 text-transparent hover:border-blue-500'
          }`}
        >
          <Check className="w-3.5 h-3.5" strokeWidth={3} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h4
            className={`text-base font-semibold text-slate-800 truncate ${
              isCompleted ? 'line-through text-slate-500' : ''
            }`}
          >
            {task.title}
          </h4>
          {category && (
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${category.color}`}
            >
              {category.name}
            </span>
          )}
          <span
             className="px-2 py-0.5 rounded-full text-xs font-medium border"
             style={{ borderColor: priorityColor, color: priorityColor }}
          >
            {task.priority}
          </span>
        </div>
        <p className="text-sm text-slate-500 line-clamp-2">{task.description}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
           <div className="flex items-center" title="Created At">
             <Clock className="w-3 h-3 mr-1" />
             {new Date(task.createdAt).toLocaleDateString()}
           </div>
           {formattedDueDate && (
             <div className={`flex items-center font-medium ${isOverdue ? 'text-red-500' : 'text-slate-500'}`} title="Due Date">
               <CalendarDays className="w-3 h-3 mr-1" />
               {formattedDueDate}
             </div>
           )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:ml-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          title="Edit"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;