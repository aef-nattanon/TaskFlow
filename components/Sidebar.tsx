import React from 'react';
import { LayoutDashboard, CheckSquare, Calendar as CalendarIcon, Tag, Filter, CalendarDays } from 'lucide-react';
import { useAppStore } from '../store';
import { FilterState } from '../types';

interface SidebarProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'list' | 'calendar';
  setViewMode: React.Dispatch<React.SetStateAction<'list' | 'calendar'>>;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ filters, setFilters, viewMode, setViewMode, isOpen, onClose }) => {
  const { state } = useAppStore();

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setViewMode('list'); // Switch back to list view when filtering
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (window.innerWidth < 1024) onClose();
  };

  const handleViewChange = (mode: 'list' | 'calendar') => {
    setViewMode(mode);
    if (window.innerWidth < 1024) onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[64px] left-0 h-full lg:h-[calc(100vh-64px)] w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-r border-slate-200/50 dark:border-slate-700/50 transform transition-transform duration-200 ease-in-out z-30 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6">
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Views
            </h3>
            <nav className="space-y-1">
              <button
                onClick={() => handleFilterChange('status', 'All')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list' && filters.status === 'All'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 mr-3" />
                All Tasks
              </button>
              <button
                onClick={() => handleViewChange('calendar')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <CalendarDays className="w-4 h-4 mr-3" />
                Calendar
              </button>
              <button
                onClick={() => handleFilterChange('status', 'Active')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list' && filters.status === 'Active'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <CheckSquare className="w-4 h-4 mr-3" />
                Active
              </button>
              <button
                onClick={() => handleFilterChange('status', 'Completed')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list' && filters.status === 'Completed'
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <CalendarIcon className="w-4 h-4 mr-3" />
                Completed
              </button>
            </nav>
          </div>

          <div className="mb-8">
            <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                 onClick={() => handleFilterChange('categoryId', 'All')}
                 className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list' && filters.categoryId === 'All' 
                        ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                 }`}
              >
                  <Tag className="w-4 h-4 mr-3 text-slate-400" />
                  All Categories
              </button>
              {state.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleFilterChange('categoryId', cat.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    viewMode === 'list' && filters.categoryId === cat.id
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full mr-3 ${cat.color.split(' ')[0].replace('bg-', 'bg-')}`} style={{backgroundColor: 'currentColor'}} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
             <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
              Priority
            </h3>
            <div className="space-y-1">
                {['Urgent', 'High', 'Medium', 'Low'].map((p) => (
                     <button
                     key={p}
                     onClick={() => handleFilterChange('priority', filters.priority === p ? 'All' : p)}
                     className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                       viewMode === 'list' && filters.priority === p
                         ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
                         : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                     }`}
                   >
                     <Filter className="w-4 h-4 mr-3 text-slate-400" />
                     {p}
                   </button>
                ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;