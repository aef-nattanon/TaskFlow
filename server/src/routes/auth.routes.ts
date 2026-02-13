import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';

const router = Router();

import { registerSchema, loginSchema } from '../schemas/auth.schema';

router.post('/register', validate(registerSchema), register);

router.post('/login', validate(loginSchema), login);

export default router;
