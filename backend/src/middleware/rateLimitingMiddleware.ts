import { Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

type KeyType = 'user' | 'ip' | 'hybrid';

type RateLimitMessage =
  | {
      error: string;
      message: string;
      retryAfter: string | number | string[] | undefined;
    }
  | ((req: Request, res: Response) => {
      error: string;
      message: string;
      retryAfter: string | number | string[] | undefined;
    });

interface HybridRateLimiterOptions {
  windowMs: number;
  max: number;
  message?: RateLimitMessage;
  keyType?: KeyType;
  skip?: (req: Request, res: Response) => boolean;
  onLimitReached?: (req: Request, res: Response) => void;
}

const getUserKey = (req: Request) => {
  const user = req.user as
    | {
        _id?: { toString(): string };
        id?: string;
      }
    | undefined;

  if (user?._id) {
    return user._id.toString();
  }

  if (user?.id) {
    return user.id;
  }

  return null;
};

const getIpKey = (req: Request) => req.ip || req.socket.remoteAddress || 'unknown';

const createKeyGenerator = (keyType: KeyType) => {
  return (req: Request, _res: Response) => {
    const userKey = getUserKey(req);

    if (keyType === 'user') {
      if (!userKey) {
        throw new Error('RateLimiter: req.user missing. Check middleware order.');
      }

      return `user:${userKey}`;
    }

    if (keyType === 'ip') {
      return `ip:${getIpKey(req)}`;
    }

    if (userKey) {
      return `user:${userKey}`;
    }

    return `ip:${getIpKey(req)}`;
  };
};

const defaultMessage = (req: Request, res: Response) => ({
  error: 'RATE_LIMIT_EXCEEDED',
  message: `Too many requests for ${req.method} ${req.baseUrl}${req.path}. Please try again later.`,
  retryAfter: res.getHeader('Retry-After'),
});

function createHybridRateLimiter({
  windowMs,
  max,
  message,
  keyType = 'hybrid',
  skip,
  onLimitReached,
}: HybridRateLimiterOptions) {
  return rateLimit({
    windowMs,
    max,
    keyGenerator: createKeyGenerator(keyType),
    message: message || defaultMessage,
    standardHeaders: true,
    legacyHeaders: false,
    skip: skip || (() => false),
    handler: (req, res, _next, options) => {
      if (onLimitReached) {
        onLimitReached(req, res);
      }

      res.status(options.statusCode).json(
        typeof options.message === 'function'
          ? options.message(req, res)
          : options.message
      );
    },
  });
}

const minutes = (value: number) => value * 60 * 1000;

export const generalIPRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 100,
  keyType: 'ip',
});

export const registerRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 5,
  keyType: 'ip',
});

export const loginRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 10,
  keyType: 'ip',
});

export const googleLoginRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 10,
  keyType: 'ip',
});

export const verifyOtpRateLimiter = createHybridRateLimiter({
  windowMs: minutes(10),
  max: 6,
  keyType: 'ip',
});

export const resendOtpRateLimiter = createHybridRateLimiter({
  windowMs: minutes(10),
  max: 3,
  keyType: 'ip',
});

export const forgotPasswordRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 3,
  keyType: 'ip',
});

export const resetPasswordRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 5,
  keyType: 'ip',
});

export const getUserProfileRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 60,
  keyType: 'user',
});

export const updateUserProfileRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 20,
  keyType: 'user',
});

export const incrementBlockedCountRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 60,
  keyType: 'user',
});

export const getDailyStatisticsRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 60,
  keyType: 'user',
});

export const getWeeklyReportRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 30,
  keyType: 'user',
});

export const logActivityRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 120,
  keyType: 'user',
});

export const videoSearchRateLimiter = createHybridRateLimiter({
  windowMs: minutes(15),
  max: 120,
  keyType: 'user',
});

export { createHybridRateLimiter };
