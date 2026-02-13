import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { serializeTask } from '../lib/serialize';
import { AppError } from '../middleware/errorHandler';

const VALID_PRIORITIES = ['Urgent', 'High', 'Medium', 'Low'];
const VALID_STATUSES = ['Active', 'Completed'];
const PRIORITY_WEIGHT: Record<string, number> = { Urgent: 4, High: 3, Medium: 2, Low: 1 };

export async function getTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const { status, priority, categoryId, search, sortBy } = req.query;
    const userId = req.userId!;

    const where: Prisma.TaskWhereInput = { userId };

    if (status && VALID_STATUSES.includes(status as string)) {
      where.status = status as string;
    }

    if (priority && VALID_PRIORITIES.includes(priority as string)) {
      where.priority = priority as string;
    }

    if (categoryId && typeof categoryId === 'string') {
      where.categoryId = categoryId;
    }

    if (search && typeof search === 'string' && search.trim()) {
      where.OR = [
        { title: { contains: search.trim() } },
        { description: { contains: search.trim() } },
      ];
    }

    let orderBy: Prisma.TaskOrderByWithRelationInput[];
    switch (sortBy) {
      case 'dueDate':
        orderBy = [{ dueDate: 'asc' }];
        break;
      default:
        orderBy = [{ order: 'asc' }];
    }

    const tasks = await prisma.task.findMany({ where, orderBy });

    // Priority sorting done in application layer
    if (sortBy === 'priority') {
      tasks.sort((a, b) => {
        const diff = (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0);
        if (diff !== 0) return diff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return res.json({ tasks: tasks.map(serializeTask) });
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description, priority, categoryId, dueDate } = req.body;
    const userId = req.userId!;

    // Verify category belongs to user
    const category = await prisma.category.findFirst({
      where: { id: categoryId, userId },
    });
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description?.trim() || '',
        priority,
        categoryId,
        dueDate: dueDate || null,
        status: 'Active',
        order: Date.now(),
        userId,
      },
    });

    return res.status(201).json({ task: serializeTask(task) });
  } catch (err) {
    next(err);
  }
}

export async function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      throw new AppError('Task not found', 404);
    }

    const data: Prisma.TaskUpdateInput = {};

    if (req.body.title !== undefined) data.title = req.body.title.trim();
    if (req.body.description !== undefined) data.description = req.body.description.trim();
    if (req.body.order !== undefined) data.order = req.body.order;
    if (req.body.dueDate !== undefined) data.dueDate = req.body.dueDate || null;

    if (req.body.priority !== undefined) {
      if (!VALID_PRIORITIES.includes(req.body.priority)) {
        throw new AppError('Invalid priority', 400);
      }
      data.priority = req.body.priority;
    }

    if (req.body.categoryId !== undefined) {
      const category = await prisma.category.findFirst({
        where: { id: req.body.categoryId, userId },
      });
      if (!category) {
        throw new AppError('Category not found', 404);
      }
      data.categoryId = req.body.categoryId;
    }

    if (req.body.status !== undefined) {
      if (!VALID_STATUSES.includes(req.body.status)) {
        throw new AppError('Invalid status', 400);
      }
      data.status = req.body.status;
      data.completedAt = req.body.status === 'Completed' ? new Date() : null;
    }

    const task = await prisma.task.update({ where: { id }, data });

    return res.json({ task: serializeTask(task) });
  } catch (err) {
    next(err);
  }
}

export async function toggleTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      throw new AppError('Task not found', 404);
    }

    const newStatus = existing.status === 'Active' ? 'Completed' : 'Active';
    const task = await prisma.task.update({
      where: { id },
      data: {
        status: newStatus,
        completedAt: newStatus === 'Completed' ? new Date() : null,
      },
    });

    return res.json({ task: serializeTask(task) });
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const existing = await prisma.task.findFirst({ where: { id, userId } });
    if (!existing) {
      throw new AppError('Task not found', 404);
    }

    await prisma.task.delete({ where: { id } });

    return res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
}
