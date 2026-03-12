import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import logger from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        logger.warn('Authenticated token has no matching user', { userId: decoded.id, path: req.originalUrl });
        res.status(401).json({ message: 'Not authorized, user not found' });
        return;
      }

      logger.debug('Authenticated request', { userId: req.user._id?.toString(), email: req.user.email, path: req.originalUrl });
      next();
      return;
    } catch (error) {
      logger.warn('Token verification failed', { path: req.originalUrl, error: error instanceof Error ? error.message : String(error) });
      res.status(401).json({ message: 'Not authorized, token failed' });
      return;
    }
  }

  logger.warn('Authorization token missing', { path: req.originalUrl });
  res.status(401).json({ message: 'Not authorized, no token' });
};

export const admin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
    return;
  }

  logger.warn('Admin access denied', { userId: req.user?._id?.toString(), path: req.originalUrl });
  res.status(401).json({ message: 'Not authorized as an admin' });
};
