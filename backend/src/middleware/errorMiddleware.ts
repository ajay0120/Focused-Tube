import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const notFound = (req: Request, res: Response, next: NextFunction) => {
  logger.warn('Route not found', { method: req.method, path: req.originalUrl });
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  logger.error('Unhandled request error', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
