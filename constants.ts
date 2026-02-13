import { Priority, Category } from './types';

export const PRIORITY_COLORS: Record<Priority, string> = {
  Urgent: '#EF4444', // Red 500
  High: '#F59E0B',   // Amber 500
  Medium: '#3B82F6', // Blue 500
  Low: '#6B7280',    // Gray 500
};

export const PRIORITY_ORDER: Record<Priority, number> = {
  Urgent: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_work', name: 'Work', color: 'bg-blue-100 text-blue-800' },
  { id: 'cat_personal', name: 'Personal', color: 'bg-green-100 text-green-800' },
  { id: 'cat_shopping', name: 'Shopping', color: 'bg-purple-100 text-purple-800' },
  { id: 'cat_health', name: 'Health', color: 'bg-rose-100 text-rose-800' },
];

export const MOCK_TASKS = [
  {
    id: 't1',
    title: 'Prepare Q1 Presentation',
    description: 'Gather metrics from the marketing team and compile slides.',
    priority: 'Urgent' as Priority,
    categoryId: 'cat_work',
    status: 'Active' as const,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0], // 2 days from now
  },
  {
    id: 't2',
    title: 'Grocery Shopping',
    description: 'Buy almond milk, eggs, spinach, and chicken breast.',
    priority: 'Medium' as Priority,
    categoryId: 'cat_shopping',
    status: 'Active' as const,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // 1 day from now
  },
  {
    id: 't3',
    title: 'Dentist Appointment',
    description: 'Routine cleaning at 3 PM.',
    priority: 'High' as Priority,
    categoryId: 'cat_health',
    status: 'Completed' as const,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    completedAt: new Date(Date.now() - 3600000).toISOString(),
    dueDate: new Date(Date.now() - 3600000).toISOString().split('T')[0], // Today
  },
  {
    id: 't4',
    title: 'Read "Atomic Habits"',
    description: 'Read 20 pages before bed.',
    priority: 'Low' as Priority,
    categoryId: 'cat_personal',
    status: 'Active' as const,
    createdAt: new Date(Date.now() - 400000).toISOString(),
    // No due date
  }
];