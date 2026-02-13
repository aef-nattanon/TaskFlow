const API_BASE = '/api';

interface RequestOptions extends RequestInit {
  body?: string;
}

async function request<T = any>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = localStorage.getItem('taskflow_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(API_BASE + path, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || 'Request failed');
  }

  return res.json();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (email: string, password: string, name: string) =>
    request<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),

  // Tasks
  getTasks: () => request<{ tasks: any[] }>('/tasks'),

  createTask: (data: { title: string; description?: string; priority: string; categoryId: string; dueDate?: string }) =>
    request<{ task: any }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateTask: (id: string, data: Record<string, any>) =>
    request<{ task: any }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  toggleTask: (id: string) =>
    request<{ task: any }>(`/tasks/${id}/toggle`, { method: 'PATCH' }),

  deleteTask: (id: string) =>
    request<{ message: string }>(`/tasks/${id}`, { method: 'DELETE' }),

  // Categories
  getCategories: () => request<{ categories: any[] }>('/categories'),

  createCategory: (data: { name: string; color: string }) =>
    request<{ category: any }>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // User
  getMe: () => request<{ user: any }>('/users/me'),

  updateMe: (data: { name: string }) =>
    request<{ user: any }>('/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};
