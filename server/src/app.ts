import express from 'express';
import cors from 'cors';
import compression from 'compression';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import categoryRoutes from './routes/category.routes';
import userRoutes from './routes/user.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(compression());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

export default app;
