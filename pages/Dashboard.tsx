import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Menu, LogOut, User as UserIcon, Settings } from 'lucide-react';
import { useAppStore } from '../store';
import { FilterState, Task, Priority } from '../types';
import { PRIORITY_ORDER } from '../constants';
import Sidebar from '../components/Sidebar';
import TaskCard from '../components/TaskCard';
import CalendarView from '../components/CalendarView';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import StatsChart from '../components/StatsChart';

const Dashboard: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Filters
  const [filters, setFilters] = useState<FilterState>({
    status: 'All',
    priority: 'All',
    categoryId: 'All',
    search: '',
  });

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    priority: Priority;
    categoryId: string;
    dueDate: string;
  }>({
    title: '',
    description: '',
    priority: 'Medium',
    categoryId: state.categories[0]?.id || '',
    dueDate: '',
  });

  // Computed Tasks
  const filteredTasks = useMemo(() => {
    return state.tasks
      .filter((task) => {
        const matchesStatus = filters.status === 'All' ? true : task.status === filters.status;
        const matchesPriority = filters.priority === 'All' ? true : task.priority === filters.priority;
        const matchesCategory = filters.categoryId === 'All' ? true : task.categoryId === filters.categoryId;
        const matchesSearch = task.title.toLowerCase().includes(filters.search.toLowerCase()) || 
                              task.description.toLowerCase().includes(filters.search.toLowerCase());
        return matchesStatus && matchesPriority && matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        // Sort by Priority first
        const pDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
        if (pDiff !== 0) return pDiff;
        // Then by Date (newest first)
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [state.tasks, filters]);

  // Handlers
  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      categoryId: state.categories[0]?.id || '',
      dueDate: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      categoryId: task.categoryId,
      dueDate: task.dueDate || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      dispatch({
        type: 'UPDATE_TASK',
        payload: { ...editingTask, ...formData },
      });
    } else {
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...formData,
        status: 'Active',
        createdAt: new Date().toISOString(),
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('taskflow_user');
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 px-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              TF
            </div>
            <span className="text-xl font-bold text-slate-900 hidden sm:block">TaskFlow</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-4 lg:mx-12">
          {viewMode === 'list' && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-md focus:bg-white focus:ring-2 focus:ring-blue-500 text-sm transition-all"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleOpenCreate} size="sm" className="hidden sm:flex">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors">
               <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                 <UserIcon className="w-5 h-5" />
               </div>
            </button>
             {/* Dropdown Menu */}
             <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right">
                <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-900">{state.user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 truncate">{state.user?.email}</p>
                </div>
                <Link
                    to="/profile"
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </button>
             </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 w-full max-w-7xl mx-auto">
            {/* Stats Section */}
            {viewMode === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500 font-medium">Pending Tasks</p>
                        <p className="text-3xl font-bold text-slate-900 mt-2">
                            {state.tasks.filter(t => t.status === 'Active').length}
                        </p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                        <p className="text-sm text-slate-500 font-medium">Completed Today</p>
                        <p className="text-3xl font-bold text-emerald-600 mt-2">
                            {state.tasks.filter(t => 
                                t.status === 'Completed' && 
                                t.completedAt && 
                                new Date(t.completedAt).toDateString() === new Date().toDateString()
                            ).length}
                        </p>
                    </div>
                    <div className="col-span-1 md:col-span-1">
                        <StatsChart tasks={state.tasks} />
                    </div>
                </div>
            )}

            {/* View Content */}
            {viewMode === 'list' ? (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {filters.status === 'All' ? 'All Tasks' : `${filters.status} Tasks`}
                        </h1>
                        <Button onClick={handleOpenCreate} size="sm" className="sm:hidden">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>

                    {(filters.priority !== 'All' || filters.categoryId !== 'All') && (
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {filters.priority !== 'All' && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Priority: {filters.priority}
                                    <button onClick={() => setFilters(prev => ({...prev, priority: 'All'}))} className="ml-1.5 hover:text-blue-900"><UserIcon className="w-3 h-3 rotate-45" /></button>
                                </span>
                            )}
                        </div>
                    )}

                    <div className="space-y-4">
                        {filteredTasks.length > 0 ? (
                        filteredTasks.map((task) => (
                            <TaskCard key={task.id} task={task} onEdit={handleOpenEdit} />
                        ))
                        ) : (
                        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-slate-300">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-slate-100 mb-4">
                            <Search className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900">No tasks found</h3>
                            <p className="mt-1 text-sm text-slate-500">
                            Try adjusting your search or filters, or create a new task.
                            </p>
                        </div>
                        )}
                    </div>
                </>
            ) : (
                <CalendarView tasks={state.tasks} onEditTask={handleOpenEdit} />
            )}
        </main>
      </div>

      {/* Task Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            label="Title"
            placeholder="e.g., Review Q3 Marketing Plan"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            autoFocus
          />
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              rows={3}
              placeholder="Add details about this task..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <Input
                label="Due Date"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
              >
                {Object.keys(PRIORITY_ORDER).map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              >
                {state.categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
