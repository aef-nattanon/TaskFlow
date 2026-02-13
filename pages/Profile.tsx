import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Save, User as UserIcon, Mail, Shield, Bell, Moon, LogOut, Sun } from 'lucide-react';
import { useAppStore } from '../store';
import Button from '../components/Button';
import Input from '../components/Input';

const Profile: React.FC = () => {
  const { state, dispatch } = useAppStore();
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (state.user) {
      setName(state.user.name);
    }
  }, [state.user]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessMessage('');

    // Simulate API delay
    setTimeout(() => {
      dispatch({ type: 'UPDATE_USER', payload: { name } });
      setIsLoading(false);
      setSuccessMessage('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    }, 800);
  };

  const toggleTheme = () => {
      dispatch({ type: 'TOGGLE_THEME' });
  };

  if (!state.user) return null;

  // Calculate some mock stats
  const completedTasks = state.tasks.filter(t => t.status === 'Completed').length;
  const activeTasks = state.tasks.filter(t => t.status === 'Active').length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors animate-fade-in">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: ID Card & Stats */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
              <div className="h-24 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <div className="px-6 pb-6 text-center">
                <div className="relative -mt-12 mb-4 inline-block">
                  <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1 shadow-md transition-colors">
                     <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300 text-3xl font-bold">
                        {state.user.name.charAt(0).toUpperCase()}
                     </div>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">{state.user.name}</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{state.user.email}</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                   <span className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">Pro Member</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Activity Stats</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg transition-colors">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completedTasks}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Completed</div>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg transition-colors">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{activeTasks}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Pending</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h3>
              </div>

              <form onSubmit={handleSave}>
                <div className="grid grid-cols-1 gap-6">
                  <Input
                    label="Display Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your full name"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        value={state.user.email}
                        disabled
                        className="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 sm:text-sm cursor-not-allowed"
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">Email address cannot be changed.</p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between">
                   {successMessage && (
                     <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium animate-in fade-in slide-in-from-left-2">
                       {successMessage}
                     </span>
                   )}
                   {!successMessage && <span></span>} {/* Spacer */}
                   <Button type="submit" isLoading={isLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>

             {/* Preferences */}
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-colors">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100 dark:border-slate-700">
                <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Preferences</h3>
              </div>
              
              <div className="space-y-4">
                 <div className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-md">
                          <Bell className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Email Notifications</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">Receive daily summaries</p>
                       </div>
                    </div>
                    <div className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 bg-slate-200 dark:bg-slate-600">
                       <span className="translate-x-0 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                    </div>
                 </div>

                 <div 
                    onClick={toggleTheme}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors cursor-pointer"
                >
                    <div className="flex items-center gap-3">
                       <div className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md">
                          {state.theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                       </div>
                       <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">Appearance</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}</p>
                       </div>
                    </div>
                    <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${state.theme === 'dark' ? 'bg-blue-600' : 'bg-slate-200'}`}>
                       <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${state.theme === 'dark' ? 'translate-x-5' : 'translate-x-0'}`}></span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;