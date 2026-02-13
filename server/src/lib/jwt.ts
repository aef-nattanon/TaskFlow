import jwt from 'jsonwebtoken';
import { config } from '../config';

export function signToken(userId: string): string {
  return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '7d' });
}

export function verifyToken(token: string): { userId: string } {
  return jwt.verify(token, config.jwtSecret) as { userId: string };
}
