export function serializeUser(user: { id: string; email: string; name: string; avatarUrl: string | null }) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
  };
}

export function serializeTask(task: {
  id: string;
  title: string;
  description: string;
  priority: string;
  categoryId: string;
  status: string;
  createdAt: Date;
  completedAt: Date | null;
  dueDate: string | null;
  order: number;
}) {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    priority: task.priority,
    categoryId: task.categoryId,
    status: task.status,
    createdAt: task.createdAt.toISOString(),
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
    dueDate: task.dueDate,
    order: task.order,
  };
}

export function serializeCategory(cat: { id: string; name: string; color: string }) {
  return {
    id: cat.id,
    name: cat.name,
    color: cat.color,
  };
}
