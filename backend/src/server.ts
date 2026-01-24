import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import videoRoutes from './routes/videoRoutes';
import logger from './utils/logger';
import { notFound, errorHandler } from './middleware/errorMiddleware';

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    logger.http(`${req.method} ${req.url}`);
    next();
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use('/api/users', authRoutes);
app.use('/api/videos', videoRoutes);

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
