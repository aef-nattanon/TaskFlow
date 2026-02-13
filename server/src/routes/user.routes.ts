import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import { getMe, updateMe } from '../controllers/user.controller';
import { validate } from '../middleware/validate';

const router = Router();
router.use(authenticate);

router.get('/me', getMe);

router.patch('/me', validate([
  { field: 'name', required: true, type: 'string', minLength: 1 },
]), updateMe);

export default router;
