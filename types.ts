export type Priority = 'Urgent' | 'High' | 'Medium' | 'Low';

export type TaskStatus = 'Active' | 'Completed';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  categoryId: string;
  status: TaskStatus;
  createdAt: string; // ISO Date string
  completedAt?: string;
  dueDate?: string; // YYYY-MM-DD
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface FilterState {
  status: 'All' | TaskStatus;
  priority: 'All' | Priority;
  categoryId: 'All' | string;
  search: string;
}