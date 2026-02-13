import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signToken } from '../lib/jwt';
import { serializeUser } from '../lib/serialize';
import { AppError } from '../middleware/errorHandler';

const DEFAULT_CATEGORIES = [
  { name: 'Work', color: 'bg-blue-100 text-blue-800' },
  { name: 'Personal', color: 'bg-green-100 text-green-800' },
  { name: 'Shopping', color: 'bg-purple-100 text-purple-800' },
  { name: 'Health', color: 'bg-rose-100 text-rose-800' },
];

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email already registered', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: name.trim(),
        password: hashedPassword,
      },
    });

    await prisma.category.createMany({
      data: DEFAULT_CATEGORIES.map(cat => ({
        ...cat,
        userId: user.id,
      })),
    });

    const token = signToken(user.id);

    return res.status(201).json({
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = signToken(user.id);

    return res.json({
      token,
      user: serializeUser(user),
    });
  } catch (err) {
    next(err);
  }
}
