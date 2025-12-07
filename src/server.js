import process from 'process';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';

import { connectMongoDB } from './db/connectMongoDB.js';
import notesRoutes from './routes/notesRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import notificationsRoutes from "./routes/notificationsRoutes.js";

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import { errors } from 'celebrate';

import { initCronJobs } from "./cronJobs/index.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

app.use(logger);
app.use(express.json());
app.use(cors());
app.use(cookieParser());

/// Маршрути
app.use(notesRoutes);
app.use(authRoutes);
app.use(userRoutes);
app.use(notificationsRoutes);

// Middleware 404
app.use(notFoundHandler);

app.use(errors());

// Middleware для обробки помилок
app.use(errorHandler);

await connectMongoDB();
initCronJobs();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
