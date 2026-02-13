import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { serializeUser } from '../lib/serialize';
import { AppError } from '../middleware/errorHandler';

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId! } });
    if (!user) {
      throw new AppError('User not found', 404);
    }

    return res.json({ user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req: Request, res: Response, next: NextFunction) {
  try {
    const { name } = req.body;

    const user = await prisma.user.update({
      where: { id: req.userId! },
      data: { name: name.trim() },
    });

    return res.json({ user: serializeUser(user) });
  } catch (err) {
    next(err);
  }
}
