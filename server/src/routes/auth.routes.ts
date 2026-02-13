import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';

const router = Router();

router.post('/register', validate([
  { field: 'email', required: true, type: 'string', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  { field: 'password', required: true, type: 'string', minLength: 8 },
  { field: 'name', required: true, type: 'string', minLength: 1 },
]), register);

router.post('/login', validate([
  { field: 'email', required: true, type: 'string' },
  { field: 'password', required: true, type: 'string' },
]), login);

export default router;
