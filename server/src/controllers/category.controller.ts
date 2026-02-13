import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { serializeCategory } from '../lib/serialize';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await prisma.category.findMany({
      where: { userId: req.userId! },
      orderBy: { createdAt: 'asc' },
    });

    return res.json({ categories: categories.map(serializeCategory) });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, color } = req.body;

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        color,
        userId: req.userId!,
      },
    });

    return res.status(201).json({ category: serializeCategory(category) });
  } catch (err) {
    next(err);
  }
}
