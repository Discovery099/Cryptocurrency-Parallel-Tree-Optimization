import { Request, Response, NextFunction } from 'express';
import { z, ZodSchema } from 'zod';
import { logger } from '../utils/logger';

export function validateRequest<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.warn('Request validation failed', {
          path: req.path,
          method: req.method,
          errors: errorMessages,
          body: req.body,
        });

        return res.status(400).json({
          error: 'Validation failed',
          details: errorMessages,
        });
      }

      logger.error('Unexpected validation error', {
        path: req.path,
        method: req.method,
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      return res.status(500).json({
        error: 'Internal validation error',
      });
    }
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.warn('Query validation failed', {
          path: req.path,
          method: req.method,
          errors: errorMessages,
          query: req.query,
        });

        return res.status(400).json({
          error: 'Query validation failed',
          details: errorMessages,
        });
      }

      return res.status(500).json({
        error: 'Internal validation error',
      });
    }
  };
}

export function validateParams<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));

        logger.warn('Params validation failed', {
          path: req.path,
          method: req.method,
          errors: errorMessages,
          params: req.params,
        });

        return res.status(400).json({
          error: 'Parameter validation failed',
          details: errorMessages,
        });
      }

      return res.status(500).json({
        error: 'Internal validation error',
      });
    }
  };
}

// Common validation schemas
export const commonSchemas = {
  uuid: z.string().uuid('Invalid UUID format'),
  positiveInteger: z.number().int().positive('Must be a positive integer'),
  percentage: z.number().min(0).max(100, 'Must be between 0 and 100'),
  timestamp: z.string().datetime('Invalid timestamp format'),
  
  // Pagination
  pagination: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }),
  
  // Sorting
  sort: z.object({
    field: z.string().min(1),
    direction: z.enum(['asc', 'desc']).default('asc'),
  }),
  
  // Date range
  dateRange: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }).refine(data => new Date(data.start) < new Date(data.end), {
    message: 'Start date must be before end date',
  }),
};

// GPU validation schemas
export const gpuValidationSchemas = {
  createGPU: z.object({
    name: z.string().min(1, 'GPU name is required'),
    model: z.string().min(1, 'GPU model is required'),
    hashRate: z.number().min(0, 'Hash rate must be non-negative'),
    temperature: z.number().int().min(0).max(150, 'Temperature must be between 0-150°C'),
    power: z.number().int().min(0).max(1000, 'Power must be between 0-1000W'),
    memoryUsed: z.number().min(0, 'Memory used must be non-negative'),
    memoryTotal: z.number().positive('Total memory must be positive'),
    utilizationRate: z.number().min(0).max(100, 'Utilization rate must be between 0-100%'),
    status: z.enum(['online', 'offline', 'warning', 'error']),
  }),
  
  updateGPU: z.object({
    name: z.string().min(1).optional(),
    hashRate: z.number().min(0).optional(),
    temperature: z.number().int().min(0).max(150).optional(),
    power: z.number().int().min(0).max(1000).optional(),
    memoryUsed: z.number().min(0).optional(),
    utilizationRate: z.number().min(0).max(100).optional(),
    status: z.enum(['online', 'offline', 'warning', 'error']).optional(),
  }),
};

// Mining pool validation schemas
export const poolValidationSchemas = {
  createPool: z.object({
    name: z.string().min(1, 'Pool name is required'),
    url: z.string().url('Invalid URL format'),
    port: z.number().int().min(1).max(65535, 'Port must be between 1-65535'),
    username: z.string().min(1, 'Username is required'),
    password: z.string().optional(),
    priority: z.number().int().min(1).max(10, 'Priority must be between 1-10'),
  }),
  
  updatePool: z.object({
    name: z.string().min(1).optional(),
    url: z.string().url().optional(),
    port: z.number().int().min(1).max(65535).optional(),
    username: z.string().min(1).optional(),
    password: z.string().optional(),
    priority: z.number().int().min(1).max(10).optional(),
    isActive: z.boolean().optional(),
  }),
};

// Configuration validation schemas
export const configValidationSchemas = {
  updateConfig: z.object({
    value: z.unknown(), // Will be validated based on config key
  }),
  
  bulkConfig: z.record(z.string(), z.unknown()),
  
  // Specific config value validators
  parallelThreads: z.number().int().min(1).max(2048),
  treeDepth: z.union([
    z.literal('auto'),
    z.literal('8'),
    z.literal('16'),
    z.literal('32'),
  ]),
  cacheStrategy: z.enum(['lru', 'lfu', 'adaptive']),
  memoryAllocation: z.number().min(50).max(90),
  failoverTimeout: z.number().int().min(10).max(300),
  maxConnections: z.number().int().min(1).max(100),
};

// Alert validation schemas
export const alertValidationSchemas = {
  createAlert: z.object({
    type: z.enum(['info', 'warning', 'error', 'success']),
    title: z.string().min(1, 'Title is required'),
    message: z.string().min(1, 'Message is required'),
    source: z.string().optional(),
    sourceId: z.string().uuid().optional(),
    severity: z.enum(['low', 'medium', 'high', 'critical']),
  }),
};

// System metrics validation schemas
export const metricsValidationSchemas = {
  createMetric: z.object({
    totalHashRate: z.number().min(0),
    treeEfficiency: z.number().min(0).max(100),
    activeGPUs: z.number().int().min(0),
    dailyRevenue: z.number().min(0),
    cpuUsage: z.number().min(0).max(100),
    memoryUsage: z.number().min(0).max(100),
    storageUsage: z.number().min(0).max(100),
    networkLoad: z.number().min(0).max(100),
    transactionsProcessed: z.number().int().min(0),
    transactionsPending: z.number().int().min(0),
  }),
};

// Error handling middleware
export function handleValidationError(error: any, req: Request, res: Response, next: NextFunction) {
  if (error instanceof z.ZodError) {
    logger.warn('Validation error occurred', {
      path: req.path,
      method: req.method,
      errors: error.errors,
    });

    return res.status(400).json({
      error: 'Validation failed',
      details: error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
        code: err.code,
      })),
    });
  }

  next(error);
}

// Rate limiting validation
export function validateRateLimit(maxRequests: number = 100, windowMs: number = 60000) {
  const requests = new Map<string, number[]>();

  return (req: Request, res: Response, next: NextFunction) => {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    if (!requests.has(clientIp)) {
      requests.set(clientIp, []);
    }
    
    const clientRequests = requests.get(clientIp)!;
    
    // Remove old requests outside the window
    const validRequests = clientRequests.filter(timestamp => now - timestamp < windowMs);
    
    if (validRequests.length >= maxRequests) {
      logger.warn('Rate limit exceeded', {
        clientIp,
        requests: validRequests.length,
        maxRequests,
        windowMs,
        path: req.path,
      });

      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `Too many requests. Maximum ${maxRequests} requests per ${windowMs / 1000} seconds.`,
        retryAfter: Math.ceil(windowMs / 1000),
      });
    }
    
    validRequests.push(now);
    requests.set(clientIp, validRequests);
    
    next();
  };
}
