import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Menu, LogOut, User as UserIcon, Settings, Sun, Moon, ArrowUpDown, GripVertical, CheckCircle2, Clock, ListTodo } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
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
  const [sortBy, setSortBy] = useState<'priority' | 'date' | 'manual'>('priority');
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

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
        if (sortBy === 'manual') {
            return (a.order || 0) - (b.order || 0);
        } else if (sortBy === 'date') {
             return new Date(a.dueDate || '9999-12-31').getTime() - new Date(b.dueDate || '9999-12-31').getTime();
        } else {
             // Default: Priority
            const pDiff = PRIORITY_ORDER[b.priority] - PRIORITY_ORDER[a.priority];
            if (pDiff !== 0) return pDiff;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [state.tasks, filters, sortBy]);

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
        order: Date.now(), // Fallback order
      };
      dispatch({ type: 'ADD_TASK', payload: newTask });
    }
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('taskflow_user');
    dispatch({ type: 'LOGOUT' });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    
    if (sourceIndex === destIndex) return;

    const newOrderedTasks = [...filteredTasks];
    const [movedTask] = newOrderedTasks.splice(sourceIndex, 1);
    newOrderedTasks.splice(destIndex, 0, movedTask);

    // Calculate new order value
    let newOrder = 0;
    const prevTask = newOrderedTasks[destIndex - 1];
    const nextTask = newOrderedTasks[destIndex + 1];

    if (!prevTask && !nextTask) {
        newOrder = 0;
    } else if (!prevTask) {
        // Moved to top
        newOrder = (nextTask.order || 0) - 100;
    } else if (!nextTask) {
        // Moved to bottom
        newOrder = (prevTask.order || 0) + 100;
    } else {
        // Between two tasks
        newOrder = ((prevTask.order || 0) + (nextTask.order || 0)) / 2;
    }

    dispatch({ 
        type: 'UPDATE_TASK', 
        payload: { ...movedTask, order: newOrder } 
    });
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col transition-colors animate-fade-in">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 h-16 px-4 flex items-center justify-between shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
              TF
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-white hidden sm:block tracking-tight">TaskFlow</span>
          </div>
        </div>

        <div className="flex-1 max-w-xl mx-4 lg:mx-12">
          {viewMode === 'list' && (
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-blue-500 text-sm transition-all text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
            className="p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700 rounded-full transition-colors"
            title="Toggle Theme"
          >
            {state.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          <Button onClick={handleOpenCreate} size="sm" className="hidden sm:flex shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
          <div className="relative group">
            <button className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
               <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all">
                 <UserIcon className="w-5 h-5" />
               </div>
            </button>
             {/* Dropdown Menu */}
             <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{state.user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{state.user?.email}</p>
                </div>
                <Link
                    to="/profile"
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center"
                >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                </Link>
                <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center"
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
            {/* Header / Greeting */}
            <div className="mb-8 animate-fade-in-up">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                    {greeting}, <span className="text-blue-600 dark:text-blue-400">{state.user?.name.split(' ')[0] || 'User'}</span>
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                    Here's what's happening with your tasks today.
                </p>
            </div>

            {/* Stats Section */}
            {viewMode === 'list' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in-up">
                    {/* Pending Card */}
                    <div className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 group hover:shadow-md transition-all">
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Tasks</p>
                            <p className="text-4xl font-extrabold text-slate-900 dark:text-white mt-2">
                                {state.tasks.filter(t => t.status === 'Active').length}
                            </p>
                        </div>
                        <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                             <ListTodo className="w-24 h-24 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-transparent opacity-50"></div>
                    </div>

                    {/* Completed Card */}
                    <div className="relative overflow-hidden bg-white/60 dark:bg-slate-800/60 backdrop-blur-md p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 group hover:shadow-md transition-all">
                        <div className="relative z-10">
                            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Completed Today</p>
                            <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2">
                                {state.tasks.filter(t => 
                                    t.status === 'Completed' && 
                                    t.completedAt && 
                                    new Date(t.completedAt).toDateString() === new Date().toDateString()
                                ).length}
                            </p>
                        </div>
                         <div className="absolute right-0 top-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                             <CheckCircle2 className="w-24 h-24 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent opacity-50"></div>
                    </div>

                    {/* Chart Card */}
                    <div className="col-span-1 md:col-span-1 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
                        <StatsChart tasks={state.tasks} />
                    </div>
                </div>
            )}

            {/* View Content */}
            {viewMode === 'list' ? (
                <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            {filters.status === 'All' ? 'All Tasks' : `${filters.status} Tasks`}
                            <span className="text-sm font-normal text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                {filteredTasks.length}
                            </span>
                        </h2>
                        <div className="flex items-center gap-2">
                            {/* Sort Dropdown */}
                            <div className="relative group z-20">
                                <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-full text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm">
                                    <ArrowUpDown className="w-4 h-4" />
                                    Sort: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right transform scale-95 group-hover:scale-100">
                                    <button onClick={() => setSortBy('priority')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 first:rounded-t-xl ${sortBy === 'priority' ? 'text-blue-600 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>Priority (Default)</button>
                                    <button onClick={() => setSortBy('date')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 ${sortBy === 'date' ? 'text-blue-600 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>Due Date</button>
                                    <button onClick={() => setSortBy('manual')} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-700 last:rounded-b-xl ${sortBy === 'manual' ? 'text-blue-600 font-medium' : 'text-slate-700 dark:text-slate-300'}`}>Manual Order</button>
                                </div>
                            </div>
                            
                            <Button onClick={handleOpenCreate} size="sm" className="sm:hidden rounded-full shadow-lg shadow-blue-500/20">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {(filters.priority !== 'All' || filters.categoryId !== 'All') && (
                        <div className="flex gap-2 mb-4 flex-wrap">
                            {filters.priority !== 'All' && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-800">
                                    Priority: {filters.priority}
                                    <button onClick={() => setFilters(prev => ({...prev, priority: 'All'}))} className="ml-2 hover:text-blue-900 dark:hover:text-blue-100"><UserIcon className="w-3 h-3 rotate-45" /></button>
                                </span>
                            )}
                        </div>
                    )}

                    <div className="space-y-3 pb-20">
                        {filteredTasks.length > 0 ? (
                            sortBy === 'manual' ? (
                                <DragDropContext onDragEnd={onDragEnd}>
                                    <Droppable droppableId="tasks">
                                        {(provided) => (
                                            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                                                {filteredTasks.map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id} index={index}>
                                                        {(provided, snapshot) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                    opacity: snapshot.isDragging ? 0.8 : 1
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                     <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab active:cursor-grabbing p-1">
                                                                        <GripVertical className="w-5 h-5" />
                                                                     </div>
                                                                     <div className="flex-1 min-w-0">
                                                                         <TaskCard task={task} onEdit={handleOpenEdit} />
                                                                     </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            ) : (
                                filteredTasks.map((task) => (
                                    <TaskCard key={task.id} task={task} onEdit={handleOpenEdit} />
                                ))
                            )
                        ) : (
                        <div className="text-center py-20 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 transition-colors">
                            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-700/50 mb-4 shadow-inner">
                            <Search className="h-8 w-8 text-slate-400 dark:text-slate-300" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No tasks found</h3>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            Try adjusting your search or filters, or create a new task.
                            </p>
                        </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="animate-fade-in-up pb-20">
                    <CalendarView tasks={state.tasks} onEditTask={handleOpenEdit} />
                </div>
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
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
            <textarea
              className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Priority</label>
              <select
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
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
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
              <select
                className="block w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
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

          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
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